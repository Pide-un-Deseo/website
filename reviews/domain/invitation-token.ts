const tokenByteLength = 32;

export function createInvitationToken(cryptoProvider: Crypto = crypto): string {
  const bytes = cryptoProvider.getRandomValues(new Uint8Array(tokenByteLength));
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

export async function hashInvitationToken(
  token: string,
  cryptoProvider: Crypto = crypto,
): Promise<string> {
  const digest = await cryptoProvider.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(token),
  );
  return Array.from(new Uint8Array(digest), (byte) =>
    byte.toString(16).padStart(2, "0"),
  ).join("");
}
