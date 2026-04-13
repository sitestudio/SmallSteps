import { test, expect } from '@playwright/test';

test.describe('Words and Sentences Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:4200/');
    await page.evaluate(() => {
      (window as any).router.navigate(['/sounds-speech/words-and-sentences']);
    });
    await page.waitForSelector('app-words-and-sentences', { timeout: 5000 });
  });

  test('should display the words and sentences page content', async ({ page }) => {
    await expect(page.locator('app-words-and-sentences')).toBeVisible();
  });

  test('should display all checklist items', async ({ page }) => {
    const items = await page.locator('.checklist-item');
    expect(await items.count()).toBe(7);
  });

  test('should display checkbox for each item', async ({ page }) => {
    const checkboxes = await page.locator('.checkbox-container input[type="checkbox"]');
    expect(await checkboxes.count()).toBe(7);
  });

  test('should have navigation buttons', async ({ page }) => {
    const homeBtn = await page.locator('.nav-home');
    const backBtn = await page.locator('.nav-back');
    await expect(homeBtn).toBeVisible();
    await expect(backBtn).toBeVisible();
  });

  test('should have proper back link', async ({ page }) => {
    const backLink = await page.locator('a.back-link');
    await expect(backLink).toBeVisible();
    await expect(backLink).toContainText('Sounds and Speech');
  });

  test('should expand description on item click', async ({ page }) => {
    const firstItem = page.locator('.checklist-item').first();
    
    await firstItem.click({ offset: { x: 50, y: 50 } });
    
    const description = firstItem.locator('.description-content');
    await expect(description).toBeVisible();
  });

  test('should collapse description on second click', async ({ page }) => {
    const firstItem = page.locator('.checklist-item').first();
    
    await firstItem.click({ offset: { x: 50, y: 50 } });
    await expect(firstItem.locator('.description-content')).toBeVisible();
    
    await firstItem.click({ offset: { x: 50, y: 50 } });
    await expect(firstItem.locator('.description-content')).not.toBeVisible();
  });

  test('should toggle checkbox state', async ({ page }) => {
    const firstCheckbox = await page.locator('.checkbox-container input[type="checkbox"]').first();
    
    expect(await firstCheckbox.isChecked()).toBe(false);
    
    await firstCheckbox.click();
    expect(await firstCheckbox.isChecked()).toBe(true);
  });

  test('should display correct item text', async ({ page }) => {
    const itemTexts = await page.locator('.item-text').allTextContents();
    
    expect(itemTexts[0]).toContain('Single Words and Gestures');
    expect(itemTexts[itemTexts.length - 1]).toContain('Many longer sentences, rich language, stories');
  });
});

test.describe('Words and Sentences Page - Animal Display', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:4200/#/sounds-speech/words-and-sentences');
  });

  test('should display selected animal icon at top', async ({ page }) => {
    await expect(page.locator('.selected-animal-icon')).toBeVisible();
  });

  test('should display animal name message', async ({ page }) => {
    await expect(page.locator('.animal-name-display')).toBeVisible();
  });

  test('should auto-assign animal when none selected', async ({ page }) => {
    await page.evaluate(() => localStorage.removeItem('tinyStepsSelectedAnimal'));
    
    await page.goto('http://localhost:4200/#/sounds-speech/words-and-sentences');
    
    const animalIcon = await page.locator('.selected-animal-icon');
    expect(await animalIcon.isVisible()).toBe(true);
  });

  test('should display the name of auto-assigned animal', async ({ page }) => {
    await page.evaluate(() => localStorage.removeItem('tinyStepsSelectedAnimal'));
    
    await page.goto('http://localhost:4200/#/sounds-speech/words-and-sentences');
    
    const animalName = await page.locator('.animal-name-display').textContent();
    expect(animalName).toContain('Playing with');
  });
});

test.describe('Words and Sentences Page - Per-Animal Checkboxes', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:4200/');
    await page.evaluate(() => {
      (window as any).router.navigate(['/sounds-speech/words-and-sentences']);
    });
    await page.waitForSelector('app-words-and-sentences', { timeout: 5000 });
  });

  test('should load checkbox state for currently selected animal', async ({ page }) => {
    await page.goto('http://localhost:4200/');
    const firstAnimal = await page.locator('.animal-item').first();
    await firstAnimal.click();
    
    await page.evaluate(() => {
      (window as any).router.navigate(['/sounds-speech/words-and-sentences']);
    });
    
    const checkboxes = await page.locator('.checkbox-container input[type="checkbox"]');
    await checkboxes.nth(0).click();
    
    await page.reload();
    
    expect(await checkboxes.nth(0).isChecked()).toBe(true);
  });

  test('should not affect other animals when toggling checkboxes', async ({ page }) => {
    await page.goto('http://localhost:4200/');
    const animals = await page.locator('.animal-item');
    
    await animals.nth(0).click();
    
    await page.evaluate(() => {
      (window as any).router.navigate(['/sounds-speech/words-and-sentences']);
    });
    
    const checkboxes = await page.locator('.checkbox-container input[type="checkbox"]');
    await checkboxes.nth(0).click();
    
    const firstAnimalState = await page.evaluate(() => {
      const saved = localStorage.getItem('tinyStepsAnimalCheckboxes');
      if (saved) {
        return JSON.parse(saved);
      }
      return {};
    });

    await page.goto('http://localhost:4200/');
    await animals.nth(1).click();
    
    await page.evaluate(() => {
      (window as any).router.navigate(['/sounds-speech/words-and-sentences']);
    });
    
    const secondAnimalCheckboxes = await page.locator('.checkbox-container input[type="checkbox"]');
    await secondAnimalCheckboxes.nth(1).click();
    
    const newState = await page.evaluate(() => {
      const saved = localStorage.getItem('tinyStepsAnimalCheckboxes');
      if (saved) {
        return JSON.parse(saved);
      }
      return {};
    });

    expect(Object.keys(newState).length).toBe(2);
  });

  test('should show different checkbox states for different animals', async ({ page }) => {
    await page.goto('http://localhost:4200/');
    const animals = await page.locator('.animal-item');
    
    await animals.nth(0).click();
    
    await page.evaluate(() => {
      (window as any).router.navigate(['/sounds-speech/words-and-sentences']);
    });
    
    const checkboxes1 = await page.locator('.checkbox-container input[type="checkbox"]');
    await checkboxes1.nth(0).click();
    
    await page.goto('http://localhost:4200/');
    await animals.nth(1).click();
    
    await page.evaluate(() => {
      (window as any).router.navigate(['/sounds-speech/words-and-sentences']);
    });
    
    const checkboxes2 = await page.locator('.checkbox-container input[type="checkbox"]');
    expect(await checkboxes2.nth(0).isChecked()).toBe(false);
  });
});
