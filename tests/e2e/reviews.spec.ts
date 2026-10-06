import { expect, test } from "@playwright/test";

test("API pública solo devuelve el resumen de reseñas visibles", async ({
  request,
}) => {
  const response = await request.get("/api/reviews");
  expect(response.ok()).toBe(true);
  await expect(response).toBeOK();
  const body = await response.json();
  expect(Array.isArray(body.reviews)).toBe(true);
  expect(body.count).toBeGreaterThanOrEqual(body.reviews.length);
  expect(typeof body.average).toBe("number");
  expect(
    body.reviews.every((review: { status?: string }) => !("status" in review)),
  ).toBe(true);
});

test("formulario limpia el fragmento y conserva el error de token inválido", async ({
  page,
}) => {
  await page.goto(`/resena#token=${"a".repeat(43)}`);
  await expect(
    page.getByRole("heading", { name: "Cuéntanos cómo fue." }),
  ).toBeVisible();
  await expect(page).toHaveURL(/\/resena$/u);

  await page.getByRole("radio", { name: "5 estrellas" }).check();
  await page.getByLabel("Tu nombre de pila").fill("Rosa");
  await page
    .getByLabel("Tu reseña")
    .fill("La animadora fue puntual y muy cariñosa con toda la familia.");
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Publicar reseña" }).click();

  await expect(
    page
      .getByRole("alert")
      .getByText(/no es válido, venció o ya fue utilizado/),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Publicar reseña" }),
  ).toBeEnabled();
});

test("panel y endpoints administrativos fallan cerrados sin Access", async ({
  page,
  request,
}) => {
  const apiResponse = await request.get("/api/admin/invitations");
  expect([401, 503]).toContain(apiResponse.status());

  await page.goto("/admin");
  await expect(
    page.getByRole("heading", { name: "Administración de reseñas" }),
  ).toBeVisible();
  await expect(page.getByRole("alert")).toContainText(
    /El acceso administrativo no está configurado|Inicia sesión para continuar/,
  );
});
