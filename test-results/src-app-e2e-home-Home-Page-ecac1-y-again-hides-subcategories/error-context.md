# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: src/app/e2e/home.spec.ts >> Home Page Language Literacy >> clicking Language & Literacy again hides subcategories
- Location: src/app/e2e/home.spec.ts:53:7

# Error details

```
Error: page.goto: Protocol error (Page.navigate): Cannot navigate to invalid URL
Call log:
  - navigating to "/", waiting until "load"

```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Home Page Language Literacy', () => {
  4  |   test.beforeEach(async ({ page }) => {
> 5  |     await page.goto('/');
     |                ^ Error: page.goto: Protocol error (Page.navigate): Cannot navigate to invalid URL
  6  |   });
  7  | 
  8  |   test('shows subcategories when clicking Language & Literacy (non-training)', async ({ page }) => {
  9  |     await expect(page.locator('.nav-item.item-center')).toBeVisible();
  10 |     
  11 |     const langLiteracyBtn = page.locator('.nav-item.item-1 a.nav-button');
  12 |     await expect(langLiteracyBtn).not.toBeVisible();
  13 |     
  14 |     const subcategoryContainer = page.locator('.subcategory-container');
  15 |     await expect(subcategoryContainer).not.toBeVisible();
  16 |     
  17 |     await langLiteracyBtn.click();
  18 |     
  19 |     // Language & Literacy becomes visible, center-hub hidden
  20 |     await expect(page.locator('.nav-item.item-1')).toBeVisible();
  21 |     await expect(page.locator('.nav-item.item-center')).not.toBeVisible();
  22 |     
  23 |     // Subcategories are now visible
  24 |     await expect(subcategoryContainer).toBeVisible();
  25 |     
  26 |     const soundsSpeechBtn = page.getByText('Sounds and speech');
  27 |     await expect(soundsSpeechBtn).toBeVisible();
  28 |     
  29 |     const comprehensionBtn = page.getByText('Comprehension');
  30 |     await expect(comprehensionBtn).toBeVisible();
  31 |   });
  32 | 
  33 |   test('hides main buttons when subcategories are shown', async ({ page }) => {
  34 |     // Before clicking, Language & Literacy (item-1) should be hidden
  35 |     await expect(page.locator('.nav-item.item-1')).not.toBeVisible();
  36 |     
  37 |     const langLiteracyBtn = page.locator('.nav-item.item-1 a.nav-button');
  38 |     await langLiteracyBtn.click();
  39 |     
  40 |     // Language & Literacy should now be visible at center
  41 |     await expect(page.locator('.nav-item.item-1')).toBeVisible();
  42 |     
  43 |     // Let's Play button (item-center) should be hidden
  44 |     await expect(page.locator('.nav-item.item-center')).not.toBeVisible();
  45 |     
  46 |     // Other main buttons should be hidden
  47 |     await expect(page.locator('.nav-item.item-2')).not.toBeVisible();
  48 |     await expect(page.locator('.nav-item.item-3')).not.toBeVisible();
  49 |     await expect(page.locator('.nav-item.item-4')).not.toBeVisible();
  50 |     await expect(page.locator('.nav-item.item-5')).not.toBeVisible();
  51 |   });
  52 | 
  53 |   test('clicking Language & Literacy again hides subcategories', async ({ page }) => {
  54 |     const langLiteracyBtn = page.locator('.nav-item.item-1 a.nav-button');
  55 |     
  56 |     const subcategoryContainer = page.locator('.subcategory-container');
  57 |     await expect(subcategoryContainer).not.toBeVisible();
  58 |     
  59 |     await langLiteracyBtn.click();
  60 |     await expect(subcategoryContainer).toBeVisible();
  61 |     
  62 |     await langLiteracyBtn.click();
  63 |     await expect(subcategoryContainer).not.toBeVisible();
  64 |   });
  65 | 
  66 |   test('training mode bypasses subcategories and navigates to training route', async ({ page }) => {
  67 |     const checkbox = page.locator('input[type="checkbox"]');
  68 |     await expect(checkbox).not.toBeChecked();
  69 |     
  70 |     await checkbox.click();
  71 |     
  72 |     const langLiteracyBtn = page.locator('.nav-item.item-1 a.nav-button');
  73 |     await langLiteracyBtn.click();
  74 |     
  75 |     await expect(page).toHaveURL(/.*training\/literacy-first/);
  76 |   });
  77 | 
  78 |   test('subcategories route correctly to their pages', async ({ page }) => {
  79 |     const langLiteracyBtn = page.locator('.nav-item.item-1 a.nav-button');
  80 |     await langLiteracyBtn.click();
  81 |     
  82 |     const subcategoryContainer = page.locator('.subcategory-container');
  83 |     await expect(subcategoryContainer).toBeVisible();
  84 |     
  85 |     const soundsSpeechBtn = page.getByText('Sounds and speech');
  86 |     await soundsSpeechBtn.click();
  87 |     
  88 |     await expect(page).toHaveURL(/.*sounds-speech\/words-and-sentences/);
  89 |   });
  90 | });
  91 | 
```