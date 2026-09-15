const assert = require('node:assert/strict');
const { chromium, launchOptions } = require("./browser-runtime");
const baseUrl = process.env.AUDIT_BASE_URL || 'http://127.0.0.1:4173';
if (!['localhost', '127.0.0.1'].includes(new URL(baseUrl).hostname)) throw new Error('Dashboard tests require a local fixture server');
(async () => {
  const browser = await chromium.launch(launchOptions);
  try {
    for (const width of [375, 768, 1440]) {
      const context = await browser.newContext({viewport:{width,height:900}});
      const page = await context.newPage();
      const errors=[]; page.on('pageerror', error=>errors.push(error.message));
      await page.route('**/api/**', route=>route.fulfill({status:503,contentType:'application/json',body:'{}'}));
      await page.addInitScript(()=>sessionStorage.setItem('kombuAdminAuthenticated','true'));
      await page.goto(`${baseUrl}/admin.html`);
      await page.waitForSelector('#dashboardMonth');
      await page.evaluate(()=>{
        state = normalizeState({products:[], recipes:[], ingredients:[], packaging:[], purchases:[], orders:[], expenses:[{date:'2026-09-10',amount:30}],sales:[{date:'2026-09-10',qty:10,unitPrice:20,batchCode:'TEST'}],batches:[{code:'TEST',costSnapshot:{costPerBottle:4}}]});
        dashboardMonth='2026-09'; render();
      });
      assert.equal((await page.locator('.dashboard-key-metrics .metric-card > strong').nth(2).innerText()).replace(/\s/g, ' '), 'R$ 130,00', 'monthly profit must be shown in its own card');
      await page.locator('#dashboardMonth').fill('2026-08');
      await page.locator('#dashboardMonth').dispatchEvent('change');
      for (const card of [1, 2]) {
        assert.equal((await page.locator('.dashboard-key-metrics .metric-card > strong').nth(card).innerText()).replace(/\s/g, ' '), 'R$ 0,00', 'empty month must clear both revenue and profit');
      }
      await page.locator('[data-dashboard-current-month]').click();
      assert.equal(await page.locator('#dashboardMonth').inputValue(), await page.evaluate(()=>new Date().toLocaleDateString('sv-SE').slice(0,7)));
      await page.locator('[data-dashboard-panel="reservations"] summary').click();
      await page.locator('[data-dashboard-order-view="missing"]').click();
      assert.equal(await page.locator('[data-dashboard-panel="reservations"]').getAttribute('open'), '');
      await page.locator('[data-dashboard-panel="workflow"] summary').click();
      await page.locator('[data-dashboard-panel="workflow"] [data-dashboard-module="purchases"]').click();
      await page.waitForSelector('[data-action="new-purchase"]');
      // Check every module renders at all breakpoints, including empty-data entry paths.
      for (const module of ['dashboard','products','ingredients','purchases','suppliers','recipes','costs','batches','stock','packaging','sales','orders','receipts','leads','partners','expenses','reports','cms','schema']) {
        await page.evaluate(module=>setModule(module), module);
        assert.ok(await page.locator('#adminContent h1').count(), `${module} has a heading`);
        assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+2), `${module} fits ${width}px`);
      }
      await page.evaluate(()=>setModule('cms'));
      const upload = page.locator('[data-cms-image-upload]').first();
      await upload.setInputFiles({name:'test.png',mimeType:'image/png',buffer:Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII=', 'base64')});
      await page.waitForFunction(()=>document.querySelector('[data-upload-status="image-0"]').textContent.includes('Imagem preparada'));
      assert.equal(await upload.isEnabled(), true, 'upload control recovers after storage failure');
      await page.evaluate(()=>setModule('dashboard'));
      await page.locator('[data-action="new-order"]').click();
      assert.equal(await page.locator('#adminModal.is-open').count(),1);
      await page.locator('#closeAdminModal').click();
      await page.screenshot({path:`/tmp/kombu-dashboard-${width}.png`, fullPage:true});
      assert.deepEqual(errors,[]);
      await context.close();
    }
    console.log('Dashboard browser regression: 19 modules at 3 widths, period filters, drilldowns, persistent disclosure, order dialog and no page errors passed.');
  } finally { await browser.close(); }
})().catch(error=>{console.error(error);process.exitCode=1;});
