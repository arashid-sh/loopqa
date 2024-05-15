import { expect, test } from '../lib/fixture';
import { config } from 'dotenv';

config();

test.describe('plp', () => {
  test.beforeEach(async ({ page, navBar }) => {
    await page.goto('/');
    const productName = "Trayton's Dumbbells";
    await navBar.searchForProduct(productName);
    // wait for products to load on the product list page
    await page.waitForResponse(/.*ClientProductGalleryQuery.*/);
  });

  test('ECMP-2123 validate sort by price, descending', async ({ page, productListPage }) => {
    await productListPage.sortBy('price_desc');
    await page.waitForResponse(/.*ClientProductGalleryQuery.*/);
    const prices = await productListPage.getAllProductPrices();
    expect(prices[0]).toBeGreaterThan(prices[prices.length - 1]);
  });

  test('ECMP-2124 validate sort by price, ascending', async ({ page, productListPage }) => {
    await productListPage.sortBy('price_asc');
    await page.waitForResponse(/.*ClientProductGalleryQuery.*/);
    const prices = await productListPage.getAllProductPrices();
    expect(prices[0]).toBeLessThan(prices[prices.length - 1]);
  });

  test('ECMP-2125 validate sort by name, A-Z', async ({ page, productListPage }) => {
    await productListPage.sortBy('name_asc');
    await page.waitForResponse(/.*ClientProductGalleryQuery.*/);
    const allProductNames = await productListPage.getAllProductNames();
    expect(allProductNames[0].localeCompare(allProductNames[allProductNames.length - 1])).toBe(-1); //localCompare() returns -1 if less than, 0 if equal, 1 if great than
  });

  test('ECMP-2126 validate sort by name, Z-A', async ({ page, productListPage }) => {
    await productListPage.sortBy('name_desc');
    await page.waitForResponse(/.*ClientProductGalleryQuery.*/);
    const allProductNames = await productListPage.getAllProductNames();
    expect(allProductNames[0].localeCompare(allProductNames[allProductNames.length - 1])).toBe(1);
  });

  test('ECMP-2127 validate sort by discount', async ({ page, productListPage }) => {
    await productListPage.sortBy('discount_desc');
    await page.waitForResponse(/.*ClientProductGalleryQuery.*/);
    const prices = await productListPage.getAllProductPrices();
    expect(prices[0]).toBeLessThan(prices[prices.length - 1]);
  });

  test('ECMP-2130 validate PDP page for an item', async ({ page, productListPage }) => {
    // Get the name of the first product on the product list page
    const product = (await page.locator('[data-testid="fs-product-card-content"] a span').first().innerText()).trim();
    await productListPage.selectProduct(product);
    // Validate that the PDP page is for the correct product
    expect(product).toMatch((await page.getByRole('heading', { name: `${product}` }).innerText()).trim());
  });

  test.describe('pagination', () => {
    test('ECMP-2129 validate Load More Products button loads more products', async ({ page, navBar, productListPage }) => {
      await page.goto('/');

      await navBar.clickLink('Fitness & Nutrition');
      const allProductsInGalleryBefore = await productListPage.getAllProduct();
      await productListPage.loadMoreProductsButton.click();
      const allProductsInGalleryAfter = await productListPage.getAllProduct();
      expect(allProductsInGalleryBefore.length).toBeLessThan(allProductsInGalleryAfter.length);
    });
  });
});
