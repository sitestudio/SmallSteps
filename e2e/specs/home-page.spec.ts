import { test, expect } from "@playwright/test";

test.describe("Home Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:4200/");
  });

  test("should display home page with title", async ({ page }) => {
    await expect(page.locator("h1")).toContainText("TinySteps");
    await expect(page.locator("p").first()).toContainText(
      "Choose a learning adventure",
    );
  });

  test("should display circular navigation menu with 5 outer buttons and center hub", async ({
    page,
  }) => {
    const circleContainer = page.locator(".circle-container");
    await expect(circleContainer).toBeVisible();

    // Check that all 5 outer nav buttons are visible (item-1 through item-5)
    const outerButtons = page.locator(
      ".nav-item.item-1, .nav-item.item-2, .nav-item.item-3, .nav-item.item-4, .nav-item.item-5",
    );
    expect(await outerButtons.count()).toBe(5);

    // Check that center hub is visible
    const centerHub = page.locator(".nav-item.item-center");
    await expect(centerHub).toBeVisible();
  });

  test("should display language & literacy subcategory buttons when clicked", async ({
    page,
  }) => {
    const langLiteracyBtn = page.locator(".nav-item.item-1 .nav-button");
    await langLiteracyBtn.click();

    const subcategoryContainer = page.locator(".subcategory-container");
    await expect(subcategoryContainer).toBeVisible();

    // Categories should be rectangular (not circular)
    const subbuttons = page.locator(".sub-nav-button-rectangular");
    expect(await subbuttons.count()).toBe(2);

    // Verify rectangular shape by checking border-radius
    const borderRadius = await subbuttons
      .first()
      .evaluate((el) =>
        window.getComputedStyle(el).getPropertyValue("border-radius"),
      );
    expect(borderRadius).not.toBe("50%"); // Should not be circular

    // Close by clicking again
    await langLiteracyBtn.click();
    await expect(subcategoryContainer).not.toBeVisible();
  });

  test("should show categories for each of the 5 navigation buttons", async ({
    page,
  }) => {
    const buttonConfigs = [
      { itemClass: "item-1", expectedCount: 2, name: "Language & Literacy" },
      { itemClass: "item-2", expectedCount: 1, name: "Maths & Numbers" },
      { itemClass: "item-3", expectedCount: 1, name: "Social/Emotional" },
      { itemClass: "item-4", expectedCount: 1, name: "Physical" },
      { itemClass: "item-5", expectedCount: 1, name: "Executive Function" },
    ];

    for (const config of buttonConfigs) {
      const btn = page.locator(`.nav-item.${config.itemClass} .nav-button`);
      await btn.click();

      const subcategoryContainer = page.locator(".subcategory-container");
      await expect(subcategoryContainer).toBeVisible();

      const subbuttons = page.locator(".sub-nav-button-rectangular");
      expect(await subbuttons.count()).toBe(config.expectedCount);

      // Close
      await btn.click();
    }
  });

  test("should allow animal selection", async ({ page }) => {
    const firstAnimal = page.locator(".animal-item").first();
    await expect(firstAnimal).toBeVisible();

    // Click to select
    await firstAnimal.click();
    await expect(firstAnimal).toHaveClass(/selected/);

    // Click again to deselect
    await firstAnimal.click();
    await expect(firstAnimal).not.toHaveClass(/selected/);
  });

  test("animal selection should persist in localStorage", async ({ page }) => {
    const firstAnimal = page.locator(".animal-item").first();

    // Select an animal
    await firstAnimal.click();

    const storedSelection = await page.evaluate(() => {
      return localStorage.getItem("tinyStepsSelectedAnimal");
    });

    expect(storedSelection).not.toBeNull();
  });

  test("should show training mode checkbox", async ({ page }) => {
    const trainingCheckbox = page.locator('input[type="checkbox"]');
    await expect(trainingCheckbox).toBeVisible();
  });

  test("should have category buttons positioned higher than default (moved up on page)", async ({
    page,
  }) => {
    const settingsPanel = page.locator(".settings-panel");

    const box = await settingsPanel.boundingBox();

    expect(box!.y).toBeLessThan(100);
  });

  test("should show unchecked state for all animals by default", async ({
    page,
  }) => {
    const animalItems = page.locator(".animal-item");
    const count = await animalItems.count();

    for (let i = 0; i < count; i++) {
      expect(await animalItems.nth(i)).not.toHaveClass(/selected/);
    }
  });
});
