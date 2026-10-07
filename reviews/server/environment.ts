import type { ReviewsDatabase } from "../storage/d1-store";

export type ReviewsEnvironment = {
  REVIEWS_DB: ReviewsDatabase;
  REVIEWS_SITE_URL: string;
  REVIEW_RATE_LIMIT_KEY: string;
  INVITATION_ENCRYPTION_KEY: string;
  ACCESS_TEAM_DOMAIN: string;
  ACCESS_AUD: string;
  ADMIN_EMAILS: string;
};
