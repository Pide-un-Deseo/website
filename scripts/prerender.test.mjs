import { describe, expect, it } from "vitest";
import { resolveSiteUrl } from "./prerender.mjs";

describe("resolución de SITE_URL del prerender", () => {
  it("usa CF_PAGES_URL como fallback en main sin SITE_URL manual", () => {
    expect(
      resolveSiteUrl({
        CF_PAGES_BRANCH: "main",
        CF_PAGES_URL: "https://pideundeseo-cuba.pages.dev",
      }),
    ).toBe("https://pideundeseo-cuba.pages.dev");
  });

  it("rechaza main sin ninguna URL de producción configurada", () => {
    expect(() => resolveSiteUrl({ CF_PAGES_BRANCH: "main" })).toThrow(
      "Configura SITE_URL",
    );
  });
});
