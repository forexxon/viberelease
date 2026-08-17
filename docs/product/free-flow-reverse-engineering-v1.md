# Vibe Release V2 — Free Flow Reverse Engineering V1

Дата: 17.08.2026
Цель: зафиксировать публично подтверждённые UX-контракты бесплатных/предпродажных механик сильных конкурентов. Это не копирование фирменного текста/дизайна; фиксируется логика `input → steps → output → CTA/paywall`.

## AVAT — бесплатный аудит + калькулятор
Источник: https://avat.studio/

### Flow A: бесплатный аудит задачи
**Input**
- имя;
- телефон;
- необязательное описание, что хотят сделать;
- согласие на обработку данных.

**Promise**
- 30 минут в Zoom;
- определить узкое место;
- дать 2–3 варианта решения;
- дать оценку стоимости;
- без обязательств.

**Flow**
1. Пользователь оставляет короткую заявку.
2. AVAT обещает связаться в рабочее время.
3. 30-минутный бриф/аудит.
4. Клиент получает варианты решения и ориентир стоимости.
5. Переход в SPRINT / PRODUCT / PARTNERSHIP.

**Output before payment**
- человек понимает, что именно ему стоит делать;
- 2–3 варианта решения;
- ориентир стоимости.

### Flow B: калькулятор ~30 секунд
**Input step 1 — тип продукта**
- Лендинг
- MVP SaaS
- Лендинг + MVP SaaS
- ИИ-ассистент
- Telegram-бот
- Интеграция / парсер

**Input step 2 — сложность**
- Простой
- Стандартный
- Сложный

**Input step 3 — дополнительные опции**
- Авторизация и роли
- Биллинг и подписки
- Claude/GPT integration
- Аналитический dashboard
- PWA
- Премиум-дизайн
- Яндекс.Директ

**Output**
- ориентировочная цена;
- срок;
- label «фикс-цена в договоре»;
- CTA «Зафиксировать стоимость».

**Vibe Release contract to reproduce**
`stage/type → complexity → options → price/time range → CTA на бесплатный scope`.

---

## MKDGRUPP — КП + дизайн-концепт за 1 час
Источник: https://mkdgrupp.ru/vaybkoding

**Input**
- имя (обязательно);
- телефон;
- email;
- Telegram;
- комментарий;
- consent checkbox.

**Promise**
- бесплатно;
- в течение часа — КП + дизайн-концепт первого экрана + оценка стоимости;
- fixed price/time в договоре;
- после старта weekly demo;
- код/репо клиента;
- 6 месяцев гарантии на баги по их вине.

**Flow**
1. Заявка ~1 минута.
2. Созвон.
3. КП + первый визуальный артефакт + оценка.
4. Старт разработки.
5. Weekly demo.

**Output before payment**
- коммерческое предложение;
- оценка;
- материальный кусок будущего продукта.

**Vibe Release contract to reproduce**
После квалификации лида клиент должен получить не только созвон, а конкретный бесплатный артефакт: для стадии «идея» — мини-spec + skeleton first screen/flow; для «застрял»/«почти готов» — mini diagnosis + next-step map.

---

## AVDemkin — self-segmentation
Источник: https://avdemkin.ru/

**Input**
Пользователь выбирает состояние:
- хочу научиться сам;
- нужна консультация;
- нужен готовый продукт.

**Flow**
- DIY → курс/база знаний;
- Assisted → 1:1 консультация;
- Done-for-you → разработка под ключ.

**Free layer**
- бесплатная регистрация;
- база знаний;
- без карты и обязательств.

**Vibe Release contract to reproduce**
До формы заявки сначала спросить не «что вам нужно?», а «на каком вы этапе / как хотите решить задачу?».

---

## AxonBuild — Beyond the Demo Scorecard
Источник: https://axonbuild.com/

**Input**
- 12 focused answers;
- code access не требуется.

