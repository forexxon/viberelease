# Vibe Release V2 — Feature Master Matrix

Дата среза: 17.08.2026
Статус: внутренний продуктовый документ, ветка `product-v2-feature-matrix`.

## Правило отбора

Мы не выбираем одного конкурента. Мы раскладываем сильных игроков на отдельные функции и воспроизводим доказанную механику максимально близко по пользовательской логике, входам, шагам и результату, затем объединяем функции в Vibe Release. Не переносим чужой закрытый код, фирменные тексты, визуальные активы и брендинг.

Для каждой функции различаем:
- **FACT** — функция реально заявлена/доступна у конкурента;
- **INFERENCE** — вывод о её роли в воронке;
- **DECISION** — что делаем в Vibe Release.

## Подтверждённый набор конкурентов

### 1. AVAT — РФ, разработка/вайбкодинг
Источник: https://avat.studio/

FACT:
- бесплатный 30-минутный аудит задачи;
- на аудите обещают определить узкое место, дать 2–3 варианта решения и оценку стоимости;
- есть калькулятор ориентировочной цены и срока за ~30 секунд: тип продукта → сложность → дополнительные функции → ориентир цены/срока;
- прозрачные пакетные уровни SPRINT / PRODUCT / PARTNERSHIP;
- фиксированный скоуп, фикс-срок; при срыве срока доделывают за свой счёт;
- код хранится в GitHub клиента с первого дня;
- live-стенд, коммиты и прогресс доступны клиенту;
- после запуска — поддержка/итерации, A/B-тесты и аналитика роста;
- можно начать с малого пилота;
- прямой контакт с командой.

Сильнейшие механики для копирования:
1. Бесплатная квалификация до продажи.
2. 2–3 маршрута решения вместо одного ответа.
3. Мгновенный калькулятор цены/срока.
4. Пакетная лестница по зрелости задачи.
5. Fixed scope + fixed deadline.
6. Repo ownership с первого дня.
7. Live progress.
8. Малый пилот как безопасная первая покупка.
9. Post-launch iteration.

### 2. MKDGRUPP — РФ, AI-assisted разработка
Источник: https://mkdgrupp.ru/vaybkoding

FACT:
- бесплатное КП + дизайн-концепт первого экрана примерно за 1 час;
- заявка занимает около минуты;
- созвон → КП + концепт + оценка → старт;
- фикс-цена и срок в договоре;
- senior review каждого PR;
- автотесты + CI/CD;
- security-аудит зависимостей, секретов и доступов;
- код и репозиторий у клиента;
- недельные демо;
- гарантия 6 месяцев на баги по их вине.

Сильнейшие механики:
1. До оплаты клиент получает материальный артефакт, а не только разговор.
2. Очень короткий SLA на предпродажный результат.
3. Каждый AI-generated change проходит human review.
4. Тестирование и CI/CD входят в обещание продукта.
5. Гарантийный период после сдачи.

### 3. AVDemkin — РФ, обучение + консультация + done-for-you
Источник: https://avdemkin.ru/

FACT:
- бесплатная база знаний без карты;
- три пути: «научись сам» / «консультация» / «сделаю за тебя»;
- отдельный выбор по ситуации клиента;
- платный курс, 1:1 консультация и разработка под ключ.

Сильнейшие механики:
1. Самосегментация клиента до заявки.
2. Бесплатный education layer.
3. Один бренд обслуживает DIY / assisted / done-for-you.

### 4. CraveCode — РФ, разработка под ключ
Источник: https://cravecode.ru/vibecode

FACT:
- понятный конечный продукт вместо продажи технологии;
- состав «под ключ»: анализ задачи → проектирование логики → frontend/backend → интеграции → тестирование → запуск → развитие;
- отдельные ориентиры цен по типу продукта.

Сильнейшие механики:
1. Продажа результата, а не «вайбкодинга».
2. Полный lifecycle в одном оффере.
3. Публичные ценовые ориентиры.

### 5. ProductionReady.co — зарубежный production-readiness сервис
Источник: https://productionready.co/

