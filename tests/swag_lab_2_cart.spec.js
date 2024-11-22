// @ts-check
const { test, expect } = require('@playwright/test');


test.describe("Swag Lab - cart page tests", () => {
  test.beforeEach(async ({ page }) => {

    // login to the main page
    await page.goto("https://www.saucedemo.com/");
    await page.waitForLoadState("networkidle");
    await page.getByPlaceholder("Username").fill("standard_user");
    await page.getByPlaceholder("Password").fill("secret_sauce");
    await page.locator("#login-button").click();
    await expect(page).toHaveURL("https://www.saucedemo.com/inventory.html");
    await expect(page.locator(".shopping_cart_badge")).not.toBeVisible();

    // adding product to the cart
    await page.getByText("Add to cart").first().click();
    await expect(page.locator(".shopping_cart_badge")).toBeVisible();
    await expect(page.locator(".shopping_cart_badge")).toHaveText("1");

    // navigating to the cart page
    await page.locator(".shopping_cart_link").click();
    await expect(page).toHaveURL("https://www.saucedemo.com/cart.html");
    await expect(page.locator(".shopping_cart_badge")).toBeVisible();
    await expect(page.locator(".shopping_cart_badge")).toHaveText("1");
    await expect(page.locator(".inventory_item_name")).toHaveText("Sauce Labs Backpack");
  });


  test("SCENARIO 7: User should see the added product in their cart", async ({ page }) => {
    await test.step("GIVEN: User has logged in, added item to the cart and opened the cart page", async () => {
    });

    await test.step("WHEN: User is on the cart page", async () => {
      await expect(page).toHaveURL("https://www.saucedemo.com/cart.html");
    });

    await test.step("THEN: User can see the correct product added to the cart", async () => {
      await expect(page.locator(".inventory_item_name")).toHaveText("Sauce Labs Backpack");
      await expect(page.locator(".inventory_item_desc")).toContainText("carry.allTheThings() with the sleek, streamlined Sly Pack ");
      await expect(page.locator(".inventory_item_price")).toHaveText("$29.99");
      await expect(page.locator(".cart_quantity")).toHaveText("1");
    });
  });


  test("SCENARIO 9: User should be able to remove the added product on the cart page", async ({ page }) => {
    await test.step("GIVEN: User has logged in, added item to the cart and opened the cart page", async () => {
    });

    await test.step("WHEN: User clicks on the 'Remove' button of an item", async () => {
      await page.locator("#remove-sauce-labs-backpack").click();
    });

    await test.step("THEN: User should not have the item on the cart anymore", async () => {
      await page.waitForLoadState("networkidle");
      await expect(page.locator(".shopping_cart_badge")).not.toBeVisible();
      await expect(page.locator(".inventory_item_name")).not.toBeVisible();
      await expect(page.locator(".inventory_item_desc")).not.toBeVisible();
      await expect(page.locator(".inventory_item_price")).not.toBeVisible();
      await expect(page.locator(".cart_quantity")).not.toBeVisible();
    });
  });


  test("SCENARIO 12: User should be able to continue shopping from the cart page", async ({ page }) => {
    await test.step("GIVEN: User has logged in, added item to the cart and opened the cart page", async () => {
    });

    await test.step("WHEN: User clicks on 'Continue Shopping' button", async () => {
      await page.locator("#continue-shopping").click();
    });

    await test.step("THEN: User should be redirected to the main page (inventory page)", async () => {
      await expect(page).toHaveURL("https://www.saucedemo.com/inventory.html");
      await expect(page.locator(".title")).toHaveText("Products");
    });
  });
});
