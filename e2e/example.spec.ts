import { expect, test } from "@playwright/test";

test.describe("認証フロー", () => {
  test("未認証ユーザーはログインページにリダイレクトされる", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/login/);
  });

  test("ログインページが表示される", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByRole("button", { name: "ログイン" })).toBeVisible();
    await expect(page.getByRole("button", { name: /Google/ })).toBeVisible();
  });
});
