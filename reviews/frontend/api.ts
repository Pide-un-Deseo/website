export type PublicReview = {
  id: string;
  firstName: string;
  rating: number;
  text: string;
  createdAt: string;
  verified: true;
};

export type ReviewsResponse = {
  reviews: PublicReview[];
  count: number;
  average: number;
};

export type Invitation = {
  id: string;
  status: "active" | "used" | "revoked";
  created_at: string;
  expires_at: string;
  expired: boolean;
  url: string | null;
};

export type AdminReview = PublicReview & {
  status: "published" | "hidden";
};

async function requestJson<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...init,
    headers: {
      ...(init?.body ? { "Content-Type": "application/json" } : {}),
      ...init?.headers,
    },
    cache: "no-store",
  });

  let body: unknown;
  try {
    body = await response.json();
  } catch {
    throw new Error("No pudimos leer la respuesta. Inténtalo otra vez.");
  }
  if (!response.ok) {
    const error =
      body && typeof body === "object" && "error" in body
        ? String(body.error)
        : "No pudimos completar la solicitud. Inténtalo otra vez.";
    throw new Error(error);
  }
  return body as T;
}

export const reviewsApi = {
  list: () => requestJson<ReviewsResponse>("/api/reviews"),
  submit: (submission: {
    token: string;
    firstName: string;
    rating: number;
    text: string;
    consent: true;
  }) =>
    requestJson<{ id: string; published: true }>("/api/reviews/submit", {
      method: "POST",
      body: JSON.stringify(submission),
    }),
  invitations: () => requestJson<Invitation[]>("/api/admin/invitations"),
  adminReviews: () => requestJson<AdminReview[]>("/api/admin/reviews"),
  createInvitation: () =>
    requestJson<{
      id: string;
      createdAt: string;
      expiresAt: string;
      url: string;
    }>("/api/admin/invitations", { method: "POST" }),
  revokeInvitation: (id: string) =>
    requestJson<{ revoked: true }>(
      `/api/admin/invitations/${encodeURIComponent(id)}`,
      {
        method: "PATCH",
      },
    ),
  deleteInvitation: (id: string) =>
    requestJson<{ deleted: true }>(
      `/api/admin/invitations/${encodeURIComponent(id)}`,
      { method: "DELETE" },
    ),
  hideReview: (id: string) =>
    requestJson<{ hidden: true }>(
      `/api/admin/reviews/${encodeURIComponent(id)}`,
      {
        method: "PATCH",
        body: JSON.stringify({ status: "hidden" }),
      },
    ),
};
