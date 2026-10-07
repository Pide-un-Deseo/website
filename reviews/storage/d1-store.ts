import type {
  PublicReview,
  ReviewRecord,
  ReviewStatus,
} from "../domain/review";

type D1Result<T = unknown> = {
  results: T[];
  meta: { changes: number };
  success: boolean;
};

type D1Statement = {
  bind(...values: unknown[]): D1Statement;
  all<T = unknown>(): Promise<D1Result<T>>;
  first<T = unknown>(): Promise<T | null>;
  run(): Promise<D1Result>;
};

export type ReviewsDatabase = {
  prepare(query: string): D1Statement;
  batch(statements: D1Statement[]): Promise<D1Result[]>;
};

type ReviewRow = {
  id: string;
  first_name: string;
  rating: number;
  text: string;
  created_at: string;
  status: ReviewStatus;
};

type InvitationRow = {
  id: string;
  status: "active" | "used" | "revoked";
  created_at: string;
  expires_at: string;
  token_ciphertext: string | null;
};

export type InvitationSummary = Omit<InvitationRow, "token_ciphertext"> & {
  encryptedToken: string | null;
  expired: boolean;
};

function toReview(row: ReviewRow): ReviewRecord {
  return {
    id: row.id,
    firstName: row.first_name,
    rating: row.rating,
    text: row.text,
    createdAt: row.created_at,
    status: row.status,
    verified: true,
  };
}

function toPublicReview(row: ReviewRow): PublicReview {
  return {
    id: row.id,
    firstName: row.first_name,
    rating: row.rating,
    text: row.text,
    createdAt: row.created_at,
    verified: true,
  };
}

function toInvitation(row: InvitationRow, now: string): InvitationSummary {
  const { token_ciphertext, ...invitation } = row;
  return {
    ...invitation,
    encryptedToken: token_ciphertext,
    expired: row.status === "active" && row.expires_at <= now,
  };
}

export async function listPublishedReviews(
  database: ReviewsDatabase,
): Promise<{ reviews: PublicReview[]; count: number; average: number }> {
  const [reviewResult, aggregate] = await Promise.all([
    database
      .prepare(
        `SELECT id, first_name, rating, text, created_at, status
         FROM reviews WHERE status = 'published'
         ORDER BY created_at DESC LIMIT 50`,
      )
      .all<ReviewRow>(),
    database
      .prepare(
        `SELECT COUNT(*) AS count, COALESCE(AVG(rating), 0) AS average
         FROM reviews WHERE status = 'published'`,
      )
      .first<{ count: number; average: number }>(),
  ]);

  return {
    reviews: reviewResult.results.map(toPublicReview),
    count: aggregate?.count ?? 0,
    average: aggregate?.average ?? 0,
  };
}

export async function listAdminReviews(
  database: ReviewsDatabase,
): Promise<ReviewRecord[]> {
  const result = await database
    .prepare(
      `SELECT id, first_name, rating, text, created_at, status
       FROM reviews ORDER BY created_at DESC LIMIT 200`,
    )
    .all<ReviewRow>();
  return result.results.map(toReview);
}

export async function listInvitations(
  database: ReviewsDatabase,
  now = new Date().toISOString(),
): Promise<InvitationSummary[]> {
  const result = await database
    .prepare(
      `SELECT id, status, created_at, expires_at, token_ciphertext
       FROM review_invitations ORDER BY created_at DESC LIMIT 200`,
    )
    .all<InvitationRow>();
  return result.results.map((row) => toInvitation(row, now));
}

export async function insertInvitation(
  database: ReviewsDatabase,
  invitation: {
    id: string;
    tokenHash: string;
    tokenCiphertext: string;
    createdAt: string;
    expiresAt: string;
  },
): Promise<void> {
  await database
    .prepare(
      `INSERT INTO review_invitations
         (id, token_hash, token_ciphertext, status, created_at, expires_at)
       VALUES (?, ?, ?, 'active', ?, ?)`,
    )
    .bind(
      invitation.id,
      invitation.tokenHash,
      invitation.tokenCiphertext,
      invitation.createdAt,
      invitation.expiresAt,
    )
    .run();
}

export async function invitationIsUsable(
  database: ReviewsDatabase,
  tokenHash: string,
  now: string,
): Promise<boolean> {
  const result = await database
    .prepare(
      `SELECT id FROM review_invitations
       WHERE token_hash = ? AND status = 'active' AND expires_at > ?`,
    )
    .bind(tokenHash, now)
    .first<{ id: string }>();
  return result !== null;
}

export async function consumeInvitationAndPublish(
  database: ReviewsDatabase,
  submission: {
    id: string;
    invitationHash: string;
    firstName: string;
    rating: number;
    text: string;
    now: string;
  },
): Promise<boolean> {
  const results = await database.batch([
    database
      .prepare(
        `UPDATE review_invitations
         SET status = 'used', used_at = ?, consumed_by = ?
         WHERE token_hash = ? AND status = 'active' AND expires_at > ?`,
      )
      .bind(
        submission.now,
        submission.id,
        submission.invitationHash,
        submission.now,
      ),
    database
      .prepare(
        `INSERT INTO reviews
           (id, invitation_id, first_name, rating, text, status, created_at, consent_at)
         SELECT ?, id, ?, ?, ?, 'published', ?, ?
         FROM review_invitations WHERE consumed_by = ?`,
      )
      .bind(
        submission.id,
        submission.firstName,
        submission.rating,
        submission.text,
        submission.now,
        submission.now,
        submission.id,
      ),
  ]);
  return results[1]?.meta.changes === 1;
}

export async function revokeInvitation(
  database: ReviewsDatabase,
  id: string,
): Promise<boolean> {
  const result = await database
    .prepare(
      `UPDATE review_invitations SET status = 'revoked'
       WHERE id = ? AND status = 'active'`,
    )
    .bind(id)
    .run();
  return result.meta.changes === 1;
}

export async function deleteRevokedInvitation(
  database: ReviewsDatabase,
  id: string,
): Promise<boolean> {
  const result = await database
    .prepare(
      `DELETE FROM review_invitations
       WHERE id = ? AND status = 'revoked'`,
    )
    .bind(id)
    .run();
  return result.meta.changes === 1;
}

export async function hideReview(
  database: ReviewsDatabase,
  id: string,
  now: string,
): Promise<boolean> {
  const result = await database
    .prepare(
      `UPDATE reviews SET status = 'hidden', hidden_at = ?
       WHERE id = ? AND status = 'published'`,
    )
    .bind(now, id)
    .run();
  return result.meta.changes === 1;
}
