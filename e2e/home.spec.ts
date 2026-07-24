import { expect, test } from "@playwright/test";

test("presents the Pill.it product foundation", async ({ page }) => {
  const response = await page.goto("/");

  expect(response?.status()).toBe(200);
  await expect(page).toHaveTitle("Pill.it");
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: /uma rotina que você não precisa guardar só na memória/i,
    }),
  ).toBeVisible();

  await page.getByRole("link", { name: /conheça a proposta/i }).click();

  await expect(page.locator("#proposta")).toBeInViewport();
  await expect(
    page.getByText(/não oferece diagnóstico, prescrição ou orientação clínica/i),
  ).toBeVisible();
});

test("returns the baseline security headers", async ({ page }) => {
  const response = await page.goto("/");
  const headers = response?.headers();

  expect(headers?.["permissions-policy"]).toBe(
    "camera=(), geolocation=(), microphone=()",
  );
  expect(headers?.["referrer-policy"]).toBe("strict-origin-when-cross-origin");
  expect(headers?.["x-content-type-options"]).toBe("nosniff");
  expect(headers?.["x-frame-options"]).toBe("DENY");
});