**12 areas exposed publicly**
1. Keys & Secrets
2. Sign-In
3. Who Sees What
4. Spam & Misuse
5. AI Features
6. Data Safety & Backups
7. Payments & Access
8. Stability
9. Speed & Scale
10. Updates & Alerts
11. Third-Party Code
12. Future Changes

**Flow**
1. Пользователь отвечает на короткие вопросы.
2. Получает estimated score.
3. Получает области, которые стоит проверить первыми.
4. Получает объяснения.
5. Получает Priority Fix Prompts.
6. Видит полный результат на экране.
7. Optional: Live App Check.
8. Next paid/deeper step: repository-level Audit / fixed result work.

**Friction**
- no account setup;
- no password;
- no payment card.

**Important UX honesty**
- score маркируется как estimate;
- некоторые области нельзя подтвердить без repo/business logic.

**Vibe Release contract to reproduce**
`≤12 answers → estimated score → weakest areas → prompts → CTA на evidence-grade check`.

---

## ProductionReady — 2-minute Readiness Check
Источник: https://productionready.co/

**Known public contract**
- 2 minutes;
- score across 8 categories;
- CTA на paid Audit.

**Paid ladder**
1. Vibe Code Audit
2. Hardening Sprint
3. Backend Build

**Audit output**
- Critical / High / Medium / Low;
- written report;
- prioritized remediation roadmap;
- debrief.

**Hardening output**
- Critical/High fixed;
- post-implementation verification;
- audit fee credited in full.

**Vibe Release contract to reproduce**
Free score must feed directly into a clear commercial ladder; user never должен думать «а что мне покупать дальше?».

---

## SecurityWall — 44-check local checklist
Источник: https://securitywall.co/blog/vibe-coding-security-checklist

**Input/interaction**
- 44 binary/self-verifiable checks;
- 7 sections;
- progress counter;
- no signup;
- no email capture;
- data stays in browser;
- reset button.

**Free output**
- completed/not completed checklist;
- score/progress;
- user can self-fix obvious items.

**Paid differentiation**
Checklist cannot prove business logic/IDOR/payment replay/attack chains. Audit adds:
- automation;
- proprietary pattern matching;
- human testing;
- dashboard;
- severity filtering;
- owner assignment;
- notes;
- retest.

**Vibe Release contract to reproduce**
Self-service free layer must clearly explain its ceiling; платный product begins exactly where self-check cannot prove behavior.

---

## ScanVibe — URL-first scanner
Источник: https://scanvibe.dev/en and /pricing

**Input**
- live app URL.

**Flow**
1. Paste URL.
2. Scan.
3. Receive score/grade and checks.
4. Copy AI fix prompt.
5. Fix in AI IDE.
6. Re-scan.

**Free output**
- unlimited scans;
- full findings;
- fix instructions;
- AI fix prompt;
- share result;
- last 5 scans in dashboard.

**Paid**
- scheduled scans;
- email alerts;
- PDF;
- badge;
- full history/before-after;
- CI/CD/API/webhooks on Business.

**Vibe Release contract to reproduce**
For live projects URL must be accepted before asking for repo access; initial value should appear as early as possible.

---

## VibeShield — URL / code / files
Источник: https://vibeshield.org/

**Input modes**
- URL;
- code snippet;
- files.

**Free flow**
- anonymous first scan;
- 0–100 score;
- findings;
- fix prompts;
- re-scan.

**Progressive friction**
- 1 anonymous scan/day;
- sign-in unlocks more scans/fix prompts;
- Pro unlocks crawling etc.

**Vibe Release contract to reproduce**
Value before account creation; account only when user wants persistence/more depth.

---

## Revibed — repo connect / URL + free preview
Источник: https://revibed.io/

**Input**
- read-only GitHub App OR live URL.

**Flow**
1. Connect code/live app.
2. Security grade F–A.
3. Severity-ranked findings.
4. AI remediation prompt.
5. Fix.
6. Re-scan.
7. Optional Autopilot rescan on push.

