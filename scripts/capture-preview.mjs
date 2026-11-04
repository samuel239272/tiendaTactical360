import { chromium } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
const browser = await chromium.launch({ channel: 'msedge', headless: true });
try {
  await mkdir('artifacts', { recursive: true });
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
    deviceScaleFactor: 1,
  });
  await page.goto('http://127.0.0.1:5173/');
  await page.locator('[data-model-status="ready"]').waitFor();
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: 'artifacts/home-desktop.png', fullPage: true });
  await page.goto('http://127.0.0.1:5173/#/producto/atlas-olive');
  await page.locator('[data-model-status="ready"]').waitFor();
  await page.screenshot({ path: 'artifacts/product-desktop.png', fullPage: true });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('http://127.0.0.1:5173/');
  await page.locator('[data-model-status="ready"]').waitFor();
  await page.screenshot({ path: 'artifacts/home-mobile.png', fullPage: true });
  console.log('Saved desktop and mobile previews in artifacts/');
} finally {
  await browser.close();
}
