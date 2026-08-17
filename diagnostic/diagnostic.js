(() => {
  const app = document.getElementById('app');
  const progress = document.getElementById('progress');
  const progressLabel = document.getElementById('progressLabel');
  const progressPercent = document.getElementById('progressPercent');
  const progressFill = document.getElementById('progressFill');

  const state = { stage: null, step: 0, answers: {} };

  const analytics = (event, data = {}) => {
    console.debug('[VR analytics]', event, data);
  };

  const commonReadinessOptions = [
    { value: 'verified', label: 'Проверяли на практике, есть evidence', note: 'Есть воспроизводимый тест или проверяемое доказательство.' },
    { value: 'configured', label: 'Настроено, но отдельно не проверяли', note: 'Код/настройка есть, но реальный сценарий не воспроизводили.' },
    { value: 'unknown', label: 'Нет / не знаю / AI сказал, что всё нормально', note: 'Считаем область неподтверждённой.' }
  ];

  const flows = {
    idea: [
      q('a1','Что хотите создать?', 'Сначала выбираем конечный результат, а не технологию.', 'single', [
        o('landing','Лендинг / сайт'), o('saas','SaaS / веб-сервис'), o('bot','Telegram-бот'),
        o('assistant','AI-ассистент / AI-агент'), o('integration','Автоматизация / интеграция / парсер'),
        o('crm','Личный кабинет / CRM / внутренний сервис'), o('mobile','Мобильное приложение / PWA'), o('other','Другое')
      ]),
      q('a2','Что продукт должен делать в первую очередь?', 'Можно выбрать до двух главных задач.', 'multi', [
        o('leads','Собирать заявки / лиды'), o('pay','Принимать оплату / подписку'), o('account','Давать личный кабинет'),
        o('automation','Автоматизировать ручную работу'), o('ai_data','Работать с AI / данными / документами'),
        o('connect','Связывать несколько сервисов'), o('analytics','Давать аналитику / отчёты'), o('other','Другое')
      ], { max: 2 }),
      q('a3','Кто будет пользоваться продуктом?', '', 'single', [
        o('team','Только я / моя команда'), o('clients_noauth','Клиенты без аккаунта'), o('clients_auth','Клиенты с аккаунтами'),
        o('roles','Несколько ролей: клиент / менеджер / админ'), o('unknown','Пока не знаю')
      ]),
      q('a4','Нужно принимать деньги внутри продукта?', '', 'single', [
        o('no','Нет'), o('once','Разовая оплата'), o('subscription','Подписка / регулярные платежи'),
        o('both','И разовые, и подписка'), o('unknown','Пока не знаю')
      ]),
      q('a5','С чем продукт должен быть связан?', 'CRM, Telegram, ЮKassa, email, 1С, API, базы данных и т. п.', 'single', [
        o('none','Ни с чем внешним'), o('one','1 внешний сервис'), o('two_three','2–3 сервиса'), o('four_plus','4+ сервисов'), o('unknown','Не знаю')
      ]),
      q('a6','AI должен быть частью продукта?', '', 'single', [
        o('no','Нет'), o('chat','Чат / помощник'), o('rag','Работа с файлами / базой знаний / RAG'),
        o('agent','AI-агент, который сам выполняет действия'), o('generate','Генерация текста / изображений / данных'), o('unknown','Пока не знаю')
      ]),
      q('a7','Когда нужен первый рабочий результат?', '', 'single', [
        o('asap','Как можно быстрее'), o('2w','До 2 недель'), o('1m','До месяца'), o('flex','Срок гибкий')
      ]),
      q('a8','Одним абзацем: что должен уметь продукт?', 'Опционально. Это поможет сделать mini-scope точнее.', 'textarea', [], { optional: true, placeholder: 'Например: пользователь загружает документ, AI извлекает данные, формирует отчёт и сохраняет его в личном кабинете.' })
    ],
    stuck: [
      q('b1','Что сейчас существует?', 'Можно выбрать несколько пунктов.', 'multi', [
        o('local','Локальные файлы / прототип'), o('repo','GitHub/GitLab репозиторий'), o('staging','Staging/test ссылка'),
        o('public','Рабочий публичный сайт/приложение'), o('unsure','Не уверен')
      ], { max: 4 }),
      q('b2','Главный сценарий пользователя сейчас работает?', '', 'single', [
        o('works','Да, от начала до конца'), o('partial','Частично'), o('flaky','Иногда работает, иногда ломается'),
        o('broken','Нет'), o('unknown','Не знаю, как проверить')
      ]),
      q('b3','Что сейчас мешает двигаться дальше?', 'Выберите до трёх главных проблем.', 'multi', [
        o('errors','Ошибки / приложение падает'), o('auth','Авторизация / роли / доступ к данным'), o('db','База данных'),
        o('payments','Платежи'), o('deploy','Деплой / домен / сервер'), o('api','API / интеграции'),
        o('ai','AI работает нестабильно'), o('ui','UI / мобильная версия'), o('limits','Скорость / стоимость / лимиты'),
        o('regression','AI чинит одно и ломает другое'), o('architecture','Я уже не понимаю код / архитектуру'), o('other','Другое')
      ], { max: 3 }),
      q('b4','Есть версия, к которой можно безопасно вернуться?', '', 'single', [
        o('git','Да, нормальная история Git / рабочий commit'), o('backup','Есть backup/копия, но не уверен'), o('no','Нет'), o('unknown','Не знаю')
      ]),
      q('b5','Где проект сейчас можно открыть?', '', 'single', [
        o('local','Только локально'), o('staging','Test / staging'), o('production','Production / публичный URL'), o('nowhere','Сейчас вообще не запускается')
      ]),
      q('b6','Есть реальные пользователи или реальные данные?', '', 'single', [
        o('test','Нет, только тестовые'), o('users','Есть реальные пользователи'), o('data','Есть реальные персональные/бизнес-данные'),
        o('both','Есть и пользователи, и важные данные'), o('unknown','Не уверен')
      ]),
      q('b7','Платежи уже подключены?', '', 'single', [
        o('no','Нет'), o('test','Только test mode'), o('live','Да, реальные платежи'), o('unknown','Не уверен, как они сейчас работают')
      ]),
      q('b8','Сможете предоставить временный/read-only доступ к коду и тестовой среде?', '', 'single', [
        o('yes','Да'), o('likely','Скорее да'), o('no','Нет'), o('unknown','Не знаю, как это сделать')
      ]),
      q('b9','Если есть ссылка на проект — добавьте её', 'Опционально. Активные проверки по URL не запускаются без отдельного разрешения.', 'text', [], { optional: true, placeholder: 'https://example.com' })
    ],
    ready: readinessQuestions()
  };

  function o(value, label, note = '') { return { value, label, note }; }
  function q(id, title, help, type, options = [], extra = {}) { return { id, title, help, type, options, ...extra }; }

  function readinessQuestions() {
    const data = [
      ['c1','Секреты и ключи','Проверяли, что реальные API-ключи, токены и пароли не доступны из frontend, публичного репозитория и истории Git?', false],
      ['c2','Вход и сессии','Критические сценарии входа реально проверены: login, logout, reset, истечение сессии и админ-доступ?', true],
      ['c3','Кто видит чьи данные','Если есть несколько пользователей, проверяли двумя разными аккаунтами, что пользователь B не может читать или менять данные A?', true],
      ['c4','Спам, злоупотребления и лимиты','Есть и проверены ограничения на login/forms/API/дорогие операции, чтобы один пользователь не мог бесконечно спамить запросами или сжечь лимиты?', false],
      ['c5','AI-функции','Если продукт использует AI, проверены ограничения на input, стоимость, tool actions и то, что LLM не принимает security/payment решения самостоятельно?', true],
      ['c6','Данные и восстановление','Есть backup и вы реально восстанавливали из него тестовую копию?', true],
      ['c7','Платежи и доступ после оплаты','Если есть платежи, проверяли server-side подтверждение, повторный webhook/retry, двойную обработку и возврат?', true],
      ['c8','Стабильность и ошибки','При падении внешнего API/БД/AI пользователь получает контролируемую ошибку, а команда видит лог/причину? Это проверяли?', false],
      ['c9','Скорость, лимиты и масштаб','Проверяли ожидаемую стартовую нагрузку, медленные запросы и лимиты внешних сервисов/AI, а не только один идеальный сценарий?', false],
      ['c10','Деплой, rollback и alerts','После неудачного релиза можно быстро понять, что сломалось, и вернуть рабочую версию? Monitoring/alerts/rollback реально проверены?', false],
      ['c11','Зависимости и supply chain','Зависимости зафиксированы lockfile, проверяются на известные уязвимости и не обновляются вслепую?', false],
      ['c12','Безопасность будущих изменений','Есть минимальный набор тестов/CI и понятная структура проекта, чтобы следующий AI-рефакторинг не ломал критические сценарии незаметно?', false]
    ];
    return data.map(([id, area, title, allowNa]) => {
      const options = commonReadinessOptions.map(x => ({ ...x }));
      if (allowNa) options.push(o('na','Не применимо','Этой функции/риска в продукте действительно нет.'));
      return q(id, title, area, 'single', options, { area, allowNa });
    });
  }

  function renderStageSelector() {
    state.stage = null; state.step = 0; state.answers = {};
    progress.hidden = true;
    app.className = 'diag-card-inner';
    app.innerHTML = `
      <div class="stage-grid">
        ${stageCard('idea','💡','Есть только идея','Понимаю, что хочу получить, но продукта ещё нет.','Разобрать идею')}
        ${stageCard('stuck','🛠','Уже начал, но застрял','Что-то уже собрано с AI/разработчиком, но дальше не получается.','Понять, как довести')}
        ${stageCard('ready','🚀','Почти готов / уже работает','Нужно понять, можно ли пускать реальных пользователей, данные и деньги.','Проверить готовность')}
      </div>`;
    app.querySelectorAll('[data-stage]').forEach(btn => btn.addEventListener('click', () => selectStage(btn.dataset.stage)));
    analytics('diagnostic_open');
  }

  function stageCard(stage, icon, title, text, cta) {
    return `<button class="stage-card" data-stage="${stage}"><span class="stage-icon">${icon}</span><strong>${title}</strong><p>${text}</p><span class="button primary" style="margin-top:18px;min-height:40px;padding:0 13px;font-size:12px">${cta}</span></button>`;
  }

  function selectStage(stage) {
    state.stage = stage; state.step = 0; state.answers = {};
    progress.hidden = false;
    analytics('stage_selected', { stage });
    renderQuestion();
  }

  function renderQuestion() {
    const flow = flows[state.stage];
    const question = flow[state.step];
    if (!question) return renderResult();
    updateProgress();
    app.className = 'diag-card-inner';

    let body = '';
    if (question.type === 'single' || question.type === 'multi') {
      const current = state.answers[question.id];
      const selected = Array.isArray(current) ? current : current ? [current] : [];
      body = `<div class="options">${question.options.map(opt => optionHtml(opt, selected.includes(opt.value))).join('')}</div>`;
    } else if (question.type === 'textarea') {
      body = `<textarea class="text-area" id="freeInput" maxlength="500" placeholder="${question.placeholder || ''}">${escapeHtml(state.answers[question.id] || '')}</textarea>`;
    } else {
      body = `<input class="text-input" id="freeInput" type="url" value="${escapeHtml(state.answers[question.id] || '')}" placeholder="${question.placeholder || ''}">`;
    }

    app.innerHTML = `
      <div class="question-eyebrow">${stageLabel(state.stage)} · ${state.step + 1}/${flow.length}</div>
      <h2 class="question-title">${question.title}</h2>
      ${question.help ? `<p class="question-help">${question.help}</p>` : ''}
      ${body}
      <div class="diag-actions">
        <button class="button secondary" id="backBtn">${state.step === 0 ? 'К выбору этапа' : 'Назад'}</button>
        <button class="button primary" id="nextBtn">${state.step === flow.length - 1 ? 'Получить результат' : 'Дальше'}</button>
      </div>
      ${question.max ? `<p class="diag-note">Максимум: ${question.max}</p>` : ''}
      ${question.optional ? '<p class="diag-note">Можно пропустить.</p>' : ''}`;

    if (question.type === 'single' || question.type === 'multi') bindOptionEvents(question);
    document.getElementById('backBtn').addEventListener('click', goBack);
    document.getElementById('nextBtn').addEventListener('click', () => goNext(question));
  }

  function optionHtml(opt, selected) {
    return `<button type="button" class="option${selected ? ' selected' : ''}" data-value="${opt.value}"><span class="option-mark"></span><span class="option-copy"><b>${opt.label}</b>${opt.note ? `<small>${opt.note}</small>` : ''}</span></button>`;
  }

  function bindOptionEvents(question) {
    app.querySelectorAll('.option').forEach(btn => {
      btn.addEventListener('click', () => {
        const value = btn.dataset.value;
        if (question.type === 'single') {
          state.answers[question.id] = value;
          app.querySelectorAll('.option').forEach(x => x.classList.toggle('selected', x === btn));
        } else {
          const arr = Array.isArray(state.answers[question.id]) ? [...state.answers[question.id]] : [];
          const idx = arr.indexOf(value);
          if (idx >= 0) arr.splice(idx,1);
          else if (!question.max || arr.length < question.max) arr.push(value);
          state.answers[question.id] = arr;
          app.querySelectorAll('.option').forEach(x => x.classList.toggle('selected', arr.includes(x.dataset.value)));
        }
      });
    });
  }

  function goBack() {
    if (state.step === 0) return renderStageSelector();
    state.step -= 1; renderQuestion();
  }

  function goNext(question) {
    if (question.type === 'text' || question.type === 'textarea') {
      state.answers[question.id] = document.getElementById('freeInput').value.trim();
    }
    const answer = state.answers[question.id];
    const empty = answer == null || answer === '' || (Array.isArray(answer) && answer.length === 0);
    if (empty && !question.optional) {
      const next = document.getElementById('nextBtn');
      const old = next.textContent;
      next.textContent = 'Выберите ответ';
      setTimeout(() => next.textContent = old, 900);
      return;
    }
    analytics('question_answered', { stage: state.stage, question_id: question.id, answer_id: answer });
    state.step += 1;
    if (state.step >= flows[state.stage].length) renderResult(); else renderQuestion();
  }

  function updateProgress() {
    const total = flows[state.stage].length;
    const pct = Math.round((state.step / total) * 100);
    progressLabel.textContent = `Шаг ${state.step + 1} из ${total}`;
    progressPercent.textContent = `${pct}%`;
    progressFill.style.width = `${pct}%`;
  }

  function renderResult() {
    progressFill.style.width = '100%'; progressPercent.textContent = '100%'; progressLabel.textContent = 'Готово';
    analytics('diagnostic_completed', { stage: state.stage });
    app.className = 'result-wrap';
    if (state.stage === 'idea') renderIdeaResult();
    if (state.stage === 'stuck') renderStuckResult();
    if (state.stage === 'ready') renderReadyResult();
  }

  function renderIdeaResult() {
    const points = ideaComplexity();
    const level = points <= 3 ? 'Простой' : points <= 7 ? 'Стандартный' : 'Сложный';
    const type = labelFor('a1', state.answers.a1);
    const audience = labelFor('a3', state.answers.a3);
    const core = labelsFor('a2', state.answers.a2).join(', ');
    const deps = [
      state.answers.a3 === 'roles' || state.answers.a3 === 'clients_auth' ? 'Авторизация/роли' : null,
      ['once','subscription','both'].includes(state.answers.a4) ? 'Платежи' : null,
      ['two_three','four_plus','one'].includes(state.answers.a5) ? 'Интеграции' : null,
      !['no','unknown'].includes(state.answers.a6) ? 'AI' : null
    ].filter(Boolean);

    app.innerHTML = `
      <div class="result-top">
        <div class="score-box"><strong>${points}</strong><span>индекс сложности</span></div>
        <div><span class="status-pill status-yellow">IDEA · ${level.toUpperCase()}</span><h2>Уже можно наметить первый рабочий вариант</h2><p>Это не смета. Индекс нужен, чтобы одинаково маршрутизировать идеи до точного scope.</p></div>
      </div>
      <div class="result-section"><h3>Три маршрута</h3><div class="route-grid">
        ${routeCard('Минимальный','Проверить саму ценность','Самая короткая версия без лишних функций.',['1 главный сценарий','Минимум интеграций','Только критичные экраны'],false)}
        ${routeCard('Рекомендуем','MVP для первых пользователей','Версия, которую уже можно дать первым реальным пользователям.',['Core flow','Нужные auth/data/payment части','Deploy + базовая проверка'],true)}
        ${routeCard('Полный запуск','С запасом на развитие','Больше инфраструктуры и функций сразу.',['Расширенные роли/интеграции','Monitoring/backups/analytics','Подготовка к следующим итерациям'],false)}
      </div></div>
      <div class="result-section"><h3>Ваш mini-scope</h3><div class="mini-scope">
        ${scopeRow('Что строим', type)}${scopeRow('Для кого', audience)}${scopeRow('Главная задача', core || 'Не определена')}
        ${scopeRow('Сложность', `${level} · ${points} points`)}${scopeRow('Зависимости', deps.length ? deps.join(', ') : 'Минимальные / не подтверждены')}
        ${scopeRow('Описание', state.answers.a8 || 'Не добавлено')}
      </div></div>
      <p class="diag-note">Ориентиры цены/срока в прототипе намеренно не показываются: их подключим после отдельной pricing/economics калибровки, чтобы не выдумывать цифры.</p>
      ${leadBox('build','Получить точный scope + первый концепт бесплатно','После value: передаём менеджеру всю диагностику, чтобы не заставлять вас пересказывать задачу.')}
      ${restartButton()}`;
    bindResultEvents();
    analytics('result_viewed', { stage: 'idea', status: level });
  }

  function ideaComplexity() {
    const base = { landing:1, bot:2, integration:2, assistant:3, crm:3, saas:4, mobile:4, other:3 }[state.answers.a1] || 3;
    let p = base;
    if (state.answers.a3 === 'clients_auth') p += 1;
    if (state.answers.a3 === 'roles') p += 2;
    if (state.answers.a4 === 'once') p += 1;
    if (['subscription','both'].includes(state.answers.a4)) p += 2;
    if (state.answers.a5 === 'two_three') p += 1;
    if (state.answers.a5 === 'four_plus') p += 2;
    if (['chat','generate'].includes(state.answers.a6)) p += 1;
    if (state.answers.a6 === 'rag') p += 2;
    if (state.answers.a6 === 'agent') p += 3;
    return p;
  }

  function renderStuckResult() {
    const route = stuckRoute();
    const routeData = {
      finish: ['ДОВЕСТИ','Проект выглядит пригодным для продолжения.','status-green'],
      stabilize: ['СНАЧАЛА СТАБИЛИЗИРОВАТЬ','Перед новой разработкой нужно зафиксировать рабочую версию и границы изменений.','status-yellow'],
      review: ['НУЖНА РЕВИЗИЯ','По анкете нельзя честно решить «доделывать» или «пересобирать» без просмотра проекта.','status-red']
    }[route];
    const blockers = labelsFor('b3', state.answers.b3).slice(0,3);
    const assets = [];
    const existing = state.answers.b1 || [];
    if (existing.includes('repo')) assets.push('Есть репозиторий');
    if (existing.includes('staging')) assets.push('Есть staging');
    if (existing.includes('public')) assets.push('Есть публичная версия');
    if (state.answers.b4 === 'git') assets.push('Есть рабочая история Git');
    if (!assets.length) assets.push('Сохраняемые части ещё не подтверждены');

    app.innerHTML = `
      <div class="result-top">
        <div class="score-box"><strong>→</strong><span>маршрут</span></div>
        <div><span class="status-pill ${routeData[2]}">${routeData[0]}</span><h2>${routeData[1]}</h2><p>Автоматически советовать «переписать всё» мы не будем — это решение принимается только после repo-level ревизии.</p></div>
      </div>
      <div class="result-section"><h3>Что уже можно считать активом</h3><div class="result-grid">${assets.map(x => resultItem(x,'Это можно использовать как опорную точку при ревизии.','good-item')).join('')}</div></div>
      <div class="result-section"><h3>Главные блокеры</h3><div class="result-grid">${(blockers.length ? blockers : ['Не указаны']).map(x => resultItem(x,'Нужно воспроизвести и зафиксировать evidence до изменения кода.','warning-item')).join('')}</div></div>
      <div class="result-section"><h3>Следующий порядок действий</h3><div class="mini-scope">
        ${scopeRow('01','Создать/подтвердить точку возврата')}${scopeRow('02','Воспроизвести главный пользовательский сценарий')}
        ${scopeRow('03','Зафиксировать blockers и evidence')}${scopeRow('04','Определить локальный fix или границу пересборки')}${scopeRow('05','Исправить → проверить снова → запуск')}
      </div></div>
      ${leadBox('finish','Получить mini diagnosis + scope','Передадим менеджеру ответы, ссылку и блокеры. Контакт спрашиваем только после результата.')}
      ${restartButton()}`;
    bindResultEvents();
    analytics('result_viewed', { stage: 'stuck', status: route });
  }

  function stuckRoute() {
    const core = state.answers.b2;
    const rollback = state.answers.b4;
    const place = state.answers.b5;
    const real = state.answers.b6;
    const payments = state.answers.b7;
    const existing = state.answers.b1 || [];
    const blockers = state.answers.b3 || [];

    if (place === 'nowhere' || existing.includes('unsure') || (rollback === 'no' && !existing.includes('repo')) || blockers.includes('architecture') && state.answers.b8 === 'unknown') return 'review';
    if (core === 'flaky' || rollback === 'no' || ['users','data','both'].includes(real) || payments === 'live' || payments === 'unknown' || blockers.includes('regression')) return 'stabilize';
    if (['broken','unknown'].includes(core)) return 'review';
    return 'finish';
  }

  function renderReadyResult() {
    const result = readinessScore();
    const weakest = weakestAreas(result.values).slice(0,3);
    const good = Object.entries(result.values).filter(([,v]) => v === 1).slice(0,3).map(([id]) => areaName(id));
    const statusClass = result.status === 'red' ? 'status-red' : result.status === 'yellow' ? 'status-yellow' : 'status-green';
    const statusText = result.status === 'red' ? 'ПРЕДВАРИТЕЛЬНО: ЗАПУСК РИСКОВАН' : result.status === 'yellow' ? 'ПРЕДВАРИТЕЛЬНО: ТРЕБУЕТСЯ ПРОВЕРКА' : 'ПРЕДВАРИТЕЛЬНО: ВЫСОКАЯ ГОТОВНОСТЬ';

    app.innerHTML = `
      <div class="result-top">
        <div class="score-box"><strong>${result.score}</strong><span>из 100</span></div>
        <div><span class="status-pill ${statusClass}">${statusText}</span><h2>Предварительная готовность к запуску</h2><p>Self-assessment по вашим ответам. Он не подтверждает отсутствие уязвимостей или ошибок и не заменяет evidence-grade проверку.</p></div>
      </div>
      <div class="result-section"><h3>Проверить в первую очередь</h3><div class="result-grid">${weakest.map(item => resultItem(areaName(item.id), valueHuman(item.value), item.value === 0 ? 'danger-item' : 'warning-item')).join('') || '<p class="empty-score">Слабые зоны не определены.</p>'}</div></div>
      <div class="result-section"><h3>Что уже отмечено как проверенное</h3><div class="result-grid">${good.length ? good.map(x => resultItem(x,'Вы отметили область как VERIFIED. Платная проверка всё равно перепроверяет критичные границы.','good-item')).join('') : '<p class="empty-score">Пока ни одна область не отмечена как VERIFIED.</p>'}</div></div>
      <div class="result-section"><h3>Fix prompts для AI</h3>${weakest.map(item => promptCard(item.id)).join('')}</div>
      <div class="auth-gate"><b>Активная проверка — только после разрешения</b><p>URL можно передать менеджеру, но active probes не должны запускаться, пока владелец не подтвердит право на тестирование.</p></div>
      ${leadBox('check','Проверить это на реальном проекте','Подтверждаем → исправляем локальные проблемы в согласованном объёме → проверяем снова. Для первых пяти подходящих стандартных CHECK-проектов — 8 900 ₽.')}
      ${restartButton()}`;
    bindResultEvents();
    analytics('result_viewed', { stage: 'ready', status: result.status, score: result.score });
  }

  function readinessScore() {
    const values = {};
    flows.ready.forEach(qn => {
      const a = state.answers[qn.id];
      values[qn.id] = a === 'verified' ? 1 : a === 'configured' ? .5 : a === 'unknown' ? 0 : null;
    });
    const applicable = Object.values(values).filter(v => v != null);
    const score = applicable.length ? Math.round(100 * applicable.reduce((a,b) => a+b,0) / applicable.length) : 0;

    const criticalIds = ['c1'];
    ['c2','c3','c6','c7'].forEach(id => { if (values[id] != null) criticalIds.push(id); });
    const critical = criticalIds.map(id => values[id]).filter(v => v != null);
    let status = 'green';
    if (critical.some(v => v === 0) || score < 50) status = 'red';
    else if (critical.some(v => v === .5) || score < 85) status = 'yellow';
    return { values, score, status };
  }

  function weakestAreas(values) {
    const critical = new Set(['c1','c2','c3','c6','c7']);
    return Object.entries(values)
      .filter(([,v]) => v != null && v < 1)
      .map(([id,value]) => ({ id, value, critical: critical.has(id) }))
      .sort((a,b) => {
        const rank = x => x.critical && x.value === 0 ? 0 : x.critical && x.value === .5 ? 1 : x.value === 0 ? 2 : 3;
        return rank(a) - rank(b) || Number(a.id.slice(1)) - Number(b.id.slice(1));
      });
  }

  function areaName(id) {
    const qn = flows.ready.find(x => x.id === id);
    return qn ? qn.area : id;
  }

  function valueHuman(v) {
    return v === 0 ? 'НЕ ПОДТВЕРЖДЕНО — ответ «нет / не знаю».' : 'НАСТРОЕНО, НО НЕ ПРОВЕРЕНО — нужен воспроизводимый тест.';
  }

  function promptCard(id) {
    const area = areaName(id);
    const extra = {
      c3: 'Создай/используй двух тестовых пользователей A и B. Проверь B→A READ, UPDATE и DELETE для защищённых сущностей. Используй synthetic/test records.',
      c6: 'Не считай наличие backup достаточным. Выполни безопасный restore drill в отдельное test окружение и сравни ожидаемые данные/структуру.',
      c7: 'Проверь повтор одного provider event/webhook, retry после неоднозначного timeout, повтор fulfillment и повтор refund. Бизнес-операция должна применяться один раз.'
    }[id] || 'Определи один критичный воспроизводимый сценарий для этой области и проверь его до/после.';
    const prompt = `Проверь область: ${area}. Сначала найди текущую реализацию и перечисли конкретные файлы/маршруты/настройки, которые участвуют. Ничего не меняй, пока не покажешь evidence и краткий план. Не трогай production-данные и не выполняй разрушительные команды. ${extra} После минимального исправления создай воспроизводимый тест: BEFORE → FIX → AFTER. Если поведение нельзя подтвердить из текущего доступа, напиши «НЕ ПОДТВЕРЖДЕНО», а не делай вывод по наличию кода.`;
    return `<div class="prompt-card"><pre>${escapeHtml(prompt)}</pre><button class="copy-btn" data-copy="${escapeAttr(prompt)}" data-area="${id}">Скопировать prompt</button></div>`;
  }

  function routeCard(label, title, text, items, recommended) {
    return `<div class="route-card${recommended ? ' recommended' : ''}"><span class="route-label">${label}</span><h4>${title}</h4><p>${text}</p><ul>${items.map(x => `<li>${x}</li>`).join('')}</ul></div>`;
  }
  function resultItem(title, text, cls='') { return `<div class="result-item ${cls}"><b>${title}</b><p>${text}</p></div>`; }
  function scopeRow(label, text) { return `<div class="scope-row"><b>${label}</b><span>${escapeHtml(String(text))}</span></div>`; }

  function leadBox(route, title, text) {
    return `<div class="lead-box" data-lead-route="${route}"><h3>${title}</h3><p>${text}</p>
      <form class="lead-form">
        <div class="lead-grid">
          <input class="text-input" name="name" placeholder="Имя" required>
          <input class="text-input" name="contact" placeholder="Telegram / телефон / email" required>
          <input class="text-input full" name="url" placeholder="Ссылка на проект, если есть">
          <textarea class="text-area full" name="comment" placeholder="Комментарий — необязательно" style="min-height:90px"></textarea>
        </div>
        <label class="inline-check"><input type="checkbox" name="consent" required><span>Согласен на обработку данных для ответа на заявку.</span></label>
        ${state.stage === 'ready' ? '<label class="inline-check"><input type="checkbox" name="authorized"><span>Я владелец проекта или имею разрешение на его техническую проверку. Это требуется только для последующих active checks.</span></label>' : ''}
        <button class="button primary" type="submit" style="margin-top:14px">Передать менеджеру</button>
        <p class="prototype-note">Прототип: заявка сейчас НЕ отправляется в Telegram. После submit ниже показывается payload для проверки UX.</p>
        <pre class="payload-preview"></pre>
      </form>
    </div>`;
  }

  function restartButton() { return '<div style="margin-top:24px"><button class="button secondary" id="restartBtn">Пройти заново</button></div>'; }

  function bindResultEvents() {
    document.getElementById('restartBtn')?.addEventListener('click', renderStageSelector);
    app.querySelectorAll('.copy-btn').forEach(btn => btn.addEventListener('click', async () => {
      const text = btn.dataset.copy;
      try { await navigator.clipboard.writeText(text); btn.textContent = 'Скопировано'; }
      catch { btn.textContent = 'Не удалось скопировать'; }
      analytics('fix_prompt_copied', { area: btn.dataset.area });
      setTimeout(() => btn.textContent = 'Скопировать prompt', 1200);
    }));
    app.querySelectorAll('.lead-form').forEach(form => {
      form.addEventListener('submit', e => {
        e.preventDefault();
        const fd = new FormData(form);
        const box = form.closest('[data-lead-route]');
        const route = box.dataset.leadRoute;
        const payload = {
          event: 'NEW VIBE RELEASE LEAD — PROTOTYPE ONLY',
          stage: state.stage.toUpperCase(),
          route: route.toUpperCase(),
          name: fd.get('name'),
          contact: fd.get('contact'),
          url: fd.get('url') || null,
          comment: fd.get('comment') || null,
          authorized_for_active_checks: fd.get('authorized') === 'on',
          answers: state.answers,
          created_at: new Date().toISOString()
        };
        const preview = form.querySelector('.payload-preview');
        preview.textContent = JSON.stringify(payload, null, 2);
        preview.classList.add('show');
        analytics('lead_submitted', { route, stage: state.stage, prototype: true });
      });
    });
  }

  function stageLabel(stage) { return stage === 'idea' ? 'Есть идея' : stage === 'stuck' ? 'Начал и застрял' : 'Почти готов'; }

  function labelFor(questionId, value) {
    const flow = Object.values(flows).flat();
    const question = flow.find(x => x.id === questionId);
    const option = question?.options.find(x => x.value === value);
    return option ? option.label : value || 'Не указано';
  }
  function labelsFor(questionId, values) {
    const arr = Array.isArray(values) ? values : values ? [values] : [];
    return arr.map(v => labelFor(questionId, v));
  }

  function escapeHtml(str) {
    return String(str).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  }
  function escapeAttr(str) { return escapeHtml(str).replace(/\n/g, '&#10;'); }

  renderStageSelector();
})();
