import type { PagesFunction } from "@cloudflare/workers-types";
import { listPublishedReviews } from "../../../reviews/server/review-service";
import { handleApi } from "../../../reviews/server/http";
import type { ReviewsEnvironment } from "../../../reviews/server/environment";

export const onRequestGet: PagesFunction<ReviewsEnvironment> = async ({
  env,
}) => handleApi(() => listPublishedReviews(env.REVIEWS_DB));
