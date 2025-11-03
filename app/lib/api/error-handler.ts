// app/lib/api/error-handler.ts
// Shared utilities for API routes to reduce code duplication

import { NextRequest } from "next/server";

/**
 * Wraps an API route handler with try-catch error handling
 * Automatically returns standardized error responses
 */
export function withErrorHandler<T = any>(
  handler: (req: NextRequest) => Promise<Response>
): (req: NextRequest) => Promise<Response> {
  return async (req: NextRequest): Promise<Response> => {
    try {
      return await handler(req);
    } catch (error) {
      console.error("API route error:", error);
      return Response.json(
        { error: (error as Error).message },
        { status: 500 }
      );
    }
  };
}

/**
 * Creates a standardized JSON error response
 */
export function errorResponse(
  message: string,
  status: number = 500,
  details?: string
): Response {
  return Response.json(
    {
      error: message,
      ...(details && { details }),
    },
    { status }
  );
}

/**
 * Creates a standardized JSON success response
 */
export function successResponse<T = any>(
  data: T,
  status: number = 200
): Response {
  return Response.json(data, { status });
}

/**
 * Validates that required fields are present in an object
 * Returns error response if validation fails, null otherwise
 */
export function validateFields<T extends Record<string, any>>(
  obj: T,
  requiredFields: (keyof T)[]
): Response | null {
  const missingFields = requiredFields.filter((field) => !obj[field]);

  if (missingFields.length > 0) {
    return errorResponse(
      `Missing required fields: ${missingFields.join(", ")}`,
      400
    );
  }

  return null;
}
