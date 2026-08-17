import base64
import hashlib
import hmac
import json
import os
import re
import secrets
import urllib.parse
import urllib.request
from datetime import datetime, timedelta, timezone

import ydb
import ydb.iam


YDB_ENDPOINT = os.getenv("YDB_ENDPOINT", "")
YDB_DATABASE = os.getenv("YDB_DATABASE", "")
ALLOWED_ORIGINS = {
    x.strip() for x in os.getenv(
        "ALLOWED_ORIGINS",
        "https://viberelease.ru,https://www.viberelease.ru",
    ).split(",") if x.strip()
}
CONSENT_VERSION = os.getenv("CONSENT_VERSION", "lead-v1-2026-08-17")
MAX_BODY_BYTES = 32_768
MAX_LEADS_PER_CONTACT_HOUR = 3


driver = ydb.Driver(
    endpoint=YDB_ENDPOINT,
    database=YDB_DATABASE,
    credentials=ydb.iam.MetadataUrlCredentials(),
)
driver.wait(fail_fast=True, timeout=5)
pool = ydb.SessionPool(driver)


def _headers(event):
    return {str(k).lower(): str(v) for k, v in (event.get("headers") or {}).items()}


def _origin(event):
    return _headers(event).get("origin", "")


def _cors(origin):
    headers = {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "no-store",
        "Vary": "Origin",
    }
    if origin in ALLOWED_ORIGINS:
        headers["Access-Control-Allow-Origin"] = origin
        headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
        headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
    return headers


def _response(status, payload, origin=""):
    return {
        "statusCode": status,
        "headers": _cors(origin),
        "body": json.dumps(payload, ensure_ascii=False, separators=(",", ":")),
    }


def _method(event):
    return str(event.get("httpMethod") or event.get("requestContext", {}).get("http", {}).get("method") or "GET").upper()


def _query(event):
    return event.get("queryStringParameters") or {}


def _parse_body(event):
    raw = event.get("body") or ""
    if event.get("isBase64Encoded"):
        raw = base64.b64decode(raw).decode("utf-8")
    if len(raw.encode("utf-8")) > MAX_BODY_BYTES:
        raise ValueError("body_too_large")
    obj = json.loads(raw)
    if not isinstance(obj, dict):
        raise ValueError("invalid_json")
    return obj


def _clean_text(value, max_len, required=False):
    text = re.sub(r"[\x00-\x08\x0B\x0C\x0E-\x1F]", "", str(value or "")).strip()
    if required and not text:
        raise ValueError("required_field")
    if len(text) > max_len:
        raise ValueError("field_too_long")
    return text


def _validate_url(value):
    value = _clean_text(value, 500)
    if not value:
        return None
    parsed = urllib.parse.urlparse(value)
    if parsed.scheme not in {"http", "https"} or not parsed.netloc:
        raise ValueError("invalid_url")
    return value


def _secret(name):
    value = os.getenv(name, "")
    if not value:
        raise RuntimeError(f"missing_secret:{name}")
    return value


def _contact_hash(contact):
    key = _secret("CONTACT_HASH_KEY").encode("utf-8")
    normalized = re.sub(r"\s+", "", contact.strip().lower()).encode("utf-8")
    return hmac.new(key, normalized, hashlib.sha256).hexdigest()


def _now_iso():
    return datetime.now(timezone.utc).isoformat(timespec="seconds")


def _one_hour_ago_iso():
    return (datetime.now(timezone.utc) - timedelta(hours=1)).isoformat(timespec="seconds")


def _execute(session, query, params=None):
    return session.transaction().execute(
        query,
        params or {},
        commit_tx=True,
        settings=ydb.BaseRequestSettings().with_timeout(4).with_operation_timeout(3),
    )


def _recent_count(contact_hash):
    def op(session):
        result = _execute(
            session,
            """
            DECLARE $contact_hash AS Utf8;
            DECLARE $since AS Utf8;
            SELECT COUNT(*) AS cnt
            FROM leads
            WHERE contact_hash = $contact_hash AND created_at >= $since;
            """,
            {"$contact_hash": contact_hash, "$since": _one_hour_ago_iso()},
        )
        return int(result[0].rows[0].cnt)

    return pool.retry_operation_sync(op)


def _insert_lead(lead):
    def op(session):
        _execute(
            session,
            """
            DECLARE $lead_id AS Utf8;
            DECLARE $created_at AS Utf8;
            DECLARE $stage AS Utf8;
            DECLARE $route AS Utf8;
            DECLARE $name AS Utf8;
            DECLARE $contact AS Utf8;
            DECLARE $contact_hash AS Utf8;
            DECLARE $project_url AS Utf8?;
            DECLARE $comment AS Utf8?;
            DECLARE $consent AS Bool;
            DECLARE $consent_version AS Utf8;
            DECLARE $authorized AS Bool;
            DECLARE $answers_json AS Json;
            DECLARE $summary_json AS Json?;
            DECLARE $status AS Utf8;

            UPSERT INTO leads (
              lead_id, created_at, stage, route, name, contact, contact_hash,
              project_url, comment, consent, consent_version,
              authorized_for_active_checks, answers_json, summary_json, status
            ) VALUES (
              $lead_id, $created_at, $stage, $route, $name, $contact, $contact_hash,
              $project_url, $comment, $consent, $consent_version,
              $authorized, $answers_json, $summary_json, $status
            );
            """,
            {
                "$lead_id": lead["lead_id"],
                "$created_at": lead["created_at"],
                "$stage": lead["stage"],
                "$route": lead["route"],
                "$name": lead["name"],
                "$contact": lead["contact"],
                "$contact_hash": lead["contact_hash"],
                "$project_url": lead["project_url"],
                "$comment": lead["comment"],
                "$consent": True,
                "$consent_version": CONSENT_VERSION,
                "$authorized": lead["authorized_for_active_checks"],
                "$answers_json": json.dumps(lead["answers"], ensure_ascii=False),
                "$summary_json": json.dumps(lead["summary"], ensure_ascii=False) if lead["summary"] is not None else None,
                "$status": "new",
            },
        )

    pool.retry_operation_sync(op)


