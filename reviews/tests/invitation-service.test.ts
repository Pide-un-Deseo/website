import { describe, expect, it } from "vitest";
import {
  createInvitationToken,
  decryptInvitationToken,
  encryptInvitationToken,
  hashInvitationToken,
} from "../domain/invitation-token";
import {
  createInvitation,
  deleteRevokedInvitation,
  listInvitations,
  ReviewsConfigurationError,
  submitReview,
} from "../server/review-service";
import type { ReviewsDatabase } from "../storage/d1-store";

function stubDatabase(
  options: {
    invitationExists?: boolean;
    changes?: number;
    invitations?: {
      id: string;
      status: "active" | "used" | "revoked";
      created_at: string;
      expires_at: string;
      token_ciphertext: string | null;
    }[];
  } = {},
) {
  const calls: Array<{ query: string; values: unknown[] }> = [];
  const database: ReviewsDatabase = {
    prepare(query) {
      const call = { query, values: [] as unknown[] };
      calls.push(call);
      const statement = {
        bind(...values: unknown[]) {
          call.values = values;
          return statement;
        },
        async first<T>() {
          return (
            options.invitationExists ? { id: "invitation-1" } : null
          ) as T | null;
        },
        async all<T>() {
          return {
            results: (options.invitations ?? []) as T[],
            meta: { changes: 0 },
            success: true,
          };
        },
        async run() {
          return {
            results: [],
            meta: { changes: options.changes ?? 1 },
            success: true,
          };
        },
      };
      return statement;
    },
    async batch() {
      return [
        { results: [], meta: { changes: 1 }, success: true },
        { results: [], meta: { changes: 1 }, success: true },
      ];
    },
  };
  return { database, calls };
}

describe("invitation service", () => {
  it("deletes revoked invitations only", async () => {
    const { database, calls } = stubDatabase();

    await expect(
      deleteRevokedInvitation(database, "invitation-1"),
    ).resolves.toBe(true);
    expect(calls[0].query).toContain("DELETE FROM review_invitations");
    expect(calls[0].query).toContain("status = 'revoked'");
    expect(calls[0].values).toEqual(["invitation-1"]);
  });

  it("does not report deletion when the invitation is not revoked", async () => {
    const { database } = stubDatabase({ changes: 0 });

    await expect(
      deleteRevokedInvitation(database, "invitation-1"),
    ).resolves.toBe(false);
  });

  it("returns an active invitation's original link without exposing ciphertext", async () => {
    const secret = "test-invitation-encryption-key-0123456789";
    const token = createInvitationToken();
    const { database } = stubDatabase({
      invitations: [
        {
          id: "invitation-1",
          status: "active",
          created_at: "2026-01-01T00:00:00.000Z",
          expires_at: "2026-01-31T00:00:00.000Z",
          token_ciphertext: await encryptInvitationToken(token, secret),
        },
      ],
    });

    const [invitation] = await listInvitations(
      database,
      "https://pideundeseo-cuba.pages.dev",
      secret,
      new Date("2026-01-02T00:00:00.000Z"),
    );

    expect(invitation.url).toBe(
      `https://pideundeseo-cuba.pages.dev/resena#token=${token}`,
    );
    expect(invitation).not.toHaveProperty("encryptedToken");
    expect(invitation).not.toHaveProperty("token_ciphertext");
  });

  it("returns a fragment link and persists a hash plus encrypted token", async () => {
    const { database, calls } = stubDatabase();
    const encryptionSecret = "test-invitation-encryption-key-0123456789";
    const invitation = await createInvitation(
      database,
      "https://pideundeseo-cuba.pages.dev",
      encryptionSecret,
      new Date("2026-01-01T00:00:00.000Z"),
      30,
    );
    const token = new URLSearchParams(invitation.url.split("#")[1]).get(
      "token",
    );
    const savedValues = calls[0].values;

    expect(new URL(invitation.url).pathname).toBe("/resena");
    expect(new URL(invitation.url).search).toBe("");
    expect(token).toMatch(/^[A-Za-z0-9_-]{43}$/u);
    expect(savedValues[1]).toBe(await hashInvitationToken(token!));
    expect(savedValues[1]).not.toBe(token);
    expect(savedValues[2]).not.toBe(token);
    await expect(
      decryptInvitationToken(String(savedValues[2]), encryptionSecret),
    ).resolves.toBe(token);
    expect(invitation.expiresAt).toBe("2026-01-31T00:00:00.000Z");
  });

  it("refuses non-HTTPS public origins", async () => {
    const { database, calls } = stubDatabase();
    await expect(
      createInvitation(
        database,
        "http://public.example",
        "test-invitation-encryption-key-0123456789",
      ),
    ).rejects.toBeInstanceOf(ReviewsConfigurationError);
    expect(calls).toHaveLength(0);
  });

  it("does not touch D1 for a review rejected by server-side filters", async () => {
    const { database, calls } = stubDatabase({ invitationExists: true });
    await expect(
      submitReview(database, {
        token: "a".repeat(43),
        firstName: "Rosa",
        rating: 5,
        text: "Contáctame en rosa@example.com para reservar.",
        consent: true,
      }),
    ).rejects.toThrow(/Quita teléfonos, correos/);
    expect(calls).toHaveLength(0);
  });

  it("publishes a valid review through the atomic invitation operation", async () => {
    const { database, calls } = stubDatabase({ invitationExists: true });
    const result = await submitReview(
      database,
      {
        token: "a".repeat(43),
        firstName: "María",
        rating: 5,
        text: "La animadora fue puntual y muy cariñosa con toda la familia.",
        consent: true,
      },
      new Date("2026-01-02T00:00:00.000Z"),
    );

    expect(result).toEqual({ id: expect.any(String), published: true });
    expect(calls[0].query).toContain("token_hash = ?");
  });
});
