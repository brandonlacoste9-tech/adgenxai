// lib/api/response.ts - Standardized API response utilities

import { HandlerResponse } from '@netlify/functions';
import { ApiResponse, ApiError, HttpStatus, ErrorCode } from './types';

/**
 * Standard CORS headers for API responses
 */
export const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Request-ID',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Content-Type': 'application/json',
};

/**
 * Create a successful API response
 */
export function successResponse<T>(
  data: T,
  statusCode: number = HttpStatus.OK,
  meta?: Record<string, any>
): HandlerResponse {
  const response: ApiResponse<T> = {
    success: true,
    data,
    meta: {
      timestamp: new Date().toISOString(),
      ...meta,
    },
  };

  return {
    statusCode,
    headers: CORS_HEADERS,
    body: JSON.stringify(response),
  };
}

/**
 * Create an error API response
 */
export function errorResponse(
  message: string,
  statusCode: number = HttpStatus.INTERNAL_SERVER_ERROR,
  code: ErrorCode | string = ErrorCode.INTERNAL_ERROR,
  details?: any
): HandlerResponse {
  const error: ApiError = {
    code,
    message,
    details,
    timestamp: new Date().toISOString(),
  };

  const response: ApiResponse = {
    success: false,
    error,
  };

  return {
    statusCode,
    headers: CORS_HEADERS,
    body: JSON.stringify(response),
  };
}

/**
 * Handle OPTIONS requests for CORS preflight
 */
export function corsPreflightResponse(): HandlerResponse {
  return {
    statusCode: HttpStatus.NO_CONTENT,
    headers: CORS_HEADERS,
    body: '',
  };
}

/**
 * Create a method not allowed response
 */
export function methodNotAllowedResponse(allowedMethods: string[]): HandlerResponse {
  return errorResponse(
    `Method not allowed. Allowed methods: ${allowedMethods.join(', ')}`,
    HttpStatus.METHOD_NOT_ALLOWED,
    ErrorCode.METHOD_NOT_ALLOWED
  );
}

/**
 * Create a validation error response
 */
export function validationErrorResponse(details: any): HandlerResponse {
  return errorResponse(
    'Validation failed',
    HttpStatus.BAD_REQUEST,
    ErrorCode.VALIDATION_ERROR,
    details
  );
}

/**
 * Create an authentication error response
 */
export function authenticationErrorResponse(message: string = 'Authentication required'): HandlerResponse {
  return errorResponse(
    message,
    HttpStatus.UNAUTHORIZED,
    ErrorCode.AUTHENTICATION_ERROR
  );
}

/**
 * Create a not found error response
 */
export function notFoundResponse(resource: string = 'Resource'): HandlerResponse {
  return errorResponse(
    `${resource} not found`,
    HttpStatus.NOT_FOUND,
    ErrorCode.NOT_FOUND
  );
}

/**
 * Create a rate limit error response
 */
export function rateLimitResponse(retryAfter?: number): HandlerResponse {
  const headers = { ...CORS_HEADERS };
  if (retryAfter) {
    headers['Retry-After'] = retryAfter.toString();
  }

  return {
    statusCode: HttpStatus.TOO_MANY_REQUESTS,
    headers,
    body: JSON.stringify({
      success: false,
      error: {
        code: ErrorCode.RATE_LIMIT_EXCEEDED,
        message: 'Rate limit exceeded. Please try again later.',
        timestamp: new Date().toISOString(),
        retryAfter,
      },
    }),
  };
}
