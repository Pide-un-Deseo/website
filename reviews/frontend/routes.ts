export type ReviewsRoute = "review-form" | "admin" | null;

export function resolveReviewsRoute(pathname: string): ReviewsRoute {
  const normalized = pathname.replace(/\/+$/u, "") || "/";
  if (normalized === "/resena") return "review-form";
  if (normalized === "/admin") return "admin";
  return null;
}
