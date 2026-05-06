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
    await page.addInitScript(() => localStorage.clear());
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

    // Tracks start unpaused (isPaused=false), so button shows "pause" state
    const pauseBtn = page.locator('[data-testid=track-pause-barista]');
    await expect(pauseBtn).toBeVisible();

    // Click to pause the track
    await pauseBtn.click();

    // After pausing, button should show "play" state
    const playBtn = page.locator('[data-testid=track-play-barista]');
    await expect(playBtn).toBeVisible();

    // Click play to unpause
    await playBtn.click();

    // Button returns to pause state
    await expect(page.locator('[data-testid=track-pause-barista]')).toBeVisible();
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

    const prefsRaw = await page.evaluate(
      (key) => localStorage.getItem(key),
      STORAGE_KEYS.PREFS
    );
    expect(prefsRaw).not.toBeNull();
  });

  test('playback failure shows error badge with retry', async ({ page }) => {
    // Abort a specific track's audio to simulate failure
    // This overrides the general MP3 stub registered in beforeEach
    await page.route('**/rain.mp3', (route) => route.abort());

    const main = new MainPage(page);
    await main.goto();

    // Enable sound — Rainy Day track will try to play and fail
    const enableBtn = page.locator('button[aria-label="Enable sound"]');
    await expect(enableBtn).toBeVisible({ timeout: TIMEOUTS.PAGE_LOAD });
    await enableBtn.click();

    // Wait for error badge to appear (play() fails on aborted route)
    const errorBadge = page.locator('[data-testid=track-error-rainy-day]');
    await expect(errorBadge).toBeVisible({ timeout: TIMEOUTS.AUDIO_PLAY });

    // Retry button should be visible alongside error
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

    // Verify the button appears active — browser converts hex #ffdcc4 to rgb()
    const style = await vibeBtn.getAttribute('style');
    expect(style).toContain('rgb(255, 220, 196)');
  });
});
