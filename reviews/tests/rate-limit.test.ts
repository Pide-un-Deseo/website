import { describe, expect, it } from "vitest";
import {
  allowReviewSubmission,
  RateLimitConfigurationError,
} from "../server/rate-limit";
import type { ReviewsDatabase } from "../storage/d1-store";

function rateLimitDatabase(attempts: number) {
  const boundValues: unknown[][] = [];
  const database: ReviewsDatabase = {
    prepare(query) {
      const statement = {
        bind(...values: unknown[]) {
          boundValues.push(values);
          return statement;
        },
        async first<T>() {
          return (
            query.includes("RETURNING attempts") ? { attempts } : null
          ) as T | null;
        },
        async all<T>() {
          return { results: [] as T[], meta: { changes: 0 }, success: true };
        },
        async run() {
          return { results: [], meta: { changes: 1 }, success: true };
        },
      };
      return statement;
    },
    async batch() {
      return [];
    },
  };
  return { database, boundValues };
}

describe("submission rate limit", () => {
  it("allows the first twenty attempts and rejects the next one", async () => {
    const atLimit = rateLimitDatabase(20);
    const overLimit = rateLimitDatabase(21);
    const now = new Date("2026-10-06T12:00:00.000Z");

    await expect(
      allowReviewSubmission(atLimit.database, "203.0.113.17", "key", now),
    ).resolves.toBe(true);
    await expect(
      allowReviewSubmission(overLimit.database, "203.0.113.17", "key", now),
    ).resolves.toBe(false);
  });

  it("persists an HMAC of the IP, never the address itself", async () => {
    const first = rateLimitDatabase(1);
    const second = rateLimitDatabase(1);
    const ipAddress = "203.0.113.17";

    await allowReviewSubmission(first.database, ipAddress, "key");
    await allowReviewSubmission(second.database, ipAddress, "key");

    expect(first.boundValues[1][0]).not.toBe(ipAddress);
    expect(first.boundValues[1][0]).toBe(second.boundValues[1][0]);
  });

  it("requires a configured HMAC key", async () => {
    const { database } = rateLimitDatabase(1);
    await expect(
      allowReviewSubmission(database, "203.0.113.17", "REPLACE_WITH_SECRET"),
    ).rejects.toBeInstanceOf(RateLimitConfigurationError);
  });
});
