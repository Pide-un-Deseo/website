import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import "@fontsource/cormorant-garamond/latin-500.css";
import "@fontsource/cormorant-garamond/latin-500-italic.css";
import "@fontsource/cormorant-garamond/latin-600.css";
import "@fontsource/manrope/latin-400.css";
import "@fontsource/manrope/latin-500.css";
import "@fontsource/manrope/latin-600.css";
import "./styles.css";
import "../reviews/frontend/reviews.css";
import App from "./App";
import { AdminPage } from "../reviews/frontend/AdminPage";
import { ReviewFormPage } from "../reviews/frontend/ReviewFormPage";
import { resolveReviewsRoute } from "../reviews/frontend/routes";
const root = document.getElementById("root")!;
const route = resolveReviewsRoute(window.location.pathname);
const app = (
  <StrictMode>
    {route === "review-form" ? (
      <ReviewFormPage />
    ) : route === "admin" ? (
      <AdminPage />
    ) : (
      <App />
    )}
  </StrictMode>
);
if (
  root.hasChildNodes() &&
  (route === "admin" || route === "review-form" || root.querySelector("main"))
)
  hydrateRoot(root, app);
else createRoot(root).render(app);
