import type { PagesFunction } from "@cloudflare/workers-types";
import { requireAdmin } from "../../../../reviews/server/access-auth";
import { handleApi } from "../../../../reviews/server/http";
import {
  createInvitation,
  listInvitations,
} from "../../../../reviews/server/review-service";
import type { ReviewsEnvironment } from "../../../../reviews/server/environment";

export const onRequestGet: PagesFunction<ReviewsEnvironment> = async ({
  request,
  env,
}) => {
  const authError = await requireAdmin(request, env);
  if (authError) return authError;
  return handleApi(() => listInvitations(env.REVIEWS_DB));
};

export const onRequestPost: PagesFunction<ReviewsEnvironment> = async ({
  request,
  env,
}) => {
  const authError = await requireAdmin(request, env);
  if (authError) return authError;
  return handleApi(
    () => createInvitation(env.REVIEWS_DB, env.REVIEWS_SITE_URL),
    201,
  );
};
