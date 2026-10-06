export type ReviewStatus = "published" | "hidden";

export type ReviewSubmission = {
  token: string;
  firstName: string;
  rating: number;
  text: string;
  consent: true;
};

export type PublicReview = {
  id: string;
  firstName: string;
  rating: number;
  text: string;
  createdAt: string;
  verified: true;
};

export type ReviewRecord = PublicReview & { status: ReviewStatus };

export class ReviewInputError extends Error {
  constructor(
    readonly code: "invalid" | "contains_private_data" | "contains_abuse",
    message: string,
  ) {
    super(message);
    this.name = "ReviewInputError";
  }
}

const emailPattern = /\b[^\s@]+@[^\s@]+\.[^\s@]+\b/u;
const urlPattern =
  /(?:https?:\/\/|www\.|\b[a-z0-9-]+\.(?:com|net|org|cu|es)\b)/iu;
const phonePattern = /\+?\d(?:[\s().-]*\d){7,}/u;
const addressPattern =
  /\b(?:mi direcci[oó]n(?: exacta)? es|vivo en (?:la )?(?:calle|avenida|calzada)|(?:calle|avenida|calzada)\s+[\w\s#.,/-]*\d)\s+[^.!?]{0,80}/iu;
const abusiveWords = new Set([
  "asqueroso",
  "asquerosa",
  "cabron",
  "cabrona",
  "cojones",
  "estupido",
  "estupida",
  "idiota",
  "imbecil",
  "mierda",
  "puta",
  "puto",
]);

function normalizeForModeration(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("es");
}

function rejectPrivateData(value: string): void {
  if (
    emailPattern.test(value) ||
    phonePattern.test(value) ||
    urlPattern.test(value) ||
    addressPattern.test(value)
  ) {
    throw new ReviewInputError(
      "contains_private_data",
      "Quita teléfonos, correos, direcciones o enlaces antes de enviar la reseña.",
    );
  }
}

function rejectAbuse(value: string): void {
  const words = normalizeForModeration(value).match(/[\p{L}\p{N}]+/gu) ?? [];
  if (words.some((word) => abusiveWords.has(word))) {
    throw new ReviewInputError(
      "contains_abuse",
      "Revisa el lenguaje de la reseña y vuelve a intentarlo.",
    );
  }
}

export function parseReviewSubmission(input: unknown): ReviewSubmission {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    throw new ReviewInputError(
      "invalid",
      "Revisa los campos e inténtalo otra vez.",
    );
  }

  const value = input as Record<string, unknown>;
  const token = typeof value.token === "string" ? value.token : "";
  const firstName =
    typeof value.firstName === "string" ? value.firstName.trim() : "";
  const text = typeof value.text === "string" ? value.text.trim() : "";

  if (
    !/^[A-Za-z0-9_-]{40,64}$/u.test(token) ||
    !/^[\p{L}\p{M}]+(?:[ '-][\p{L}\p{M}]+)*$/u.test(firstName) ||
    firstName.length > 40 ||
    !Number.isInteger(value.rating) ||
    (value.rating as number) < 1 ||
    (value.rating as number) > 5 ||
    text.length < 10 ||
    text.length > 1200 ||
    value.consent !== true
  ) {
    throw new ReviewInputError(
      "invalid",
      "Completa el nombre, una reseña de 10 a 1200 caracteres, las estrellas y el consentimiento.",
    );
  }

  rejectPrivateData(firstName);
  rejectPrivateData(text);
  rejectAbuse(text);

  return {
    token,
    firstName,
    rating: value.rating as number,
    text,
    consent: true,
  };
}