def _telegram_notify(stage, route):
    # IMPORTANT: deliberately no lead_id, name, contact, URL, comment or questionnaire.
    token = _secret("TELEGRAM_BOT_TOKEN")
    chat_id = _secret("TELEGRAM_CHAT_ID")
    text = f"Новая заявка Vibe Release · {stage} → {route}. Откройте панель менеджера."
    body = urllib.parse.urlencode({"chat_id": chat_id, "text": text}).encode("utf-8")
    request = urllib.request.Request(
        f"https://api.telegram.org/bot{token}/sendMessage",
        data=body,
        method="POST",
    )
    with urllib.request.urlopen(request, timeout=4) as response:
        if response.status != 200:
            raise RuntimeError("telegram_failed")


def _validate_lead(payload):
    if payload.get("website"):
        raise ValueError("spam")

    elapsed_ms = int(payload.get("elapsed_ms") or 0)
    if elapsed_ms and elapsed_ms < 2500:
        raise ValueError("too_fast")

    stage = _clean_text(payload.get("stage"), 16, required=True).upper()
    route = _clean_text(payload.get("route"), 24, required=True).upper()
    if stage not in {"IDEA", "STUCK", "READY"}:
        raise ValueError("invalid_stage")
    if route not in {"BUILD", "FINISH", "CHECK", "STABILIZE", "REVIEW"}:
        raise ValueError("invalid_route")

    name = _clean_text(payload.get("name"), 100, required=True)
    contact = _clean_text(payload.get("contact"), 200, required=True)
    if not payload.get("consent"):
        raise ValueError("consent_required")

    answers = payload.get("answers") or {}
    summary = payload.get("summary")
    if not isinstance(answers, dict):
        raise ValueError("invalid_answers")
    if summary is not None and not isinstance(summary, dict):
        raise ValueError("invalid_summary")
    if len(json.dumps(answers, ensure_ascii=False)) > 16_000:
        raise ValueError("answers_too_large")

    return {
        "lead_id": "vr_" + secrets.token_urlsafe(12),
        "created_at": _now_iso(),
        "stage": stage,
        "route": route,
        "name": name,
        "contact": contact,
        "contact_hash": _contact_hash(contact),
        "project_url": _validate_url(payload.get("url")),
        "comment": _clean_text(payload.get("comment"), 1500) or None,
        "authorized_for_active_checks": bool(payload.get("authorized_for_active_checks")),
        "answers": answers,
        "summary": summary,
    }


def _create_lead(event, origin):
    if origin not in ALLOWED_ORIGINS:
        return _response(403, {"ok": False, "error": "origin_not_allowed"}, origin)

    try:
        lead = _validate_lead(_parse_body(event))
        if _recent_count(lead["contact_hash"]) >= MAX_LEADS_PER_CONTACT_HOUR:
            return _response(429, {"ok": False, "error": "rate_limited"}, origin)
        _insert_lead(lead)  # RF first write happens before Telegram.
    except (ValueError, json.JSONDecodeError):
        return _response(400, {"ok": False, "error": "invalid_request"}, origin)
    except Exception:
        # Do not log request payload or PII here.
        return _response(500, {"ok": False, "error": "temporary_error"}, origin)

    notification_sent = True
    try:
        _telegram_notify(lead["stage"], lead["route"])
    except Exception:
        notification_sent = False

    return _response(
        201,
        {
            "ok": True,
            "accepted": True,
            "notification_sent": notification_sent,
        },
        origin,
    )


def _check_admin(event):
    auth = _headers(event).get("authorization", "")
    expected = "Bearer " + _secret("ADMIN_KEY")
    return hmac.compare_digest(auth, expected)


def _list_leads(event, origin):
    if origin not in ALLOWED_ORIGINS:
        return _response(403, {"ok": False, "error": "origin_not_allowed"}, origin)
    try:
        if not _check_admin(event):
            return _response(401, {"ok": False, "error": "unauthorized"}, origin)
        limit = max(1, min(50, int(_query(event).get("limit") or 20)))

        def op(session):
            result = _execute(
                session,
                f"""
                SELECT lead_id, created_at, stage, route, name, contact,
                       project_url, comment, consent_version,
                       authorized_for_active_checks, answers_json, summary_json, status
                FROM leads
                ORDER BY created_at DESC
                LIMIT {limit};
                """,
            )
            return [dict(row) for row in result[0].rows]

        rows = pool.retry_operation_sync(op)
        return _response(200, {"ok": True, "leads": rows}, origin)
    except Exception:
        return _response(500, {"ok": False, "error": "temporary_error"}, origin)


def handler(event, context):
    method = _method(event)
    origin = _origin(event)

    if method == "OPTIONS":
        if origin not in ALLOWED_ORIGINS:
            return _response(403, {"ok": False}, origin)
        return {"statusCode": 204, "headers": _cors(origin), "body": ""}

    action = str(_query(event).get("action") or "create")
    if method == "POST" and action == "create":
        return _create_lead(event, origin)
    if method == "GET" and action == "list":
        return _list_leads(event, origin)
    return _response(404, {"ok": False, "error": "not_found"}, origin)
