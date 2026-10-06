import type { PagesFunction } from "@cloudflare/workers-types";
import { requireAdmin } from "../../../../reviews/server/access-auth";
import {
  handleApi,
  HttpError,
  readJson,
} from "../../../../reviews/server/http";
import { hideReview } from "../../../../reviews/server/review-service";
import type { ReviewsEnvironment } from "../../../../reviews/server/environment";

export const onRequestPatch: PagesFunction<ReviewsEnvironment, "id"> = async ({
  request,
  env,
  params,
}) => {
  const authError = await requireAdmin(request, env);
  if (authError) return authError;
  return handleApi(async () => {
    const body = await readJson(request);
    if (
      !body ||
      typeof body !== "object" ||
      (body as Record<string, unknown>).status !== "hidden"
    )
      throw new HttpError(400, "Solo se permite ocultar una reseña.");
    const id = Array.isArray(params.id) ? params.id[0] : params.id;
    if (
      !id ||
      !(await hideReview(env.REVIEWS_DB, id, new Date().toISOString()))
    )
      throw new HttpError(
        404,
        "No encontramos una reseña publicada con ese identificador.",
      );
    return { hidden: true };
  });
};
