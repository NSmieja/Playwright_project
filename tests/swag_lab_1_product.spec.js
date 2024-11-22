// @ts-check
const { test, expect } = require('@playwright/test');


test.describe("Inventory and single product page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("https://www.saucedemo.com/");
    await page.waitForLoadState("networkidle");
    await page.getByPlaceholder("Username").fill("standard_user");
    await page.getByPlaceholder("Password").fill("secret_sauce");
    await page.locator("#login-button").click();
  });


  test("SCENARIO 4: User should be logged out once Logout button is pressed", async ({ page }) => {
    await test.step("GIVEN: User is logged in and is on the main page", async () => {
      await expect(page).toHaveURL("https://www.saucedemo.com/inventory.html");
    });

    await test.step("WHEN: User cliks on logout link", async () => {
      await page.locator("#react-burger-menu-btn").click();
      await page.locator("#logout_sidebar_link").click();
    });

    await test.step("THEN: User is redirected to login page", async () => {
      await expect(page).toHaveURL("https://www.saucedemo.com/");
    });

    await test.step("AND: User cannot access inventory page without login first", async () => {
      await page.goto("https://www.saucedemo.com/inventory.html");
      await expect(page).toHaveURL("https://www.saucedemo.com/");
    });
  });


  test("SCENARIO 5: User should be able to filter the inventory according to the option chosen", async ({ page }) => {
    const sortDropdownLocator = page.locator('.product_sort_container');

    await test.step("GIVEN: User is logged in and is on the main page", async () => {
      await expect(page).toHaveURL("https://www.saucedemo.com/inventory.html");
    });

    // Scenario: price low to high
    await test.step("WHEN: User clicks on the sorting selector", async () => {
      await page.locator(".product_sort_container").click();
    });

    await test.step("AND: User chooses to sort by Price (low to high)", async () => {
      await sortDropdownLocator.selectOption({ value: 'lohi' });
    });

    await test.step("THEN: Products on the page ale sorted by the price", async () => {
      await expect(page.locator(".inventory_item_name").first()).toHaveText("Sauce Labs Onesie");
      await expect(page.locator(".inventory_item_price").first()).toContainText("7.99");
    });

    // Scenario: price high to low
    await test.step("WHEN: User clicks on the sorting selector", async () => {
      await page.locator(".product_sort_container").click();
    });

    await test.step("AND: User chooses to sort by Price (high to low)", async () => {
      await sortDropdownLocator.selectOption({ value: 'hilo' });
    });

    await test.step("THEN: Products on the page ale sorted by the price", async () => {
      await expect(page.locator(".inventory_item_name").first()).toHaveText("Sauce Labs Fleece Jacket");
      await expect(page.locator(".inventory_item_price").first()).toContainText("49.99");
    });

    // Scenario: name z to a
    await test.step("WHEN: User clicks on the sorting selector", async () => {
      await page.locator(".product_sort_container").click();
    });

    await test.step("AND: User chooses to sort by Name (Z to A)", async () => {
      await sortDropdownLocator.selectOption({ value: 'za' });
    });

    await test.step("THEN: Products on the page are sorted by the name", async () => {
      await expect(page.locator(".inventory_item_name").first()).toHaveText("Test.allTheThings() T-Shirt (Red)");
      await expect(page.locator(".inventory_item_price").first()).toContainText("15.99");
    });

    // Scenario: name a to z
    await test.step("WHEN: User clicks on the sorting selector", async () => {
      await page.locator(".product_sort_container").click();
    });

    await test.step("AND: User chooses to sort by Name (A to Z)", async () => {
      await sortDropdownLocator.selectOption({ value: 'az' });
    });

    await test.step("THEN: Products on the page ale sorted by the name", async () => {
      await expect(page.locator(".inventory_item_name").first()).toHaveText("Sauce Labs Backpack");
      await expect(page.locator(".inventory_item_price").first()).toContainText("29.99");
    });
  });


  test("SCENARIO 6: User should see the correct product details such as image, product name, description and price", async ({ page }) => {
    await test.step("GIVEN: User is logged in and is on the main page", async () => {
      await expect(page).toHaveURL("https://www.saucedemo.com/inventory.html");
    });

    await test.step("WHEN: User observes the product on the main page", async () => {
    });

    await test.step("THEN: All the product details (image, title, description and price) are visible for the user", async () => {
      await expect(page.locator(".inventory_item_img").last()).toBeVisible();
      await expect(page.locator(".inventory_item_name").last()).toBeVisible();
      await expect(page.locator(".inventory_item_name").last()).toHaveText("Test.allTheThings() T-Shirt (Red)");
      await expect(page.locator(".inventory_item_desc").last()).toBeVisible();
      await expect(page.locator(".inventory_item_desc").last()).toContainText("This classic Sauce Labs t-shirt is perfect to wear when cozying");
      await expect(page.locator(".inventory_item_price").last()).toBeVisible();
      await expect(page.locator(".inventory_item_price").last()).toContainText("15.99");
    });
  });


  test("SCENARIO 8: User should see the cart icon update accordingly when adding a product to the cart", async ({ page }) => {
    await test.step("GIVEN: User is logged in and is on the main page", async () => {
      await expect(page).toHaveURL("https://www.saucedemo.com/inventory.html");
    });

    await test.step("WHEN: User adds a product to the cart", async () => {
      await expect(page.locator(".shopping_cart_badge")).not.toBeVisible();
      await page.getByText("Add to cart").first().click();
    });

    await test.step("THEN: User can see the basket icon has number of added products to the cart", async () => {
      await expect(page.locator(".shopping_cart_badge")).toBeVisible();
      await expect(page.locator(".shopping_cart_badge")).toHaveText("1");
    });
  });


  test("SCENARIO 10: User should be able to remove the added product from cart on the inventory page", async ({ page }) => {
    await test.step("GIVEN: User is logged in and is on the main page", async () => {
      await expect(page).toHaveURL("https://www.saucedemo.com/inventory.html");
    });

    await test.step("WHEN: User adds a product to the cart", async () => {
      expect(page.locator("#remove-sauce-labs-backpack")).not.toBeVisible();
      expect(await page.locator(".btn.btn_secondary.btn_small.btn_inventory").count()).toBe(0);
      await page.getByText("Add to cart").first().click();
    });

    await test.step("THEN: User can see the 'Remove' button instead of 'Add to cart' button next to the added product", async () => {
      expect(page.locator("#remove-sauce-labs-backpack")).toBeVisible();
      expect(await page.locator(".btn.btn_secondary.btn_small.btn_inventory").count()).toBe(1);
    });

    await test.step("AND: User can remove the product from the cart by clicking 'Remove' button", async () => {
      await page.locator("#remove-sauce-labs-backpack").click();
      expect(page.locator("#remove-sauce-labs-backpack")).not.toBeVisible();
      expect(await page.locator(".btn.btn_secondary.btn_small.btn_inventory").count()).toBe(0);
    });
  });


  test("SCENARIO 11: User should be able to remove the added product from cart on the specific product page", async ({ page }) => {
    await test.step("GIVEN: User is logged in and is on the main page", async () => {
      await expect(page).toHaveURL("https://www.saucedemo.com/inventory.html");
    });

    await test.step("AND: User adds a product to the cart", async () => {
      expect(page.locator("#remove-sauce-labs-backpack")).not.toBeVisible();
      expect(await page.locator(".btn.btn_secondary.btn_small.btn_inventory").count()).toBe(0);
      await page.getByText("Add to cart").first().click();
    });

    await test.step("AND: User navigates to the product page", async () => {
      await page.locator("#item_4_title_link").click();
      await expect(page).toHaveURL("https://www.saucedemo.com/inventory-item.html?id=4");
    });

    await test.step("THEN: User can remove product from the cart by clicking 'Remove' button", async () => {
      await expect(page.locator("#add-to-cart")).not.toBeVisible();
      await expect(page.locator("#remove")).toBeVisible();
      await expect(page.locator(".shopping_cart_badge")).toBeVisible();
      await expect(page.locator(".shopping_cart_badge")).toHaveText("1");

      await page.locator("#remove").click();

      await expect(page.locator("#add-to-cart")).toBeVisible();
      await expect(page.locator("#remove")).not.toBeVisible();
      await expect(page.locator(".shopping_cart_badge")).not.toBeVisible();
    });
  });


  test("SCENARIO 17: User can navigate to Twitter (X) page by clicking on the bird icon", async ({ browser }) => {

    // Note: link to external page opens in a new tab (new page)

    const context = await browser.newContext();

    console.log("GIVEN: User is logged in and is on the main page");
    const page = await context.newPage();
    await page.goto("https://www.saucedemo.com/");
    await page.waitForLoadState("networkidle");
    await page.getByPlaceholder("Username").fill("standard_user");
    await page.getByPlaceholder("Password").fill("secret_sauce");
    await page.locator("#login-button").click();
    await page.goto("https://www.saucedemo.com/inventory.html");
    await expect(page).toHaveURL("https://www.saucedemo.com/inventory.html");


    console.log("WHEN:: User clicks on the 'bird' icon");
    let twitterLink = page.locator("[data-test='social-twitter']");
    const [newPage] = await Promise.all(
      [
        context.waitForEvent("page"),  // listen for any new pages to open
        twitterLink.click(),  // opens link to a new page in separate window
      ]
    )

    console.log("THEN: User is redirected to the Twitter page");
    await expect(newPage).toHaveURL("https://x.com/saucelabs");

  });
});
