/**
 * Ghost Publisher Service
 * Integrates AI-generated content with Ghost CMS publishing
 */

import { GhostClient, GhostPost, GhostConfig } from './ghost-client';

export interface PublishOptions {
  status?: 'draft' | 'published' | 'scheduled';
  featured?: boolean;
  tags?: string[];
  publishAt?: Date;
  addAIMetadata?: boolean;
}

export interface AIGeneratedContent {
  title: string;
  content: string;
  format?: 'html' | 'markdown';
  metadata?: {
    prompt?: string;
    provider?: string;
    generatedAt?: Date;
    category?: string;
  };
}

/**
 * Ghost Publisher - Bridge between AI content generation and Ghost CMS
 */
export class GhostPublisher {
  private client: GhostClient;

  constructor(config: GhostConfig) {
    this.client = new GhostClient(config);
  }

  /**
   * Publish AI-generated content to Ghost
   */
  async publishAIContent(
    content: AIGeneratedContent,
    options?: PublishOptions
  ): Promise<{ success: boolean; postUrl?: string; postId?: string; error?: string }> {
    try {
      // Prepare Ghost post from AI content
      const ghostPost: GhostPost = {
        title: content.title,
        ...(content.format === 'markdown' ? { markdown: content.content } : { html: content.content }),
        status: options?.status || 'draft',
        featured: options?.featured || false,
        tags: options?.tags || [],
        published_at: options?.publishAt
      };

      // Add AI metadata if requested
      if (options?.addAIMetadata && content.metadata) {
        const metaTag = 'AI-Generated';
        ghostPost.tags = [...(ghostPost.tags || []), metaTag];
        
        // Add metadata to the beginning of the content
        const metadataNote = this.formatAIMetadata(content.metadata);
        if (content.format === 'markdown') {
          ghostPost.markdown = `${metadataNote}\n\n${ghostPost.markdown || ''}`;
        } else {
          ghostPost.html = `${metadataNote}\n\n${ghostPost.html || ''}`;
        }
      }

      // Publish to Ghost
      const result = await this.client.createPost(ghostPost);

      if (result.success && result.post) {
        return {
          success: true,
          postUrl: result.post.url,
          postId: result.post.id
        };
      }

      return {
        success: false,
        error: result.error || 'Failed to publish post'
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Unexpected error during publishing'
      };
    }
  }

  /**
   * Publish multiple AI-generated posts in batch
   */
  async publishBatch(
    contents: AIGeneratedContent[],
    options?: PublishOptions
  ): Promise<{
    success: boolean;
    results: Array<{ success: boolean; postUrl?: string; postId?: string; error?: string }>;
    summary: { total: number; succeeded: number; failed: number };
  }> {
    const results = await Promise.all(
      contents.map(content => this.publishAIContent(content, options))
    );

    const succeeded = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;

    return {
      success: succeeded > 0,
      results,
      summary: {
        total: contents.length,
        succeeded,
        failed
      }
    };
  }

  /**
   * Update an existing post with new AI-generated content
   */
  async updateWithAIContent(
    postId: string,
    content: AIGeneratedContent,
    options?: PublishOptions
  ): Promise<{ success: boolean; postUrl?: string; error?: string }> {
    try {
      const updates: any = {
        title: content.title,
        ...(content.format === 'markdown' ? { markdown: content.content } : { html: content.content })
      };

      if (options?.status) updates.status = options.status;
      if (options?.tags) updates.tags = options.tags;
      if (options?.featured !== undefined) updates.featured = options.featured;

      const result = await this.client.updatePost(postId, updates);

      if (result.success && result.post) {
        return {
          success: true,
          postUrl: result.post.url
        };
      }

      return {
        success: false,
        error: result.error || 'Failed to update post'
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Unexpected error during update'
      };
    }
  }

  /**
   * Test Ghost connection
   */
  async testConnection() {
    return await this.client.testConnection();
  }

  /**
   * Get all posts from Ghost
   */
  async getPosts(options?: { limit?: number; filter?: string }) {
    return await this.client.getPosts(options);
  }

  /**
   * Get available tags from Ghost
   */
  async getTags() {
    return await this.client.getTags();
  }

  /**
   * Get Ghost site information
   */
  async getSiteInfo() {
    return await this.client.getSiteInfo();
  }

  /**
   * Format AI metadata for display in post
   */
  private formatAIMetadata(metadata: AIGeneratedContent['metadata']): string {
    if (!metadata) return '';

    const parts = [
      '<!-- AI Generation Metadata',
      metadata.provider ? `Provider: ${metadata.provider}` : null,
      metadata.generatedAt ? `Generated: ${metadata.generatedAt.toISOString()}` : null,
      metadata.prompt ? `Prompt: ${metadata.prompt}` : null,
      metadata.category ? `Category: ${metadata.category}` : null,
      '-->'
    ];

    return parts.filter(Boolean).join('\n');
  }
}

/**
 * Factory function to create a Ghost publisher instance
 */
export function createGhostPublisher(config: GhostConfig): GhostPublisher {
  return new GhostPublisher(config);
}
