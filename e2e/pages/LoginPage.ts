import { Page, Locator, expect } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly connectSourceBtn: Locator;
  readonly connectDestinationBtn: Locator;
  readonly continueBtn: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: /Connect Accounts/i });
    this.connectSourceBtn = page.getByRole('link', { name: /Connect Source/i });
    this.connectDestinationBtn = page.getByRole('link', { name: /Connect Destination/i });
    this.continueBtn = page.getByRole('link', { name: /Continue to Dashboard/i });
  }

  async goto() {
    await this.page.goto('/login');
  }

  async expectSourceConnectVisible() {
    await expect(this.connectSourceBtn).toBeVisible();
  }

  // A helper since OAuth is hard to E2E properly; we might just check if the buttons redirect correctly to Google
  async getSourceConnectHref() {
    return await this.connectSourceBtn.getAttribute('href');
  }
}
