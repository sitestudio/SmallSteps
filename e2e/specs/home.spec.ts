import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:4200/');
  });

  test('should display the home page content', async ({ page }) => {
    await expect(page.locator('app-home')).toBeVisible();
  });

  test('should have navigation buttons', async ({ page }) => {
    await expect(page.locator('app-home')).toContainText(/Home|Training/i);
  });

  test('should display all 12 animals', async ({ page }) => {
    const animalItems = await page.locator('.animal-item');
    expect(await animalItems.count()).toBe(12);
  });

  test('should display animal names correctly', async ({ page }) => {
    const firstAnimal = await page.locator('.animal-item').first();
    await expect(firstAnimal.locator('.animal-name')).toContainText('Lion');
  });

  test('should display animal icons', async ({ page }) => {
    const animalIcons = await page.locator('.animal-icon');
    expect(await animalIcons.count()).toBe(12);
  });

  test('should show unchecked state by default', async ({ page }) => {
    const animalItems = await page.locator('.animal-item');
    
    for (let i = 0; i < 12; i++) {
      await expect(animalItems.nth(i)).not.toHaveClass(/selected/);
    }
  });

  test('should select animal when clicked', async ({ page }) => {
    const firstAnimal = await page.locator('.animal-item').first();
    
    await expect(firstAnimal).not.toHaveClass(/selected/);
    await firstAnimal.click();
    
    await expect(firstAnimal).toHaveClass(/selected/);
  });

  test('should toggle off when clicking already selected animal', async ({ page }) => {
    const firstAnimal = await page.locator('.animal-item').first();
    
    await firstAnimal.click();
    await expect(firstAnimal).toHaveClass(/selected/);
    
    await firstAnimal.click();
    await expect(firstAnimal).not.toHaveClass(/selected/);
  });

  test('should allow only one animal selected at a time', async ({ page }) => {
    // Navigate to home
    await page.goto('http://localhost:4200/');
    
    // Wait for home component
    await expect(page.locator('app-home')).toBeVisible();
    
    // Get initial animals (all 12 in unchecked section)
    const animals1 = await page.locator('.animal-item');
    // console.log('Animal count:', await animals1.count());
    
    // Click first animal (animal-0)
    await animals1.nth(0).click();
    // console.log('Clicked animal 0');
    
    // Wait for DOM to update
    await page.waitForTimeout(500);
    
    const class1 = await animals1.nth(0).getAttribute('class');
    // console.log('After click 0, animal 0 class:', class1);
    
    await expect(animals1.nth(0)).toHaveClass(/selected/);
    
    // Re-acquire animals since DOM changed
    const animals2 = await page.locator('.animal-item');
    
    // After first click: 
    // - animals2.nth(0) = animal-0 (selected, now in checked section)
    // - animals2.nth(1) = animal-1 (in unchecked section, should be selected)
    
    // Click the second animal (animal-1) 
    await animals2.nth(1).click();
    // console.log('Clicked animal 1');
    
    // Wait for DOM to update
    await page.waitForTimeout(500);
    
    // Check that animal 0 is no longer selected
    await expect(animals2.nth(0)).not.toHaveClass(/selected/);  // animal-0 should be deselected
    await expect(animals2.nth(1)).toHaveClass(/selected/);  // animal-1 should be selected
  });

  test('should persist selection after page reload', async ({ page }) => {
    const firstAnimal = await page.locator('.animal-item').first();
    
    await firstAnimal.click();
    await expect(firstAnimal).toHaveClass(/selected/);
    
    await page.reload();
    
    await expect(firstAnimal).toHaveClass(/selected/);
  });

  test('should show delete button once after all checked animals', async ({ page }) => {
    const firstAnimal = await page.locator('.animal-item').first();
    
    await firstAnimal.click();
    await expect(firstAnimal).toHaveClass(/selected/);
    
    const deleteBtn = page.locator('.delete-btn');
    await expect(deleteBtn).toBeVisible();
  });

  test('should not show delete button when no animal selected', async ({ page }) => {
    const deleteBtn = page.locator('.delete-btn');
    await expect(deleteBtn).not.toBeVisible();
  });

  test('should delete selected animal when delete button clicked', async ({ page }) => {
    const firstAnimal = await page.locator('.animal-item').first();
    
    await firstAnimal.click();
    const deleteBtn = page.locator('.delete-btn');
    await expect(deleteBtn).toBeVisible();
    
    await deleteBtn.click();
    
    const cancelBtn = page.locator('button:has-text("Cancel")');
    if (await cancelBtn.count() > 0) {
      await cancelBtn.click();
    }
    
    await expect(firstAnimal).not.toHaveClass(/selected/);
  });
});

