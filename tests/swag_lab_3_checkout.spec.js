// @ts-check
const { test, expect } = require('@playwright/test');


test.describe("Swag Lab - checkout pages tests", () => {
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

    // navigating to the checkout page (checkout-step-one)
    await page.locator("#checkout").click();
    await expect(page).toHaveURL("https://www.saucedemo.com/checkout-step-one.html");
  });


  test("SCENARIO 13: User should see the checkout overview with details such as payment, shipping info, price total", async ({ page }) => {
    await test.step("GIVEN: User has logged in, added item to the cart, opened the cart page and navigated to the checkout page", async () => {
    });

    await test.step("WHEN: User enters required data to the Information form and clicks 'Continue' button", async () => {
      await page.getByPlaceholder("First Name").fill("John");
      await page.getByPlaceholder("Last Name").fill("Doe");
      await page.getByPlaceholder("Zip/Postal Code").fill("12345");
      await page.locator("#continue").click();
    });

    await test.step("AND: User is redircted to the checkout-step-two page", async () => {
      await expect(page).toHaveURL("https://www.saucedemo.com/checkout-step-two.html");
    });

    await test.step("THEN: All the order details are visible for the user", async () => {
      await expect(page.locator(".inventory_item_name").last()).toBeVisible();
      await expect(page.locator(".inventory_item_name").last()).toHaveText("Sauce Labs Backpack");
      await expect(page.locator(".inventory_item_desc").last()).toBeVisible();
      await expect(page.locator(".inventory_item_desc").last()).toContainText("carry.allTheThings() with the sleek, streamlined Sly Pack");
      await expect(page.locator(".inventory_item_price").last()).toBeVisible();
      await expect(page.locator(".inventory_item_price").last()).toContainText("29.99");
      await expect(page.locator(".summary_value_label").first()).toContainText("SauceCard #31337");
      await expect(page.locator(".summary_value_label").last()).toContainText("Free Pony Express Delivery!");
      await expect(page.locator(".summary_subtotal_label")).toContainText("29.99");
      await expect(page.locator(".summary_tax_label")).toContainText("2.40");
      await expect(page.locator(".summary_total_label")).toContainText("32.39");
    });
  });


  test("SCENARIO 14: User should get notified when they fail to enter any of the checkout information", async ({ page }) => {
    await test.step("GIVEN: User has logged in, added item to the cart, opened the cart page and navigated to the checkout page", async () => {
    });

    // Scenario 1: missing First Name
    await test.step("WHEN: User clicks 'Continue' button without providing 'First Name' to the form field", async () => {
      await expect(page.locator(".error-message-container.error")).not.toBeVisible();
      await page.getByPlaceholder("Last Name").fill("Doe");
      await page.getByPlaceholder("Zip/Postal Code").fill("12345");
      await page.locator("#continue").click();
    });

    await test.step("THEN: User is notified that the form is invalid", async () => {
      await expect(page.locator(".error-message-container.error")).toBeVisible();
      await expect(page.locator(".error-message-container.error h3")).toHaveText("Error: First Name is required");
    });

    // Scenario 2: missing Last Name
    await test.step("WHEN: User clicks 'Continue' button without providing 'Last Name' to the form field", async () => {
      await page.reload();
      await expect(page.locator(".error-message-container.error")).not.toBeVisible();
      await page.getByPlaceholder("First Name").fill("John");
      await page.getByPlaceholder("Zip/Postal Code").fill("12345");
      await page.locator("#continue").click();
    });

    await test.step("THEN: User is notified that the form is invalid", async () => {
      await expect(page.locator(".error-message-container.error")).toBeVisible();
      await expect(page.locator(".error-message-container.error h3")).toHaveText("Error: Last Name is required");
    });

    // Scenario 3: missing zip code
    await test.step("WHEN: User clicks 'Continue' button without providing 'Zip code' to the form field", async () => {
      await page.reload();
      await expect(page.locator(".error-message-container.error")).not.toBeVisible();
      await page.getByPlaceholder("First Name").fill("John");
      await page.getByPlaceholder("Last Name").fill("Doe");
      await page.locator("#continue").click();
    });

    await test.step("THEN: User is notified that the form is invalid", async () => {
      await expect(page.locator(".error-message-container.error")).toBeVisible();
      await expect(page.locator(".error-message-container.error h3")).toHaveText("Error: Postal Code is required");
    });
  });


  test("SCENARIO 15: User should get notified after placing a successful order", async ({ page }) => {
    await test.step("GIVEN: User has logged in, added item to the cart, opened the cart page and navigated to the checkout page", async () => {
    });

    await test.step("WHEN: User enters required data to the Information form and clicks 'Continue' button", async () => {
      await page.getByPlaceholder("First Name").fill("John");
      await page.getByPlaceholder("Last Name").fill("Doe");
      await page.getByPlaceholder("Zip/Postal Code").fill("12345");
      await page.locator("#continue").click();
    });

    await test.step("AND: User is redircted to the checkout-step-two page", async () => {
      await expect(page).toHaveURL("https://www.saucedemo.com/checkout-step-two.html");
    });

    await test.step("AND: User clicks on the 'Finish' button", async () => {
      await page.locator("#finish").click();
    });

    await test.step("THEN: User is redirected to the checkout-complete page and correct test is displayed on the page", async () => {
      await expect(page).toHaveURL("https://www.saucedemo.com/checkout-complete.html");
      await expect(page.locator(".complete-header")).toHaveText("Thank you for your order!");
      await expect(page.locator(".complete-text")).toContainText("Your order has been dispatched");
    });
  });


  test("SCENARIO 16: After finishing placing an order, user should be able to return 'Back Home' and the cart icon should not have any items", async ({ page }) => {
    await test.step("GIVEN: User has logged in, added item to the cart, opened the cart page and navigated to the checkout page", async () => {
    });

    await test.step("AND: User proceeds with the order by going through checkout pages", async () => {
      await page.getByPlaceholder("First Name").fill("John");
      await page.getByPlaceholder("Last Name").fill("Doe");
      await page.getByPlaceholder("Zip/Postal Code").fill("12345");
      await page.locator("#continue").click();
      await expect(page).toHaveURL("https://www.saucedemo.com/checkout-step-two.html");
      await page.locator("#finish").click();
    });

    await test.step("WHEN: User is on the 'checkout-complete' page and clicks on 'Back Home' button", async () => {
      await expect(page).toHaveURL("https://www.saucedemo.com/checkout-complete.html");
      await page.locator("#back-to-products").click();
    });

    await test.step("THEN: User is redirected to the inventory page", async () => {
      await expect(page).toHaveURL("https://www.saucedemo.com/inventory.html");

    });

    await test.step("AND: The cart icon has no items", async () => {
      await expect(page.locator(".shopping_cart_badge")).not.toBeVisible();
    });
  });
});
