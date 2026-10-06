import { test, expect } from "@playwright/test";

const email = process.env.EVENTHUB_EMAIL;
const password = process.env.EVENTHUB_PASSWORD;

test("Sign in with valid credentials", async ({ page }) => {
  //test.skip(
  // !email || !password,
  //"Set EVENTHUB_EMAIL and EVENTHUB_PASSWORD to run this test.",

  await page.goto("https://eventhub.rahulshettyacademy.com");

  await expect(page.getByPlaceholder("Email")).toBeVisible();
  await expect(page.getByLabel("password")).toBeVisible();
  await expect(page.getByRole("link", { name: "Register" })).toBeVisible();

  await page.getByPlaceholder("Email").fill("radha@gmail.com");
  await page.getByLabel("password").fill("Radha@123");
  await page.getByRole("button", { name: "Sign In" }).click();

  await expect(
    page.getByRole("link", { name: "Browse Events", exact: true }),
  ).toBeVisible();
});
