/**
 * Ghost CMS Integration Client
 * Provides interface for publishing AI-generated content to Ghost sites
 */

import GhostContentAPI from '@tryghost/content-api';
import GhostAdminAPI from '@tryghost/admin-api';

export interface GhostConfig {
  url: string;
  contentApiKey: string;
  adminApiKey?: string;
}

export interface GhostPost {
  title: string;
  html?: string;
  markdown?: string;
  status?: 'draft' | 'published' | 'scheduled';
  featured?: boolean;
  tags?: string[];
  authors?: string[];
  published_at?: Date;
  meta_title?: string;
  meta_description?: string;
  og_image?: string;
  twitter_image?: string;
}

export interface GhostPostResponse {
  id: string;
  uuid: string;
  title: string;
  slug: string;
  html?: string;
  status: string;
  url: string;
  published_at?: string;
  created_at: string;
  updated_at: string;
}

/**
 * Ghost CMS Client
 * Handles both reading content (Content API) and publishing (Admin API)
 */
export class GhostClient {
  private contentApi: any;
  private adminApi: any;
  private config: GhostConfig;

  constructor(config: GhostConfig) {
    this.config = config;

    // Initialize Content API for reading
    this.contentApi = new GhostContentAPI({
      url: config.url,
      key: config.contentApiKey,
      version: 'v5.0'
    });

    // Initialize Admin API for publishing (if key provided)
    if (config.adminApiKey) {
      this.adminApi = new GhostAdminAPI({
        url: config.url,
        key: config.adminApiKey,
        version: 'v5.0'
      });
    }
  }

  /**
   * Test connection to Ghost site
   */
  async testConnection(): Promise<{ success: boolean; message: string; version?: string }> {
    try {
      const settings = await this.contentApi.settings.browse();
      return {
        success: true,
        message: `Connected to ${settings.title || 'Ghost site'}`,
        version: settings.version
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Failed to connect to Ghost'
      };
    }
  }

  /**
   * Fetch posts from Ghost
   */
  async getPosts(options?: { limit?: number; filter?: string }) {
    try {
      const posts = await this.contentApi.posts.browse({
        limit: options?.limit || 10,
        filter: options?.filter,
        include: 'tags,authors'
      });
      return { success: true, posts };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Fetch a single post by ID or slug
   */
  async getPost(identifier: string, bySlug: boolean = false) {
    try {
      const post = bySlug
        ? await this.contentApi.posts.read({ slug: identifier }, { include: 'tags,authors' })
        : await this.contentApi.posts.read({ id: identifier }, { include: 'tags,authors' });
      return { success: true, post };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Publish a new post to Ghost
   * Requires Admin API key
   */
  async createPost(post: GhostPost): Promise<{ success: boolean; post?: GhostPostResponse; error?: string }> {
    if (!this.adminApi) {
      return {
        success: false,
        error: 'Admin API key required for publishing'
      };
    }

    try {
      const publishedPost = await this.adminApi.posts.add(
        {
          title: post.title,
          html: post.html,
          markdown: post.markdown,
          status: post.status || 'draft',
          featured: post.featured || false,
          tags: post.tags?.map(tag => ({ name: tag })),
          authors: post.authors,
          published_at: post.published_at,
          meta_title: post.meta_title,
          meta_description: post.meta_description,
          og_image: post.og_image,
          twitter_image: post.twitter_image
        },
        { source: 'html' }
      );

      return {
        success: true,
        post: publishedPost as GhostPostResponse
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to create post'
      };
    }
  }

  /**
   * Update an existing post
   * Requires Admin API key
   */
  async updatePost(id: string, updates: Partial<GhostPost>): Promise<{ success: boolean; post?: GhostPostResponse; error?: string }> {
    if (!this.adminApi) {
      return {
        success: false,
        error: 'Admin API key required for updating'
      };
    }

    try {
      const updatedPost = await this.adminApi.posts.edit({
        id,
        ...updates,
        tags: updates.tags?.map(tag => ({ name: tag })),
        updated_at: new Date().toISOString()
      });

      return {
        success: true,
        post: updatedPost as GhostPostResponse
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to update post'
      };
    }
  }

  /**
   * Delete a post
   * Requires Admin API key
   */
  async deletePost(id: string): Promise<{ success: boolean; error?: string }> {
    if (!this.adminApi) {
      return {
        success: false,
        error: 'Admin API key required for deleting'
      };
    }

    try {
      await this.adminApi.posts.delete({ id });
      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to delete post'
      };
    }
  }

  /**
   * Fetch available tags from Ghost
   */
  async getTags() {
    try {
      const tags = await this.contentApi.tags.browse({ limit: 'all' });
      return { success: true, tags };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Fetch authors from Ghost
   */
  async getAuthors() {
    try {
      const authors = await this.contentApi.authors.browse({ limit: 'all' });
      return { success: true, authors };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Get site settings and information
   */
  async getSiteInfo() {
    try {
      const settings = await this.contentApi.settings.browse();
      return { success: true, settings };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }
}

/**
 * Factory function to create a Ghost client instance
 */
export function createGhostClient(config: GhostConfig): GhostClient {
  return new GhostClient(config);
}
