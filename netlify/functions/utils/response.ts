import type { HandlerResponse } from '@netlify/functions';

const JSON_CONTENT_HEADER = 'Content-Type';
const JSON_CONTENT_TYPE = 'application/json';

interface BaseResponseOptions {
  statusCode?: number;
  headers?: Record<string, string>;
  timestamp?: string;
  meta?: Record<string, unknown>;
}

interface ErrorResponseOptions extends BaseResponseOptions {
  code?: string;
  details?: unknown;
}

const normalizeHeaders = (headers: Record<string, string> = {}): Record<string, string> => ({
  [JSON_CONTENT_HEADER]: JSON_CONTENT_TYPE,
  ...headers
});

const withMeta = (
  body: Record<string, unknown>,
  meta?: Record<string, unknown>
): Record<string, unknown> => {
  if (!meta) {
    return body;
  }

  return {
    ...body,
    meta
  };
};

export const successResponse = <T>(
  data: T,
  options: BaseResponseOptions = {}
): HandlerResponse => {
  const { statusCode = 200, headers, timestamp, meta } = options;

  const body = withMeta(
    {
      success: true,
      data,
      timestamp: timestamp ?? new Date().toISOString()
    },
    meta
  );

  return {
    statusCode,
    headers: normalizeHeaders(headers),
    body: JSON.stringify(body)
  };
};

export const errorResponse = (
  message: string,
  options: ErrorResponseOptions = {}
): HandlerResponse => {
  const { statusCode = 500, headers, timestamp, meta, code, details } = options;

  const errorPayload: Record<string, unknown> = {
    message
  };

  if (code) {
    errorPayload.code = code;
  }

  if (details !== undefined) {
    errorPayload.details = details;
  }

  const body = withMeta(
    {
      success: false,
      error: errorPayload,
      timestamp: timestamp ?? new Date().toISOString()
    },
    meta
  );

  return {
    statusCode,
    headers: normalizeHeaders(headers),
    body: JSON.stringify(body)
  };
};

export const methodNotAllowedResponse = (
  allowedMethods: string[],
  options: Omit<ErrorResponseOptions, 'statusCode' | 'code' | 'details'> = {}
): HandlerResponse => {
  const allowHeaderValue = allowedMethods.join(', ');

  return errorResponse('Method not allowed', {
    ...options,
    statusCode: 405,
    code: 'method_not_allowed',
    details: { allowedMethods },
    headers: {
      Allow: allowHeaderValue,
      ...(options.headers ?? {})
    }
  });
};

export const noContentResponse = (
  headers: Record<string, string> = {}
): HandlerResponse => ({
  statusCode: 204,
  headers,
  body: ''
});

export type { BaseResponseOptions, ErrorResponseOptions };
