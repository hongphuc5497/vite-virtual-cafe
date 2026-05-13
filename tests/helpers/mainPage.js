import { SELECTORS, TIMEOUTS, ROUTES } from '../constants';

export class MainPage {
  constructor(page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto(ROUTES.HOME, { timeout: 60000 });
    await this.page.locator(SELECTORS.TIMER_DISPLAY).waitFor();
  }

  async startTimer(preset = 25) {
    const selector = SELECTORS[`TIMER_PRESET_${preset}`];
    await this.page.click(selector);
    await this.page.click(SELECTORS.TIMER_START);
  }

  async getTimerText() {
    const el = this.page.locator(SELECTORS.TIMER_DISPLAY);
    return el.textContent();
  }

  async waitForCelebration() {
    const overlay = this.page.locator(SELECTORS.CELEBRATION_OVERLAY);
    await overlay.waitFor({ state: 'visible', timeout: TIMEOUTS.CELEBRATION });
    return overlay;
  }

  async getCelebrationHeading() {
    const el = this.page.locator(SELECTORS.CELEBRATION_HEADING);
    return el.textContent();
  }

  async selectVibe(vibe) {
    await this.page.click(SELECTORS.VIBE_OPTION(vibe));
  }

  async isMixerVisible() {
    return this.page.locator(SELECTORS.MIXER_PANEL).isVisible();
  }

  async getLocalStorage(key) {
    return this.page.evaluate((k) => localStorage.getItem(k), key);
  }

  async clearLocalStorage() {
    await this.page.evaluate(() => localStorage.clear());
  }
}
