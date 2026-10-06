import type { ReviewsDatabase } from "../storage/d1-store";

const windowDurationMs = 60 * 60 * 1000;
const retentionMs = 24 * windowDurationMs;
const maximumAttempts = 20;

export class RateLimitConfigurationError extends Error {
  constructor() {
    super("La protección de envíos no está configurada.");
    this.name = "RateLimitConfigurationError";
  }
}

async function hmacClientKey(
  ipAddress: string,
  secret: string,
): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(ipAddress),
  );
  return Array.from(new Uint8Array(signature), (byte) =>
    byte.toString(16).padStart(2, "0"),
  ).join("");
}

export async function allowReviewSubmission(
  database: ReviewsDatabase,
  ipAddress: string,
  secret: string,
  now = new Date(),
): Promise<boolean> {
  if (!secret || secret.startsWith("REPLACE_WITH"))
    throw new RateLimitConfigurationError();

  const windowStart =
    Math.floor(now.getTime() / windowDurationMs) * windowDurationMs;
  const clientKey = await hmacClientKey(ipAddress, secret);
  await database
    .prepare("DELETE FROM review_submission_limits WHERE window_start < ?")
    .bind(windowStart - retentionMs)
    .run();

  const result = await database
    .prepare(
      `INSERT INTO review_submission_limits (client_key, window_start, attempts)
       VALUES (?, ?, 1)
       ON CONFLICT(client_key, window_start)
       DO UPDATE SET attempts = attempts + 1
       RETURNING attempts`,
    )
    .bind(clientKey, windowStart)
    .first<{ attempts: number }>();

  return (result?.attempts ?? maximumAttempts + 1) <= maximumAttempts;
}
