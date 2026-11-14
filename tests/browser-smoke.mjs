import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
const server = spawn(process.execPath, ['node_modules/vite/bin/vite.js', ...(process.argv.includes('--dev') ? [] : ['preview']), '--host', '127.0.0.1', '--port', '4173', '--strictPort'], { stdio: 'pipe' });
const base = 'http://127.0.0.1:4173/ASCean/';
let browser;
try {
  for (let i = 0; i < 100; i++) {
    try { if ((await fetch(base)).ok) break; } catch {}
    if (i === 99) throw Error('Preview did not start');
    await new Promise(r => setTimeout(r, 100));
  }
  browser = await chromium.launch({ headless: true });
  console.log('Browser:', browser.version(), 'OS:', process.platform, 'emulated viewports, no physical phone');
  for (const width of [1280, 390]) {
    const page = await browser.newPage({ viewport: { width, height: 820 } });
    const errors = []; page.on('pageerror', e => errors.push(e.message));
    page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
    for (const route of ['', 'ocean/', 'lab/', 'ocean/foundation/', 'lab/foundation/']) {
      const response = await page.goto(base + route); assert.equal(response.status(), 200);
      if (route.includes('foundation')) {
        await page.locator('#select').click();
        const initial = await page.locator('#inspection').innerText();
        await page.locator('#save').click();
        await page.locator('#step').click();
        assert.match(await page.locator('#clock').innerText(), /Tick 1 /);
        assert.notEqual(await page.locator('#inspection').innerText(), initial);
        await page.locator('#restore').click();
        assert.equal(await page.locator('#inspection').innerText(), initial);
        await page.locator('#compare').click();
        assert.match(await page.locator('#message').innerText(), /PASS/);
        await page.locator('#play').click(); await page.waitForTimeout(250);
        await page.locator('#play').click();
        const paused = await page.locator('#clock').innerText();
        await page.waitForTimeout(100); assert.equal(await page.locator('#clock').innerText(), paused);
        await page.locator('#reset').click(); assert.match(await page.locator('#clock').innerText(), /Tick 0 /);
        await page.locator('#snapshot').fill('{"schema":99}'); await page.locator('#restore').click();
        assert.match(await page.locator('#message').innerText(), /Rejected/);
        await page.waitForTimeout(1100);
        console.log(route, width, await page.locator('#telemetry').innerText());
        await page.screenshot({ path: `test-results/${route.split('/')[0]}-${width}.png`, fullPage: true });
      }
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 3), `Overflow ${route} ${width}`);
    }
    assert.deepEqual(errors, []); await page.close();
    console.log(`PASS five routes and foundation controls at ${width}px`);
  }
} finally { await browser?.close(); server.kill(); }
