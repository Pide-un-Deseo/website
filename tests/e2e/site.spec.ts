import { test, expect } from "@playwright/test";
test("contenido, recursos y contacto sin errores de navegador", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  const failedAssets: string[] = [];
  page.on("response", (response) => {
    if (
      response.url().startsWith("http://127.0.0.1") &&
      response.status() >= 400
    )
      failedAssets.push(response.url());
  });
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Un recuerdo",
  );
  await expect(page.locator(".character-card")).toHaveCount(10);
  await expect(page.locator(".character-photo-blank")).toHaveCount(4);
  await expect(
    page.getByRole("link", {
      name: "Quiero conocer más sobre Huntrix en WhatsApp",
    }),
  ).toHaveAttribute("href", /https:\/\/wa\.me\/5353893363\?text=/);
  for (const section of [
    "#personajes",
    "#servicios",
    "#eventos",
    "#galeria",
    "#nosotras",
    "#reservas",
    "#contacto",
  ])
    await page.locator(section).scrollIntoViewIfNeeded();
  await page.waitForLoadState("networkidle");
  expect(
    await page
      .locator("img:visible")
      .evaluateAll((images) =>
        images.every(
          (image) =>
            (image as HTMLImageElement).complete &&
            (image as HTMLImageElement).naturalWidth > 0,
        ),
      ),
  ).toBe(true);
  expect(errors).toEqual([]);
  expect(failedAssets).toEqual([]);
});
test("galería accesible con Escape y retorno del foco", async ({ page }) => {
  await page.goto("/");
  const opener = page.locator(".gallery-item").first();
  await opener.click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Cerrar fotografía" }),
  ).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("button", { name: "Cerrar fotografía" }),
  ).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await expect(opener).toBeFocused();
});
test("preguntas frecuentes operables por teclado", async ({ page }) => {
  await page.goto("/");
  const question = page.getByText("¿Con cuánto tiempo debo contactar?", {
    exact: true,
  });
  await question.focus();
  await page.keyboard.press("Enter");
  await expect(
    page.getByText(/Recomendamos escribirnos con un mes/),
  ).toBeVisible();
});
test("menú móvil enlaza a la sección y se cierra", async ({
  page,
  isMobile,
}) => {
  test.skip(!isMobile);
  await page.goto("/");
  await page.locator(".mobile-menu summary").click();
  await page
    .getByRole("navigation", { name: "Navegación móvil" })
    .getByRole("link", { name: "Personajes" })
    .click();
  await expect(page).toHaveURL(/#personajes$/);
  await expect(page.locator(".mobile-menu")).not.toHaveAttribute("open");
});
test("no hay desbordamiento en los tamaños acordados", async ({ page }) => {
  for (const width of [360, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
  }
});
test("contenido y enlaces esenciales sin JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:4173/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(
    page.getByRole("link", {
      name: "Quiero conocer más sobre Ariel en WhatsApp",
    }),
  ).toHaveAttribute("href", /wa.me\/5353893363/);
  await page.getByText("¿En qué zonas trabajan?", { exact: true }).click();
  await expect(
    page.getByText(/Tenemos nuestra sede en La Habana Vieja/),
  ).toBeVisible();
  await context.close();
});
