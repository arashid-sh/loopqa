import { Locator, Page } from '@playwright/test';

export class NavBar {
  readonly page: Page;
  readonly signInButton: Locator;
  readonly searchInputField: Locator;
  readonly searchButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.signInButton = page.locator('span:has-text("Sign In")');
    this.searchInputField = page.getByRole('textbox', { name: 'search' });
    this.searchButton = page.getByTestId('fs-search-button');
  }

  /**
   * Function clicks on the sign in button on home page.
   */
  async clickSignInButton(): Promise<void> {
    await this.signInButton.click();
  }

  /**
   * Function searches for the given product
   * @param productName name of the product you want to search for.
   */
  async searchForProduct(productName: string): Promise<void> {
    await this.searchInputField.fill(productName);
    await this.searchButton.click();
  }

  /**
   * Function will click on the given menu option in the nav bar: e.g Fitness, Books & Guides, etc
   * @param menuOption
   */
  async selectNavBarOption(menuOption: string): Promise<void> {
    await this.page.getByRole('link', { name: `${menuOption}` }).click();
  }
}