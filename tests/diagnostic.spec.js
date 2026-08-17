import { test, expect } from '@playwright/test';

const URL = '/diagnostic/';

async function startStage(page, stage) {
  await page.goto(URL);
  await page.locator(`[data-stage="${stage}"]`).click();
}

async function choose(page, value) {
  await page.locator(`.option[data-value="${value}"]`).click();
  await page.locator('#nextBtn').click();
}

async function chooseMulti(page, values) {
  for (const value of values) await page.locator(`.option[data-value="${value}"]`).click();
  await page.locator('#nextBtn').click();
}

async function skipOptional(page) {
  await page.locator('#nextBtn').click();
}

async function runIdea(page, a) {
  await startStage(page, 'idea');
  await choose(page, a.a1);
  await chooseMulti(page, a.a2);
  await choose(page, a.a3);
  await choose(page, a.a4);
  await choose(page, a.a5);
  await choose(page, a.a6);
  await choose(page, a.a7);
  await skipOptional(page);
}

async function runStuck(page, b) {
  await startStage(page, 'stuck');
  await chooseMulti(page, b.b1);
  await choose(page, b.b2);
  await chooseMulti(page, b.b3);
  await choose(page, b.b4);
  await choose(page, b.b5);
  await choose(page, b.b6);
  await choose(page, b.b7);
  await choose(page, b.b8);
  await skipOptional(page);
}

async function runReady(page, answers) {
  await startStage(page, 'ready');
  for (let i = 1; i <= 12; i++) {
    const value = answers[`c${i}`] || 'verified';
    await choose(page, value);
  }
}

const IDEA = {
  I1: { a1:'landing', a2:['leads'], a3:'clients_noauth', a4:'no', a5:'none', a6:'no', a7:'2w' },
  I2: { a1:'saas', a2:['pay','ai_data'], a3:'clients_auth', a4:'subscription', a5:'two_three', a6:'rag', a7:'1m' },
  I3: { a1:'bot', a2:['automation'], a3:'team', a4:'no', a5:'one', a6:'chat', a7:'asap' }
};

const STUCK = {
  S1: { b1:['repo','staging'], b2:'partial', b3:['ui','api'], b4:'git', b5:'staging', b6:'test', b7:'test', b8:'yes' },
  S2: { b1:['repo','public'], b2:'flaky', b3:['regression','payments','auth'], b4:'no', b5:'production', b6:'both', b7:'live', b8:'yes' },
  S3: { b1:['unsure'], b2:'unknown', b3:['architecture','errors'], b4:'unknown', b5:'nowhere', b6:'unknown', b7:'unknown', b8:'unknown' }
};

const R2 = {
  c1:'verified', c2:'verified', c3:'unknown', c4:'configured', c5:'na', c6:'configured', c7:'na', c8:'verified', c9:'configured', c10:'configured', c11:'verified', c12:'configured'
};

for (const [name, data] of Object.entries(IDEA)) {
  test(`IDEA ${name}`, async ({ page }) => {
    await runIdea(page, data);
    if (name === 'I1') {
      await expect(page.locator('.score-box strong')).toHaveText('1');
      await expect(page.locator('.status-pill')).toContainText('ПРОСТОЙ');
    }
    if (name === 'I2') {
      await expect(page.locator('.score-box strong')).toHaveText('10');
      await expect(page.locator('.status-pill')).toContainText('СЛОЖНЫЙ');
      await expect(page.locator('.mini-scope')).toContainText('Авторизация/роли');
      await expect(page.locator('.mini-scope')).toContainText('Платежи');
      await expect(page.locator('.mini-scope')).toContainText('Интеграции');
      await expect(page.locator('.mini-scope')).toContainText('AI');
    }
    if (name === 'I3') {
      await expect(page.locator('.score-box strong')).toHaveText('3');
      await expect(page.locator('.status-pill')).toContainText('ПРОСТОЙ');
    }
    await expect(page.locator('.route-card')).toHaveCount(3);
    await expect(page.locator('.lead-form')).toBeVisible();
  });
}

for (const [name, data] of Object.entries(STUCK)) {
  test(`STUCK ${name}`, async ({ page }) => {
    await runStuck(page, data);
    const pill = page.locator('.status-pill');
    if (name === 'S1') await expect(pill).toContainText('ДОВЕСТИ');
    if (name === 'S2') await expect(pill).toContainText('СТАБИЛИЗИРОВАТЬ');
    if (name === 'S3') await expect(pill).toContainText('РЕВИЗИЯ');
    await expect(page.locator('body')).not.toContainText('переписать с нуля');
  });
}

