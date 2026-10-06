import { useEffect, useState } from "react";
import { reviewsApi, type ReviewsResponse } from "./api";

export function ReviewsSection() {
  const [reviews, setReviews] = useState<ReviewsResponse | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;
    reviewsApi
      .list()
      .then((result) => {
        if (active) setReviews(result);
      })
      .catch(() => {
        if (active) setError(true);
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <section
      className="section reviews-section"
      id="resenas"
      aria-labelledby="reviews-title"
    >
      <div className="reviews-inner">
        <p className="reviews-eyebrow">
          Lo cuentan quienes ya vivieron la magia
        </p>
        <h2 id="reviews-title">Cada deseo, una historia.</h2>
        {reviews && reviews.count > 0 && (
          <div className="reviews-summary">
            <span className="reviews-summary-rating">
              {reviews.average.toFixed(1)}
            </span>
            <span
              className="reviews-stars"
              aria-label={`${reviews.average.toFixed(1)} de 5 estrellas`}
            >
              ★★★★★
            </span>
            <span>
              {reviews.count} {reviews.count === 1 ? "reseña" : "reseñas"}
            </span>
          </div>
        )}

        {error ? (
          <p className="reviews-message" role="status">
            Ahora mismo no podemos cargar las reseñas. Vuelve a intentarlo más
            tarde.
          </p>
        ) : !reviews ? (
          <p className="reviews-message" role="status">
            Cargando reseñas…{" "}
            <noscript>
              Las reseñas actuales requieren JavaScript para consultarse.
            </noscript>
          </p>
        ) : reviews.reviews.length === 0 ? (
          <p className="reviews-message">
            Aún no hay reseñas publicadas. Pronto compartiremos las primeras.
          </p>
        ) : (
          <div className="reviews-list">
            {reviews.reviews.map((review) => (
              <article className="review-card" key={review.id}>
                <div
                  className="review-card-stars"
                  aria-label={`${review.rating} de 5 estrellas`}
                >
                  {"★".repeat(review.rating)}
                  <span>{"☆".repeat(5 - review.rating)}</span>
                </div>
                <blockquote>{review.text}</blockquote>
                <div className="review-attribution">
                  <strong>{review.firstName}</strong>
                  {review.verified && <span>Cliente verificado</span>}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
