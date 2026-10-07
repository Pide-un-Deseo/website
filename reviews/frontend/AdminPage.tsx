import { useEffect, useState } from "react";
import { reviewsApi, type AdminReview, type Invitation } from "./api";

function displayDate(value: string): string {
  return new Intl.DateTimeFormat("es", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function AdminPage() {
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [reviews, setReviews] = useState<AdminReview[]>([]);
  const [newUrl, setNewUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    try {
      const [nextInvitations, nextReviews] = await Promise.all([
        reviewsApi.invitations(),
        reviewsApi.adminReviews(),
      ]);
      setInvitations(nextInvitations);
      setReviews(nextReviews);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "No pudimos cargar el panel.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  async function createInvitation() {
    setPending(true);
    setError("");
    try {
      const invitation = await reviewsApi.createInvitation();
      setNewUrl(invitation.url);
      await load();
    } catch (createError) {
      setError(
        createError instanceof Error
          ? createError.message
          : "No pudimos crear la invitación.",
      );
    } finally {
      setPending(false);
    }
  }

  async function revoke(id: string) {
    setPending(true);
    setError("");
    try {
      await reviewsApi.revokeInvitation(id);
      await load();
    } catch (revokeError) {
      setError(
        revokeError instanceof Error
          ? revokeError.message
          : "No pudimos revocar la invitación.",
      );
    } finally {
      setPending(false);
    }
  }

  async function removeInvitation(id: string) {
    if (!window.confirm("¿Eliminar permanentemente esta invitación revocada?"))
      return;
    setPending(true);
    setError("");
    try {
      await reviewsApi.deleteInvitation(id);
      await load();
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "No pudimos eliminar la invitación.",
      );
    } finally {
      setPending(false);
    }
  }

  async function hide(id: string) {
    setPending(true);
    setError("");
    try {
      await reviewsApi.hideReview(id);
      await load();
    } catch (hideError) {
      setError(
        hideError instanceof Error
          ? hideError.message
          : "No pudimos ocultar la reseña.",
      );
    } finally {
      setPending(false);
    }
  }

  return (
    <main className="review-admin-page">
      <header className="review-admin-header">
        <a className="review-page-brand" href="/">
          Pide un Deseo
        </a>
        <h1>Administración de reseñas</h1>
        <a href="/">Volver al sitio</a>
      </header>

      {error && (
        <div className="review-admin-error" role="alert">
          <p>{error}</p>
          <button type="button" onClick={() => void load()}>
            Volver a intentar
          </button>
        </div>
      )}

      <section
        className="review-admin-section"
        aria-labelledby="invitations-title"
      >
        <div className="review-admin-section-heading">
          <div>
            <p className="reviews-eyebrow">Enlaces de un solo uso</p>
            <h2 id="invitations-title">Invitaciones</h2>
          </div>
          <button
            className="review-submit"
            type="button"
            onClick={() => void createInvitation()}
            disabled={pending}
          >
            {pending ? "Procesando…" : "Crear invitación"}
          </button>
        </div>

        {newUrl && (
          <div className="review-invitation-created" role="status">
            <p>
              Enlace creado. Compártelo solo con el cliente correspondiente.
            </p>
            <code>{newUrl}</code>
            <a
              href={`https://wa.me/?text=${encodeURIComponent(`Te invitamos a compartir tu experiencia: ${newUrl}`)}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Compartir por WhatsApp
            </a>
          </div>
        )}

        {loading ? (
          <p role="status">Cargando invitaciones…</p>
        ) : invitations.length === 0 ? (
          <p>Aún no se han creado invitaciones.</p>
        ) : (
          <div className="review-admin-table-wrap">
            <table className="review-admin-table">
              <thead>
                <tr>
                  <th>Creada</th>
                  <th>Vencimiento</th>
                  <th>Estado</th>
                  <th>Enlace</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {invitations.map((invitation) => {
                  const status = invitation.expired
                    ? "Vencida"
                    : invitation.status === "active"
                      ? "Activa"
                      : invitation.status === "used"
                        ? "Usada"
                        : "Revocada";
                  return (
                    <tr key={invitation.id}>
                      <td>{displayDate(invitation.created_at)}</td>
                      <td>{displayDate(invitation.expires_at)}</td>
                      <td>{status}</td>
                      <td>
                        {invitation.url ? (
                          <>
                            <code className="review-invitation-url">
                              {invitation.url}
                            </code>
                            <a
                              className="review-text-action"
                              href={`https://wa.me/?text=${encodeURIComponent(`Te invitamos a compartir tu experiencia: ${invitation.url}`)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Reenviar por WhatsApp
                            </a>
                          </>
                        ) : invitation.status === "active" ? (
                          "Enlace no recuperable"
                        ) : (
                          "—"
                        )}
                      </td>
                      <td>
                        {invitation.status === "active" &&
                          !invitation.expired && (
                            <button
                              className="review-text-action"
                              type="button"
                              onClick={() => void revoke(invitation.id)}
                              disabled={pending}
                            >
                              Revocar
                            </button>
                          )}
                        {invitation.status === "revoked" && (
                          <button
                            className="review-text-action review-delete-action"
                            type="button"
                            onClick={() => void removeInvitation(invitation.id)}
                            disabled={pending}
                          >
                            Eliminar
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section
        className="review-admin-section"
        aria-labelledby="published-title"
      >
        <div className="review-admin-section-heading">
          <div>
            <p className="reviews-eyebrow">Visibles en la web</p>
            <h2 id="published-title">Reseñas</h2>
          </div>
        </div>
        {loading ? (
          <p role="status">Cargando reseñas…</p>
        ) : reviews.length === 0 ? (
          <p>Aún no se han enviado reseñas.</p>
        ) : (
          <div className="review-admin-list">
            {reviews.map((review) => (
              <article className="review-admin-item" key={review.id}>
                <div>
                  <p
                    className="review-card-stars"
                    aria-label={`${review.rating} de 5 estrellas`}
                  >
                    {"★".repeat(review.rating)}
                    <span>{"☆".repeat(5 - review.rating)}</span>
                  </p>
                  <p className="review-admin-item-meta">
                    {review.firstName} · {displayDate(review.createdAt)} ·{" "}
                    {review.status === "published" ? "Publicada" : "Oculta"}
                  </p>
                  <p>{review.text}</p>
                </div>
                {review.status === "published" && (
                  <button
                    className="review-text-action"
                    type="button"
                    onClick={() => void hide(review.id)}
                    disabled={pending}
                  >
                    Ocultar
                  </button>
                )}
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