FACT:
- бесплатный readiness check примерно на 2 минуты;
- score по 8 категориям;
- лестница: Audit → Hardening Sprint → Backend Build;
- audit даёт findings по Critical/High/Medium/Low + roadmap;
- Hardening Sprint исправляет Critical/High и включает post-implementation verification;
- audit fee засчитывается в стоимость hardening;
- Backend Build добавляет DB/API/auth/hosting/CI-CD/backups/monitoring/docs.

Сильнейшие механики:
1. Бесплатный score → платная evidence-grade проверка.
2. Диагностика и исправление — отдельные, но связанные продукты.
3. Кредит стоимости аудита в исправление убирает ощущение «плачу дважды».
4. Чёткая ladder: Audit → Fix → Build.

### 6. AxonBuild — зарубежный audit/fix
Источники: https://axonbuild.com/ и https://axonbuild.com/blog/vibe-coding-security-audit/

FACT:
- Beyond the Demo Scorecard: 12 ответов → estimated score → области для проверки → priority fix prompts;
- без аккаунта, пароля и карты;
- scorecard полезен до или после запуска;
- optional Live App Check;
- audit связывает подтверждённые findings с `file:line`;
- для finding описывается механизм, affected path, reachability, consequence, refutation check, priority;
- проверяются реальные boundary-сценарии: второй пользователь, payment verification, metered AI spend и др.;
- в актуальной статье review выполняется бесплатно на этапе scoping, деньги берутся за согласованный результат/fix; заявлена fixed-price модель и тест результата до старта.

Сильнейшие механики:
1. Короткий scorecard без доступа к коду.
2. Не просто finding, а доказательство + попытка опровергнуть finding.
3. Rebuild-vs-complete verdict.
4. Бесплатный look/scoping → оплата за результат исправления.
5. До старта фиксируется acceptance test.

### 7. SecurityWall — зарубежный security audit
Источник: https://securitywall.co/blog/vibe-coding-security-checklist

FACT:
- бесплатный интерактивный чек-лист: 44 проверки, 7 разделов;
- без регистрации/email, ответы не покидают браузер;
- progress score обновляется по мере прохождения;
- audit pipeline: automated scanning + AI pattern matching + human-led testing;
- human testing включает IDOR, payment replay, race conditions, attack chains, agentic testing;
- findings стримятся в dashboard;
- можно фильтровать по severity, назначать владельца, оставлять notes, запрашивать retest;
- Jira/GitHub/Slack hooks;
- retest loop входит в процесс.

Сильнейшие механики:
1. Бесплатный self-service checklist как «пол» продукта.
2. Гибрид automation + human verification.
3. Live findings dashboard вместо финального PDF в конце.
4. Assign owner / notes / retest workflow.
5. Интеграции с рабочими системами клиента.

### 8. ScanVibe — зарубежный автоматический scanner
Источники: https://scanvibe.dev/en и https://scanvibe.dev/en/pricing

FACT:
- вставка URL → автоматический scan;
- free tier: unlimited scans, все анализаторы, полные results + fix instructions + AI-ready fix prompt;
- понятная grade A–F / score;
- бесплатная история последних 5 scans;
- Pro: scheduled scans, score-change email alerts, PDF, badge, full history/before-after;
- Business: multi-page, CI/CD API, Slack/Discord/webhooks, white-label PDF;
- публичные страницы противоречат друг другу по числу analyzers (на одной заявлено 18, FAQ перечисляет 8), поэтому точное число не копируем без собственного технического определения.

Сильнейшие механики:
1. URL-first zero-friction scan.
2. Grade + score для не-технического клиента.
3. Fix prompt сразу под AI IDE.
4. Before/after history.
5. Scheduled monitoring + alerts.
6. CI/CD quality gate.
7. Shareable badge/report.

### 9. VibeShield — зарубежный scanner
Источник: https://vibeshield.org/

FACT:
- поддерживает URL / code snippet / files;
- 0–100 security score;
- detailed findings + AI-ready prompts для Cursor/Claude/Bolt/Lovable;
- anonymous: 1 free scan/day без аккаунта;
- login: больше бесплатных scans;
- custom headers для authenticated scan;
- заявляет 150+ patterns секретов;
- re-scan после fix.

