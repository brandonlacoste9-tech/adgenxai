import { test } from 'node:test';
import assert from 'node:assert/strict';

import { errorResponse, methodNotAllowedResponse, noContentResponse, successResponse } from './response.js';

test('creates a success response with defaults', () => {
  const response = successResponse({ ok: true }, { timestamp: '2024-01-01T00:00:00.000Z' });

  assert.strictEqual(response.statusCode, 200);
  assert.deepStrictEqual(response.headers, { 'Content-Type': 'application/json' });

  assert.ok(response.body);
  const body = JSON.parse(response.body);
  assert.deepStrictEqual(body, {
    success: true,
    data: { ok: true },
    timestamp: '2024-01-01T00:00:00.000Z'
  });
});

test('allows overriding status code, headers, and meta data', () => {
  const response = successResponse(
    { id: '123' },
    {
      statusCode: 201,
      headers: { 'Cache-Control': 'no-store' },
      meta: { requestId: 'req_456' },
      timestamp: '2024-02-01T12:30:00.000Z'
    }
  );

  assert.strictEqual(response.statusCode, 201);
  assert.deepStrictEqual(response.headers, {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-store'
  });

  assert.ok(response.body);
  const body = JSON.parse(response.body);
  assert.deepStrictEqual(body, {
    success: true,
    data: { id: '123' },
    meta: { requestId: 'req_456' },
    timestamp: '2024-02-01T12:30:00.000Z'
  });
});

test('creates an error response with diagnostic information', () => {
  const response = errorResponse('Validation failed', {
    statusCode: 400,
    code: 'validation_error',
    details: { field: 'email' },
    timestamp: '2024-03-10T08:45:00.000Z'
  });

  assert.strictEqual(response.statusCode, 400);
  assert.deepStrictEqual(response.headers, { 'Content-Type': 'application/json' });

  assert.ok(response.body);
  const body = JSON.parse(response.body);
  assert.deepStrictEqual(body, {
    success: false,
    error: {
      message: 'Validation failed',
      code: 'validation_error',
      details: { field: 'email' }
    },
    timestamp: '2024-03-10T08:45:00.000Z'
  });
});

test('creates a method not allowed response with Allow header and metadata', () => {
  const response = methodNotAllowedResponse(['POST', 'PUT'], {
    meta: { hint: 'Use POST' },
    timestamp: '2024-04-15T14:20:00.000Z'
  });

  assert.strictEqual(response.statusCode, 405);
  assert.deepStrictEqual(response.headers, {
    'Content-Type': 'application/json',
    Allow: 'POST, PUT'
  });

  assert.ok(response.body);
  const body = JSON.parse(response.body);
  assert.deepStrictEqual(body, {
    success: false,
    error: {
      message: 'Method not allowed',
      code: 'method_not_allowed',
      details: { allowedMethods: ['POST', 'PUT'] }
    },
    meta: { hint: 'Use POST' },
    timestamp: '2024-04-15T14:20:00.000Z'
  });
});

test('creates a no content response without body', () => {
  const response = noContentResponse({ 'X-Request-Id': 'req789' });

  assert.strictEqual(response.statusCode, 204);
  assert.strictEqual(response.body, '');
  assert.deepStrictEqual(response.headers, { 'X-Request-Id': 'req789' });
});
