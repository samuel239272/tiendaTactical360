import { test, expect } from '@playwright/test';

test('inicio, catálogo, búsqueda por nombre/referencia, filtros y orden', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /Una nueva/ })).toBeVisible();
  await expect(page.getByTestId('product-viewer')).toHaveAttribute('data-model-status', 'ready');
  await page.locator('.hero-copy').getByRole('link', { name: 'Explorar catálogo' }).click();
  await expect(page.locator('.product-card')).toHaveCount(6);
  const search = page.getByRole('textbox', { name: 'Buscar por nombre o referencia' });
  await search.fill('sand');
  await expect(page.locator('.product-card')).toHaveCount(1);
  await expect(page.locator('.product-card h3')).toHaveText('ATLAS / Sand');
  await search.fill('T360-I03');
  await expect(page.locator('.product-card h3')).toHaveText('CORE / Comfort kit');
  await search.fill('no existe');
  await expect(page.getByRole('heading', { name: 'No encontramos ese producto.' })).toBeVisible();
  await page.getByRole('button', { name: 'Limpiar filtros' }).click();
  await page.getByRole('button', { name: 'Accesorios 2', exact: true }).click();
  await expect(page.locator('.product-card')).toHaveCount(2);
  await page.getByRole('button', { name: 'Todos 6', exact: true }).click();
  await expect(page.locator('.product-card')).toHaveCount(6);
  await page.getByRole('combobox', { name: 'Ordenar productos' }).selectOption('name-desc');
  await expect(page.locator('.product-card h3').first()).toHaveText('SPECTRA / Visor');
  await page.getByRole('combobox', { name: 'Ordenar productos' }).selectOption('manufacturer');
  await expect(page.locator('.product-card h3').first()).toHaveText('ARC / Rail kit');
  await page.getByRole('link', { name: 'Explorar ATLAS / Olive', exact: true }).click();
  await expect(page.locator('.product-info h1')).toContainText('ATLAS');
  await expect(page.getByTestId('product-viewer')).toHaveAttribute('data-model-status', 'ready');
  await page.getByRole('link', { name: 'Ver acabado Desert sand' }).click();
  await expect(page.locator('.product-info h1')).toContainText('Sand');
  await page
    .locator('.product-pagination')
    .getByRole('link', { name: /SIGUIENTE PRODUCTO/ })
    .click();
  await expect(page.locator('.product-info h1')).toContainText('Carbon');
  expect(errors).toEqual([]);
});

test('galería, miniaturas, diálogo accesible y documentación', async ({ page }) => {
  await page.goto('/#/producto/atlas-olive');
  await page.getByRole('button', { name: 'Galería 3' }).click();
  const gallery = page.locator('.gallery-content:visible');
  await expect(gallery.locator('.gallery-main>img')).toHaveAttribute('src', /perspective/);
  await gallery.getByRole('button', { name: 'Imagen siguiente' }).click();
  await expect(gallery.locator('.gallery-main>img')).toHaveAttribute('src', /side/);
  await expect(gallery.getByRole('button', { name: 'Ver imagen 2' })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  await gallery.getByRole('button', { name: 'Imagen anterior' }).click();
  await gallery.getByRole('button', { name: 'Ver imagen 3' }).click();
  await expect(gallery.locator('.gallery-main>img')).toHaveAttribute('src', /rear/);
  await gallery.getByRole('button', { name: 'Ampliar imagen' }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await page.getByRole('button', { name: 'Exploración 3D' }).click();
  await expect(page.getByTestId('product-viewer')).toBeVisible();
  await page
    .locator('.info-tabs')
    .getByRole('button', { name: 'Componentes', exact: true })
    .click();
  await page.locator('.component-list summary').filter({ hasText: 'Carcasa exterior' }).click();
  await expect(page.locator('.component-list details').first()).toHaveAttribute('open', '');
  await page.getByRole('button', { name: 'Documentos', exact: true }).click();
  const documentLink = page.locator('.documentation-list a');
  await expect(documentLink).toHaveAttribute('href', '/documents/catalogo-demo.html');
  const response = await page.request.get('/documents/catalogo-demo.html');
  expect(response.ok()).toBeTruthy();
});

test('layouts sin desbordamiento, imágenes locales y navegación accesible', async ({
  page,
}, testInfo) => {
  for (const url of ['/', '/#/catalogo', '/#/producto/atlas-olive', '/#/experiencia']) {
    await page.goto(url);
    await page.evaluate(() => document.fonts.ready);
    await expect
      .poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth))
      .toBe(true);
    await page.locator('img').evaluateAll((images) =>
      images.forEach((image) => {
        (image as HTMLImageElement).loading = 'eager';
      }),
    );
    await expect
      .poll(() =>
        page
          .locator('img')
          .evaluateAll((images) =>
            images.every(
              (image) =>
                (image as HTMLImageElement).complete &&
                (image as HTMLImageElement).naturalWidth > 0,
            ),
          ),
      )
      .toBe(true);
  }
  if (testInfo.project.name === 'mobile') {
    await page.getByRole('button', { name: 'Abrir menú' }).click();
    await page
      .getByRole('navigation', { name: 'Navegación principal' })
      .getByRole('link', { name: 'Catálogo', exact: true })
      .click();
    await expect(page.getByRole('heading', { name: 'Diseño. Desde cada ángulo.' })).toBeVisible();
  }
  await page.goto('/#/producto/desconocido');
  await expect(page.getByRole('heading', { name: 'Esta perspectiva no existe.' })).toBeVisible();
});
