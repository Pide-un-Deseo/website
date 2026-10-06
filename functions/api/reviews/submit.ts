import type { PagesFunction } from "@cloudflare/workers-types";
import { handleApi, readJson } from "../../../reviews/server/http";
import { allowReviewSubmission } from "../../../reviews/server/rate-limit";
import { submitReview } from "../../../reviews/server/review-service";
import type { ReviewsEnvironment } from "../../../reviews/server/environment";

export const onRequestPost: PagesFunction<ReviewsEnvironment> = async ({
  request,
  env,
}) => {
  try {
    const allowed = await allowReviewSubmission(
      env.REVIEWS_DB,
      request.headers.get("cf-connecting-ip") ?? "local-development",
      env.REVIEW_RATE_LIMIT_KEY,
    );
    if (!allowed)
      return Response.json(
        {
          error:
            "Se alcanzó el límite de intentos. Espera un momento e inténtalo otra vez.",
        },
        { status: 429, headers: { "Cache-Control": "no-store" } },
      );
  } catch (error) {
    if (error instanceof Error && error.name === "RateLimitConfigurationError")
      return Response.json(
        { error: error.message },
        { status: 503, headers: { "Cache-Control": "no-store" } },
      );
    throw error;
  }

  return handleApi(
    async () => submitReview(env.REVIEWS_DB, await readJson(request)),
    201,
  );
};
