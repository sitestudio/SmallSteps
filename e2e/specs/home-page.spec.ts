import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:4200/');
  });

  test('should display home page with title', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('TinySteps');
    await expect(page.locator('p').first()).toContainText('Choose a learning adventure');
  });

  test('should display circular navigation menu', async ({ page }) => {
    const circleContainer = page.locator('.circle-container');
    await expect(circleContainer).toBeVisible();
    
    // Check that all 6 major nav buttons are visible
    const navButtons = page.locator('.nav-button');
    expect(await navButtons.count()).toBe(6);
  });

  test('should display all language & literacy subcategory buttons', async ({ page }) => {
    const langLiteracyBtn = page.locator('.nav-item.item-1 .nav-button');
    await langLiteracyBtn.click();
    
    const subcategoryContainer = page.locator('.subcategory-container');
    await expect(subcategoryContainer).toBeVisible();
    
    const subbuttons = page.locator('.sub-nav-button');
    expect(await subbuttons.count()).toBe(2);
  });

  test('should allow animal selection', async ({ page }) => {
    const firstAnimal = page.locator('.animal-item').first();
    await expect(firstAnimal).toBeVisible();
    
    // Click to select
    await firstAnimal.click();
    await expect(firstAnimal).toHaveClass(/selected/);
    
    // Click again to deselect
    await firstAnimal.click();
    await expect(firstAnimal).not.toHaveClass(/selected/);
  });

  test('animal selection should persist in localStorage', async ({ page }) => {
    const firstAnimal = page.locator('.animal-item').first();
    
    // Select an animal
    await firstAnimal.click();
    
    const storedSelection = await page.evaluate(() => {
      return localStorage.getItem('tinyStepsSelectedAnimal');
    });
    
    expect(storedSelection).not.toBeNull();
  });

  test('should show training mode checkbox', async ({ page }) => {
    const trainingCheckbox = page.locator('input[type="checkbox"]');
    await expect(trainingCheckbox).toBeVisible();
  });

  test('should show unchecked state for all animals by default', async ({ page }) => {
    const animalItems = page.locator('.animal-item');
    const count = await animalItems.count();
    
    for (let i = 0; i < count; i++) {
      expect(await animalItems.nth(i)).not.toHaveClass(/selected/);
    }
  });
});
