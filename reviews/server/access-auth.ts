import { createRemoteJWKSet, jwtVerify } from "jose";
import type { ReviewsEnvironment } from "./environment";

const keySets = new Map<string, ReturnType<typeof createRemoteJWKSet>>();

function unauthorized(status: 401 | 403 | 503, error: string): Response {
  return Response.json(
    { error },
    { status, headers: { "Cache-Control": "no-store" } },
  );
}

function normalizeTeamDomain(domain: string): string | null {
  const normalized = domain
    .trim()
    .replace(/^https:\/\//u, "")
    .replace(/\/$/u, "");
  if (!/^[a-z0-9.-]+$/iu.test(normalized)) return null;
  return normalized.toLowerCase();
}

export async function requireAdmin(
  request: Request,
  env: ReviewsEnvironment,
): Promise<Response | null> {
  const configuredDomain = env.ACCESS_TEAM_DOMAIN ?? "";
  const configuredAudience = env.ACCESS_AUD ?? "";
  const teamDomain = normalizeTeamDomain(configuredDomain);
  const audience = configuredAudience.trim();
  const administrators = (env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);

  if (
    !teamDomain ||
    teamDomain.startsWith("replace_with") ||
    !audience ||
    audience.startsWith("REPLACE_WITH") ||
    administrators.length === 0
  )
    return unauthorized(503, "El acceso administrativo no está configurado.");

  if (request.method !== "GET") {
    const origin = request.headers.get("origin");
    if (!origin || origin !== new URL(request.url).origin)
      return unauthorized(403, "La solicitud no tiene un origen permitido.");
  }

  const assertion = request.headers.get("cf-access-jwt-assertion");
  if (!assertion) return unauthorized(401, "Inicia sesión para continuar.");

  const issuer = `https://${teamDomain}`;
  let keySet = keySets.get(issuer);
  if (!keySet) {
    keySet = createRemoteJWKSet(new URL(`${issuer}/cdn-cgi/access/certs`));
    keySets.set(issuer, keySet);
  }

  try {
    const { payload } = await jwtVerify(assertion, keySet, {
      issuer,
      audience,
    });
    const email =
      typeof payload.email === "string" ? payload.email.toLowerCase() : "";
    if (!administrators.includes(email))
      return unauthorized(403, "Esta cuenta no tiene acceso al panel.");
    return null;
  } catch {
    return unauthorized(401, "La sesión no es válida o ha vencido.");
  }
}
