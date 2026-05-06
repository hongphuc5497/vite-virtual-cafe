import { expect } from '@playwright/test';
import { SELECTORS, TIMEOUTS, ROUTES } from '../constants';

export class RelaxPage {
  constructor(page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto(ROUTES.RELAX);
    await this.page.waitForLoadState('networkidle');
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
