import { expect, test } from "@playwright/test";

test.describe("PageCue settings and about", () => {
  test("settings page explains data storage and can toggle theme", async ({
    page,
  }) => {
    await page.goto("/settings");
    await expect(page.getByRole("heading", { name: "Settings" })).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Your data" }),
    ).toBeVisible();
    await expect(page.getByText(/stored only in this browser/i)).toBeVisible();

    await page
      .locator("main")
      .getByRole("button", { name: /light mode|dark mode/i })
      .click();
    await expect(page.locator("html")).toHaveClass(/dark/);
  });

  test("resetting demo data clears the shelf back to just the demo book", async ({
    page,
  }) => {
    await page.goto("/search");
    await page.getByLabel("Title, author, or ISBN").fill("cartographer");
    await page.getByRole("button", { name: "Search" }).click();
    await page.getByRole("button", { name: "Add to shelf" }).click();

    await page.goto("/app");
    await expect(page.getByText("The Cartographer's Silence")).toBeVisible();

    await page.goto("/settings");
    page.once("dialog", (dialog) => dialog.accept());
    await page.getByRole("button", { name: "Reset demo data" }).click();

    await expect(page).toHaveURL(/\/app$/);
    await expect(page.getByText("The Cartographer's Silence")).toHaveCount(0);
    await expect(page.getByText("The Lanternkeeper's Atlas")).toBeVisible();
  });

  test("about page explains spoiler safety and links back to the shelf", async ({
    page,
  }) => {
    await page.goto("/about");
    await expect(
      page.getByRole("heading", { name: "About PageCue" }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "How the spoiler boundary works" }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "A note on copyright" }),
    ).toBeVisible();

    await page.getByRole("link", { name: "Open my shelf" }).click();
    await expect(page).toHaveURL(/\/app$/);
  });

  test("footer and header link to about and settings", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "Learn more" }).click();
    await expect(page).toHaveURL(/\/about$/);

    await page
      .getByLabel("Primary")
      .getByRole("link", { name: "Settings" })
      .click();
    await expect(page).toHaveURL(/\/settings$/);
  });
});
