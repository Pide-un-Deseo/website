import {
  decryptInvitationToken,
  encryptInvitationToken,
  createInvitationToken,
  hashInvitationToken,
} from "../domain/invitation-token";
import { parseReviewSubmission, ReviewInputError } from "../domain/review";
import {
  consumeInvitationAndPublish,
  deleteRevokedInvitation,
  hideReview,
  insertInvitation,
  invitationIsUsable,
  listAdminReviews,
  listInvitations as listStoredInvitations,
  listPublishedReviews,
  revokeInvitation,
} from "../storage/d1-store";
import type { ReviewsDatabase } from "../storage/d1-store";

export class InvitationError extends Error {
  constructor() {
    super("Este enlace no es válido, venció o ya fue utilizado.");
    this.name = "InvitationError";
  }
}

export class ReviewsConfigurationError extends Error {
  constructor() {
    super("La configuración de invitaciones no está disponible.");
    this.name = "ReviewsConfigurationError";
  }
}

export async function createInvitation(
  database: ReviewsDatabase,
  origin: string,
  encryptionSecret: string,
  now = new Date(),
  lifetimeDays = 30,
) {
  const configuredOrigin = parseReviewsOrigin(origin);
  if (!encryptionSecret?.trim()) throw new ReviewsConfigurationError();

  const token = createInvitationToken();
  const id = crypto.randomUUID();
  const createdAt = now.toISOString();
  const expiresAt = new Date(
    now.getTime() + lifetimeDays * 24 * 60 * 60 * 1000,
  ).toISOString();

  await insertInvitation(database, {
    id,
    tokenHash: await hashInvitationToken(token),
    tokenCiphertext: await encryptInvitationToken(token, encryptionSecret),
    createdAt,
    expiresAt,
  });

  const url = new URL("/resena", configuredOrigin.origin);
  url.hash = new URLSearchParams({ token }).toString();
  return { id, createdAt, expiresAt, url: url.href };
}

function parseReviewsOrigin(origin: string): URL {
  let configuredOrigin: URL;
  try {
    configuredOrigin = new URL(origin);
  } catch {
    throw new ReviewsConfigurationError();
  }
  if (
    (configuredOrigin.protocol !== "https:" &&
      configuredOrigin.hostname !== "localhost" &&
      configuredOrigin.hostname !== "127.0.0.1") ||
    configuredOrigin.username ||
    configuredOrigin.password ||
    configuredOrigin.pathname !== "/" ||
    configuredOrigin.search ||
    configuredOrigin.hash
  )
    throw new ReviewsConfigurationError();
  return configuredOrigin;
}

export async function listInvitations(
  database: ReviewsDatabase,
  origin: string,
  encryptionSecret: string,
  now = new Date(),
) {
  const configuredOrigin = parseReviewsOrigin(origin);
  if (!encryptionSecret?.trim()) throw new ReviewsConfigurationError();
  const invitations = await listStoredInvitations(database, now.toISOString());
  return Promise.all(
    invitations.map(async ({ encryptedToken, ...invitation }) => {
      if (
        !encryptedToken ||
        invitation.status !== "active" ||
        invitation.expired
      )
        return { ...invitation, url: null };
      const url = new URL("/resena", configuredOrigin.origin);
      url.hash = new URLSearchParams({
        token: await decryptInvitationToken(encryptedToken, encryptionSecret),
      }).toString();
      return { ...invitation, url: url.href };
    }),
  );
}

export async function submitReview(
  database: ReviewsDatabase,
  input: unknown,
  now = new Date(),
) {
  const submission = parseReviewSubmission(input);
  const invitationHash = await hashInvitationToken(submission.token);
  const timestamp = now.toISOString();

  if (!(await invitationIsUsable(database, invitationHash, timestamp)))
    throw new InvitationError();

  const id = crypto.randomUUID();
  const published = await consumeInvitationAndPublish(database, {
    id,
    invitationHash,
    firstName: submission.firstName,
    rating: submission.rating,
    text: submission.text,
    now: timestamp,
  });

  if (!published) throw new InvitationError();
  return { id, published: true as const };
}

export {
  deleteRevokedInvitation,
  hideReview,
  listAdminReviews,
  listPublishedReviews,
  revokeInvitation,
};
export { ReviewInputError };
