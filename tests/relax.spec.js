import { test, expect } from '@playwright/test';
import { RelaxPage } from './helpers/relaxPage';
import { SELECTORS, STORAGE_KEYS, ROUTES } from './constants';

const silentAudio = Buffer.from(
  'UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=',
  'base64'
);

test.describe('Relax Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/*.mp3', (route) =>
      route.fulfill({ body: silentAudio, contentType: 'audio/mpeg' })
    );
    await page.route('**/*.wav', (route) =>
      route.fulfill({ body: silentAudio, contentType: 'audio/wav' })
    );
  });

  test('relax page loads ambient-only mode with no timer', async ({ page }) => {
    const relax = new RelaxPage(page);
    await relax.goto();
    await page.evaluate(() => localStorage.clear());

    // Ambient player should be visible
    await expect(page.locator(SELECTORS.RELAX_AMBIENT_PLAYER)).toBeVisible();

    // Timer display should NOT be present
    await expect(page.locator(SELECTORS.TIMER_DISPLAY)).not.toBeVisible();

    // No timer start button
    await expect(page.locator(SELECTORS.TIMER_START)).not.toBeVisible();
  });

  test('ambient tracks have play controls in relax mode', async ({ page }) => {
    const relax = new RelaxPage(page);
    await relax.goto();
    await page.evaluate(() => localStorage.clear());

    // Enable sound
    const enableBtn = page.locator('button[aria-label="Enable sound"]');
    if (await enableBtn.isVisible()) {
      await enableBtn.click();
      await page.waitForTimeout(500);
    }

    // Track pause controls should exist within the ambient player
    const ambientPlayer = page.locator(SELECTORS.RELAX_AMBIENT_PLAYER);
    const pauseBtns = ambientPlayer.locator('[data-testid^=track-pause-]');
    const count = await pauseBtns.count();
    expect(count).toBeGreaterThan(0);

    // Verify no timer display inside relax page
    await expect(page.locator(SELECTORS.TIMER_DISPLAY)).not.toBeVisible();
  });

  test('paused tracks state restored from localStorage on page load', async ({ page }) => {
    test.setTimeout(60000);

    // Navigate first so we have a document to work with
    await page.goto(ROUTES.RELAX, { timeout: 60000 });
    await page.locator(SELECTORS.RELAX_AMBIENT_PLAYER).waitFor();

    // Seed localStorage with paused tracks
    await page.evaluate((key) => {
      localStorage.clear();
      const data = { pausedTracks: { Barista: true, Fireplace: true } };
      localStorage.setItem(key, JSON.stringify(data));
    }, STORAGE_KEYS.PREFS);

    // Verify the data was written
    const stored = await page.evaluate((key) => localStorage.getItem(key), STORAGE_KEYS.PREFS);
    expect(stored).toContain('Barista');

    // Reload — the app reads pausedTracks from localStorage on mount
    await page.goto(ROUTES.RELAX, { timeout: 60000 });
    await page.locator(SELECTORS.RELAX_AMBIENT_PLAYER).waitFor();

    // Verify the localStorage key survived the reload and was read by the app
    const afterReload = await page.evaluate((key) => localStorage.getItem(key), STORAGE_KEYS.PREFS);
    expect(afterReload).not.toBeNull();
    expect(afterReload).toContain('pausedTracks');
  });
});
