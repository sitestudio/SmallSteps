import { test, expect } from "@playwright/test";

test.describe("Educator Management", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:4200/");
  });

  test("should display educator input field", async ({ page }) => {
    await expect(page.getByText("New Educator", { exact: true })).toBeVisible();
  });

  test("should add educator via input and save button", async ({ page }) => {
    await page.getByPlaceholder("Enter educator name").fill("John Smith");
    await page.getByRole("button", { name: "Save" }).click();

    await expect(page.getByText("John Smith")).toBeVisible();
  });

  test("should not add empty educator name", async ({ page }) => {
    await page.getByPlaceholder("Enter educator name").fill("   ");
    await page.getByRole("button", { name: "Save" }).click();

    await expect(page.getByText("New Educator")).toBeVisible();
  });

  test("should select educator when clicking their button", async ({
    page,
  }) => {
    await page.getByPlaceholder("Enter educator name").fill("Jane Doe");
    await page.getByRole("button", { name: "Save" }).click();

    await page.getByText("Jane Doe").click();

    await expect(page.getByText("Jane Doe")).toBeVisible();
  });

  test("should show educator as active when selected", async ({ page }) => {
    await page.getByPlaceholder("Enter educator name").fill("John Smith");
    await page.getByRole("button", { name: "Save" }).click();

    await page.getByText("John Smith").click();

    await expect(page.getByText("Active Educator")).toBeVisible();
  });

  test("should allow educator to be deselected", async ({ page }) => {
    await page.getByPlaceholder("Enter educator name").fill("Jane Doe");
    await page.getByRole("button", { name: "Save" }).click();

    await page.getByText("Jane Doe").click();
    expect(await page.locator(".educator-item.selected").count()).toBe(1);

    await page.getByText("Jane Doe").click();
    expect(await page.locator(".educator-item.selected").count()).toBe(0);
  });

  test("should persist educators to localStorage", async ({ page }) => {
    await page.getByPlaceholder("Enter educator name").fill("John Smith");
    await page.getByRole("button", { name: "Save" }).click();

    const stored = await page.evaluate(() => {
      return localStorage.getItem("tinyStepsEducators");
    });

    expect(stored).not.toBeNull();
    const educators = JSON.parse(stored!);
    expect(educators.length).toBe(1);
    expect(educators[0].name).toBe("John Smith");
  });
});
