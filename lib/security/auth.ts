import { JwtError, JwtPayload, scopesFromPayload, verifyJwt } from "./jwt";

export interface AuthContext {
  token: string;
  payload: JwtPayload;
  userId: string;
  scopes: string[];
}

export class AuthError extends Error {
  public readonly statusCode: number;
  public readonly code: string;

  constructor(message: string, statusCode = 401, code = "unauthorized") {
    super(message);
    this.name = "AuthError";
    this.statusCode = statusCode;
    this.code = code;
  }
}

function getHeaderValue(
  headers: Record<string, string | undefined>,
  headerName: string
): string | undefined {
  const direct = headers[headerName];
  if (direct) return direct;

  const lowerCaseKey = Object.keys(headers).find(
    (key) => key.toLowerCase() === headerName.toLowerCase()
  );
  return lowerCaseKey ? headers[lowerCaseKey] : undefined;
}

export interface RequireAuthOptions {
  requiredScopes?: string[];
}

export function requireAuth(
  headers: Record<string, string | undefined>,
  options: RequireAuthOptions = {}
): AuthContext {
  const authorization = getHeaderValue(headers, "authorization");
  if (!authorization) {
    throw new AuthError("Missing Authorization header");
  }

  const tokenMatch = authorization.match(/^Bearer\s+(.+)$/i);
  if (!tokenMatch) {
    throw new AuthError("Authorization header must be a Bearer token");
  }

  const token = tokenMatch[1];
  const secret = process.env.POSTING_JWT_SECRET;
  if (!secret) {
    throw new AuthError(
      "Server misconfiguration: POSTING_JWT_SECRET is not set",
      500,
      "server_error"
    );
  }

  let payload: JwtPayload;
  try {
    payload = verifyJwt(token, secret);
  } catch (error) {
    if (error instanceof JwtError) {
      throw new AuthError(error.message);
    }
    throw error;
  }

  const scopes = scopesFromPayload(payload);
  if (options.requiredScopes?.length) {
    const missing = options.requiredScopes.filter(
      (scope) => !scopes.includes(scope)
    );
    if (missing.length > 0) {
      throw new AuthError(
        `Missing required scope(s): ${missing.join(", ")}`,
        403,
        "forbidden"
      );
    }
  }

  const userId = typeof payload.sub === "string" && payload.sub.length > 0
    ? payload.sub
    : "anonymous";

  return { token, payload, userId, scopes };
}
