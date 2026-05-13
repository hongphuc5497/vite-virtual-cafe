import { SELECTORS, ROUTES } from '../constants';

export class RelaxPage {
  constructor(page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto(ROUTES.RELAX, { timeout: 60000 });
    await this.page.locator(SELECTORS.RELAX_AMBIENT_PLAYER).waitFor();
  }

  async getAmbientPlayer() {
    return this.page.locator(SELECTORS.RELAX_AMBIENT_PLAYER);
  }

  async isAmbientPlayerVisible() {
    return this.page.locator(SELECTORS.RELAX_AMBIENT_PLAYER).isVisible();
  }

  async timerDisplayExists() {
    return this.page.locator(SELECTORS.TIMER_DISPLAY).isVisible();
  }

  async getLocalStorage(key) {
    return this.page.evaluate((k) => localStorage.getItem(k), key);
  }

  async setLocalStorage(key, value) {
    await this.page.evaluate(
      ({ k, v }) => localStorage.setItem(k, v),
      { k: key, v: value }
    );
  }

  async clearLocalStorage() {
    await this.page.evaluate(() => localStorage.clear());
  }
}
