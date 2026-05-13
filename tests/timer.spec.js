import { test, expect } from '@playwright/test';
import { MainPage } from './helpers/mainPage';
import { SELECTORS, STORAGE_KEYS } from './constants';

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
    await page.addInitScript(() => localStorage.clear());
  });

  test('timer countdown updates in real time', async ({ page }) => {
    test.setTimeout(60000);

    const main = new MainPage(page);
    await main.goto();

    // Click 25-minute preset
    await page.click(SELECTORS.TIMER_PRESET_25);

    // Get initial timer text
    const initialText = await main.getTimerText();
    expect(initialText).toBe('25:00');

    // Start the timer
    await page.click(SELECTORS.TIMER_START);

    // Wait for the timer to tick — poll until the text changes from initial
    await expect(async () => {
      const text = await main.getTimerText();
      expect(text).not.toBe('25:00');
    }).toPass({ timeout: 10000 });
  });

  test('timer reaches zero and celebration appears', async ({ page }) => {
    test.setTimeout(120000);
    const main = new MainPage(page);
    await main.goto();

    // Set a 1-minute custom duration
    const input = page.locator('input[aria-label="Custom session length in minutes"]');
    await input.fill('1');

    // Start the timer
    await page.click(SELECTORS.TIMER_START);

    // Wait for celebration overlay (1min timer + animation buffer)
    const overlay = page.locator(SELECTORS.CELEBRATION_OVERLAY);
    await overlay.waitFor({ state: 'visible', timeout: 90000 });
    await expect(overlay).toBeVisible();

    const heading = await main.getCelebrationHeading();
    expect(heading).toContain('Great work');
  });

  test('session entry written to localStorage on completion', async ({ page }) => {
    test.setTimeout(120000);
    const main = new MainPage(page);
    await main.goto();

    // Set a 1-minute custom duration
    const input = page.locator('input[aria-label="Custom session length in minutes"]');
    await input.fill('1');

    // Start the timer
    await page.click(SELECTORS.TIMER_START);

    // Wait for celebration (1min timer + buffer)
    await page.locator(SELECTORS.CELEBRATION_OVERLAY).waitFor({ state: 'visible', timeout: 90000 });

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