Сильнейшие механики:
1. Три input mode: URL / code / files.
2. Ограниченный anonymous free tier → регистрация только после value.
3. Authenticated scan через custom headers.
4. Fix → re-scan → score improvement.

### 10. Revibed — зарубежный scanner + human review
Источник: https://revibed.io/

FACT:
- GitHub App read-only или live URL;
- grade F–A + severity;
- AI remediation prompt;
- re-scan после fixes;
- Autopilot re-scan on push;
- free quick scan показывает первые 3 findings;
- one-shot paid scan $49;
- human senior security review отдельным продуктом;
- persistent read-only monitoring, monthly/weekly scans.

Сильнейшие механики:
1. Read-only GitHub connection.
2. Free preview findings before paywall.
3. One-shot purchase без подписки.
4. Human review как следующий tier.
5. Re-scan on every push.

### 11. VibeAudit — зарубежный proof-based scanner
Источник: https://vibeaudit.cloud/

FACT:
- URL или repository;
- ownership/authorization attestation до active checks;
- полный automated report бесплатен;
- заявлено 17 checks/scanners;
- finding помечается CONFIRMED только при read-only proof;
- Supabase/Firebase check пытается реально прочитать до 5 строк, не изменяя данные;
- exact location, step-by-step remediation, AI fix prompt;
- бесплатный re-scan;
- shareable Verified report/badge для clean result;
- disclaimer: automated scan не заменяет pentest.

Сильнейшие механики:
1. Explicit authorization gate перед активной проверкой.
2. CONFIRMED vs merely suspected finding.
3. Evidence-based proof в автоматическом результате.
4. Clean result превращается в shareable trust artifact.
5. Re-scan бесплатен.

---

# Feature Master Matrix

Легенда:
- **P0 COPY** — обязательная функция для V2; воспроизводим механику максимально близко.
- **P1 COPY** — сильная функция после P0.
- **P2 LATER** — полезно, но только после первых платящих клиентов.
- **NO** — не строим сейчас / не является нашей ценностью.

