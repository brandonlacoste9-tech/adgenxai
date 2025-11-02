// lib/api/__tests__/validation.test.ts - Tests for validation utilities

import { describe, it, expect } from 'vitest';
import { z } from 'zod';
import { validateBody, sanitizeString, sanitizeObject, schemas } from '../validation';
import { HttpStatus, ErrorCode } from '../types';

describe('API Validation Utilities', () => {
  describe('validateBody', () => {
    const testSchema = z.object({
      name: z.string(),
      age: z.number().positive(),
    });

    it('validates valid data successfully', () => {
      const body = JSON.stringify({ name: 'John', age: 30 });
      const result = validateBody(body, testSchema);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.name).toBe('John');
        expect(result.data.age).toBe(30);
      }
    });

    it('rejects invalid data', () => {
      const body = JSON.stringify({ name: 'John', age: -5 });
      const result = validateBody(body, testSchema);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.response.statusCode).toBe(HttpStatus.BAD_REQUEST);
        const responseBody = JSON.parse(result.response.body);
        expect(responseBody.error.code).toBe(ErrorCode.VALIDATION_ERROR);
      }
    });

    it('rejects null body', () => {
      const result = validateBody(null, testSchema);

      expect(result.success).toBe(false);
      if (!result.success) {
        const responseBody = JSON.parse(result.response.body);
        expect(responseBody.error.details.message).toBe('Request body is required');
      }
    });

    it('rejects invalid JSON', () => {
      const result = validateBody('{ invalid json', testSchema);

      expect(result.success).toBe(false);
      if (!result.success) {
        const responseBody = JSON.parse(result.response.body);
        expect(responseBody.error.details.message).toBe('Invalid JSON in request body');
      }
    });
  });

  describe('sanitizeString', () => {
    it('removes null bytes', () => {
      const input = 'hello\0world';
      const output = sanitizeString(input);
      expect(output).toBe('helloworld');
    });

    it('trims whitespace', () => {
      const input = '  hello world  ';
      const output = sanitizeString(input);
      expect(output).toBe('hello world');
    });

    it('limits length to prevent DoS', () => {
      const input = 'a'.repeat(20000);
      const output = sanitizeString(input);
      expect(output.length).toBe(10000);
    });

    it('preserves normal strings', () => {
      const input = 'Hello, World!';
      const output = sanitizeString(input);
      expect(output).toBe('Hello, World!');
    });
  });

  describe('sanitizeObject', () => {
    it('sanitizes string properties', () => {
      const input = { name: '  John  ', email: 'test\0@example.com' };
      const output = sanitizeObject(input);
      expect(output.name).toBe('John');
      expect(output.email).toBe('test@example.com');
    });

    it('sanitizes nested objects', () => {
      const input = { user: { name: '  Jane  ' } };
      const output = sanitizeObject(input);
      expect(output.user.name).toBe('Jane');
    });

    it('sanitizes arrays', () => {
      const input = ['  hello  ', '  world  '];
      const output = sanitizeObject(input);
      expect(output).toEqual(['hello', 'world']);
    });

    it('handles mixed types', () => {
      const input = {
        string: '  test  ',
        number: 42,
        boolean: true,
        array: ['  item  '],
      };
      const output = sanitizeObject(input);
      expect(output.string).toBe('test');
      expect(output.number).toBe(42);
      expect(output.boolean).toBe(true);
      expect(output.array[0]).toBe('item');
    });
  });

  describe('schemas', () => {
    describe('instagramPost', () => {
      it('validates valid Instagram post', () => {
        const data = {
          imageUrl: 'https://example.com/image.jpg',
          caption: 'Test caption',
        };
        const result = schemas.instagramPost.safeParse(data);
        expect(result.success).toBe(true);
      });

      it('rejects invalid URL', () => {
        const data = {
          imageUrl: 'not-a-url',
          caption: 'Test caption',
        };
        const result = schemas.instagramPost.safeParse(data);
        expect(result.success).toBe(false);
      });

      it('rejects missing caption', () => {
        const data = {
          imageUrl: 'https://example.com/image.jpg',
          caption: '',
        };
        const result = schemas.instagramPost.safeParse(data);
        expect(result.success).toBe(false);
      });
    });

    describe('tiktokPost', () => {
      it('validates valid TikTok post', () => {
        const data = {
          videoUrl: 'https://example.com/video.mp4',
          title: 'Test title',
          description: 'Test description',
        };
        const result = schemas.tiktokPost.safeParse(data);
        expect(result.success).toBe(true);
      });

      it('validates with privacy level', () => {
        const data = {
          videoUrl: 'https://example.com/video.mp4',
          title: 'Test title',
          privacyLevel: 'PUBLIC_TO_EVERYONE',
        };
        const result = schemas.tiktokPost.safeParse(data);
        expect(result.success).toBe(true);
      });
    });

    describe('youtubePost', () => {
      it('validates valid YouTube post', () => {
        const data = {
          videoUrl: 'https://example.com/video.mp4',
          title: 'Test title',
          description: 'Test description',
          privacyStatus: 'public',
          tags: ['tag1', 'tag2'],
        };
        const result = schemas.youtubePost.safeParse(data);
        expect(result.success).toBe(true);
      });

      it('rejects invalid privacy status', () => {
        const data = {
          videoUrl: 'https://example.com/video.mp4',
          title: 'Test title',
          privacyStatus: 'invalid',
        };
        const result = schemas.youtubePost.safeParse(data);
        expect(result.success).toBe(false);
      });
    });
  });
});
