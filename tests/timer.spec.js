import { test, expect } from '@playwright/test';
import { MainPage } from './helpers/mainPage';
import { SELECTORS, TIMEOUTS, STORAGE_KEYS } from './constants';

const silentAudio = Buffer.from(
  'UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=',
  'base64'
);

test.describe('Focus Timer', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/*.mp3', (route) =>
      route.fulfill({ body: silentAudio, contentType: 'audio/mpeg' })
    );
    await page.route('**/*.wav', (route) =>
      route.fulfill({ body: silentAudio, contentType: 'audio/wav' })
    );
    await page.evaluate(() => localStorage.clear());
  });

  test('timer countdown updates in real time', async ({ page }) => {
    const main = new MainPage(page);
    await main.goto();

    // Click 25-minute preset
    await page.click(SELECTORS.TIMER_PRESET_25);

    // Start the timer
    await page.click(SELECTORS.TIMER_START);

    // Wait for the timer to tick at least once
    await page.waitForTimeout(2000);

    // Timer should show 24:5x after a couple seconds
    const timerText = await main.getTimerText();
    expect(timerText).toMatch(/24:5\d/);
  });

  test('timer reaches zero and celebration appears', async ({ page }) => {
    const main = new MainPage(page);
    await main.goto();

    // Set a 1-minute custom duration
    const input = page.locator('input[aria-label="Custom session length in minutes"]');
    await input.fill('1');

    // Start the timer
    await page.click(SELECTORS.TIMER_START);

    // Wait for celebration overlay (1min timer + buffer)
    const overlay = await main.waitForCelebration();
    await expect(overlay).toBeVisible();

    const heading = await main.getCelebrationHeading();
    expect(heading).toContain('Great work');
  });

  test('session entry written to localStorage on completion', async ({ page }) => {
    const main = new MainPage(page);
    await main.goto();

    // Set a 1-minute custom duration
    const input = page.locator('input[aria-label="Custom session length in minutes"]');
    await input.fill('1');

    // Start the timer
    await page.click(SELECTORS.TIMER_START);

    // Wait for celebration
    await main.waitForCelebration();

    // Check localStorage for session entry
    const sessionsRaw = await page.evaluate((key) => localStorage.getItem(key), STORAGE_KEYS.SESSIONS);
    expect(sessionsRaw).not.toBeNull();

    const sessions = JSON.parse(sessionsRaw);
    expect(sessions.length).toBeGreaterThanOrEqual(1);

    const lastSession = sessions[sessions.length - 1];
    expect(lastSession).toHaveProperty('date');
    expect(lastSession).toHaveProperty('durationMinutes');
    expect(lastSession).toHaveProperty('vibe');
    expect(lastSession).toHaveProperty('mood');
    expect(lastSession).toHaveProperty('tracksSnapshot');
  });
});
