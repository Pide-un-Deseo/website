import { renderToString } from "react-dom/server";
import { AdminPage } from "../reviews/frontend/AdminPage";
import { ReviewFormPage } from "../reviews/frontend/ReviewFormPage";
import { resolveReviewsRoute } from "../reviews/frontend/routes";
import App from "./App";
export function render(pathname = "/") {
  const route = resolveReviewsRoute(pathname);
  return renderToString(
    route === "review-form" ? (
      <ReviewFormPage />
    ) : route === "admin" ? (
      <AdminPage />
    ) : (
      <App />
    ),
  );
}
export { business } from "./content";
