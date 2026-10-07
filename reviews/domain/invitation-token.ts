const tokenByteLength = 32;

function encodeBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function decodeBase64Url(value: string): Uint8Array<ArrayBuffer> {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(base64 + "=".repeat((4 - (base64.length % 4)) % 4));
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index++)
    bytes[index] = binary.charCodeAt(index);
  return bytes;
}

async function encryptionKey(secret: string, cryptoProvider: Crypto) {
  if (new TextEncoder().encode(secret).byteLength < 32)
    throw new Error(
      "La clave de cifrado de invitaciones debe tener al menos 32 bytes.",
    );
  const material = await cryptoProvider.subtle.digest(
    "SHA-256",
    new TextEncoder().encode("pide-un-deseo-invitation-token-v1:" + secret),
  );
  return cryptoProvider.subtle.importKey("raw", material, "AES-GCM", false, [
    "encrypt",
    "decrypt",
  ]);
}

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

export async function encryptInvitationToken(
  token: string,
  secret: string,
  cryptoProvider: Crypto = crypto,
): Promise<string> {
  const iv = cryptoProvider.getRandomValues(new Uint8Array(12));
  const key = await encryptionKey(secret, cryptoProvider);
  const ciphertext = await cryptoProvider.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    new TextEncoder().encode(token),
  );
  return `v1.${encodeBase64Url(iv)}.${encodeBase64Url(new Uint8Array(ciphertext))}`;
}

export async function decryptInvitationToken(
  encryptedToken: string,
  secret: string,
  cryptoProvider: Crypto = crypto,
): Promise<string> {
  const parts = encryptedToken.split(".");
  if (parts.length !== 3 || parts[0] !== "v1")
    throw new Error("El enlace guardado no tiene un formato válido.");
  const key = await encryptionKey(secret, cryptoProvider);
  const plaintext = await cryptoProvider.subtle.decrypt(
    { name: "AES-GCM", iv: decodeBase64Url(parts[1]) },
    key,
    decodeBase64Url(parts[2]),
  );
  return new TextDecoder().decode(plaintext);
}
