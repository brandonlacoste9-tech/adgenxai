import crypto from "crypto";

export interface JwtPayload {
  sub?: string;
  scope?: string | string[];
  exp?: number;
  [key: string]: unknown;
}

export class JwtError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "JwtError";
  }
}

function base64UrlDecode(segment: string): Buffer {
  const normalized = segment.replace(/-/g, "+").replace(/_/g, "/");
  const padding = normalized.length % 4 === 0 ? 0 : 4 - (normalized.length % 4);
  return Buffer.from(normalized + "=".repeat(padding), "base64");
}

function safeJsonParse<T = unknown>(buffer: Buffer): T {
  try {
    return JSON.parse(buffer.toString("utf8"));
  } catch (error) {
    throw new JwtError("Invalid JWT: payload is not valid JSON");
  }
}

export function verifyJwt(token: string, secret: string): JwtPayload {
  const segments = token.split(".");
  if (segments.length !== 3) {
    throw new JwtError("Invalid JWT: token must have three segments");
  }

  const [headerSegment, payloadSegment, signatureSegment] = segments;
  const header = safeJsonParse<{ alg?: string }>(base64UrlDecode(headerSegment));

  if (header.alg !== "HS256") {
    throw new JwtError("Unsupported JWT algorithm. Expected HS256");
  }

  const data = `${headerSegment}.${payloadSegment}`;
  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(data)
    .digest("base64url");

  const providedSignature = Buffer.from(signatureSegment);
  const expectedSignatureBuffer = Buffer.from(expectedSignature);

  if (providedSignature.length !== expectedSignatureBuffer.length) {
    throw new JwtError("Invalid JWT signature");
  }

  if (!crypto.timingSafeEqual(providedSignature, expectedSignatureBuffer)) {
    throw new JwtError("Invalid JWT signature");
  }

  const payload = safeJsonParse<JwtPayload>(base64UrlDecode(payloadSegment));

  if (typeof payload.exp === "number") {
    const nowSeconds = Math.floor(Date.now() / 1000);
    if (payload.exp < nowSeconds) {
      throw new JwtError("JWT has expired");
    }
  }

  return payload;
}

export function scopesFromPayload(payload: JwtPayload): string[] {
  if (Array.isArray(payload.scope)) {
    return payload.scope.map((s) => s.trim()).filter(Boolean);
  }

  if (typeof payload.scope === "string") {
    return payload.scope
      .split(/[ ,]/)
      .map((s) => s.trim())
      .filter(Boolean);
  }

  return [];
}