test('READY R1 all verified => 100 / GREEN preliminary', async ({ page }) => {
  await runReady(page, {});
  await expect(page.locator('.score-box strong')).toHaveText('100');
  await expect(page.locator('.status-pill')).toContainText('ВЫСОКАЯ ГОТОВНОСТЬ');
  await expect(page.locator('body')).not.toContainText('ГОТОВ К ЗАПУСКУ');
});

test('READY R2 critical cross-user unknown => RED and c3 first', async ({ page }) => {
  await runReady(page, R2);
  await expect(page.locator('.score-box strong')).toHaveText('65');
  await expect(page.locator('.status-pill')).toContainText('ЗАПУСК РИСКОВАН');
  const firstWeak = page.locator('.result-grid .result-item').first();
  await expect(firstWeak).toContainText('Кто видит чьи данные');
  await expect(page.locator('.prompt-card').first()).toContainText('READ, UPDATE и DELETE');
});

test('READY R3 all configured => 50 / YELLOW', async ({ page }) => {
  const answers = Object.fromEntries(Array.from({length:12}, (_,i)=>[`c${i+1}`,'configured']));
  await runReady(page, answers);
  await expect(page.locator('.score-box strong')).toHaveText('50');
  await expect(page.locator('.status-pill')).toContainText('ТРЕБУЕТСЯ ПРОВЕРКА');
  await expect(page.locator('.result-section').filter({hasText:'Что уже отмечено как проверенное'})).toContainText('Пока ни одна область');
});

test('multi-select max cannot exceed declared maximum', async ({ page }) => {
  await startStage(page, 'idea');
  await choose(page, 'saas');
  await page.locator('.option[data-value="pay"]').click();
  await page.locator('.option[data-value="ai_data"]').click();
  await page.locator('.option[data-value="leads"]').click();
  await expect(page.locator('.option.selected')).toHaveCount(2);
  await expect(page.locator('.option[data-value="leads"]')).not.toHaveClass(/selected/);
});

test('back change critical answer recalculates final result', async ({ page }) => {
  await startStage(page, 'ready');
  await choose(page, 'verified'); // c1
  await choose(page, 'verified'); // c2
  await choose(page, 'unknown'); // c3
  for (let i=4; i<=12; i++) await choose(page, 'verified');
  await expect(page.locator('.status-pill')).toContainText('ЗАПУСК РИСКОВАН');
  await page.locator('#restartBtn').click();
  await startStage(page, 'ready');
  for (let i=1; i<=12; i++) await choose(page, 'verified');
  await expect(page.locator('.score-box strong')).toHaveText('100');
});

test('lead form blocks missing required contact', async ({ page }) => {
  await runIdea(page, IDEA.I1);
  await page.locator('input[name="name"]').fill('Тест');
  await page.locator('input[name="consent"]').check();
  await page.locator('.lead-form button[type="submit"]').click();
  await expect(page.locator('.payload-preview')).not.toHaveClass(/show/);
});

test('READY authorization stays false unless explicitly checked', async ({ page }) => {
  await runReady(page, R2);
  await page.locator('input[name="name"]').fill('Тест');
  await page.locator('input[name="contact"]').fill('@test');
  await page.locator('input[name="consent"]').check();
  await page.locator('.lead-form button[type="submit"]').click();
  await expect(page.locator('.payload-preview')).toContainText('"authorized_for_active_checks": false');
});

test('copy prompt works in Chromium with clipboard permission', async ({ page, context, browserName }) => {
  test.skip(browserName !== 'chromium');
  await context.grantPermissions(['clipboard-read','clipboard-write']);
  await runReady(page, R2);
  await page.locator('.copy-btn').first().click();
  await expect(page.locator('.copy-btn').first()).toHaveText('Скопировано');
  const clipboard = await page.evaluate(() => navigator.clipboard.readText());
  expect(clipboard).toContain('Кто видит чьи данные');
});

test('keyboard-only: stage selector and option are operable', async ({ page }) => {
  await page.goto(URL);
  await page.locator('[data-stage="idea"]').focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('.question-title')).toContainText('Что хотите создать');
  await page.locator('.option[data-value="landing"]').focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('.option[data-value="landing"]')).toHaveClass(/selected/);
});

for (const viewport of [{width:360,height:800},{width:390,height:844}]) {
  test(`mobile ${viewport.width}px no horizontal overflow`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto(URL);
    const overflow = await page.evaluate(() => ({sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth}));
    expect(overflow.sw).toBeLessThanOrEqual(overflow.cw + 1);
    await page.locator('[data-stage="ready"]').click();
    const overflow2 = await page.evaluate(() => ({sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth}));
    expect(overflow2.sw).toBeLessThanOrEqual(overflow2.cw + 1);
  });
}
