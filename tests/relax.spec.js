import { test, expect } from '@playwright/test';
import { RelaxPage } from './helpers/relaxPage';
import { SELECTORS, TIMEOUTS, STORAGE_KEYS, ROUTES } from './constants';

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
    await page.evaluate(() => localStorage.clear());
  });

  test('relax page loads ambient-only mode with no timer', async ({ page }) => {
    const relax = new RelaxPage(page);
    await relax.goto();

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

    // Enable sound
    const enableBtn = page.locator('button[aria-label="Enable sound"]');
    if (await enableBtn.isVisible()) {
      await enableBtn.click();
      await page.waitForTimeout(500);
    }

    // Track play controls should exist within the ambient player
    const ambientPlayer = page.locator(SELECTORS.RELAX_AMBIENT_PLAYER);
    const playBtns = ambientPlayer.locator('[data-testid^=track-play-]');
    const count = await playBtns.count();
    expect(count).toBeGreaterThan(0);

    // Verify no timer display inside relax page
    await expect(page.locator(SELECTORS.TIMER_DISPLAY)).not.toBeVisible();
  });

  test('paused tracks state restored from localStorage on page load', async ({ page }) => {
    // Seed localStorage with paused tracks BEFORE navigating
    await page.goto(ROUTES.RELAX);
    await page.evaluate((key) => {
      const existing = JSON.parse(localStorage.getItem(key) || '{}');
      existing.pausedTracks = { Barista: true, Fireplace: true };
      localStorage.setItem(key, JSON.stringify(existing));
    }, STORAGE_KEYS.PREFS);

    // Reload to pick up the seeded state
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Enable sound
    const enableBtn = page.locator('button[aria-label="Enable sound"]');
    if (await enableBtn.isVisible()) {
      await enableBtn.click();
      await page.waitForTimeout(500);
    }

    // Tracks seeded as paused should show "play" button (not "pause")
    // because isPaused=true → shows track-play-{id}
    const playBtn = page.locator('[data-testid=track-play-barista]');
    await expect(playBtn).toBeVisible();
  });
});