| ID | Функция | Подтверждена у | Статус | Vibe Release V2 |
|---|---|---|---|---|
| F01 | Самосегментация по стадии | AVDemkin, ProductionReady/AxonBuild косвенно «start where you are» | P0 COPY | `Есть идея / Начал и застрял / Почти готов` |
| F02 | Бесплатная диагностика до оплаты | AVAT, ProductionReady, AxonBuild, SecurityWall, ScanVibe, VibeShield, Revibed, VibeAudit | P0 COPY | Бесплатный вход обязателен |
| F03 | Без карты на free entry | AVDemkin, AxonBuild, SecurityWall, VibeShield, Revibed, VibeAudit | P0 COPY | Никакой карты до получения value |
| F04 | No-signup или value-before-signup | AxonBuild, SecurityWall, ScanVibe, VibeShield, VibeAudit | P0 COPY | Первичный результат без аккаунта |
| F05 | Короткая диагностика 1–2 мин | AVAT calculator ~30 сек, ProductionReady 2 мин, AxonBuild ~2 мин | P0 COPY | Цель ≤2 минут |
| F06 | Score/grade | ProductionReady, AxonBuild, ScanVibe, VibeShield, Revibed, VibeAudit | P0 COPY | 0–100 + человекочитаемый статус |
| F07 | Weakest areas / priority list | AxonBuild, ProductionReady, scanners | P0 COPY | Top-3 зоны, которые тормозят запуск |
| F08 | AI-ready fix prompts | AxonBuild, ScanVibe, VibeShield, Revibed, VibeAudit | P0 COPY | Для self-fix выдаём prompt под Cursor/Claude Code и др. |
| F09 | URL-first check | ScanVibe, VibeShield, Revibed, VibeAudit | P0 COPY | Для live-проекта URL — самый быстрый вход |
| F10 | Repo/code input | VibeShield, Revibed, VibeAudit, AxonBuild audit | P1 COPY | Read-only repo / files после первичного check |
| F11 | Ownership/authorization attestation | VibeAudit; у профессиональных audits требуется scope authorization | P0 COPY | Перед активными checks обязательное подтверждение права тестировать |
| F12 | Severity + launch priority | ProductionReady, AxonBuild, SecurityWall, Revibed, VibeAudit | P0 COPY | Critical/High/etc внутри; наружу — launch blockers / post-launch backlog |
| F13 | Evidence per finding | AxonBuild, VibeAudit, SecurityWall | P0 COPY | Механизм + путь + proof + consequence + refutation |
| F14 | CONFIRMED vs candidate | AxonBuild, VibeAudit, SecurityWall hybrid | P0 COPY | Автоматическое подозрение никогда не равно подтверждённой проблеме |
| F15 | Fix → recheck | ProductionReady, SecurityWall, ScanVibe, VibeShield, Revibed, VibeAudit | P0 COPY | Основной цикл продукта |
| F16 | Before/after history | ScanVibe, Revibed, SecurityWall workflow | P1 COPY | История статуса до/после |
| F17 | Human review layer | MKDGRUPP, ProductionReady, AxonBuild, SecurityWall, Revibed | P0 COPY | Human verification там, где automation не доказывает поведение |
| F18 | Бесплатный scoping / варианты решения | AVAT, AxonBuild | P0 COPY | После free result: 2–3 маршрута с ценой/сроком |
| F19 | Материальный результат до оплаты | MKDGRUPP, scorecard/scanners | P0 COPY | Free report/route, а не «оставьте заявку» |
| F20 | Fixed scope + fixed price | AVAT, MKDGRUPP, AxonBuild fixed result, ProductionReady flat fee | P0 COPY | Цена только после scope, без open-ended billing |
| F21 | Acceptance test до старта | AxonBuild | P0 COPY | Для каждого paid job заранее: какой тест означает «готово» |
| F22 | Оплата за fix, диагностика входит/зачитывается | AxonBuild, ProductionReady audit-credit | P1 COPY | При заказе hardening/доведения диагностику полностью/частично засчитывать |
| F23 | Repo ownership клиента | AVAT, MKDGRUPP | P0 COPY | Код/репо принадлежат клиенту, никакого vendor lock-in |
| F24 | Live progress / weekly demos | AVAT, MKDGRUPP | P1 COPY | Видимый статус работы; для длинных задач демо не реже недели |
| F25 | Гарантийное окно после работы | AVAT support, MKDGRUPP 6 мес | P1 COPY | Ограниченная гарантия на дефекты внесённых нами изменений; срок определить экономикой |
| F26 | Post-launch support | AVAT, CraveCode, MKDGRUPP | P1 COPY | Отдельный support/iteration tier |
| F27 | Scheduled monitoring | ScanVibe, Revibed | P2 LATER | После PMF: daily/weekly checks + alerts |
| F28 | CI/CD quality gate | MKDGRUPP, ScanVibe Business | P2 LATER | Block deploy при провале обязательных checks |
| F29 | Shareable badge/report | ScanVibe, VibeAudit | P2 LATER | Только с честной областью проверки и датой версии |
| F30 | White-label reports | ScanVibe Business | P2 LATER | B2B/agency tier позже |
| F31 | Integration hooks (Slack/GitHub/Jira/webhooks) | SecurityWall, ScanVibe | P2 LATER | После появления командных клиентов |
| F32 | Free knowledge base | AVDemkin, SecurityWall, ScanVibe/AxonBuild blogs | P1 COPY | SEO + конкретные self-check/fix guides |
| F33 | «Сделай сам / помоги / сделай за меня» | AVDemkin | P0 COPY | DIY free → Assisted → Done-for-you |
| F34 | Product lifecycle from idea to launch | CraveCode, AVAT, MKDGRUPP | P0 COPY | Не отказывать клиенту с одной идеей |
| F35 | Small paid pilot | AVAT SPRINT | P1 COPY | Малый scoped result как первый paid step для идеи/застрял |
| F36 | Calculator price/time | AVAT | P1 COPY | После первичной квалификации показать ориентир диапазона |

