import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const routes = [
  ['home', '/', 'A familiar place.'],
  ['portfolio', '/portfolio', 'Every space has'],
  ['process', '/process', 'Good spaces begin'],
  ['about', '/about', 'Less noise.'],
  ['contact', '/contact', 'A little room'],
  ['project', '/portfolio/the-courtyard', 'The Courtyard'],
  ['story', '/stories/after-the-light', 'When the day'],
  ['colophon', '/colophon', 'About this concept.'],
] as const;

for (const width of [320, 768, 1024, 1440]) {
  for (const [name, route, heading] of routes) {
    test(`${name} at ${width}px: visual, layout, and design rules`, async ({ page }, testInfo) => {
      await page.setViewportSize({ width, height: 900 });
      await page.emulateMedia({ reducedMotion: 'reduce' });
      const errors: string[] = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.goto(route);
      await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
      await expect(page.getByRole('heading', { level: 1 })).toContainText(heading);
      await expect(page).toHaveTitle(/.+ — STILL$/);
      await expect(page.locator('meta[name="description"]')).toHaveCount(1);
      await page.evaluate(async () => {
        document.querySelectorAll('img').forEach(image => { image.loading = 'eager'; });
        await Promise.all(Array.from(document.images).map(image => image.decode()));
        await document.fonts.ready;
      });
      const rules = await page.evaluate(() => {
        const elements = Array.from(document.querySelectorAll<HTMLElement>('body *')).filter(element => element.getBoundingClientRect().width > 0);
        return {
          overflow: document.documentElement.scrollWidth > innerWidth,
          tooLarge: elements.filter(element => parseFloat(getComputedStyle(element).fontSize) > 40).map(element => element.tagName),
          tooBold: elements.filter(element => parseInt(getComputedStyle(element).fontWeight) > 500).map(element => element.tagName),
          shadows: elements.filter(element => getComputedStyle(element).boxShadow !== 'none').map(element => element.tagName),
          gradients: elements.filter(element => getComputedStyle(element).backgroundImage.includes('gradient')).map(element => element.tagName),
          brokenImages: Array.from(document.images).filter(image => !image.complete || image.naturalWidth === 0).map(image => image.src),
          roundedImages: Array.from(document.images).filter(image => getComputedStyle(image).borderRadius !== '0px').map(image => image.src),
        };
      });
      expect(rules).toEqual({ overflow: false, tooLarge: [], tooBold: [], shadows: [], gradients: [], brokenImages: [], roundedImages: [] });
      expect(errors).toEqual([]);
      if (width === 1440) {
        const audit = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
        expect(audit.violations.map(item => ({ id: item.id, nodes: item.nodes.map(node => node.target) }))).toEqual([]);
      }
      await page.screenshot({ path: testInfo.outputPath(`${name}-${width}.png`), fullPage: true, animations: 'disabled' });
    });
  }
}

test('menu supports keyboard, focus containment, Escape, and navigation', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Meny' }).click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await page.keyboard.press('Shift+Tab');
  expect(await page.evaluate(() => document.activeElement?.closest('dialog') !== null)).toBe(true);
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
  await expect(page.getByRole('button', { name: 'Meny' })).toBeFocused();
  await page.getByRole('button', { name: 'Meny' }).click();
  await dialog.getByRole('link', { name: 'Kontakt Start a conversation' }).click();
  await expect(page).toHaveURL('/contact');
  await expect(dialog).not.toBeVisible();
  expect(await page.evaluate(() => document.body.classList.contains('menu-open'))).toBe(false);
});

test('portfolio filters, project details, and next project work', async ({ page }) => {
  await page.goto('/portfolio');
  await page.getByRole('button', { name: 'Retreats' }).click();
  await expect(page.locator('article')).toHaveCount(1);
  await page.getByRole('link', { name: 'Explore The Long Weekend' }).click();
  await expect(page).toHaveURL('/portfolio/the-long-weekend');
  await page.getByRole('link', { name: 'Next space — After the Light' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('After the Light');
  await page.reload();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('After the Light');
});

test('service links open the matching process detail', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Explore surfaces & tile' }).click();
  await expect(page).toHaveURL('/process#surfaces');
  await expect(page.locator('#surfaces')).toHaveAttribute('open', '');
  await page.locator('#surfaces summary').click();
  await expect(page.locator('#surfaces')).not.toHaveAttribute('open');
});

test('inquiry validates, saves, downloads, and removes a local draft', async ({ page }) => {
  await page.goto('/contact');
  await page.getByRole('button', { name: 'Save inquiry' }).click();
  await expect(page.getByRole('alert')).toBeVisible();
  await page.getByLabel('Your name').fill('Alex Morgan');
  await page.getByLabel('Email address').fill('alex@example.com');
  await page.getByLabel('Your pool', { exact: true }).selectOption('Residential pool');
  await page.getByLabel('Tell us about your space').fill('We would like to renew the stone terrace and resurface our garden pool.');
  await page.getByRole('button', { name: 'Save inquiry' }).click();
  await expect(page.getByRole('status')).toContainText('No email has been sent');
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download inquiry' }).click();
  expect((await downloadPromise).suggestedFilename()).toBe('still-pool-inquiry.txt');
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('still-inquiry-draft') ?? '{}').name)).toBe('Alex Morgan');
  await page.getByRole('button', { name: 'Remove draft from this device' }).click();
  expect(await page.evaluate(() => localStorage.getItem('still-inquiry-draft'))).toBeNull();
  await page.getByRole('button', { name: 'Write another note' }).click();
  await expect(page.getByLabel('Your name')).toHaveValue('');
});

test('reduced motion and missing routes have useful behavior', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/missing-page');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('This space isn’t here.');
  expect(await page.locator('html').evaluate(element => getComputedStyle(element).scrollBehavior)).toBe('auto');
  await page.getByRole('link', { name: 'Back to the beginning' }).click();
  await expect(page).toHaveURL('/');
});
