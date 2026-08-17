# Vibe Release — RF-first Lead Backend Architecture V1

Дата: 17.08.2026
Статус: **DECISION FOR IMPLEMENTATION / DEPLOYMENT PENDING**.

Цель: реализовать фактический путь заявки:

`viberelease.ru → backend в РФ → первичная запись в РФ → внутренний Telegram-канал → менеджер`

При этом Telegram используется как **сигнал о новой заявке**, а не как хранилище персональных данных клиента.

## 1. FACT — правовые ограничения, на которых строим архитектуру

Актуальная редакция 152-ФЗ на 17.08.2026:

- ст. 18 ч. 5: при сборе ПДн граждан РФ через интернет запись, систематизация, накопление, хранение, уточнение и извлечение с использованием БД за пределами РФ не допускаются, кроме прямо перечисленных законом исключений;
- ст. 22: оператор до начала обработки ПДн в общем случае уведомляет Роскомнадзор; действующие исключения узкие и обычная автоматизированная форма заявки под них не подходит;
- ст. 12: до начала трансграничной передачи ПДн требуется отдельное уведомление Роскомнадзора и выполнение требований статьи;
- письмо Минцифры от 12.05.2025 N П25-44929 отдельно разъясняет: после первичной локализации последующая трансграничная передача регулируется ст. 12.

Источники:
- https://www.consultant.ru/document/cons_doc_LAW_61801/cbf4e15b7c330f9372e876cdf2bc928bad7950ef/
- https://www.consultant.ru/document/cons_doc_LAW_61801/d996966e22e1320c9de1ab82d9f6be12c3d9d765/
- https://www.consultant.ru/document/cons_doc_LAW_61801/e4ebbe1780de623c7cf32a59ca82a7bb523a25dd/
- https://www.consultant.ru/document/cons_doc_LAW_511584/

Это рабочая техническая интерпретация, не юридическое заключение.

## 2. FACT — доступная RF-инфраструктура

Yandex Cloud официально имеет регион **Россия**, включая `ru-central1-*`; Serverless YDB создаётся с `location_id: ru-central1`.

Публичные тарифы на 17.08.2026:
- Cloud Functions: первые 1 000 000 вызовов в месяц бесплатно и первые 10 GB×hour бесплатно;
- YDB Serverless: первые 1 000 000 RU/операций в месяц бесплатно; хранение тарифицируется отдельно;
- первые 100 GB исходящего трафика YDB в интернет в месяц не тарифицируются.

Источники:
- https://yandex.cloud/ru/docs/overview/concepts/region
- https://yandex.cloud/ru/docs/functions/pricing
- https://yandex.cloud/ru/docs/ydb/pricing/serverless
- https://yandex.cloud/ru/docs/ydb/quickstart

## 3. DECISION — архитектура MVP

### Public flow
1. Пользователь проходит FREE diagnostic без контакта.
2. Только после результата открывается lead form.
3. Форма отправляет данные по HTTPS в Yandex Cloud Function региона РФ.
4. Function валидирует origin, размер и поля.
5. **До любого вызова Telegram** заявка записывается в YDB Serverless `ru-central1`.
6. После успешной записи Function отправляет в закрытый Telegram-канал только обезличенное операционное уведомление.
7. Менеджер открывает отдельную RF-first manager panel и читает заявку из YDB.

### Telegram payload — P0 правило
В Telegram **НЕ передаём**:
- имя;
- телефон;
- email;
- Telegram username клиента;
- URL проекта;
- свободный комментарий;
- полный questionnaire payload;
- lead_id или другой стабильный идентификатор, позволяющий однозначно связать сообщение с человеком.

Разрешённый notification V1:

`Новая заявка Vibe Release · STUCK → FINISH. Откройте панель менеджера.`

Можно добавить только общую стадию/маршрут и факт новой заявки. Менеджер открывает список последних лидов в RF manager panel.

Причина: не делать Telegram необходимым получателем клиентских ПДн и не создавать трансграничную передачу ПДн просто ради уведомления.

## 4. Manager panel

Статическая оболочка может находиться в `viberelease.ru/admin/`, но:
- никаких credentials в GitHub/JS;
- backend endpoint требует отдельный `Authorization: Bearer <ADMIN_KEY>`;
- ключ менеджер вводит вручную и хранит только в `sessionStorage`;
- backend возвращает данные только после server-side проверки ключа;
- admin list сортируется по времени, поэтому Telegram notification не требует lead_id.

V1 не претендует на полноценную IAM-панель. После нескольких менеджеров заменить shared secret на индивидуальную аутентификацию.

## 5. Секреты

Никогда не коммитим:
- `TELEGRAM_BOT_TOKEN`;
- `TELEGRAM_CHAT_ID`;
- `ADMIN_KEY`;
- service-account static keys.

Предпочтительно: Yandex Lockbox → Cloud Functions. Официальная документация рекомендует Lockbox для API keys/passwords/tokens, необходимых функции:
https://yandex.cloud/ru/docs/lockbox/concepts/services

Function получает доступ к YDB через привязанный service account / metadata credentials, без статического ключа в коде:
https://yandex.cloud/ru/docs/ydb/tutorials/connect-from-cf

## 6. Data minimization V1

Храним только:
- lead_id;
- created_at;
- stage;
- commercial route;
- name;
- one contact string;
- optional project URL;
- optional comment;
- consent flag + consent_version;
- active-check authorization flag;
- diagnostic answers JSON;
- readiness/complexity summary JSON;
- lifecycle status (`new/contacted/qualified/paid/closed/deleted`).

Не сохраняем IP в P0. Не подключаем зарубежную аналитику/капчу к форме до отдельного PD review.

## 7. Abuse controls P0

Без зарубежних антибот-сервисов:
- strict request/body limits;
- exact allowed Origin;
- honeypot field;
- minimum elapsed time from result to submit;
- server-side validation;
- normalized contact hash для dedupe/rate limit внутри RF YDB;
- ограничение количества заявок одного contact hash за окно;
- generic error responses без stack traces.

## 8. Active-check authorization

`authorized_for_active_checks=false` не блокирует обычную коммерческую заявку.

Но backend/операционная процедура должна запрещать active technical probes, пока не получено отдельное подтверждение права на тестирование. Self-assessment и просмотр публичных материалов остаются разрешены.

## 9. До production обязательно

- фактически создать RF Yandex Cloud resources;
- проверить `ru-central1` для YDB/Function;
- подать/актуализировать уведомление РКН до начала production-обработки, если применимо;
- привести privacy policy и consent text к фактическому payload/storage/retention;
- назначить срок хранения/удаления лидов;
- test restore/export/delete flow;
- test `site → YDB → generic Telegram notification → manager panel`;
- убедиться, что Telegram request не содержит ПДн;
- только после этого включать production endpoint на публичном сайте.

## 10. Verdict

Для MVP выбираем **Yandex Cloud Functions + YDB Serverless в регионе Россия** как RF-first lead intake. Telegram остаётся внутренним уведомлением. Клиентские ПДн читаются менеджером из RF backend, а не из Telegram.