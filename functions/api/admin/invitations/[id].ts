import type { PagesFunction } from "@cloudflare/workers-types";
import { requireAdmin } from "../../../../reviews/server/access-auth";
import { handleApi, HttpError } from "../../../../reviews/server/http";
import {
  deleteRevokedInvitation,
  revokeInvitation,
} from "../../../../reviews/server/review-service";
import type { ReviewsEnvironment } from "../../../../reviews/server/environment";

export const onRequestPatch: PagesFunction<ReviewsEnvironment, "id"> = async ({
  request,
  env,
  params,
}) => {
  const authError = await requireAdmin(request, env);
  if (authError) return authError;
  return handleApi(async () => {
    const id = Array.isArray(params.id) ? params.id[0] : params.id;
    if (!id || !(await revokeInvitation(env.REVIEWS_DB, id)))
      throw new HttpError(
        404,
        "No encontramos una invitación activa con ese identificador.",
      );
    return { revoked: true };
  });
};

export const onRequestDelete: PagesFunction<ReviewsEnvironment, "id"> = async ({
  request,
  env,
  params,
}) => {
  const authError = await requireAdmin(request, env);
  if (authError) return authError;
  return handleApi(async () => {
    const id = Array.isArray(params.id) ? params.id[0] : params.id;
    if (!id || !(await deleteRevokedInvitation(env.REVIEWS_DB, id)))
      throw new HttpError(
        404,
        "Solo se pueden eliminar invitaciones revocadas.",
      );
    return { deleted: true };
  });
};
