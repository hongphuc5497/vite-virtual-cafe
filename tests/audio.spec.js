import { test, expect } from '@playwright/test';
import { MainPage } from './helpers/mainPage';
import { SELECTORS, TIMEOUTS, STORAGE_KEYS } from './constants';

const silentAudio = Buffer.from(
  'UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=',
  'base64'
);

test.describe('Audio Mixer', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/*.mp3', (route) =>
      route.fulfill({ body: silentAudio, contentType: 'audio/mpeg' })
    );
    await page.route('**/*.wav', (route) =>
      route.fulfill({ body: silentAudio, contentType: 'audio/wav' })
    );
    await page.evaluate(() => localStorage.clear());
  });

  test('tracks can be played and paused individually', async ({ page }) => {
    const main = new MainPage(page);
    await main.goto();

    // Enable sound first
    const enableBtn = page.locator('button[aria-label="Enable sound"]');
    if (await enableBtn.isVisible()) {
      await enableBtn.click();
      await page.waitForTimeout(500);
    }

    // Find a track's play button (paused state = play button visible)
    const playBtn = page.locator('[data-testid=track-play-barista]');
    await expect(playBtn).toBeVisible();
    await playBtn.click();

    // After clicking play, pause button should appear
    const pauseBtn = page.locator('[data-testid=track-pause-barista]');
    await expect(pauseBtn).toBeVisible();

    // Click pause — play button should return
    await pauseBtn.click();
    await expect(page.locator('[data-testid=track-play-barista]')).toBeVisible();
  });

  test('volume sliders adjust output', async ({ page }) => {
    const main = new MainPage(page);
    await main.goto();

    // Enable sound
    const enableBtn = page.locator('button[aria-label="Enable sound"]');
    if (await enableBtn.isVisible()) {
      await enableBtn.click();
      await page.waitForTimeout(500);
    }

    // Get a volume slider
    const volumeSlider = page.locator('[data-testid=track-volume-barista]');
    await expect(volumeSlider).toBeVisible();

    const initialValue = await volumeSlider.inputValue();

    // Change the volume
    await volumeSlider.fill('50');
    const newValue = await volumeSlider.inputValue();
    expect(newValue).not.toBe(initialValue);

    // Reload and check localStorage persistence
    await page.reload();
    await page.waitForLoadState('networkidle');

    const sessionsRaw = await page.evaluate(
      (key) => localStorage.getItem(key),
      STORAGE_KEYS.PREFS
    );
    expect(sessionsRaw).not.toBeNull();
  });

  test('playback failure shows error badge with retry', async ({ page }) => {
    // Abort a specific track's audio to simulate failure
    await page.route('**/rain.mp3', (route) => route.abort());

    const main = new MainPage(page);
    await main.goto();

    // Enable sound
    const enableBtn = page.locator('button[aria-label="Enable sound"]');
    if (await enableBtn.isVisible()) {
      await enableBtn.click();
      await page.waitForTimeout(500);
    }

    // Try to play the "Rainy Day" track
    const rainyPlayBtn = page.locator('[data-testid=track-play-rainy-day]');
    await rainyPlayBtn.click();

    // Wait for error badge
    const errorBadge = page.locator('[data-testid=track-error-rainy-day]');
    await expect(errorBadge).toBeVisible({ timeout: TIMEOUTS.AUDIO_PLAY });

    // Click retry
    const retryBtn = page.locator('[data-testid=track-retry-rainy-day]');
    await expect(retryBtn).toBeVisible();
    await retryBtn.click();
  });

  test('selecting a vibe preset changes active track set', async ({ page }) => {
    const main = new MainPage(page);
    await main.goto();

    // Click the "Lo-fi Beats" vibe
    const vibeBtn = page.locator('[data-testid=vibe-lo-fi-beats]');
    await expect(vibeBtn).toBeVisible();
    await vibeBtn.click();

    // Verify the button appears active (has the active background style)
    const style = await vibeBtn.getAttribute('style');
    expect(style).toContain('#ffdcc4');
  });
});
