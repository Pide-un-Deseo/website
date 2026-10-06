import { useEffect, useState, type FormEvent } from "react";
import { reviewsApi } from "./api";

export function ReviewFormPage() {
  const [token, setToken] = useState("");
  const [tokenReady, setTokenReady] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [rating, setRating] = useState(0);
  const [text, setText] = useState("");
  const [consent, setConsent] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const tokenValue = new URLSearchParams(window.location.hash.slice(1)).get(
      "token",
    );
    if (tokenValue) setToken(tokenValue);
    window.history.replaceState(
      window.history.state,
      "",
      window.location.pathname,
    );
    setTokenReady(true);
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setPending(true);
    try {
      await reviewsApi.submit({
        token,
        firstName,
        rating,
        text,
        consent: true,
      });
      setSent(true);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "No pudimos enviar la reseña. Inténtalo otra vez.",
      );
    } finally {
      setPending(false);
    }
  }

  return (
    <main className="review-page">
      <a
        className="review-page-brand"
        href="/"
        aria-label="Pide un Deseo, inicio"
      >
        Pide un Deseo
      </a>
      <section
        className="review-form-shell"
        aria-labelledby="review-form-title"
      >
        <p className="reviews-eyebrow">Tu experiencia importa</p>
        <h1 id="review-form-title">Cuéntanos cómo fue.</h1>
        <noscript>
          <p className="review-form-notice">
            Este formulario necesita JavaScript para proteger y validar tu
            invitación.
          </p>
        </noscript>
        {!tokenReady ? (
          <p role="status">Preparando el formulario…</p>
        ) : !token ? (
          <p className="review-form-notice" role="alert">
            Este enlace no contiene una invitación. Pídele al equipo de Pide un
            Deseo que te envíe uno nuevo por WhatsApp.
          </p>
        ) : sent ? (
          <div className="review-form-success" role="status">
            <h2>¡Gracias por compartir tu experiencia!</h2>
            <p>Tu reseña ya está publicada.</p>
          </div>
        ) : (
          <form className="review-form" onSubmit={submit}>
            <fieldset className="review-rating-field">
              <legend>¿Cuántas estrellas le das al servicio?</legend>
              <div className="review-rating-options">
                {[1, 2, 3, 4, 5].map((value) => (
                  <label key={value}>
                    <input
                      type="radio"
                      name="rating"
                      value={value}
                      checked={rating === value}
                      onChange={() => setRating(value)}
                      required={value === 1}
                    />
                    <span
                      className={value <= rating ? "is-active" : undefined}
                      aria-hidden="true"
                    >
                      ★
                    </span>
                    <span className="review-rating-label">
                      {value} estrellas
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            <label className="review-field">
              <span>Tu nombre de pila</span>
              <input
                name="firstName"
                type="text"
                autoComplete="given-name"
                minLength={1}
                maxLength={40}
                value={firstName}
                onChange={(event) => setFirstName(event.currentTarget.value)}
                required
              />
            </label>

            <label className="review-field">
              <span>Tu reseña</span>
              <textarea
                name="text"
                rows={5}
                minLength={10}
                maxLength={1200}
                value={text}
                onChange={(event) => setText(event.currentTarget.value)}
                required
              />
              <span className="review-character-count">
                {text.length} de 1200 caracteres
              </span>
            </label>

            <label className="review-consent">
              <input
                type="checkbox"
                checked={consent}
                onChange={(event) => setConsent(event.currentTarget.checked)}
                required
              />
              <span>
                Acepto que se publique mi reseña junto a mi nombre de pila.
              </span>
            </label>

            {error && (
              <p className="review-form-error" role="alert">
                {error}
              </p>
            )}
            <button className="review-submit" type="submit" disabled={pending}>
              {pending ? "Enviando…" : "Publicar reseña"}
            </button>
          </form>
        )}
      </section>
    </main>
  );
}
