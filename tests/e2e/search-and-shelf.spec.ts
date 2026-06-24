import { expect, test } from "@playwright/test";

test.describe("PageCue search and shelf management", () => {
  test("searching for the demo book shows it as already on the shelf", async ({
    page,
  }) => {
    await page.goto("/search");
    await page.getByLabel("Title, author, or ISBN").fill("lanternkeeper");
    await page.getByRole("button", { name: "Search" }).click();
    await expect(page.getByText("The Lanternkeeper's Atlas")).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Already on shelf" }),
    ).toBeVisible();
  });

  test("can add a book from search and see it on the shelf, then remove it", async ({
    page,
  }) => {
    await page.goto("/search");
    await page.getByLabel("Title, author, or ISBN").fill("cartographer");
    await page.getByRole("button", { name: "Search" }).click();
    await expect(page.getByText("The Cartographer's Silence")).toBeVisible();

    await page.getByRole("button", { name: "Add to shelf" }).click();
    await expect(
      page.getByRole("button", { name: "Already on shelf" }),
    ).toBeVisible();

    await page.goto("/app");
    await expect(page.getByText("The Cartographer's Silence")).toBeVisible();

    page.once("dialog", (dialog) => dialog.accept());
    await page
      .locator("li", { hasText: "The Cartographer's Silence" })
      .getByRole("button", { name: "Remove" })
      .click();
    await expect(page.getByText("The Cartographer's Silence")).toHaveCount(0);
  });

  test("an ISBN search finds the matching title", async ({ page }) => {
    await page.goto("/search");
    await page.getByLabel("Title, author, or ISBN").fill("978-0-306-40615-7");
    await page.getByRole("button", { name: "Search" }).click();
    await expect(page.getByText("The Cartographer's Silence")).toBeVisible();
  });

  test("a multi-edition title surfaces an edition-ambiguity warning for each edition", async ({
    page,
  }) => {
    await page.goto("/search");
    await page.getByLabel("Title, author, or ISBN").fill("the quiet algorithm");
    await page.getByRole("button", { name: "Search" }).click();
    await expect(page.getByText(/Multiple editions/i)).toHaveCount(2);
  });

  test("an unmatched search shows an honest empty state", async ({ page }) => {
    await page.goto("/search");
    await page
      .getByLabel("Title, author, or ISBN")
      .fill("nonexistent title xyz");
    await page.getByRole("button", { name: "Search" }).click();
    await expect(page.getByText("No results for that search.")).toBeVisible();
  });

  test("removing the demo book from its detail page returns to the shelf", async ({
    page,
  }) => {
    await page.goto("/app");
    await page.getByRole("link", { name: "Open" }).first().click();
    await expect(
      page.getByRole("heading", { name: "The Lanternkeeper's Atlas" }),
    ).toBeVisible();

    page.once("dialog", (dialog) => dialog.accept());
    await page.getByRole("button", { name: "Remove from shelf" }).click();
    await expect(page).toHaveURL(/\/app$/);
    await expect(page.getByText("Your shelf is empty.")).toBeVisible();
  });
});