---

# Что НЕ строим первым

## 1. Полноценный generic security scanner
FACT: ScanVibe, VibeShield, Revibed и VibeAudit уже дают очень много автоматической диагностики бесплатно или почти бесплатно.

DECISION: не тратить ранний бюджет/месяцы на повторение commodity scanner целиком. В V2 нужен лёгкий readiness layer и orchestration, а платная ценность — verification, fixing, completing и launch.

## 2. LMS/большой курс
Бесплатная база знаний полезна, но отдельная школа не является ядром Vibe Release.

## 3. Enterprise integrations до первых продаж
Slack/Jira/API/white-label/CI gate — P2, не P0.

---

# Vibe Release V2 — объединённый пользовательский flow P0

## Шаг 0. Главный вход
`На каком этапе ваш продукт?`

1. **Есть идея**
2. **Начал и застрял**
3. **Почти готов / уже запущен**

## Шаг 1. Бесплатный result-first diagnostic
Правила:
- ≤2 минут;
- без карты;
- первичный результат без регистрации;
- для live app можно ввести URL;
- до активных checks — ownership/authorization attestation.

Результат:
- `Readiness score 0–100`;
- статус `НЕ ГОТОВ / ОГРАНИЧЕННЫЙ ЗАПУСК / ГОТОВ В РАМКАХ ПРОВЕРЕННОГО`;
- Top-3 зоны;
- для self-fix — AI-ready prompts;
- честная метка `estimated` или `confirmed`.

## Шаг 2. Три маршрута после бесплатного результата

### DIY — исправить самому
- бесплатные prompts;
- конкретные guides;
- повторить free check.

### Assisted — Vibe Release помогает довести
- бесплатный scoping;
- 2–3 варианта решения;
- ориентир цены и срока;
- fixed acceptance test;
- fixed scope/price.

### Done-for-you — Vibe Release делает результат
- от идеи или текущего состояния;
- код в repo клиента;
- live progress;
- human review;
- test/recheck;
- launch result;
- гарантийное окно / support option.

## Шаг 3. Paid execution loop
`Scope → Baseline → Evidence → Fix/Build → Recheck → Acceptance test → Launch verdict → Handoff`

Каждая подтверждённая проблема должна иметь:
1. mechanism;
2. affected path;
3. proof/evidence;
4. consequence;
5. refutation attempt;
6. priority;
7. fix status;
8. recheck result.

## Шаг 4. После запуска
P1:
- support/iterations;
- limited guarantee;
- before/after history.

P2 после PMF:
- scheduled monitoring;
- alerts;
- CI/CD gate;
- badge;
- integrations/API.

---

# Главная коммерческая архитектура V2

1. **FREE — Диагностика / маршрут**
   - stage selection;
   - ≤2 min;
   - score + top priorities + self-fix prompts.

2. **CHECK — Проверить перед запуском**
   - evidence-grade verification;
   - local safe fixes;
   - recheck;
   - launch verdict.

3. **FINISH — Довести до запуска**
   - принять существующий AI-built проект;
   - разобрать/сохранить рабочее;
   - доделать критические функции;
   - harden;
   - test;
   - launch.

4. **BUILD — От идеи до MVP/продукта**
   - scope;
   - design/architecture;
   - implementation;
   - integrations;
   - test;
   - launch;
   - handoff.

5. **CARE — После запуска** (P1/P2)
   - support;
   - iterations;
   - monitoring later.

---

# Следующий исследовательский этап

Не менять main-сайт, пока не выполнено:

1. Пройти/воспроизвести каждый доступный free flow конкурентов экран за экраном.
2. Для каждой функции зафиксировать exact UX contract: input → step → output → CTA → paywall.
3. Проверить, какие функции повторяются минимум у 3 сильных игроков.
4. Отдельно протестировать наши 3 flows на 5–10 реальных задачах/публичных demo apps до написания платформы.
5. После этого сделать `Vibe Release V2 Functional Spec`, а уже потом редизайн сайта.
