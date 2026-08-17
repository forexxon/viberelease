# Vibe Release V2 — P0 Smoke Test V1

Дата: 17.08.2026
Статус: тестовая матрица для прототипа `/diagnostic/`.

Цель: до любого merge в main вручную пройти минимум 9 persona-сценариев и убедиться, что routing/scoring не выдаёт абсурдный результат.

## Общие PASS criteria
- result появляется до запроса контакта;
- назад/вперёд не теряет ответы;
- multi-select соблюдает max;
- restart полностью очищает state;
- mobile layout не ломает выбор;
- form в prototype mode НЕ отправляет реальные данные;
- active-check authorization не влияет на self-assessment;
- READYISH не выдаёт финальный статус `ГОТОВ К ЗАПУСКУ` — только предварительный.

---

# IDEA personas

## I1 — простой лендинг
Ответы:
- a1 landing
- a2 leads
- a3 clients_noauth
- a4 no
- a5 none
- a6 no
- a7 2w

Expected:
- complexity = 1
- level = `Простой`
- 3 routes показаны
- recommended = MVP для первых пользователей
- dependencies не должны выдумывать auth/payments/AI
- lead CTA route = BUILD

## I2 — SaaS с подпиской и AI/RAG
Ответы:
- a1 saas = 4
- a2 pay + ai_data
- a3 clients_auth = +1
- a4 subscription = +2
- a5 two_three = +1
- a6 rag = +2
- a7 1m

Expected:
- complexity = 10
- level = `Сложный`
- dependencies содержат auth, payments, integrations, AI
- mini-scope отражает SaaS и пользовательские аккаунты
- CTA появляется только после результата

## I3 — Telegram-бот для команды
Ответы:
- a1 bot = 2
- a2 automation
- a3 team
- a4 no
- a5 one
- a6 chat = +1
- a7 asap

Expected:
- complexity = 3
- level = `Простой`
- AI присутствует в dependencies
- платежи/auth не должны добавляться автоматически

---

# STUCK personas

## S1 — нормальный проект, просто не закончен
Ответы:
- b1 repo + staging
- b2 partial
- b3 ui + api
- b4 git
- b5 staging
- b6 test
- b7 test
- b8 yes

Expected:
- route = `ДОВЕСТИ`
- repo + staging + Git отображаются как assets
- автоматический rebuild не предлагается
- CTA route = FINISH

## S2 — живой проект с реальным риском
Ответы:
- b1 repo + public
- b2 flaky
- b3 regression + payments + auth
- b4 no
- b5 production
- b6 both
- b7 live
- b8 yes

Expected:
- route = `СНАЧАЛА СТАБИЛИЗИРОВАТЬ`
- next-step map первым ставит restore point
- result не предлагает просто «добавить ещё функции»

## S3 — непонятно, что вообще осталось
Ответы:
- b1 unsure
- b2 unknown
- b3 architecture + errors
- b4 unknown
- b5 nowhere
- b6 unknown
- b7 unknown
- b8 unknown

Expected:
- route = `НУЖНА РЕВИЗИЯ`
- не выдавать оценку процента готовности
- не говорить «переписать с нуля» автоматически

---

# READYISH personas

## R1 — всё self-reported VERIFIED
Ответы:
- c1..c12 = verified, кроме действительно неприменимых зон можно na

Expected:
- score = 100 по применимым зонам
- preliminary status = GREEN / `ВЫСОКАЯ ГОТОВНОСТЬ`
- disclaimer остаётся видимым
- финальный `ГОТОВ К ЗАПУСКУ` НЕ показывается
- Top-3 weakest может быть пустым

## R2 — высокий средний score, но cross-user неизвестен
Пример:
- c1 verified
- c2 verified
- c3 unknown
- c4 configured
- c5 na
- c6 configured
- c7 na
- c8 verified
- c9 configured
- c10 configured
- c11 verified
- c12 configured

Expected:
- status = RED независимо от того, что часть зон хорошая
- причина: critical gate c3 = UNKNOWN
- c3 должен быть первым в Top-3
- prompt c3 должен требовать User A/User B READ/UPDATE/DELETE test

## R3 — всё «настроено, но не проверено»
Ответы:
- все применимые c1..c12 = configured

Expected:
- score = 50
- status = YELLOW
- critical configured areas поднимаются выше остальных
- ни одна область не попадает в блок VERIFIED
- result объясняет разницу между configured и verified

---

# Edge cases

## E1 — все READYISH зоны NA
Такого normal flow не должно возникать, потому что c1/c4/c8/c9/c10/c11/c12 не дают NA.
PASS: denominator никогда не равен 0 при корректном UI.

## E2 — пользователь назад меняет critical answer
PASS: score/status пересчитываются по финальному state, старый answer не остаётся.

## E3 — multi-select пытаются выбрать больше max
PASS: лишний выбор не добавляется; уже выбранные можно снять.

## E4 — lead form без contact
PASS: browser validation блокирует submit.

## E5 — READYISH form без authorization
PASS: prototype payload может быть сформирован для обычной заявки, но `authorized_for_active_checks=false`; дальнейший active scan запрещён бизнес-логикой backend в production implementation.

---

# Что ещё нужно проверить вручную после появления preview URL

- Chrome desktop
- Firefox desktop
- Android viewport ~360px
- iPhone viewport ~390px
- keyboard-only navigation
- copy prompt
- reload/restart behavior
- 9 persona timing: median target ≤2 minutes
- lead payload fields

## Статус на момент создания матрицы
Frontend prototype создан в `diagnostic/`, но ещё не считается QA PASS. Реальная Telegram-доставка и analytics backend не подключены; prototype form только показывает payload локально.
