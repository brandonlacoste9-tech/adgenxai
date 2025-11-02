// lib/api/validation.ts - Request validation utilities using Zod

import { z } from 'zod';
import { validationErrorResponse } from './response';
import { HandlerResponse } from '@netlify/functions';

/**
 * Validate request body against a Zod schema
 * Returns parsed data or validation error response
 */
export function validateBody<T extends z.ZodType>(
  body: string | null,
  schema: T
): { success: true; data: z.infer<T> } | { success: false; response: HandlerResponse } {
  try {
    if (!body) {
      return {
        success: false,
        response: validationErrorResponse({ message: 'Request body is required' }),
      };
    }

    const parsed = JSON.parse(body);
    const result = schema.safeParse(parsed);

    if (!result.success) {
      return {
        success: false,
        response: validationErrorResponse({
          message: 'Invalid request body',
          errors: result.error.errors.map((err) => ({
            path: err.path.join('.'),
            message: err.message,
            code: err.code,
          })),
        }),
      };
    }

    return { success: true, data: result.data };
  } catch (error) {
    return {
      success: false,
      response: validationErrorResponse({
        message: 'Invalid JSON in request body',
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
    };
  }
}

/**
 * Common validation schemas
 */
export const schemas = {
  // Instagram post validation
  instagramPost: z.object({
    imageUrl: z.string().url('Invalid image URL'),
    caption: z.string().min(1, 'Caption is required').max(2200, 'Caption too long'),
  }),

  // TikTok post validation
  tiktokPost: z.object({
    videoUrl: z.string().url('Invalid video URL'),
    title: z.string().min(1, 'Title is required').max(150, 'Title too long'),
    description: z.string().max(2200, 'Description too long').optional(),
    privacyLevel: z
      .enum([
        'PUBLIC_TO_EVERYONE',      // Video visible to all TikTok users
        'MUTUAL_FOLLOW_FRIENDS',   // Visible to users who follow each other
        'FOLLOWER_OF_CREATOR',     // Visible only to your followers
        'SELF_ONLY'                // Visible only to you (private)
      ])
      .optional(),
  }),

  // YouTube post validation
  youtubePost: z.object({
    videoUrl: z.string().url('Invalid video URL'),
    title: z.string().min(1, 'Title is required').max(100, 'Title too long'),
    description: z.string().max(5000, 'Description too long').optional(),
    privacyStatus: z.enum(['public', 'private', 'unlisted']).optional(),
    tags: z.array(z.string()).max(500, 'Too many tags').optional(),
  }),

  // Generic webhook payload
  webhookPayload: z.object({
    type: z.string().optional(),
    payload: z.record(z.any()).optional(),
    hero_variant: z.string().optional(),
    timestamp: z.string().optional(),
  }),

  // Health check request
  healthCheck: z.object({
    detailed: z.boolean().optional(),
  }),
};

/**
 * Sanitize string input to prevent XSS and injection attacks
 */
export function sanitizeString(input: string): string {
  // Remove null bytes
  let sanitized = input.replace(/\0/g, '');
  
  // Trim whitespace
  sanitized = sanitized.trim();
  
  // Limit length to prevent DoS
  if (sanitized.length > 10000) {
    sanitized = sanitized.substring(0, 10000);
  }
  
  return sanitized;
}

/**
 * Sanitize object recursively
 */
export function sanitizeObject(obj: any): any {
  if (typeof obj === 'string') {
    return sanitizeString(obj);
  }
  
  if (Array.isArray(obj)) {
    return obj.map(sanitizeObject);
  }
  
  if (obj && typeof obj === 'object') {
    const sanitized: any = {};
    for (const [key, value] of Object.entries(obj)) {
      sanitized[sanitizeString(key)] = sanitizeObject(value);
    }
    return sanitized;
  }
  
  return obj;
}
