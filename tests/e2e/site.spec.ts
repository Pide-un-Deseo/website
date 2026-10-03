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
  // Horizontal lazy-loaded photos enter the viewport only as the gallery scrolls.
  for (const image of await page.locator("img:visible").all()) {
    await image.scrollIntoViewIfNeeded();
    await expect
      .poll(() =>
        image.evaluate(
          (element) =>
            (element as HTMLImageElement).complete &&
            (element as HTMLImageElement).naturalWidth > 0,
        ),
      )
      .toBe(true);
  }
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
    page.getByRole("button", { name: "Foto anterior", exact: true }),
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

test("carrusel completo y navegación ampliada sin perder el foco", async ({
  page,
}) => {
  await page.goto("/");
  const photos = page.locator(".gallery-item");
  await expect(photos).toHaveCount(14);
  const previous = page.getByRole("button", { name: "Ver fotos anteriores" });
  const next = page.getByRole("button", { name: "Ver fotos siguientes" });
  await expect(previous).toBeDisabled();
  await next.click();
  await expect(previous).toBeEnabled();
  await photos.last().focus();
  await expect(next).toBeDisabled();
  await photos.last().press("Enter");
  const dialog = page.getByRole("dialog");
  await expect(dialog.getByRole("status")).toHaveText("Foto 14 de 14");
  const close = page.getByRole("button", { name: "Cerrar fotografía" });
  await expect(close).toBeFocused();
  await page.keyboard.press("ArrowLeft");
  await expect(dialog.getByRole("status")).toHaveText("Foto 13 de 14");
  await expect(close).toBeFocused();
  await page.keyboard.press("ArrowRight");
  await page.keyboard.press("ArrowRight");
  await expect(dialog.getByRole("status")).toHaveText("Foto 14 de 14");
  await page.keyboard.press("Shift+Tab");
  await expect(
    page.getByRole("button", { name: "Foto siguiente", exact: true }),
  ).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(close).toBeFocused();
  for (let index = 13; index > 0; index--) {
    await page
      .getByRole("button", { name: "Foto anterior", exact: true })
      .click();
  }
  await expect(dialog.getByRole("status")).toHaveText("Foto 1 de 14");
  await page.keyboard.press("ArrowLeft");
  await expect(dialog.getByRole("status")).toHaveText("Foto 1 de 14");
  await close.click();
  await expect(photos.last()).toBeFocused();
  await expect(dialog).not.toBeVisible();
});

test("todas las fotos tienen recursos válidos y acceso sin JavaScript", async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:4173/");
  const photos = page.locator(".gallery-item");
  await expect(photos).toHaveCount(14);
  const hrefs = await photos.evaluateAll((items) =>
    items.map((item) => (item as HTMLAnchorElement).href),
  );
  expect(new Set(hrefs).size).toBe(14);
  for (const photo of await photos.all()) {
    await photo.scrollIntoViewIfNeeded();
    await expect(photo).toBeInViewport();
    await expect
      .poll(() =>
        photo
          .locator("img")
          .evaluate(
            (image) =>
              (image as HTMLImageElement).complete &&
              (image as HTMLImageElement).naturalWidth > 0,
          ),
      )
      .toBe(true);
  }
  await photos.last().click();
  await expect(page).toHaveURL(/moana-1200.webp$/);
  await context.close();
});
