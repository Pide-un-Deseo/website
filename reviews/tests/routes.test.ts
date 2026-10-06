import { describe, expect, it } from "vitest";
import { resolveReviewsRoute } from "../frontend/routes";

describe("review routes", () => {
  it.each([
    ["/resena", "review-form"],
    ["/resena/", "review-form"],
    ["/admin", "admin"],
    ["/admin/", "admin"],
    ["/", null],
    ["/ruta-inexistente", null],
  ] as const)("resolves %s", (pathname, expected) => {
    expect(resolveReviewsRoute(pathname)).toBe(expected);
  });
});
