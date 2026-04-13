import { test, expect } from '@playwright/test';

test.describe('Theme Toggle', () => {
  test.beforeEach(async ({ page }) => {
    // Start from a known clean state - ensure light mode first
    await page.goto('http://localhost:4200/');
  });

  test('should display theme toggle button in upper right corner', async ({ page }) => {
    const toggleButton = page.locator('button.theme-toggle-btn');
    await expect(toggleButton).toBeVisible();
    
    const box = await toggleButton.boundingBox();
    expect(box?.y).toBeLessThan(50);
    expect(box?.x + box!.width).toBeGreaterThan(page.viewportSize()!.width - 50);
  });

  test('should toggle between sun and moon icons', async ({ page }) => {
    const toggleButton = page.locator('button.theme-toggle-btn');
    
    // Initial state check - ensure dark mode is NOT enabled
    const initialIsDark = await page.evaluate(() => {
      return document.documentElement.classList.contains('dark');
    });
    
    // If already in dark mode from a previous test, toggle it off first
    if (initialIsDark) {
      await toggleButton.click();
      await page.waitForTimeout(100);
    }
    
    // Verify we're in light mode (moon icon)
    expect(await page.evaluate(() => document.documentElement.classList.contains('dark'))).toBe(false);
    
    // Click to toggle dark mode
    await toggleButton.click();
    
    // Wait for the effect to apply
    await page.waitForTimeout(100);
    
    // Check dark class is applied
    expect(await page.evaluate(() => document.documentElement.classList.contains('dark'))).toBe(true);
    
    // Click again to go back
    await toggleButton.click();
    await page.waitForTimeout(100);
    
    // Should be back to light mode
    expect(await page.evaluate(() => document.documentElement.classList.contains('dark'))).toBe(false);
  });

  test('theme preference should persist to localStorage', async ({ page }) => {
    const toggleButton = page.locator('button.theme-toggle-btn');
    
    // Toggle to dark mode
    await toggleButton.click();
    await page.waitForTimeout(100);
    
    const storedTheme = await page.evaluate(() => {
      return localStorage.getItem('themePreference');
    });
    
    expect(storedTheme).toBe('dark');
  });

  test('should apply dark class to html element', async ({ page }) => {
    const toggleButton = page.locator('button.theme-toggle-btn');
    
    // Click to enable dark mode
    await toggleButton.click();
    
    // Wait for effect to apply
    await page.waitForTimeout(100);
    
    const hasDarkClass = await page.evaluate(() => {
      return document.documentElement.classList.contains('dark');
    });
    
    expect(hasDarkClass).toBe(true);
  });
});
