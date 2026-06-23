import { expect, test } from "@playwright/test";

test.describe("PageCue demo recap flow", () => {
  test("landing page explains the product and links into guest mode", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(
      page.getByRole("heading", { name: "Pick up where you left off." }),
    ).toBeVisible();
    await expect(page.getByText(/spoiler boundary/i)).toBeVisible();
    await page.getByRole("link", { name: "Continue as guest" }).click();
    await expect(page).toHaveURL(/\/app$/);
  });

  test("guest can open the demo book, confirm a boundary, and generate a validated recap", async ({
    page,
  }) => {
    await page.goto("/app");
    await expect(page.getByRole("heading", { name: "My shelf" })).toBeVisible();

    const openLink = page.getByRole("link", { name: "Open" }).first();
    await openLink.click();
    await expect(
      page.getByRole("heading", { name: "The Lanternkeeper's Atlas" }),
    ).toBeVisible();

    await page.getByRole("link", { name: "Set your progress" }).click();
    await expect(
      page.getByRole("heading", { name: "Update your progress" }),
    ).toBeVisible();

    await page.getByLabel("Chapter number").fill("3");
    await expect(
      page.getByText(/Chapter 3 ends exactly at a supported boundary/i),
    ).toBeVisible();
    await page.getByRole("button", { name: "Save progress" }).click();

    await expect(page).toHaveURL(/\/library\/[^/]+$/);
    await page.getByRole("link", { name: "Resume with a recap" }).click();
    await expect(
      page.getByRole("heading", { name: "Resume with a recap" }),
    ).toBeVisible();

    await page.getByRole("radio", { name: "Quick" }).check();
    await page.getByRole("button", { name: "Generate recap" }).click();
    await expect(
      page.getByRole("heading", { name: "The story so far" }),
    ).toBeVisible({
      timeout: 10_000,
    });
    await expect(page.getByText(/End of Chapter 3/).first()).toBeVisible();

    await page.getByRole("button", { name: "Change recap length" }).click();
    await page.getByRole("radio", { name: "Detailed" }).check();
    await page.getByRole("button", { name: "Generate recap" }).click();
    await expect(
      page.getByRole("heading", { name: "The story so far" }),
    ).toBeVisible({
      timeout: 10_000,
    });
    await expect(
      page.getByRole("heading", { name: "Spoiler boundary" }),
    ).toBeVisible();

    await page.getByRole("link", { name: "Return to shelf" }).click();
    await expect(page).toHaveURL(/\/app$/);
  });

  test("guest shelf persists across a reload", async ({ page }) => {
    await page.goto("/app");
    await expect(page.getByRole("heading", { name: "My shelf" })).toBeVisible();
    await expect(page.getByText("The Lanternkeeper's Atlas")).toBeVisible();
    await page.reload();
    await expect(page.getByText("The Lanternkeeper's Atlas")).toBeVisible();
  });

  test("primary flow is keyboard reachable", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Tab");
    await expect(
      page.getByRole("link", { name: "Skip to main content" }),
    ).toBeFocused();
  });
});
