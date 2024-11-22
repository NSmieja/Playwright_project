// @ts-check
const { test, expect } = require('@playwright/test');


test.describe("Login page", () => {
  test("SCENARIO 1: User should be able to log in with standard user given the correct credentials.", async ({ page }) => {
    await test.step("GIVEN: User goes to the Swag Lab login page", async () => {
      await page.goto("https://www.saucedemo.com/");
      await expect(page).toHaveURL("https://www.saucedemo.com/");
    });

    await test.step("WHEN: User enters valid credentials", async () => {
      await page.getByPlaceholder("Username").fill("standard_user");
      await page.getByPlaceholder("Password").fill("secret_sauce");
      await page.locator("#login-button").click();
    });

    await test.step("THEN: User is able to log in to the Swag Lab product page", async () => {
    });
    await expect(page).toHaveURL("https://www.saucedemo.com/inventory.html");
    await expect(page.locator(".app_logo")).toHaveText("Swag Labs");
    await expect(page.locator(".title")).toHaveText("Products");
  });


  test("SCENARIO 2: User should not be able to access the e-shop inventory without logging in.", async ({ page }) => {
    await test.step("GIVEN: User wants to enter inventory page without login first", async () => {
    });

    await test.step("WHEN: User enters inventory page directly, without login", async () => {
      await page.goto("https://www.saucedemo.com/inventory.html");
    });

    await test.step("THEN: User is redirected to login page", async () => {
      await expect(page).toHaveURL("https://www.saucedemo.com/");
    });
  });


  test("SCENARIO 3: User whose access is denied (locked_out_user) should not be able to log in", async ({ page }) => {
    await test.step("GIVEN: User goes to the Swag Lab login page", async () => {
      await page.goto("https://www.saucedemo.com/");
      await expect(page).toHaveURL("https://www.saucedemo.com/");
      expect(page.locator('[data-test="error"]')).not.toBeVisible;
    });

    await test.step("WHEN: User enters valid but blocked credentials", async () => {
      await page.getByPlaceholder("Username").fill("locked_out_user");
      await page.getByPlaceholder("Password").fill("secret_sauce");
      await page.locator("#login-button").click();
    });

    await test.step("THEN: User is unable to log in to the Swag Lab product page", async () => {
      await expect(page).toHaveURL("https://www.saucedemo.com/");
      expect(page.locator('[data-test="error"]')).toBeVisible;
      await expect(page.locator('[data-test="error"]')).toContainText("Sorry, this user has been locked out.");
    });
  });
});
