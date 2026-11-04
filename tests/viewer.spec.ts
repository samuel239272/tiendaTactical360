import { test, expect } from '@playwright/test';

test('GLB, giro real, zoom, vistas, enfoque, reset y hotspots', async ({ page }, testInfo) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/#/producto/atlas-olive');
  const viewer = page.getByTestId('product-viewer');
  await expect(viewer).toHaveAttribute('data-model-status', 'ready');
  const canvas = viewer.locator('canvas');
  await expect(canvas).toHaveAttribute('data-camera-position', /.+/);
  const initial = await canvas.getAttribute('data-camera-position');
  const distance = Number(await canvas.getAttribute('data-camera-distance'));
  await page.getByRole('button', { name: 'Acercar', exact: true }).click();
  await expect
    .poll(async () => Number(await canvas.getAttribute('data-camera-distance')))
    .toBeLessThan(distance - 0.2);
  await page.getByRole('button', { name: 'Alejar', exact: true }).click();
  await expect
    .poll(async () => Number(await canvas.getAttribute('data-camera-distance')))
    .toBeGreaterThan(distance - 0.1);
  await page.getByRole('button', { name: 'Frontal', exact: true }).click();
  await expect(canvas).not.toHaveAttribute('data-camera-position', initial!);
  await expect
    .poll(async () => Number((await canvas.getAttribute('data-camera-position'))?.split(',')[0]))
    .toBeCloseTo(0, 1);
  await page.getByRole('button', { name: 'Interior', exact: true }).click();
  await expect
    .poll(async () => Number((await canvas.getAttribute('data-camera-position'))?.split(',')[1]))
    .toBeLessThan(-3);
  await page.getByRole('button', { name: 'Restablecer cámara' }).click();
  await expect(canvas).toHaveAttribute('data-camera-position', initial!);
  const region = page.getByRole('region', { name: /Visor interactivo/ });
  await region.focus();
  await page.keyboard.press('ArrowLeft');
  await expect
    .poll(async () => Number((await canvas.getAttribute('data-camera-position'))?.split(',')[0]))
    .toBeLessThan(-4);
  await page.keyboard.press('0');
  await expect(canvas).toHaveAttribute('data-camera-position', initial!);
  const box = await canvas.boundingBox();
  expect(box).not.toBeNull();
  if (!box) return;
  const center = { x: box.x + box.width * 0.55, y: box.y + box.height * 0.45 };
  if (testInfo.project.name === 'desktop') {
    await page.mouse.move(center.x, center.y);
    await page.mouse.down();
    await page.mouse.move(center.x + 90, center.y + 20, { steps: 10 });
    await page.mouse.up();
  } else {
    const session = await page.context().newCDPSession(page);
    await session.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [center] });
    await session.send('Input.dispatchTouchEvent', {
      type: 'touchMove',
      touchPoints: [{ x: center.x + 70, y: center.y + 10 }],
    });
    await session.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  }
  await expect(canvas).not.toHaveAttribute('data-camera-position', initial!);
  await page.getByRole('button', { name: 'Restablecer cámara' }).click();
  await expect(canvas).toHaveAttribute('data-camera-position', initial!);
  await canvas.dblclick({ position: { x: box.width * 0.5, y: box.height * 0.43 } });
  await expect(canvas).not.toHaveAttribute('data-camera-target', '0.000,0.120,0.000');
  await page.getByRole('button', { name: 'Restablecer cámara' }).click();
  await viewer.getByRole('button', { name: 'Componentes', exact: true }).click();
  await page.getByRole('combobox', { name: 'Inspeccionar', exact: true }).selectOption('rail');
  await expect(viewer.locator('.hotspot-panel h3')).toHaveText('Riel lateral');
  await expect(viewer.getByRole('button', { name: 'Inspeccionar Riel lateral' })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  await viewer.getByRole('button', { name: 'Cerrar componente' }).click();
  await expect(viewer.locator('.hotspot-panel')).toHaveCount(0);
  await viewer.getByRole('button', { name: 'Inspeccionar Carcasa exterior' }).click();
  await expect(viewer.locator('.hotspot-panel h3')).toHaveText('Carcasa exterior');
  await viewer.getByRole('button', { name: 'Pantalla completa', exact: true }).click();
  await expect(viewer).toHaveClass(/is-fullscreen/);
  await viewer.getByRole('button', { name: 'Salir de pantalla completa' }).click();
  await expect(viewer).not.toHaveClass(/is-fullscreen/);
});

test('todos los modelos de producto cargan sin errores de ejecución', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  for (const id of ['atlas-sand', 'atlas-carbon', 'rail-kit', 'comfort-kit', 'visor']) {
    await page.goto(`/#/producto/${id}`);
    await expect(page.getByTestId('product-viewer')).toHaveAttribute('data-model-status', 'ready');
    if (!id.startsWith('atlas'))
      await expect(page.getByRole('button', { name: 'Interior', exact: true })).toHaveCount(0);
  }
  expect(errors).toEqual([]);
});

test('modelo ausente: galería de respaldo y reintento recuperable', async ({ page }) => {
  await page.route('**/models/helmets/atlas-olive.glb', (route) => route.abort());
  await page.goto('/#/producto/atlas-olive');
  await expect(page.getByTestId('product-viewer')).toHaveAttribute('data-model-status', 'fallback');
  await expect(page.getByText('No se pudo cargar el modelo 3D.')).toBeVisible();
  await page.getByRole('button', { name: 'Abrir galería' }).click();
  await expect(page.locator('.gallery-content')).toBeVisible();
  await page.getByRole('button', { name: 'Exploración 3D' }).click();
  await page.unroute('**/models/helmets/atlas-olive.glb');
  await page.getByRole('button', { name: 'Reintentar carga' }).click();
  await expect(page.getByTestId('product-viewer')).toHaveAttribute('data-model-status', 'ready');
});

test('sin WebGL: imágenes disponibles y catálogo funcional', async ({ page }) => {
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (
      this: HTMLCanvasElement,
      contextId: string,
      ...args: unknown[]
    ) {
      if (contextId.includes('webgl')) return null;
      return Reflect.apply(original, this, [contextId, ...args]);
    } as typeof original;
  });
  await page.goto('/#/producto/atlas-olive');
  await expect(page.getByText('Tu dispositivo no dispone de WebGL.')).toBeVisible();
  await expect(page.locator('.viewer-fallback img')).toBeVisible();
  await page.getByRole('button', { name: 'Abrir galería' }).click();
  await expect(page.locator('.gallery-content')).toBeVisible();
});
