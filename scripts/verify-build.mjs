import { chromium } from '@playwright/test';
import { spawn } from 'node:child_process';
import { setTimeout as delay } from 'node:timers/promises';
import assert from 'node:assert/strict';

const server = spawn(
  process.execPath,
  [
    'node_modules/vite/bin/vite.js',
    'preview',
    '--host',
    '127.0.0.1',
    '--port',
    '4173',
    '--strictPort',
  ],
  { windowsHide: true, stdio: 'pipe' },
);
let browser;
try {
  let ready = false;
  for (let attempt = 0; attempt < 40; attempt++) {
    try {
      ready = (await fetch('http://127.0.0.1:4173/')).ok;
    } catch {
      /* Wait for owned server. */
    }
    if (ready) break;
    await delay(250);
  }
  assert(ready, 'Production preview server did not start');
  browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const requests = [];
  const errors = [];
  page.on('request', (request) => requests.push(request.url()));
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('http://127.0.0.1:4173/#/catalogo');
  await page.locator('.product-card').first().waitFor();
  assert.equal(await page.locator('.product-card').count(), 6);
  assert(!requests.some((url) => /assets\/three[-.]/.test(url)), 'Catalog eagerly loaded Three.js');
  console.log('Production catalog: 6 products; Three.js is not loaded until a viewer opens');
  await page.getByRole('link', { name: 'Explorar ATLAS / Olive', exact: true }).click();
  await page.locator('[data-model-status="ready"]').waitFor();
  assert(
    requests.some((url) => /assets\/three-/.test(url)),
    'Scene engine was not requested',
  );
  await page.screenshot({ path: 'artifacts/product-desktop.png', fullPage: true });
  await page.goto('http://127.0.0.1:4173/');
  await page.locator('[data-model-status="ready"]').waitFor();
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: 'artifacts/home-desktop.png', fullPage: true });
  await page.screenshot({ path: 'artifacts/preview.png' });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({ path: 'artifacts/home-mobile.png', fullPage: true });
  assert.deepEqual(errors, []);
  console.log(
    'Production GLB and page navigation: OK. No runtime errors. Final screenshots saved.',
  );
} finally {
  await browser?.close();
  server.kill();
}
