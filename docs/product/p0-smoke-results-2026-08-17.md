# Vibe Release V2 — P0 Smoke Results

Дата: 17.08.2026
Статус: **LOGIC PASS / BROWSER QA PENDING**.

Проверен именно deterministic routing/scoring из текущего `diagnostic/diagnostic.js` на 9 заранее зафиксированных persona-сценариях. Это не заменяет браузерный/mobile/keyboard QA.

## Результат 9/9

| Persona | Expected | Actual | Result |
|---|---|---|---|
| I1 — простой лендинг | complexity 1 / Простой | 1 / Простой | PASS |
| I2 — SaaS + subscription + RAG | complexity 10 / Сложный | 10 / Сложный | PASS |
| I3 — Telegram bot + AI chat | complexity 3 / Простой | 3 / Простой | PASS |
| S1 — repo+staging, частично работает | FINISH / ДОВЕСТИ | FINISH | PASS |
| S2 — production, flaky, real data/payments, no rollback | STABILIZE | STABILIZE | PASS |
| S3 — непонятный сломанный проект | REVIEW | REVIEW | PASS |
| R1 — все применимые VERIFIED | 100 / GREEN | 100 / GREEN | PASS |
| R2 — высокий средний, но cross-user UNKNOWN | RED; c3 first | 65 / RED; Top-3: c3, c6, c4 | PASS |
| R3 — всё CONFIGURED | 50 / YELLOW | 50 / YELLOW | PASS |

## Что отдельно подтвердилось

### Critical gate работает
R2 не получает зелёный/жёлтый итог несмотря на средний score 65, потому что `c3 Who sees what` = UNKNOWN. Это требуемое поведение: среднее значение не может скрыть неподтверждённую критическую границу.

### Weakest-area ordering работает
Для R2 порядок:
1. c3 — critical UNKNOWN;
2. c6 — critical CONFIGURED;
3. c4 — ordinary CONFIGURED.

Это совпадает с контрактом `critical unknown → critical configured → ordinary unknown → ordinary configured`.

### STUCK routing не предлагает rebuild автоматически
- нормальный незаконченный repo → FINISH;
- живой рискованный production → STABILIZE;
- неизвестное/неработающее состояние → REVIEW.

В текущей logic нет автоматического verdict `переписать с нуля`.

## Edge logic — инспекция текущего кода

- `READYISH` denominator не может быть 0 в нормальном UI: c1/c4/c8/c9/c10/c11/c12 не дают N/A.
- score считается из финального `state.answers`, поэтому изменение ответа назад должно пересчитать итог по новому state.
- multi-select ограничивается `max`: лишний пункт не добавляется, выбранный можно снять.
- prototype lead form использует required для name/contact/consent.
- authorization checkbox в READYISH не блокирует обычную заявку; payload передаёт `authorized_for_active_checks=false` — active checks должны блокироваться уже production backend.

## Что НЕ протестировано и нельзя называть PASS

Остаётся обязательный ручной/браузерный QA:
- Chrome desktop;
- Firefox desktop;
- Android ~360px;
- iPhone ~390px;
- keyboard-only;
- back/forward visual state;
- copy prompt через Clipboard API;
- HTML required validation во всех целевых браузерах;
- reload/restart UX;
- реальный median completion time ≤2 min;
- Telegram test delivery;
- backend authorization enforcement.

## Verdict

**Core routing/scoring logic: PASS 9/9.**
**Frontend/product QA overall: NOT YET PASS.**

Следующий engineering gate: preview/runtime → browser matrix → test Telegram delivery → только после этого обсуждать merge в main.