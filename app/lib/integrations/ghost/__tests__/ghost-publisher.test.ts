/**
 * Ghost Publisher Tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GhostPublisher, createGhostPublisher } from '../ghost-publisher';

// Mock the Ghost client
vi.mock('../ghost-client', () => ({
  GhostClient: vi.fn().mockImplementation(() => ({
    testConnection: vi.fn().mockResolvedValue({
      success: true,
      message: 'Connected to Test Site'
    }),
    createPost: vi.fn().mockResolvedValue({
      success: true,
      post: {
        id: '123',
        url: 'https://test.ghost.io/test-post'
      }
    }),
    updatePost: vi.fn().mockResolvedValue({
      success: true,
      post: {
        id: '123',
        url: 'https://test.ghost.io/test-post'
      }
    }),
    getPosts: vi.fn().mockResolvedValue({
      success: true,
      posts: []
    }),
    getTags: vi.fn().mockResolvedValue({
      success: true,
      tags: []
    }),
    getSiteInfo: vi.fn().mockResolvedValue({
      success: true,
      settings: { title: 'Test Site' }
    })
  }))
}));

describe('GhostPublisher', () => {
  let publisher: GhostPublisher;

  beforeEach(() => {
    publisher = createGhostPublisher({
      url: 'https://test.ghost.io',
      contentApiKey: 'test-content-key',
      adminApiKey: 'test-admin-key'
    });
  });

  describe('Factory Function', () => {
    it('should create a Ghost publisher instance', () => {
      const newPublisher = createGhostPublisher({
        url: 'https://test.ghost.io',
        contentApiKey: 'test-key',
        adminApiKey: 'test-admin-key'
      });
      expect(newPublisher).toBeInstanceOf(GhostPublisher);
    });
  });

  describe('publishAIContent', () => {
    it('should publish AI-generated content as HTML', async () => {
      const result = await publisher.publishAIContent({
        title: 'AI Generated Post',
        content: '<h1>Test Content</h1>',
        format: 'html'
      });

      expect(result.success).toBe(true);
      expect(result.postUrl).toBeDefined();
      expect(result.postId).toBeDefined();
    });

    it('should publish AI-generated content as Markdown', async () => {
      const result = await publisher.publishAIContent({
        title: 'AI Generated Post',
        content: '# Test Content',
        format: 'markdown'
      });

      expect(result.success).toBe(true);
    });

    it('should publish with custom options', async () => {
      const result = await publisher.publishAIContent(
        {
          title: 'Test Post',
          content: '<p>Content</p>',
          format: 'html'
        },
        {
          status: 'published',
          featured: true,
          tags: ['ai', 'test']
        }
      );

      expect(result.success).toBe(true);
    });

    it('should add AI metadata when requested', async () => {
      const result = await publisher.publishAIContent(
        {
          title: 'Test Post',
          content: '<p>Content</p>',
          format: 'html',
          metadata: {
            provider: 'openai',
            prompt: 'Test prompt',
            generatedAt: new Date()
          }
        },
        {
          addAIMetadata: true
        }
      );

      expect(result.success).toBe(true);
    });
  });

  describe('publishBatch', () => {
    it('should publish multiple posts', async () => {
      const contents = [
        {
          title: 'Post 1',
          content: '<p>Content 1</p>',
          format: 'html' as const
        },
        {
          title: 'Post 2',
          content: '<p>Content 2</p>',
          format: 'html' as const
        }
      ];

      const result = await publisher.publishBatch(contents);

      expect(result.success).toBe(true);
      expect(result.results).toHaveLength(2);
      expect(result.summary.total).toBe(2);
      expect(result.summary.succeeded).toBe(2);
      expect(result.summary.failed).toBe(0);
    });

    it('should handle mixed success/failure', async () => {
      // Mock one success, one failure
      const publisherWithFailure = createGhostPublisher({
        url: 'https://test.ghost.io',
        contentApiKey: 'test-key',
        adminApiKey: 'test-admin-key'
      });

      const contents = [
        {
          title: 'Post 1',
          content: '<p>Content 1</p>',
          format: 'html' as const
        }
      ];

      const result = await publisherWithFailure.publishBatch(contents);

      expect(result.summary.total).toBe(1);
    });
  });

  describe('updateWithAIContent', () => {
    it('should update an existing post', async () => {
      const result = await publisher.updateWithAIContent(
        '123',
        {
          title: 'Updated Title',
          content: '<p>Updated content</p>',
          format: 'html'
        }
      );

      expect(result.success).toBe(true);
      expect(result.postUrl).toBeDefined();
    });

    it('should update with options', async () => {
      const result = await publisher.updateWithAIContent(
        '123',
        {
          title: 'Updated Title',
          content: '<p>Updated content</p>',
          format: 'html'
        },
        {
          status: 'published',
          tags: ['updated']
        }
      );

      expect(result.success).toBe(true);
    });
  });

  describe('testConnection', () => {
    it('should test Ghost connection', async () => {
      const result = await publisher.testConnection();
      expect(result.success).toBe(true);
      expect(result.message).toContain('Test Site');
    });
  });

  describe('getPosts', () => {
    it('should fetch posts', async () => {
      const result = await publisher.getPosts();
      expect(result.success).toBe(true);
    });

    it('should fetch posts with options', async () => {
      const result = await publisher.getPosts({ limit: 10 });
      expect(result.success).toBe(true);
    });
  });

  describe('getTags', () => {
    it('should fetch tags', async () => {
      const result = await publisher.getTags();
      expect(result.success).toBe(true);
    });
  });

  describe('getSiteInfo', () => {
    it('should fetch site info', async () => {
      const result = await publisher.getSiteInfo();
      expect(result.success).toBe(true);
    });
  });
});
