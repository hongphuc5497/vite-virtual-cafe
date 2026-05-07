import { test, expect } from '@playwright/test';
import { MainPage } from './helpers/mainPage';
import { SELECTORS } from './constants';

const silentAudio = Buffer.from(
  'UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=',
  'base64'
);

test.describe('Session Completion', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/*.mp3', (route) =>
      route.fulfill({ body: silentAudio, contentType: 'audio/mpeg' })
    );
    await page.route('**/*.wav', (route) =>
      route.fulfill({ body: silentAudio, contentType: 'audio/wav' })
    );
  });

  test('celebration overlay appears and AudioContext is created on completion', async ({
    page,
  }) => {
    test.setTimeout(120000);

    // Spy on AudioContext before the page loads
    await page.addInitScript(() => {
      const OrigAudioContext =
        window.AudioContext || window.webkitAudioContext;
      window.__audioContextCreated = false;
      window.__audioContextCallCount = 0;

      // Monkey-patch AudioContext to track creation
      const PatchedContext = function () {
        window.__audioContextCreated = true;
        window.__audioContextCallCount++;
        return new OrigAudioContext();
      };
      PatchedContext.prototype = OrigAudioContext.prototype;
      window.AudioContext = PatchedContext;
    });

    const main = new MainPage(page);
    await main.goto();
    await page.evaluate(() => localStorage.clear());

    // Set a 1-minute custom duration
    const input = page.locator(
      'input[aria-label="Custom session length in minutes"]'
    );
    await input.fill('1');

    // Start the timer
    await page.click(SELECTORS.TIMER_START);

    // Wait for celebration overlay (1min timer)
    const overlay = page.locator(SELECTORS.CELEBRATION_OVERLAY);
    await overlay.waitFor({ state: 'visible', timeout: 90000 });

    // RED: Verify celebration overlay is visible
    await expect(overlay).toBeVisible();
    const heading = page.locator(SELECTORS.CELEBRATION_HEADING);
    await expect(heading).toContainText('Great work');

    // RED: Verify AudioContext was created (completion chime played)
    const audioCtxCreated = await page.evaluate(
      () => window.__audioContextCreated
    );
    expect(audioCtxCreated).toBe(true);

    const callCount = await page.evaluate(
      () => window.__audioContextCallCount
    );
    expect(callCount).toBeGreaterThanOrEqual(1);
  });

  test('celebration overlay appears even if AudioContext is unavailable', async ({
    page,
  }) => {
    test.setTimeout(120000);

    // Simulate browser without AudioContext support
    await page.addInitScript(() => {
      delete window.AudioContext;
      delete window.webkitAudioContext;
      window.__audioContextCreated = false;
    });

    const main = new MainPage(page);
    await main.goto();
    await page.evaluate(() => localStorage.clear());

    const input = page.locator(
      'input[aria-label="Custom session length in minutes"]'
    );
    await input.fill('1');

    await page.click(SELECTORS.TIMER_START);

    // Should still show celebration even if sound fails
    const overlay = page.locator(SELECTORS.CELEBRATION_OVERLAY);
    await overlay.waitFor({ state: 'visible', timeout: 90000 });
    await expect(overlay).toBeVisible();
  });
});
