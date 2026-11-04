import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
const browser = await chromium.launch({
  channel: 'msedge',
  headless: true,
  args: ['--enable-webgl', '--ignore-gpu-blocklist'],
});
try {
  const page = await browser.newPage({ viewport: { width: 900, height: 760 } });
  await page.goto('http://127.0.0.1:5173/scripts/asset-studio.html');
  await page.waitForFunction(() => typeof window.renderAsset === 'function');
  await mkdir('public/images', { recursive: true });
  for (const id of [
    'atlas-olive',
    'atlas-sand',
    'atlas-carbon',
    'rail-kit',
    'comfort-kit',
    'visor',
  ]) {
    for (const view of ['perspective', 'side', 'rear']) {
      const url = `/models/${id.startsWith('atlas') ? 'helmets' : 'accessories'}/${id}.glb`;
      const data = await page.evaluate(async ({ url, view }) => window.renderAsset(url, view), {
        url,
        view,
      });
      await writeFile(
        `public/images/${id}-${view}.webp`,
        Buffer.from(data.split(',')[1], 'base64'),
      );
    }
    console.log(`Rendered ${id}: 3 original model views`);
  }
} finally {
  await browser.close();
}
