import { describe, expect, it } from "vitest";
import { requireAdmin } from "../server/access-auth";

const environment = {
  REVIEWS_DB: {} as never,
  REVIEWS_SITE_URL: "https://example.com",
  REVIEW_RATE_LIMIT_KEY: "test-rate-limit-key",
  ACCESS_TEAM_DOMAIN: "team.cloudflareaccess.com",
  ACCESS_AUD: "expected-audience",
  ADMIN_EMAILS: "owner@example.com",
};

describe("Cloudflare Access admin authorization", () => {
  it("fails closed if the administrator allowlist is missing", async () => {
    const response = await requireAdmin(
      new Request("https://example.com/api/admin/reviews"),
      { ...environment, ADMIN_EMAILS: "" },
    );

    expect(response?.status).toBe(503);
  });

  it("fails closed when Access still has placeholder values", async () => {
    const response = await requireAdmin(
      new Request("https://example.com/api/admin/reviews"),
      {
        ...environment,
        ACCESS_TEAM_DOMAIN: "REPLACE_WITH_TEAM.cloudflareaccess.com",
        ACCESS_AUD: "REPLACE_WITH_ACCESS_APPLICATION_AUDIENCE",
      },
    );

    expect(response?.status).toBe(503);
  });

  it("rejects mutations from a different origin before parsing credentials", async () => {
    const response = await requireAdmin(
      new Request("https://example.com/api/admin/invitations", {
        method: "POST",
        headers: { Origin: "https://attacker.example" },
      }),
      environment,
    );

    expect(response?.status).toBe(403);
  });

  it("requires a signed Access assertion for same-origin reads", async () => {
    const response = await requireAdmin(
      new Request("https://example.com/api/admin/reviews"),
      environment,
    );

    expect(response?.status).toBe(401);
  });
});
