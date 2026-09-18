const assert = require('node:assert/strict');
const { chromium, launchOptions } = require('./browser-runtime');
const base = process.env.AUDIT_BASE_URL || 'http://127.0.0.1:4173';
if (!['localhost', '127.0.0.1'].includes(new URL(base).hostname)) throw new Error('Local fixtures only');
const product = { id:'p', flavor:'Maracujá', sizeMl:500, retailPrice:22, wholesalePrice:15, active:true };
const line = (key, allocations=[]) => ({ key, productId:'p', flavor:'Maracujá', sizeMl:500, qty:10, unitPrice:15, allocations });
const order = (id,date,items) => ({ id, code:id, customerName:id, clientType:'novo_cliente', orderDate:date, createdAt:'2026-09-18T00:00:00Z', status:'confirmado', items });
const seed = {
  products:[product], recipes:[{id:'r',productId:'p',flavor:'Maracujá',bottleMl:500,yieldBottles:1,ingredients:[],packaging:[]}],
  batches:[{id:'b',code:'B',productId:'p',recipeId:'r',sizeMl:500,flavor:'Maracujá',actual:10,date:'2026-09-01',status:'aprovado'}],
  orders:[order('Origem','2026-08-10',[line('s',[{batchCode:'B',qty:10,manual:false}])]),order('Antigo','2026-08-03',[line('o')]),order('Destino','2026-08-24',[line('n')])],
  ingredients:[],packaging:[],sales:[],purchases:[],expenses:[],partners:[],audit:[]
};
const snapshot = page => page.evaluate(()=>JSON.parse(localStorage.getItem('kombuAdminStateV3')));
const qty = state => state.orders.map(o=>o.items.reduce((sum,i)=>sum+(i.allocations||[]).reduce((sum,a)=>sum+a.qty,0),0));
(async()=>{
 const browser = await chromium.launch(launchOptions);
 try {
  for (const width of [390,1440]) {
   for (const destination of ['free','auto',JSON.stringify(['Destino','n'])]) {
    const context = await browser.newContext({viewport:{width,height:1000},locale:'pt-BR'});
    await context.addInitScript(seed=>{if(!localStorage.getItem('kombuAdminStateV3')) localStorage.setItem('kombuAdminStateV3',JSON.stringify(seed));},seed);
    const page=await context.newPage(); const errors=[]; page.on('pageerror',e=>errors.push(e.message));
    await page.goto(`${base}/admin`);
    await page.fill('#adminPassword','local-fixture'); await page.click('#loginForm button[type="submit"]');
    await page.waitForSelector('#adminShell:not(.is-locked)');
    if (width < 760) await page.selectOption('#mobileModuleSelector','orders'); else await page.click('#adminNav [data-module="orders"]');
    await page.locator('.order-compact-card > summary').filter({hasText:'Origem'}).click();
    await page.click('[data-action="adjust-order-reservation:Origem"]');
    assert.equal(await page.locator('[data-release-destination]').isVisible(),false);
    await page.fill('[data-reserve-input]','5');
    await page.selectOption('[data-reserve-destination]',destination);
    assert.equal(await page.locator('[data-release-destination]').isVisible(),true);
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth <= innerWidth+2));
    const destinationBox = await page.locator('[data-release-destination]').boundingBox();
    const quickBox = await page.locator('.reserve-quick').boundingBox();
    assert.ok(quickBox.y >= destinationBox.y + destinationBox.height - 1, 'destination and quick controls must not overlap');
    await page.screenshot({path:`/tmp/kombu-reservation-${width}.png`});
    await page.click('#adjustOrderReservationForm button[type="submit"]');
    await page.waitForSelector('#adminModal',{state:'hidden'});
    assert.deepEqual(qty(await snapshot(page)),destination==='free'?[5,0,0]:destination==='auto'?[5,5,0]:[5,0,5]);
    await page.reload(); await page.waitForSelector('#adminShell:not(.is-locked)');
    assert.deepEqual(qty(await snapshot(page)),destination==='free'?[5,0,0]:destination==='auto'?[5,5,0]:[5,0,5]);
    assert.deepEqual(errors,[]);
    await context.close();
   }
   // Saving the older order automatically reallocates unpinned stock to it.
   const context=await browser.newContext({viewport:{width,height:1000},locale:'pt-BR'});
   await context.addInitScript(seed=>localStorage.setItem('kombuAdminStateV3',JSON.stringify(seed)),seed);
   const page=await context.newPage(); await page.goto(`${base}/admin`);
   await page.fill('#adminPassword','local-fixture'); await page.click('#loginForm button[type="submit"]');
   await page.waitForSelector('#adminShell:not(.is-locked)'); if (width < 760) await page.selectOption('#mobileModuleSelector','orders'); else await page.click('#adminNav [data-module="orders"]');
   await page.locator('.order-compact-card > summary').filter({hasText:'Antigo'}).click();
   await page.click('[data-action="edit-order:Antigo"]');
   await page.click('#orderForm button[type="submit"]'); await page.waitForSelector('#adminModal',{state:'hidden'});
   assert.deepEqual(qty(await snapshot(page)),[0,10,0]);
   await context.close();
  }
  console.log('Reservation workflow: free/FIFO/specific destination, reload persistence, order-save autoallocation and older order priority passed at 390/1440px.');
 } finally {await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