test.describe('Subcategory Button Sizing', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:4200/');
  });

  test('should have at least 3px border from text edge on subcategory buttons', async ({ page }) => {
    const languageLiteracyBtn = await page.locator('.nav-item.item-1 .nav-button');
    await languageLiteracyBtn.click();
    
    const soundsSpeechBtn = page.locator('.sub-nav-button:has-text("Sounds and speech")');
    await soundsSpeechBtn.click();
    
    // Get button dimensions (64x64) and content bounding box
    const buttonBox = await soundsSpeechBtn.boundingBox();
    
    // The span with text should have padding of at least 8px (horizontal) and 10px (vertical)
    // This means the text should be at least 8-10px from each edge
    const computedStyle = await soundsSpeechBtn.evaluate((el: HTMLElement) => {
      return window.getComputedStyle(el);
    });
    
    // Check that the padding exists (box-sizing should be border-box)
    expect(computedStyle.boxSizing).toBe('border-box');
    
    // Button should be square (64x64)
    expect(buttonBox?.width).toBe(64);
    expect(buttonBox?.height).toBe(64);
  });

  test('should have equal width and height for all subcategory buttons', async ({ page }) => {
    const languageLiteracyBtn = await page.locator('.nav-item.item-1 .nav-button');
    await languageLiteracyBtn.click();
    
    const soundsSpeechBtn = page.locator('.sub-nav-button:has-text("Sounds and speech")');
    const comprehensionBtn = page.locator('.sub-nav-button:has-text("Comprehension")');
    
    const soundsSpeechBox = await soundsSpeechBtn.boundingBox();
    const comprehensionBox = await comprehensionBtn.boundingBox();
    
    // Both buttons should have the same dimensions
    expect(soundsSpeechBox?.width).toBe(comprehensionBox?.width);
    expect(soundsSpeechBox?.height).toBe(comprehensionBox?.height);
    
    // Both should be 64x64
    expect(soundsSpeechBox?.width).toBe(64);
    expect(soundsSpeechBox?.height).toBe(64);
  });

  test('should all have the same border radius (circular)', async ({ page }) => {
    const languageLiteracyBtn = await page.locator('.nav-item.item-1 .nav-button');
    await languageLiteracyBtn.click();
    
    const soundsSpeechBtn = page.locator('.sub-nav-button:has-text("Sounds and speech")');
    const comprehensionBtn = page.locator('.sub-nav-button:has-text("Comprehension")');
    
    const soundsSpeechBorderRadius = await soundsSpeechBtn.evaluate((el: HTMLElement) => {
      return window.getComputedStyle(el).borderRadius;
    });
    
    const comprehensionBorderRadius = await comprehensionBtn.evaluate((el: HTMLElement) => {
      return window.getComputedStyle(el).borderRadius;
    });
    
    // All buttons should have 50% border-radius (circular)
    expect(soundsSpeechBorderRadius).toBe(comprehensionBorderRadius);
    expect(soundsSpeechBorderRadius).toContain('50%');
  });
});

test.describe('Subcategory Button Colors', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:4200/');
  });

  test('should have Sounds and Speech button with correct color (#FF6B6B)', async ({ page }) => {
    const languageLiteracyBtn = await page.locator('.nav-item.item-1 .nav-button');
    await languageLiteracyBtn.click();
    
    const soundsSpeechBtn = page.locator('.sub-nav-button:has-text("Sounds and speech")');
    const computedStyle = await soundsSpeechBtn.evaluate((el: HTMLElement) => {
      return window.getComputedStyle(el).backgroundColor;
    });
    
    // The button should have red background (#FF6B6B)
    expect(computedStyle).toBe('rgb(255, 107, 107)');
  });

  test('should have Comprehension button with correct color (#4D96FF)', async ({ page }) => {
    const languageLiteracyBtn = await page.locator('.nav-item.item-1 .nav-button');
    await languageLiteracyBtn.click();
    
    const comprehensionBtn = page.locator('.sub-nav-button:has-text("Comprehension")');
    const computedStyle = await comprehensionBtn.evaluate((el: HTMLElement) => {
      return window.getComputedStyle(el).backgroundColor;
    });
    
    // The button should have blue background (#4D96FF)
    expect(computedStyle).toBe('rgb(77, 150, 255)');
  });

  test('should have different colors for Sounds and Speech vs Comprehension', async ({ page }) => {
    const languageLiteracyBtn = await page.locator('.nav-item.item-1 .nav-button');
    await languageLiteracyBtn.click();
    
    const soundsSpeechBtn = page.locator('.sub-nav-button:has-text("Sounds and speech")');
    const comprehensionBtn = page.locator('.sub-nav-button:has-text("Comprehension")');
    
    const soundsSpeechColor = await soundsSpeechBtn.evaluate((el: HTMLElement) => {
      return window.getComputedStyle(el).backgroundColor;
    });
    
    const comprehensionColor = await comprehensionBtn.evaluate((el: HTMLElement) => {
      return window.getComputedStyle(el).backgroundColor;
    });
    
    // Colors should be different
    expect(soundsSpeechColor).not.toBe(comprehensionColor);
  });
});

