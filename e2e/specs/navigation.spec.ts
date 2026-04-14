import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:4200/');
  });

  test('should navigate to sounds & speech page', async ({ page }) => {
    const langLiteracyBtn = page.locator('.nav-item.item-1 .nav-button');
    await langLiteracyBtn.click();
    
    const soundsSpeechBtn = page.locator('.sub-nav-button-rectangular:has-text("Sounds and Speech")');
    await soundsSpeechBtn.click();
    
    await page.waitForSelector('app-words-and-sentences', { timeout: 5000 });
    
    const url = page.url();
    expect(url).toContain('sounds-speech/words-and-sentences');
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

  test('back button works from sounds & speech', async ({ page }) => {
    // Navigate to sounds & speech
    const langLiteracyBtn = page.locator('.nav-item.item-1 .nav-button');
    await langLiteracyBtn.click();
    
    const soundsSpeechBtn = page.locator('.sub-nav-button-rectangular:has-text("Sounds and Speech")');
    await soundsSpeechBtn.click();
    
    await page.waitForSelector('app-words-and-sentences', { timeout: 5000 });
    
    // Click back
    const backBtn = page.locator('.nav-back');
    await backBtn.click();
    
    // Should return to home
    await page.waitForSelector('app-home', { timeout: 5000 });
  });

  test('should persist animal selection through navigation', async ({ page }) => {
    const firstAnimal = page.locator('.animal-item').first();
    
    // Select animal on home
    await firstAnimal.click();
    expect(await firstAnimal).toHaveClass(/selected/);
    
    // Navigate to sounds & speech
    const langLiteracyBtn = page.locator('.nav-item.item-1 .nav-button');
    await langLiteracyBtn.click();
    
    const soundsSpeechBtn = page.locator('.sub-nav-button-rectangular:has-text("Sounds and Speech")');
    await soundsSpeechBtn.click();
    
    // Check selected animal displays
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

  test('can navigate back to home from sounds & speech', async ({ page }) => {
    // Navigate to sounds & speech
    const langLiteracyBtn = page.locator('.nav-item.item-1 .nav-button');
    await langLiteracyBtn.click();
    
    const soundsSpeechBtn = page.locator('.sub-nav-button-rectangular:has-text("Sounds and Speech")');
    await soundsSpeechBtn.click();
    
    await page.waitForSelector('app-words-and-sentences', { timeout: 5000 });
    
    // Click home button
    const homeBtn = page.locator('.nav-home');
    await homeBtn.click();
    
    // Should be on home
    await expect(page.locator('app-home')).toBeVisible();
  });
});
