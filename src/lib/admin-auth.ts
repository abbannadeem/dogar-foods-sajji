/**
 * Single-admin session auth using HMAC-signed cookies.
 * Edge-compatible (Web Crypto) so middleware can verify without Node.
 *
 * Token format: base64url(payload) + "." + base64url(hmac(payload))
 * Payload: { exp: epoch-seconds }
 *
 * Required env vars:
 *   ADMIN_PASSWORD — what the owner types in the login form
 *   AUTH_SECRET    — random string used to sign session tokens
 */

export const ADMIN_COOKIE = "dogar-admin";
export const SESSION_DAYS = 7;

function getSecret(): string {
  const s = process.env.AUTH_SECRET;
  if (!s || s.length < 16) {
    // Fallback for local dev when nothing is set — clearly insecure for prod.
    return "dev-only-insecure-secret-please-set-AUTH_SECRET-in-env";
  }
  return s;
}

function b64urlEncode(bytes: ArrayBuffer | Uint8Array): string {
  const arr = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  let bin = "";
  for (let i = 0; i < arr.length; i++) bin += String.fromCharCode(arr[i]);
  return btoa(bin).replace(/=+$/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}

function b64urlDecode(s: string): Uint8Array {
  const pad = s.length % 4 === 0 ? "" : "=".repeat(4 - (s.length % 4));
  const norm = s.replace(/-/g, "+").replace(/_/g, "/") + pad;
  const bin = atob(norm);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

async function importKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

async function sign(payloadStr: string): Promise<string> {
  const key = await importKey(getSecret());
  const sig = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(payloadStr)
  );
  return b64urlEncode(sig);
}

async function verifySig(payloadStr: string, sigB64: string): Promise<boolean> {
  const key = await importKey(getSecret());
  const sigBytes = b64urlDecode(sigB64);
  return crypto.subtle.verify(
    "HMAC",
    key,
    sigBytes as unknown as BufferSource,
    new TextEncoder().encode(payloadStr)
  );
}

export type Session = { exp: number };

export async function createSession(ttlSeconds = SESSION_DAYS * 24 * 60 * 60): Promise<string> {
  const exp = Math.floor(Date.now() / 1000) + ttlSeconds;
  const payload: Session = { exp };
  const payloadStr = b64urlEncode(new TextEncoder().encode(JSON.stringify(payload)));
  const sig = await sign(payloadStr);
  return `${payloadStr}.${sig}`;
}

export async function verifySession(token: string | undefined | null): Promise<Session | null> {
  if (!token) return null;
  const dot = token.indexOf(".");
  if (dot < 1) return null;
  const payloadStr = token.slice(0, dot);
  const sigB64 = token.slice(dot + 1);
  try {
    const ok = await verifySig(payloadStr, sigB64);
    if (!ok) return null;
    const json = new TextDecoder().decode(b64urlDecode(payloadStr));
    const parsed = JSON.parse(json) as Session;
    if (!parsed?.exp || parsed.exp < Math.floor(Date.now() / 1000)) return null;
    return parsed;
  } catch {
    return null;
  }
}

/**
 * Constant-time string compare. Prevents timing attacks on password verification.
 */
export function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export function getAdminPassword(): string | null {
  const p = process.env.ADMIN_PASSWORD;
  if (!p || p.length === 0) return null;
  return p;
}