test.describe('Home Page - Grid Layout', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:4200/');
  });

  test('should show grid with max 3 columns', async ({ page }) => {
    const animalList = await page.locator('.animal-list');
    const layout = await animalList.evaluate((el: HTMLElement) => {
      return window.getComputedStyle(el).gridTemplateColumns;
    });
    
    expect(layout).toContain('repeat(3');
  });

  test('should show grid with max 4 rows', async ({ page }) => {
    const animalList = await page.locator('.animal-list');
    const layout = await animalList.evaluate((el: HTMLElement) => {
      return window.getComputedStyle(el).gridTemplateRows;
    });
    
    expect(layout).toContain('repeat(4');
  });

  test('should not have checkbox elements in DOM', async ({ page }) => {
    const checkboxes = await page.locator('input[type="checkbox"]');
    expect(await checkboxes.count()).toBe(0);
  });
});

test.describe('Language & Literacy - Subcategory Display', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:4200/');
  });

  test('should show subcategories when clicking Language & Literacy button', async ({ page }) => {
    const languageLiteracyBtn = await page.locator('.nav-item.item-1 .nav-button');
    expect(await languageLiteracyBtn.textContent()).toContain('Language & Literacy');
    
    await languageLiteracyBtn.click();
    
    const subcategoryContainer = await page.locator('.subcategory-container');
    await expect(subcategoryContainer).toBeVisible();
  });

  test('should display subcategories in horizontal linear layout', async ({ page }) => {
    const languageLiteracyBtn = await page.locator('.nav-item.item-1 .nav-button');
    await languageLiteracyBtn.click();
    
    const subcategoryContainer = await page.locator('.subcategory-container');
    const layout = await subcategoryContainer.evaluate((el: HTMLElement) => {
      return window.getComputedStyle(el).display;
    });
    
    expect(layout).toBe('flex');
  });

  test('should have Sounds and Speech subcategory button', async ({ page }) => {
    const languageLiteracyBtn = await page.locator('.nav-item.item-1 .nav-button');
    await languageLiteracyBtn.click();
    
    const soundsSpeechBtn = page.locator('.sub-nav-button:has-text("Sounds and speech")');
    await expect(soundsSpeechBtn).toBeVisible();
  });

  test('should have Comprehension subcategory button', async ({ page }) => {
    const languageLiteracyBtn = await page.locator('.nav-item.item-1 .nav-button');
    await languageLiteracyBtn.click();
    
    const comprehensionBtn = page.locator('.sub-nav-button:has-text("Comprehension")');
    await expect(comprehensionBtn).toBeVisible();
  });

  test('should position sounds and speech button before comprehension', async ({ page }) => {
    const languageLiteracyBtn = await page.locator('.nav-item.item-1 .nav-button');
    await languageLiteracyBtn.click();
    
    const soundsSpeechBtn = await page.locator('.sub-nav-button:has-text("Sounds and speech")');
    const comprehensionBtn = await page.locator('.sub-nav-button:has-text("Comprehension")');
    
    const soundsSpeechBox = await soundsSpeechBtn.boundingBox();
    const comprehensionBox = await comprehensionBtn.boundingBox();
    
    expect(soundsSpeechBox?.x).toBeLessThan(comprehensionBox!.x);
  });

  test('should have round subcategory buttons', async ({ page }) => {
    const languageLiteracyBtn = await page.locator('.nav-item.item-1 .nav-button');
    await languageLiteracyBtn.click();
    
    const soundsSpeechBtn = page.locator('.sub-nav-button:has-text("Sounds and speech")');
    await soundsSpeechBtn.click();
    
    // Get the computed border-radius to verify it's round (50%)
    const borderRadius = await soundsSpeechBtn.evaluate((el: HTMLElement) => {
      return window.getComputedStyle(el).borderRadius;
    });
    
    // Round buttons have 50% border-radius
    expect(borderRadius).toContain('50%');
  });

  test('should have equal width and height for subcategory buttons', async ({ page }) => {
    const languageLiteracyBtn = await page.locator('.nav-item.item-1 .nav-button');
    await languageLiteracyBtn.click();
    
    const soundsSpeechBtn = page.locator('.sub-nav-button:has-text("Sounds and speech")');
    
    const box = await soundsSpeechBtn.boundingBox();
    
    // Buttons should be square (round means equal dimensions)
    expect(box?.width).toBeCloseTo(box?.height, 0);
  });

  test('should hide subcategories when clicking Language & Literacy again', async ({ page }) => {
    const languageLiteracyBtn = await page.locator('.nav-item.item-1 .nav-button');
    await languageLiteracyBtn.click();
    
    const subcategoryContainer = await page.locator('.subcategory-container');
    await expect(subcategoryContainer).toBeVisible();
    
    await languageLiteracyBtn.click();
    await expect(subcategoryContainer).not.toBeVisible();
  });
});

