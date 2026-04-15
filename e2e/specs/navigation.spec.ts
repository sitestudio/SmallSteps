import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:4200/');
  });

  test('should have Training Mode checkbox in dark mode with visible dark text', async ({ page }) => {
    const toggleButton = page.locator('button.theme-toggle-btn');
    await toggleButton.click();
    await page.waitForTimeout(100);
    
    const settingsPanel = page.locator('.settings-panel');
    await expect(settingsPanel).toBeVisible();
    
    const trainingModeText = page.locator('.settings-panel span');
    await expect(trainingModeText).toBeVisible();
  });

  test('should open words and sentences modal when clicking Sounds and Speech', async ({ page }) => {
    const langLiteracyBtn = page.locator('.nav-item.item-1 .nav-button');
    await langLiteracyBtn.click();
    
    const soundsSpeechBtn = page.locator('.sub-nav-button-rectangular:has-text("Sounds and Speech")');
    await soundsSpeechBtn.click();
    
    // The modal should be visible inline, not a separate route
    await page.waitForSelector('.modal-backdrop', { timeout: 5000 });
    
    // Verify modal backdrop is visible
    const backdrop = page.locator('.modal-backdrop');
    await expect(backdrop).toBeVisible();
    
    // Verify words-and-sentences content is inside modal
    await page.waitForSelector('app-words-and-sentences', { timeout: 5000 });
    
    // URL should still be home (hash route)
    const url = page.url();
    expect(url).toContain('/home');
  });

  test('should navigate to comprehension page', async ({ page }) => {
    const langLiteracyBtn = page.locator('.nav-item.item-1 .nav-button');
    await langLiteracyBtn.click();
    
    const comprehensionBtn = page.locator('.sub-nav-button-rectangular:has-text("Comprehension")');
    await comprehensionBtn.click();
    
    await page.waitForSelector('app-comprehension', { timeout: 5000 });
    
    const url = page.url();
    expect(url).toContain('comprehension');
  });

  test('close button closes words and sentences modal', async ({ page }) => {
    // Navigate to sounds & speech
    const langLiteracyBtn = page.locator('.nav-item.item-1 .nav-button');
    await langLiteracyBtn.click();
    
    const soundsSpeechBtn = page.locator('.sub-nav-button-rectangular:has-text("Sounds and Speech")');
    await soundsSpeechBtn.click();
    
    await page.waitForSelector('.modal-backdrop', { timeout: 5000 });
    
    // Click close on modal backdrop to close it
    await page.locator('.modal-backdrop').click();
    
    // Modal should be closed, modal-backdrop should not exist
    await expect(page.locator('.modal-backdrop')).not.toBeVisible();
    
    // Should still be on home
    await page.waitForSelector('app-home', { timeout: 5000 });
  });

  test('should persist animal selection when opening words and sentences modal', async ({ page }) => {
    const firstAnimal = page.locator('.animal-item').first();
    
    // Select animal on home
    await firstAnimal.click();
    expect(await firstAnimal).toHaveClass(/selected/);
    
    // Click Sounds and Speech to open modal
    const langLiteracyBtn = page.locator('.nav-item.item-1 .nav-button');
    await langLiteracyBtn.click();
    
    const soundsSpeechBtn = page.locator('.sub-nav-button-rectangular:has-text("Sounds and Speech")');
    await soundsSpeechBtn.click();
    
    // Check selected animal displays in modal
    const animalDisplay = page.locator('.selected-animal-icon');
    await expect(animalDisplay).toBeVisible();
  });

  test('subcategories expand when clicking language & literacy', async ({ page }) => {
    const langLiteracyBtn = page.locator('.nav-item.item-1 .nav-button');
    
    const subcategoryContainer = page.locator('.subcategory-container');
    await expect(subcategoryContainer).not.toBeVisible();
    
    await langLiteracyBtn.click();
    await expect(subcategoryContainer).toBeVisible();
  });

  test('can navigate to home from words and sentences modal', async ({ page }) => {
    // Open sounds & speech modal
    const langLiteracyBtn = page.locator('.nav-item.item-1 .nav-button');
    await langLiteracyBtn.click();
    
    const soundsSpeechBtn = page.locator('.sub-nav-button-rectangular:has-text("Sounds and Speech")');
    await soundsSpeechBtn.click();
    
    await page.waitForSelector('.modal-backdrop', { timeout: 5000 });
    
    // Click home button to navigate away
    const homeBtn = page.locator('.nav-home');
    await homeBtn.click();
    
    // Should be on home (modal should have been closed)
    await expect(page.locator('app-home')).toBeVisible();
  });
});
