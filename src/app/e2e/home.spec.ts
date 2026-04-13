import { test, expect } from '@playwright/test';

test.describe('Home Page Language Literacy', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('shows subcategories when clicking Language & Literacy (non-training)', async ({ page }) => {
    await expect(page.locator('.nav-item.item-center')).toBeVisible();
    
    const langLiteracyBtn = page.locator('.nav-item.item-1 a.nav-button');
    await expect(langLiteracyBtn).not.toBeVisible();
    
    const subcategoryContainer = page.locator('.subcategory-container');
    await expect(subcategoryContainer).not.toBeVisible();
    
    await langLiteracyBtn.click();
    
    // Language & Literacy becomes visible, center-hub hidden
    await expect(page.locator('.nav-item.item-1')).toBeVisible();
    await expect(page.locator('.nav-item.item-center')).not.toBeVisible();
    
    // Subcategories are now visible
    await expect(subcategoryContainer).toBeVisible();
    
    const soundsSpeechBtn = page.getByText('Sounds and speech');
    await expect(soundsSpeechBtn).toBeVisible();
    
    const comprehensionBtn = page.getByText('Comprehension');
    await expect(comprehensionBtn).toBeVisible();
  });

  test('hides main buttons when subcategories are shown', async ({ page }) => {
    // Before clicking, Language & Literacy (item-1) should be hidden
    await expect(page.locator('.nav-item.item-1')).not.toBeVisible();
    
    const langLiteracyBtn = page.locator('.nav-item.item-1 a.nav-button');
    await langLiteracyBtn.click();
    
    // Language & Literacy should now be visible at center
    await expect(page.locator('.nav-item.item-1')).toBeVisible();
    
    // Let's Play button (item-center) should be hidden
    await expect(page.locator('.nav-item.item-center')).not.toBeVisible();
    
    // Other main buttons should be hidden
    await expect(page.locator('.nav-item.item-2')).not.toBeVisible();
    await expect(page.locator('.nav-item.item-3')).not.toBeVisible();
    await expect(page.locator('.nav-item.item-4')).not.toBeVisible();
    await expect(page.locator('.nav-item.item-5')).not.toBeVisible();
  });

  test('clicking Language & Literacy again hides subcategories', async ({ page }) => {
    const langLiteracyBtn = page.locator('.nav-item.item-1 a.nav-button');
    
    const subcategoryContainer = page.locator('.subcategory-container');
    await expect(subcategoryContainer).not.toBeVisible();
    
    await langLiteracyBtn.click();
    await expect(subcategoryContainer).toBeVisible();
    
    await langLiteracyBtn.click();
    await expect(subcategoryContainer).not.toBeVisible();
  });

  test('training mode bypasses subcategories and navigates to training route', async ({ page }) => {
    const checkbox = page.locator('input[type="checkbox"]');
    await expect(checkbox).not.toBeChecked();
    
    await checkbox.click();
    
    const langLiteracyBtn = page.locator('.nav-item.item-1 a.nav-button');
    await langLiteracyBtn.click();
    
    await expect(page).toHaveURL(/.*training\/literacy-first/);
  });

  test('subcategories route correctly to their pages', async ({ page }) => {
    const langLiteracyBtn = page.locator('.nav-item.item-1 a.nav-button');
    await langLiteracyBtn.click();
    
    const subcategoryContainer = page.locator('.subcategory-container');
    await expect(subcategoryContainer).toBeVisible();
    
    const soundsSpeechBtn = page.getByText('Sounds and speech');
    await soundsSpeechBtn.click();
    
    await expect(page).toHaveURL(/.*sounds-speech\/words-and-sentences/);
  });
});