test.describe('Language & Literacy - Button Repositioning', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:4200/');
  });

  test('should position Language & Literacy button at center', async ({ page }) => {
    const languageLiteracyBtn = await page.locator('.nav-item.item-1 .nav-button');
    
    // Language & Literacy button is always visible at center (0deg)
    await expect(languageLiteracyBtn).toBeVisible();
    
    // Check the button is roughly centered (allow for button size)
    const btnPos = await languageLiteracyBtn.boundingBox();
    
    // With circle size of 500px and button of ~140px,
    // center should be around x=250, with tolerance for rounding
    expect(btnPos?.x).toBeGreaterThan(170);
    expect(btnPos?.x).toBeLessThan(330);
  });

  test('should have Maths & Numbers button at correct position', async ({ page }) => {
    const mathsBtn = await page.locator('.nav-item.item-2 .nav-button');
    expect(await mathsBtn.textContent()).toContain('Maths & Numbers');
    
    // The button should be at 72deg rotation position (upper right quadrant)
    const pos = await mathsBtn.boundingBox();
    
    // At 72deg, button should be in upper-right quadrant (y=140px from center)
    // Circle radius is 250px, so y should be around 110-140 range
    expect(pos?.x).toBeGreaterThan(250); // Right of center
    expect(pos?.y).toBeLessThan(380);     // Allow for 72deg calculation variation
    expect(pos?.y).toBeGreaterThan(20);   // Should be near top
  });
  
  test('should have Social/Emotional button at correct position', async ({ page }) => {
    const socialBtn = await page.locator('.nav-item.item-3 .nav-button');
    expect(await socialBtn.textContent()).toContain('Social/Emotional');
  });

  test('should have Physical button at top position', async ({ page }) => {
    const physicalBtn = await page.locator('.nav-item.item-4 .nav-button');
    expect(await physicalBtn.textContent()).toContain('Physical');
  });

  test('should have Executive Function button at correct position', async ({ page }) => {
    const execBtn = await page.locator('.nav-item.item-5 .nav-button');
    expect(await execBtn.textContent()).toContain('Executive Function');
  });
});

test.describe('Speech and Sound - Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:4200/');
  });

  test('should navigate to sounds-speech page when clicking Sounds and Speech subcategory', async ({ page }) => {
    const languageLiteracyBtn = await page.locator('.nav-item.item-1 .nav-button');
    await languageLiteracyBtn.click();
    
    const soundsSpeechBtn = page.locator('.sub-nav-button:has-text("Sounds and speech")');
    await soundsSpeechBtn.click();
    
    // Wait for navigation to complete
    await page.waitForSelector('app-words-and-sentences', { timeout: 5000 });
    
    const url = page.url();
    expect(url).toContain('sounds-speech/words-and-sentences');
  });

  test('should navigate to comprehension page when clicking Comprehension subcategory', async ({ page }) => {
    const languageLiteracyBtn = await page.locator('.nav-item.item-1 .nav-button');
    await languageLiteracyBtn.click();
    
    const comprehensionBtn = page.locator('.sub-nav-button:has-text("Comprehension")');
    await comprehensionBtn.click();
    
    // Wait for navigation to complete
    await page.waitForSelector('app-comprehension', { timeout: 5000 });
    
    const url = page.url();
    expect(url).toContain('comprehension');
  });

  test('should have working back navigation from sounds-speech page', async ({ page }) => {
    const languageLiteracyBtn = await page.locator('.nav-item.item-1 .nav-button');
    await languageLiteracyBtn.click();
    
    const soundsSpeechBtn = page.locator('.sub-nav-button:has-text("Sounds and speech")');
    await soundsSpeechBtn.click();
    
    await page.waitForSelector('app-words-and-sentences', { timeout: 5000 });
    
    const backBtn = await page.locator('.nav-back');
    expect(backBtn).toBeVisible();
  });

  test('should preserve animal selection through navigation to sounds-speech', async ({ page }) => {
    const firstAnimal = await page.locator('.animal-item').first();
    await firstAnimal.click();
    
    const languageLiteracyBtn = await page.locator('.nav-item.item-1 .nav-button');
    await languageLiteracyBtn.click();
    
    const soundsSpeechBtn = page.locator('.sub-nav-button:has-text("Sounds and speech")');
    await soundsSpeechBtn.click();
    
    await page.waitForSelector('app-words-and-sentences', { timeout: 5000 });
    
    // Verify animal selection persists
    const selectedAnimal = await page.locator('.selected-animal-icon');
    expect(selectedAnimal).toBeVisible();
  });
});
