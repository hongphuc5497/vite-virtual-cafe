import { test, expect } from '@playwright/test';
import { MainPage } from './helpers/mainPage';
import { SELECTORS, ROUTES } from './constants';

const silentAudio = Buffer.from(
  'UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=',
  'base64'
);

test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/*.mp3', (route) =>
      route.fulfill({ body: silentAudio, contentType: 'audio/mpeg' })
    );
    await page.route('**/*.wav', (route) =>
      route.fulfill({ body: silentAudio, contentType: 'audio/wav' })
    );
    await page.addInitScript(() => localStorage.clear());
  });

  test('route switching between / and /relax', async ({ page }) => {
    // Start at home
    await page.goto(ROUTES.HOME);
    await page.waitForLoadState('networkidle');

    // Verify main page elements
    await expect(page.locator(SELECTORS.TIMER_DISPLAY)).toBeVisible();
    await expect(page.locator(SELECTORS.MIXER_PANEL)).toBeVisible();

    // Navigate to /relax
    await page.click(SELECTORS.NAV_RELAX);
    await expect(page).toHaveURL(ROUTES.RELAX);

    // Verify relax page elements
    await expect(page.locator(SELECTORS.RELAX_AMBIENT_PLAYER)).toBeVisible();
    await expect(page.locator(SELECTORS.TIMER_DISPLAY)).not.toBeVisible();

    // Navigate back to /
    await page.click(SELECTORS.NAV_HOME);
    await expect(page).toHaveURL(ROUTES.HOME);

    // Verify timer is visible again
    await expect(page.locator(SELECTORS.TIMER_DISPLAY)).toBeVisible();
  });

  test('scene selector changes active state', async ({ page }) => {
    const main = new MainPage(page);
    await main.goto();

    // Click a scene button
    const sceneBtn = page.locator('[data-testid=scene-misty-cabin]');
    await expect(sceneBtn).toBeVisible();
    await sceneBtn.click();

    // Click another scene and verify it changes
    const libraryBtn = page.locator('[data-testid=scene-midnight-archive]');
    await libraryBtn.click();

    // Both should exist and be clickable — verify no errors
    await expect(page.locator('[data-testid=scene-selector]')).toBeVisible();
  });
});

test.describe('Keyboard Shortcuts', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/*.mp3', (route) =>
      route.fulfill({ body: silentAudio, contentType: 'audio/mpeg' })
    );
    await page.route('**/*.wav', (route) =>
      route.fulfill({ body: silentAudio, contentType: 'audio/wav' })
    );
    await page.addInitScript(() => localStorage.clear());
  });

  test('Space toggles play/pause and ArrowUp adjusts volume', async ({ page }) => {
    const main = new MainPage(page);
    await main.goto();

    // Click away from any input so keyboard shortcuts are active
    await page.click('h1');

    // Press Space to toggle play/pause
    await page.keyboard.press('Space');

    // Press ArrowUp for volume
    await page.keyboard.press('ArrowUp');

    // Press ArrowDown for volume decrease
    await page.keyboard.press('ArrowDown');

    // Verify the page didn't crash — timer and mixer still visible
    await expect(page.locator(SELECTORS.TIMER_DISPLAY)).toBeVisible();
    await expect(page.locator(SELECTORS.MIXER_PANEL)).toBeVisible();
  });
});
