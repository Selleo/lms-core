import { expect } from "@playwright/test";

import type { Locator, Page } from "@playwright/test";

export class AuthFixture {
  private readonly emailInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;
  private readonly logoutButton: Locator;

  constructor(public page: Page) {
    this.emailInput = page.getByLabel("email");
    this.passwordInput = page.getByLabel("password");
    this.loginButton = page.getByRole("button", { name: /login/i });
    this.logoutButton = page.getByRole("button", { name: /logout/i }).nth(1);
  }

  async login(email: string, password: string) {
    await this.page.goto("/auth/login");
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();

    await expect(this.page).toHaveURL("/");
  }

  async logout() {
    await this.logoutButton.click();
    await expect(this.page).toHaveURL("/auth/login");
  }
}
