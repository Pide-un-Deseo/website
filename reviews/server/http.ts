import {
  InvitationError,
  ReviewInputError,
  ReviewsConfigurationError,
} from "./review-service";

export class HttpError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = "HttpError";
  }
}

export function jsonResponse(value: unknown, status = 200): Response {
  return Response.json(value, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

export async function readJson(request: Request): Promise<unknown> {
  const contentType = request.headers.get("content-type") ?? "";
  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (!contentType.toLowerCase().includes("application/json"))
    throw new HttpError(415, "Envía los datos como JSON.");
  if (contentLength > 8192)
    throw new HttpError(413, "La solicitud es demasiado grande.");

  const reader = request.body?.getReader();
  if (!reader) throw new HttpError(400, "No pudimos leer los datos enviados.");
  const chunks: Uint8Array[] = [];
  let totalBytes = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      totalBytes += value.byteLength;
      if (totalBytes > 8192) {
        await reader.cancel();
        throw new HttpError(413, "La solicitud es demasiado grande.");
      }
      chunks.push(value);
    }
  } catch (error) {
    if (error instanceof HttpError) throw error;
    throw new HttpError(400, "No pudimos leer los datos enviados.");
  }

  const body = new Uint8Array(totalBytes);
  let offset = 0;
  for (const chunk of chunks) {
    body.set(chunk, offset);
    offset += chunk.byteLength;
  }
  try {
    return JSON.parse(new TextDecoder().decode(body)) as unknown;
  } catch {
    throw new HttpError(400, "No pudimos leer los datos enviados.");
  }
}

export function errorResponse(error: unknown): Response {
  if (error instanceof HttpError)
    return jsonResponse({ error: error.message }, error.status);
  if (error instanceof ReviewInputError)
    return jsonResponse({ code: error.code, error: error.message }, 422);
  if (error instanceof InvitationError)
    return jsonResponse({ error: error.message }, 410);
  if (error instanceof ReviewsConfigurationError)
    return jsonResponse({ error: error.message }, 503);
  console.error("Reviews API request failed", error);
  return jsonResponse(
    { error: "No pudimos completar la solicitud. Inténtalo otra vez." },
    500,
  );
}

export async function handleApi<T>(
  action: () => Promise<T>,
  successStatus = 200,
): Promise<Response> {
  try {
    return jsonResponse(await action(), successStatus);
  } catch (error) {
    return errorResponse(error);
  }
}
