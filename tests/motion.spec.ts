import { expect, test } from '@playwright/test';

test.use({ viewport: { width: 1280, height: 800 } });

test('water motion changes the picture, pauses, and remembers the visitor preference', async ({ page }) => {
  await page.goto('/');
  const hero = page.locator('.hero-image');
  await expect(hero).toHaveAttribute('data-renderer', 'water');
  await expect(hero).toHaveAttribute('data-motion', 'playing');
  const first = await hero.screenshot();
  await page.waitForTimeout(1100);
  const second = await hero.screenshot();
  expect(first.equals(second)).toBe(false);
  await page.getByRole('button', { name: 'Pause motion' }).click();
  await expect(hero).toHaveAttribute('data-motion', 'paused');
  const paused = await hero.screenshot();
  await page.waitForTimeout(600);
  expect(paused.equals(await hero.screenshot())).toBe(true);
  await page.reload();
  await expect(page.getByRole('button', { name: 'Play motion' })).toBeVisible();
  await expect(hero).toHaveAttribute('data-motion', 'paused');
  await page.getByRole('button', { name: 'Play motion' }).click();
  await expect(hero).toHaveAttribute('data-motion', 'playing');
});

test('off-screen motion pauses and reduced motion uses still images', async ({ page }) => {
  await page.goto('/');
  const hero = page.locator('.hero-image');
  await expect(hero).toHaveAttribute('data-motion', 'playing');
  await page.locator('footer').scrollIntoViewIfNeeded();
  await expect(hero).toHaveAttribute('data-motion', 'paused');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/portfolio');
  await expect(page.getByRole('button', { name: 'Motion off' })).toBeDisabled();
  expect(await page.locator('.motion-image').evaluateAll(elements => elements.every(element => element.getAttribute('data-motion') === 'paused'))).toBe(true);
  expect(await page.locator('.motion-poster').first().evaluate(element => getComputedStyle(element).animationName)).toBe('none');
});

test('WebGL failure keeps the original image and a working pause control', async ({ page }) => {
  await page.addInitScript(() => { HTMLCanvasElement.prototype.getContext = () => null; });
  await page.goto('/');
  const hero = page.locator('.hero-image');
  await expect(hero).toHaveAttribute('data-renderer', 'photo');
  await expect(hero).toHaveAttribute('data-motion', 'playing');
  await expect(hero.getByRole('img')).toBeVisible();
  await page.getByRole('button', { name: 'Pause motion' }).click();
  await expect(hero).toHaveAttribute('data-motion', 'paused');
});

test('public pages send crawler restrictions and browser resource protections', async ({ page, request }) => {
  const response = await page.goto('/');
  expect(response?.headers()['x-robots-tag']).toContain('noindex');
  expect(response?.headers()['cross-origin-resource-policy']).toBe('same-origin');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
  expect(await (await request.get('/robots.txt')).text()).toContain('Disallow: /');
});
