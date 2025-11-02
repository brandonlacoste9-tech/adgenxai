// lib/api/__tests__/response.test.ts - Tests for response utilities

import { describe, it, expect } from 'vitest';
import {
  successResponse,
  errorResponse,
  corsPreflightResponse,
  methodNotAllowedResponse,
  validationErrorResponse,
  authenticationErrorResponse,
  notFoundResponse,
  rateLimitResponse,
  CORS_HEADERS,
} from '../response';
import { HttpStatus, ErrorCode } from '../types';

describe('API Response Utilities', () => {
  describe('successResponse', () => {
    it('creates a successful response with data', () => {
      const data = { id: 1, name: 'Test' };
      const response = successResponse(data);

      expect(response.statusCode).toBe(HttpStatus.OK);
      expect(response.headers).toEqual(CORS_HEADERS);

      const body = JSON.parse(response.body);
      expect(body.success).toBe(true);
      expect(body.data).toEqual(data);
      expect(body.meta).toHaveProperty('timestamp');
    });

    it('accepts custom status code', () => {
      const response = successResponse({ created: true }, HttpStatus.CREATED);
      expect(response.statusCode).toBe(HttpStatus.CREATED);
    });

    it('includes custom metadata', () => {
      const meta = { requestId: 'test-123' };
      const response = successResponse({ data: 'test' }, HttpStatus.OK, meta);

      const body = JSON.parse(response.body);
      expect(body.meta.requestId).toBe('test-123');
      expect(body.meta).toHaveProperty('timestamp');
    });
  });

  describe('errorResponse', () => {
    it('creates an error response', () => {
      const response = errorResponse('Something went wrong');

      expect(response.statusCode).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(response.headers).toEqual(CORS_HEADERS);

      const body = JSON.parse(response.body);
      expect(body.success).toBe(false);
      expect(body.error.message).toBe('Something went wrong');
      expect(body.error.code).toBe(ErrorCode.INTERNAL_ERROR);
      expect(body.error).toHaveProperty('timestamp');
    });

    it('accepts custom error code and details', () => {
      const details = { field: 'email', value: 'invalid' };
      const response = errorResponse(
        'Validation failed',
        HttpStatus.BAD_REQUEST,
        ErrorCode.VALIDATION_ERROR,
        details
      );

      const body = JSON.parse(response.body);
      expect(body.error.code).toBe(ErrorCode.VALIDATION_ERROR);
      expect(body.error.details).toEqual(details);
    });
  });

  describe('corsPreflightResponse', () => {
    it('creates a CORS preflight response', () => {
      const response = corsPreflightResponse();

      expect(response.statusCode).toBe(HttpStatus.NO_CONTENT);
      expect(response.headers).toEqual(CORS_HEADERS);
      expect(response.body).toBe('');
    });
  });

  describe('methodNotAllowedResponse', () => {
    it('creates a method not allowed response', () => {
      const response = methodNotAllowedResponse(['GET', 'POST']);

      expect(response.statusCode).toBe(HttpStatus.METHOD_NOT_ALLOWED);

      const body = JSON.parse(response.body);
      expect(body.error.code).toBe(ErrorCode.METHOD_NOT_ALLOWED);
      expect(body.error.message).toContain('GET, POST');
    });
  });

  describe('validationErrorResponse', () => {
    it('creates a validation error response', () => {
      const details = { errors: [{ field: 'email', message: 'Invalid email' }] };
      const response = validationErrorResponse(details);

      expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);

      const body = JSON.parse(response.body);
      expect(body.error.code).toBe(ErrorCode.VALIDATION_ERROR);
      expect(body.error.details).toEqual(details);
    });
  });

  describe('authenticationErrorResponse', () => {
    it('creates an authentication error response with default message', () => {
      const response = authenticationErrorResponse();

      expect(response.statusCode).toBe(HttpStatus.UNAUTHORIZED);

      const body = JSON.parse(response.body);
      expect(body.error.code).toBe(ErrorCode.AUTHENTICATION_ERROR);
      expect(body.error.message).toBe('Authentication required');
    });

    it('accepts custom message', () => {
      const response = authenticationErrorResponse('Invalid token');

      const body = JSON.parse(response.body);
      expect(body.error.message).toBe('Invalid token');
    });
  });

  describe('notFoundResponse', () => {
    it('creates a not found response with default resource', () => {
      const response = notFoundResponse();

      expect(response.statusCode).toBe(HttpStatus.NOT_FOUND);

      const body = JSON.parse(response.body);
      expect(body.error.code).toBe(ErrorCode.NOT_FOUND);
      expect(body.error.message).toBe('Resource not found');
    });

    it('accepts custom resource name', () => {
      const response = notFoundResponse('User');

      const body = JSON.parse(response.body);
      expect(body.error.message).toBe('User not found');
    });
  });

  describe('rateLimitResponse', () => {
    it('creates a rate limit response', () => {
      const response = rateLimitResponse();

      expect(response.statusCode).toBe(HttpStatus.TOO_MANY_REQUESTS);

      const body = JSON.parse(response.body);
      expect(body.error.code).toBe(ErrorCode.RATE_LIMIT_EXCEEDED);
    });

    it('includes Retry-After header when provided', () => {
      const response = rateLimitResponse(60);

      expect(response.headers['Retry-After']).toBe('60');

      const body = JSON.parse(response.body);
      expect(body.error.retryAfter).toBe(60);
    });
  });
});
