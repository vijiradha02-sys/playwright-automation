import { test, expect } from "@playwright/test";
test("Eventhub test", async ({ page }) => {
  //step 1:Login
  await page.goto("https://eventhub.rahulshettyacademy.com");
  await page.getByPlaceholder("Email").fill("radha@gmail.com");
  await page.getByLabel("password").fill("Radha@123");
  await page.getByRole("button", { name: "Sign In" }).click();
  await page.getByRole("link", { name: "Browse Events" }).isVisible();

  //step 2: create a new event
  await page.getByRole("button", { name: "Admin" }).click();
  await page.locator(".relative").first().waitFor();
  await page.getByRole("link", { name: "Manage Events" }).nth(1).click();
  const eventName = "workshopAI_" + Date.now();
  await page.locator("input#event-title-input").fill(eventName);
  await page
    .locator("#admin-event-form textarea")
    .fill("Annual tech Workshop.!");
  await page.getByLabel("City").fill("Chennai");
  await page.getByLabel("Venue").fill("Anna Conference Hall Guindy");
  /* const now = new Date();
  const futureDate = new Date(now);
  futureDate.setDate(now.getDate() + 5);
  futureDate.setHours(23, 45); // 11:45 PM
  // Format as YYYY-MM-DDTHH:MM (required for datetime-local)
  const formatted = futureDate.toISOString().slice(0, 16);
  // Fill the input field by id (escape & in selector)
  await page.fill("#event-date-\\&-time", formatted);*/
  await page.getByLabel("Event Date & Time").fill("2026-10-22T21:00");
  await page.getByLabel("Price ($)").fill("100");
  await page.getByLabel("Total Seats").fill("50");
  await page.getByRole("button", { name: "+ Add Event" }).click();
  await expect(page.getByText("Event created!")).toBeVisible();

  //step 3:Find Event cards and capture seats
  await page.getByRole("link", { name: "Events" }).nth(0).click();
  await expect(
    page.locator('[data-testid="event-card"]').first(),
  ).toBeVisible();

  const eventCard = page
    .locator('[data-testid="event-card"]')
    .filter({ hasText: eventName });

  await expect(eventCard).toBeVisible();

  const seatsBeforeText = await eventCard
    .locator("span.text-emerald-600")
    .textContent();

  //converting seat text string to number first .
  const seatsBeforeBooking = parseInt(seatsBeforeText ?? "0", 10);

  console.log(seatsBeforeBooking);

  //step: 4 #start booking
  await page
    .locator('[data-testid="event-card"]')
    .filter({ hasText: eventName })
    .locator('[data-testid="book-now-btn"]')
    .click();

  //step 5: fill booking form
  await expect(page.locator("#ticket-count").getByText("1")).toBeVisible();
  await page.getByLabel("Full Name").fill("Radha");
  await page.getByTestId("customer-email").fill("vijiradha02@gmail.com");
  await page.getByPlaceholder("+91 98765 43210").fill("9840667638");
  await page.locator(".confirm-booking-btn").click();

  //step 6:Verify booking confirmation
  await expect(page.locator(".booking-ref").first()).toBeVisible();
  const bookingRef = (await page.locator(".booking-ref").innerText()).trim();
  console.log(bookingRef);

  //step 7: Verify in My Bookings
  await page.getByRole("button", { name: "View My Bookings" }).click();
  await expect(page).toHaveURL(
    "https://eventhub.rahulshettyacademy.com/bookings",
  );
  await expect(
    page.locator('[data-testid="booking-card"]').first(),
  ).toBeVisible();
  await expect(
    page
      .locator('[data-testid="booking-card"]')
      .filter({ hasText: bookingRef }),
  ).toBeVisible();
  await expect(
    page.locator('[data-testid="booking-card"]').filter({ hasText: eventName }),
  ).toBeVisible();

  //step 8:Verify seat reduction
  await page.getByRole("link", { name: "Events" }).nth(0).click();
  await expect(
    page.locator('[data-testid="event-card"]').first(),
  ).toBeVisible();

  await expect(
    page.locator('[data-testid="event-card"]').filter({ hasText: eventName }),
  ).toBeVisible();
  await page.reload();
  const seatsAfterText = await page
    .locator('[data-testid="event-card"]')
    .filter({ hasText: eventName })
    .getByText("seat")
    .textContent();

  const seatsAfterBooking = parseInt(seatsAfterText ?? "0", 10);

  expect(seatsAfterBooking).toBe(seatsBeforeBooking - 1);
  console.log(seatsAfterBooking);
});
