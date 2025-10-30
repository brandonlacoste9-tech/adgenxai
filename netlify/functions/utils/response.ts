import type { HandlerResponse } from '@netlify/functions';

const JSON_HEADER = { 'Content-Type': 'application/json' } as const;

export interface JsonResponseInit {
  statusCode?: number;
  headers?: Record<string, string>;
}

export const jsonResponse = (
  body: unknown,
  { statusCode = 200, headers = {} }: JsonResponseInit = {}
): HandlerResponse => ({
  statusCode,
  headers: {
    ...JSON_HEADER,
    ...headers
  },
  body: JSON.stringify(body)
});

export const errorResponse = (
  message: string,
  init: JsonResponseInit = {},
  details?: Record<string, unknown>
): HandlerResponse => {
  const { statusCode = 500, headers } = init;
  return jsonResponse(
    {
      error: message,
      ...(details ?? {})
    },
    { statusCode, headers }
  );
};
