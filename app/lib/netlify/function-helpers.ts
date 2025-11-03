// app/lib/netlify/function-helpers.ts
// Shared utilities for Netlify Functions to reduce code duplication

import { HandlerEvent, HandlerResponse } from "@netlify/functions";

/**
 * Validates that the HTTP method matches the expected method
 * Returns an error response if it doesn't match
 */
export function validateHttpMethod(
  event: HandlerEvent,
  expectedMethod: string
): HandlerResponse | null {
  if (event.httpMethod !== expectedMethod) {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: `Method not allowed. Use ${expectedMethod}.` }),
    };
  }
  return null;
}

/**
 * Parses JSON request body safely
 * Returns parsed body or an error response
 */
export function parseRequestBody<T>(event: HandlerEvent): {
  body?: T;
  error?: HandlerResponse;
} {
  try {
    const body = JSON.parse(event.body || "{}") as T;
    return { body };
  } catch (error) {
    return {
      error: {
        statusCode: 400,
        body: JSON.stringify({
          error: "Invalid JSON in request body",
          details: (error as Error).message,
        }),
      },
    };
  }
}

/**
 * Validates that required fields are present in the request body
 */
export function validateRequiredFields<T extends Record<string, any>>(
  body: T,
  requiredFields: (keyof T)[]
): HandlerResponse | null {
  const missingFields = requiredFields.filter((field) => !body[field]);

  if (missingFields.length > 0) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: `Missing required fields: ${missingFields.join(", ")}`,
      }),
    };
  }

  return null;
}

/**
 * Validates that required environment variables are present
 * Returns an error response if any are missing
 */
export function validateEnvVars(
  requiredVars: Record<string, string | undefined>,
  serviceName: string
): HandlerResponse | null {
  const missingVars = Object.entries(requiredVars)
    .filter(([_, value]) => !value)
    .map(([key]) => key);

  if (missingVars.length > 0) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: `${serviceName} credentials not configured. Set ${missingVars.join(", ")} environment variables.`,
      }),
    };
  }

  return null;
}

/**
 * Creates a success response with consistent structure
 */
export function successResponse(
  data: Record<string, any>,
  statusCode: number = 200
): HandlerResponse {
  return {
    statusCode,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  };
}

/**
 * Creates an error response with consistent structure
 */
export function errorResponse(
  message: string,
  details?: string,
  statusCode: number = 500
): HandlerResponse {
  return {
    statusCode,
    body: JSON.stringify({
      error: message,
      ...(details && { details }),
    }),
  };
}
