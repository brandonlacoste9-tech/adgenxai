// lib/api/middleware.ts - Middleware utilities for Netlify functions

import { HandlerEvent, HandlerResponse } from '@netlify/functions';
import { corsPreflightResponse, methodNotAllowedResponse } from './response';

/**
 * Check if the HTTP method is allowed
 */
export function checkMethod(
  event: HandlerEvent,
  allowedMethods: string[]
): HandlerResponse | null {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return corsPreflightResponse();
  }

  // Check if method is allowed
  if (!allowedMethods.includes(event.httpMethod)) {
    return methodNotAllowedResponse(allowedMethods);
  }

  return null;
}

/**
 * Extract request ID from headers or generate one
 */
export function getRequestId(event: HandlerEvent): string {
  return event.headers['x-request-id'] || `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Extract environment variable with validation
 */
export function getRequiredEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

/**
 * Extract optional environment variable
 */
export function getOptionalEnv(key: string, defaultValue?: string): string | undefined {
  return process.env[key] || defaultValue;
}

/**
 * Log request information for debugging
 */
export function logRequest(event: HandlerEvent, requestId: string): void {
  console.log(JSON.stringify({
    requestId,
    method: event.httpMethod,
    path: event.path,
    timestamp: new Date().toISOString(),
    headers: {
      userAgent: event.headers['user-agent'],
      contentType: event.headers['content-type'],
    },
  }));
}

/**
 * Log response information for debugging
 */
export function logResponse(requestId: string, statusCode: number, duration: number): void {
  console.log(JSON.stringify({
    requestId,
    statusCode,
    duration,
    timestamp: new Date().toISOString(),
  }));
}

/**
 * Measure execution time
 */
export function createTimer(): { elapsed: () => number } {
  const start = Date.now();
  return {
    elapsed: () => Date.now() - start,
  };
}
