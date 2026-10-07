import { describe, expect, it } from "vitest";
import {
  createInvitationToken,
  decryptInvitationToken,
  encryptInvitationToken,
  hashInvitationToken,
} from "../domain/invitation-token";
import { parseReviewSubmission, ReviewInputError } from "../domain/review";

const validSubmission = {
  token: "a".repeat(43),
  firstName: "María",
  rating: 5,
  text: "La animadora fue puntual y muy cariñosa con toda la familia.",
  consent: true,
};

describe("review input", () => {
  it("normalizes whitespace and accepts a valid five-star review", () => {
    expect(
      parseReviewSubmission({
        ...validSubmission,
        text: ` ${validSubmission.text} `,
      }),
    ).toMatchObject({ firstName: "María", rating: 5, consent: true });
  });

  it("allows general city references", () => {
    expect(() =>
      parseReviewSubmission({
        ...validSubmission,
        text: "Vivimos en La Habana y la celebración fue muy especial.",
      }),
    ).not.toThrow();
  });

  it.each([0, 6, 2.5, "5"])('rejects invalid rating "%s"', (rating) => {
    expect(() => parseReviewSubmission({ ...validSubmission, rating })).toThrow(
      ReviewInputError,
    );
  });

  it.each([
    "Escríbeme a cliente@example.com para darte más detalles.",
    "Llama al +53 5389 3363 para hablar conmigo.",
    "Mira https://example.com para ver más.",
    "Vivo en calle 23 número 14, reparto Centro.",
  ])("rejects personal information or links", (text) => {
    expect(() => parseReviewSubmission({ ...validSubmission, text })).toThrow(
      ReviewInputError,
    );
  });

  it("rejects abusive content without storing it", () => {
    expect(() =>
      parseReviewSubmission({
        ...validSubmission,
        text: "La animadora fue una persona idiota durante la actividad.",
      }),
    ).toThrowError(/Revisa el lenguaje/);
  });

  it("requires explicit consent and a first name", () => {
    expect(() =>
      parseReviewSubmission({ ...validSubmission, consent: false }),
    ).toThrow(ReviewInputError);
    expect(() =>
      parseReviewSubmission({ ...validSubmission, firstName: "" }),
    ).toThrow(ReviewInputError);
  });
});

describe("invitation tokens", () => {
  it("creates unique high-entropy URL-safe tokens and stores only a hash", async () => {
    const first = createInvitationToken();
    const second = createInvitationToken();
    const hash = await hashInvitationToken(first);

    expect(first).toMatch(/^[A-Za-z0-9_-]{43}$/u);
    expect(second).not.toBe(first);
    expect(hash).toMatch(/^[a-f0-9]{64}$/u);
    expect(hash).not.toContain(first);
    expect(await hashInvitationToken(first)).toBe(hash);
  });

  it("encrypts recoverable tokens and rejects the wrong key", async () => {
    const token = createInvitationToken();
    const secret = "test-invitation-encryption-key-0123456789";
    const encrypted = await encryptInvitationToken(token, secret);

    expect(encrypted).not.toContain(token);
    await expect(decryptInvitationToken(encrypted, secret)).resolves.toBe(
      token,
    );
    await expect(
      decryptInvitationToken(
        encrypted,
        "different-invitation-encryption-key-0123456789",
      ),
    ).rejects.toThrow();
  });
});
