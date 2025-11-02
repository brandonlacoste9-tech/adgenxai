// lib/api/types.ts - Shared API types for AdGenXAI

import { Handler, HandlerEvent, HandlerContext, HandlerResponse } from '@netlify/functions';

/**
 * Standard API response format
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: ApiError;
  meta?: ApiMetadata;
}

/**
 * API error information
 */
export interface ApiError {
  code: string;
  message: string;
  details?: any;
  timestamp: string;
}

/**
 * API metadata for responses
 */
export interface ApiMetadata {
  timestamp: string;
  requestId?: string;
  version?: string;
  [key: string]: any;
}

/**
 * Platform configuration types
 */
export interface PlatformCredentials {
  accountId?: string;
  accessToken?: string;
  clientKey?: string;
  clientSecret?: string;
}

/**
 * Content publishing request
 */
export interface PublishRequest {
  platform: 'instagram' | 'tiktok' | 'youtube';
  contentUrl: string;
  caption?: string;
  title?: string;
  description?: string;
  metadata?: Record<string, any>;
}

/**
 * Publishing result
 */
export interface PublishResult {
  platform: string;
  publishedId: string;
  url?: string;
  status: 'success' | 'pending' | 'failed';
}

/**
 * Health check response
 */
export interface HealthCheckResponse {
  status: 'healthy' | 'degraded' | 'unhealthy';
  uptime?: string;
  timestamp: string;
  services?: Record<string, ServiceStatus>;
  version?: string;
}

/**
 * Service status
 */
export interface ServiceStatus {
  status: 'up' | 'down' | 'degraded';
  latency?: number;
  message?: string;
}

/**
 * HTTP status codes commonly used
 */
export enum HttpStatus {
  OK = 200,
  CREATED = 201,
  ACCEPTED = 202,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  METHOD_NOT_ALLOWED = 405,
  CONFLICT = 409,
  UNPROCESSABLE_ENTITY = 422,
  TOO_MANY_REQUESTS = 429,
  INTERNAL_SERVER_ERROR = 500,
  BAD_GATEWAY = 502,
  SERVICE_UNAVAILABLE = 503,
  GATEWAY_TIMEOUT = 504,
}

/**
 * Standard error codes
 */
export enum ErrorCode {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR',
  AUTHORIZATION_ERROR = 'AUTHORIZATION_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  METHOD_NOT_ALLOWED = 'METHOD_NOT_ALLOWED',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
  EXTERNAL_API_ERROR = 'EXTERNAL_API_ERROR',
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  MISSING_CONFIGURATION = 'MISSING_CONFIGURATION',
}

/**
 * Type for Netlify function handler with better typing
 */
export type ApiHandler = Handler;