**Free boundary**
- first 3 findings free.

**Paid ladder**
- one-shot full scan;
- recurring coverage;
- human review;
- enterprise.

**Vibe Release contract to reproduce later**
Preview before paywall is stronger than «pay before seeing any evidence».

---

## VibeAudit — proof-based automated result
Источник: https://vibeaudit.cloud/

**Input**
- deployed URL or repository;
- email for grade;
- checkbox attesting ownership/written permission.

**Flow**
1. User attests authorization.
2. Automated read-only scan.
3. 17 advertised check groups/scanners.
4. Finding only labelled CONFIRMED when proof succeeds.
5. Evidence redacted/minimized.
6. Exact fix.
7. AI fix prompt.
8. Re-scan.
9. Clean result → Verified report/badge.

**Important safety contract**
- read-only/non-destructive;
- max 5 rows read for leak proof;
- no secret values retained;
- automated result explicitly not a pentest/security guarantee.

**Vibe Release contract to reproduce**
Authorization + evidence minimization + `candidate/confirmed` separation are P0, not optional extras.

---

# Cross-competitor patterns with strongest repetition

## Pattern 1 — Value before payment
Seen in AVAT, MKDGRUPP, AVDemkin, AxonBuild, ProductionReady, SecurityWall, ScanVibe, VibeShield, Revibed, VibeAudit.

V2 requirement: no main funnel that starts with «оставьте контакты и мы расскажем». User must get a diagnosis, route, estimate, artifact, score or preview first/very early.

## Pattern 2 — Simple quantified output
Score/grade/readiness state repeats across AxonBuild, ProductionReady, ScanVibe, VibeShield, Revibed, VibeAudit and SecurityWall progress.

V2 requirement: 0–100 + launch state + weakest areas.

## Pattern 3 — Fix guidance immediately attached to finding
AxonBuild, ScanVibe, VibeShield, Revibed, VibeAudit.

V2 requirement: every self-fixable result includes an AI-ready prompt or exact next step.

## Pattern 4 — Recheck after fix
ProductionReady, SecurityWall, ScanVibe, VibeShield, Revibed, VibeAudit.

V2 requirement: no finding is considered closed until rechecked.

## Pattern 5 — Human layer for high-value truth
MKDGRUPP, AxonBuild, ProductionReady, SecurityWall, Revibed.

V2 requirement: automation creates candidates; human/behavioral verification decides high-stakes claims.

## Pattern 6 — Clear commercial ladder
AVAT, AVDemkin, ProductionReady, Revibed, ScanVibe.

V2 requirement: FREE → CHECK/ASSIST → FINISH/BUILD → CARE.

## Pattern 7 — Client owns the product
AVAT and MKDGRUPP state repo ownership explicitly.

V2 requirement: client repo / client access / no lock-in for done-for-you work.

---

# Exact P0 funnel to prototype next

1. **Stage selector**
   - Есть идея
   - Начал и застрял
   - Почти готов / запущен

2. **≤2 minute diagnostic**
   - 10–12 questions;
   - no card;
   - no required account;
   - optional URL.

3. **Immediate result**
   - readiness 0–100;
   - estimated label;
   - 3 weakest areas;
   - launch status;
   - 1–3 fix prompts;
   - CTA based on stage.

4. **Free scope artifact**
   - Idea: mini-spec + 2–3 implementation routes + range price/time.
   - Stuck: current-state diagnosis + save/rebuild decision + 2–3 routes.
   - Almost ready: mini preflight + what can/cannot be confirmed without deeper access.

5. **Paid path**
   - CHECK: evidence-grade verification + local fix + recheck.
   - FINISH: finish existing product to acceptance test.
   - BUILD: idea to MVP/launch.

6. **Execution contract**
   - fixed scope/price after scoping;
   - acceptance test written before start;
   - client repo ownership;
   - visible progress;
   - recheck before done.

Это следующий прототипный объект. До его проверки main-сайт не переписываем.
