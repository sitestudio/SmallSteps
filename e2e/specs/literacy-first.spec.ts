import { test, expect } from '@playwright/test';

test.describe('Literacy First Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:4200/#/training/literacy-first');
  });

  test('should display literacy first content', async ({ page }) => {
    await expect(page.locator('app-literacy-first')).toBeVisible();
  });
});
