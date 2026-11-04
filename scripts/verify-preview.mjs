import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
const browser = await chromium.launch({ channel: 'msedge', headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  for (const width of [320, 768, 1024, 1920]) {
    await page.setViewportSize({ width, height: 1000 });
    for (const route of ['/', '/#/catalogo', '/#/producto/atlas-olive']) {
      await page.goto(`http://127.0.0.1:5173${route}`);
      await page.evaluate(() => document.fonts.ready);
      assert(
        await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
        `Overflow at ${width}: ${route}`,
      );
    }
    console.log(`Responsive width ${width}px: home, catalog, detail OK`);
  }
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('http://127.0.0.1:5173/#/producto/atlas-olive');
  await page.locator('[data-model-status="ready"]').waitFor();
  await page.getByRole('button', { name: 'Posterior', exact: true }).click();
  await page.waitForFunction(
    () => Number(document.querySelector('canvas')?.dataset.cameraPosition?.split(',')[2]) < -5.3,
  );
  await page.getByRole('button', { name: 'Restablecer cámara' }).click();
  await page.waitForFunction(
    () => document.querySelector('canvas')?.dataset.cameraPosition === '3.400,1.900,4.300',
  );
  console.log('Smooth preset and reset, with standard motion: OK');
  await page.setViewportSize({ width: 390, height: 844 });
  await page.locator('.technical-toggle').click();
  assert(
    !((await page.locator('.product-technical').getAttribute('open')) !== null),
    'Technical panel should collapse',
  );
  console.log('Mobile technical panel collapses: OK');
} finally {
  await browser.close();
}
