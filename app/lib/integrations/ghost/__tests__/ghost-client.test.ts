/**
 * Ghost Client Tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GhostClient, createGhostClient } from '../ghost-client';

// Mock the Ghost API modules
vi.mock('@tryghost/content-api', () => ({
  default: vi.fn().mockImplementation(() => ({
    posts: {
      browse: vi.fn().mockResolvedValue([
        { id: '1', title: 'Test Post', slug: 'test-post' }
      ]),
      read: vi.fn().mockResolvedValue({
        id: '1',
        title: 'Test Post',
        slug: 'test-post',
        html: '<p>Test content</p>'
      })
    },
    tags: {
      browse: vi.fn().mockResolvedValue([
        { id: '1', name: 'Test Tag', slug: 'test-tag' }
      ])
    },
    authors: {
      browse: vi.fn().mockResolvedValue([
        { id: '1', name: 'Test Author', slug: 'test-author' }
      ])
    },
    settings: {
      browse: vi.fn().mockResolvedValue({
        title: 'Test Site',
        version: '5.0.0'
      })
    }
  }))
}));

vi.mock('@tryghost/admin-api', () => ({
  default: vi.fn().mockImplementation(() => ({
    posts: {
      add: vi.fn().mockResolvedValue({
        id: '123',
        uuid: 'uuid-123',
        title: 'New Post',
        slug: 'new-post',
        status: 'published',
        url: 'https://test.ghost.io/new-post',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }),
      edit: vi.fn().mockResolvedValue({
        id: '123',
        uuid: 'uuid-123',
        title: 'Updated Post',
        slug: 'updated-post',
        status: 'published',
        url: 'https://test.ghost.io/updated-post',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }),
      delete: vi.fn().mockResolvedValue({})
    }
  }))
}));

describe('GhostClient', () => {
  let client: GhostClient;

  beforeEach(() => {
    client = createGhostClient({
      url: 'https://test.ghost.io',
      contentApiKey: 'test-content-key',
      adminApiKey: 'test-admin-key'
    });
  });

  describe('Factory Function', () => {
    it('should create a Ghost client instance', () => {
      const newClient = createGhostClient({
        url: 'https://test.ghost.io',
        contentApiKey: 'test-key'
      });
      expect(newClient).toBeInstanceOf(GhostClient);
    });
  });

  describe('testConnection', () => {
    it('should test connection successfully', async () => {
      const result = await client.testConnection();
      expect(result.success).toBe(true);
      expect(result.message).toContain('Test Site');
    });
  });

  describe('getPosts', () => {
    it('should fetch posts', async () => {
      const result = await client.getPosts();
      expect(result.success).toBe(true);
      expect(result.posts).toBeDefined();
      expect(Array.isArray(result.posts)).toBe(true);
    });

    it('should fetch posts with options', async () => {
      const result = await client.getPosts({ limit: 5, filter: 'featured:true' });
      expect(result.success).toBe(true);
    });
  });

  describe('getPost', () => {
    it('should fetch a single post by ID', async () => {
      const result = await client.getPost('1');
      expect(result.success).toBe(true);
      expect(result.post).toBeDefined();
      expect(result.post?.id).toBe('1');
    });

    it('should fetch a single post by slug', async () => {
      const result = await client.getPost('test-post', true);
      expect(result.success).toBe(true);
      expect(result.post).toBeDefined();
    });
  });

  describe('createPost', () => {
    it('should create a new post', async () => {
      const result = await client.createPost({
        title: 'Test Post',
        html: '<p>Test content</p>',
        status: 'draft'
      });
      expect(result.success).toBe(true);
      expect(result.post).toBeDefined();
      expect(result.post?.title).toBe('New Post');
    });

    it('should create a post with tags', async () => {
      const result = await client.createPost({
        title: 'Test Post',
        html: '<p>Test content</p>',
        tags: ['tag1', 'tag2']
      });
      expect(result.success).toBe(true);
    });

    it('should fail without admin API key', async () => {
      const clientNoAdmin = createGhostClient({
        url: 'https://test.ghost.io',
        contentApiKey: 'test-content-key'
      });
      
      const result = await clientNoAdmin.createPost({
        title: 'Test',
        html: '<p>Test</p>'
      });
      
      expect(result.success).toBe(false);
      expect(result.error).toContain('Admin API key required');
    });
  });

  describe('updatePost', () => {
    it('should update an existing post', async () => {
      const result = await client.updatePost('123', {
        title: 'Updated Title'
      });
      expect(result.success).toBe(true);
      expect(result.post).toBeDefined();
    });
  });

  describe('deletePost', () => {
    it('should delete a post', async () => {
      const result = await client.deletePost('123');
      expect(result.success).toBe(true);
    });
  });

  describe('getTags', () => {
    it('should fetch tags', async () => {
      const result = await client.getTags();
      expect(result.success).toBe(true);
      expect(result.tags).toBeDefined();
    });
  });

  describe('getAuthors', () => {
    it('should fetch authors', async () => {
      const result = await client.getAuthors();
      expect(result.success).toBe(true);
      expect(result.authors).toBeDefined();
    });
  });

  describe('getSiteInfo', () => {
    it('should fetch site information', async () => {
      const result = await client.getSiteInfo();
      expect(result.success).toBe(true);
      expect(result.settings).toBeDefined();
      expect(result.settings?.title).toBe('Test Site');
    });
  });
});
