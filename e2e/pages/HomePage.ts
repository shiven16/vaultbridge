import { Page, Locator, expect } from '@playwright/test';

export class HomePage {
  readonly page: Page;
  readonly heading: Locator;
  readonly getStartedBtn: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: /Transfer files between Google accounts/i });
    this.getStartedBtn = page.getByRole('link', { name: /Get Started/i });
  }

  async goto() {
    await this.page.goto('/');
  }

  async clickGetStarted() {
    await this.getStartedBtn.click();
  }

  async expectLoaded() {
    await expect(this.heading).toBeVisible();
    await expect(this.getStartedBtn).toBeVisible();
  }
}
