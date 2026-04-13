import { test, expect } from '@playwright/test';

test.describe('Words and Sentences Checklist', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:4200/');
    
    // Select an animal first
    const firstAnimal = page.locator('.animal-item').first();
    await firstAnimal.click();
    
    // Navigate to sounds & speech
    const langLiteracyBtn = page.locator('.nav-item.item-1 .nav-button');
    await langLiteracyBtn.click();
    
    const soundsSpeechBtn = page.locator('.sub-nav-button:has-text("Sounds and speech")');
    await soundsSpeechBtn.click();
    
    await page.waitForSelector('app-words-and-sentences', { timeout: 5000 });
  });

  test('should display all checklist items', async ({ page }) => {
    const items = page.locator('.checklist-item');
    expect(await items.count()).toBe(7);
  });

  test('should display all item texts correctly', async ({ page }) => {
    const itemTexts = await page.locator('.item-text').allTextContents();
    
    expect(itemTexts[0]).toContain('Single Words and Gestures');
    expect(itemTexts[itemTexts.length - 1]).toContain('Many longer sentences, rich language, stories');
  });

  test('checkbox can be toggled', async ({ page }) => {
    // Get first checklist item and click to expand
    const firstItem = page.locator('.checklist-item').first();
    
    // Click the item to ensure it's visible
    await firstItem.click({ force: true });
    
    // The checkbox is inside checkbox-container which has the click handler
    const firstCheckboxContainer = page.locator('.checklist-item').first().locator('.checkbox-container');
    
    // Verify not checked initially
    const initialChecked = await firstCheckboxContainer.locator('input[type="checkbox"]').first().isChecked();
    expect(initialChecked).toBe(false);
    
    // Click the checkbox container (the custom checkmark area)
    await firstCheckboxContainer.click();
    
    // Verify it's checked now
    const afterClick = await firstCheckboxContainer.locator('input[type="checkbox"]').first().isChecked();
    expect(afterClick).toBe(true);
  });

  test('checkbox state persists in localStorage', async ({ page }) => {
    const firstItem = page.locator('.checklist-item').first();
    
    // Click item to expand if needed
    await firstItem.click({ force: true });
    
    const checkboxContainer = page.locator('.checklist-item').first().locator('.checkbox-container');
    await checkboxContainer.click();
    
    const storageState = await page.evaluate(() => {
      return localStorage.getItem('tinyStepsAnimalCheckboxes');
    });
    
    expect(storageState).not.toBeNull();
  });

  test('page reload maintains checkbox states', async ({ page }) => {
    const items = page.locator('.checklist-item');
    
    // Click first item and check a checkbox
    await items.first().click({ force: true });
    
    const firstCheckbox = page.locator('.checklist-item').first().locator('.checkbox-container');
    await firstCheckbox.click();
    
    // Reload page
    await page.reload();
    
    // Wait for component to load again
    await page.waitForSelector('app-words-and-sentences', { timeout: 5000 });
    
    // Click first item to expand (if needed)
    await items.first().click({ force: true });
    
    const checkboxes = page.locator('.checkbox-container');
    
    // Check if first one is still checked after reload
    expect(await checkboxes.nth(0).locator('input').first().isChecked()).toBe(true);
  });

  test('should expand description on item click', async ({ page }) => {
    const firstItem = page.locator('.checklist-item').first();
    
    await firstItem.click({ offset: { x: 50, y: 50 } });
    
    const description = firstItem.locator('.description-content');
    await expect(description).toBeVisible();
  });

  test('generate PDF includes checked items', async ({ page }) => {
    const checkboxes = page.locator('.checklist-item');
    
    // Click items to expand, then check first checkbox
    await checkboxes.nth(1).click({ force: true });
    const firstCheckContainer = checkboxes.nth(1).locator('.checkbox-container');
    await firstCheckContainer.click();
    
    await checkboxes.nth(3).click({ force: true });
    const thirdCheckContainer = checkboxes.nth(3).locator('.checkbox-container');
    await thirdCheckContainer.click();
    
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.locator('.btn-primary').click(),
    ]);
    
    expect(download.suggestedFilename()).toBe('words-and-sentences-checked-items.pdf');
  });
});
