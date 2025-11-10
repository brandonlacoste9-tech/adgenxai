declare module '@tryghost/admin-api' {
  export interface GhostAdminAPIOptions {
    url: string;
    key: string;
    version: string;
  }

  export interface PostInput {
    id?: string;
    title?: string;
    slug?: string;
    mobiledoc?: string;
    html?: string;
    markdown?: string;
    feature_image?: string;
    featured?: boolean;
    status?: 'draft' | 'published' | 'scheduled';
    visibility?: 'public' | 'members' | 'paid';
    created_at?: string;
    updated_at?: string;
    published_at?: string | Date;
    custom_excerpt?: string;
    codeinjection_head?: string;
    codeinjection_foot?: string;
    custom_template?: string;
    canonical_url?: string;
    tags?: Array<{ id?: string; name: string; slug?: string }>;
    authors?: Array<string | { id: string }>;
    meta_title?: string;
    meta_description?: string;
    og_image?: string;
    og_title?: string;
    og_description?: string;
    twitter_image?: string;
    twitter_title?: string;
    twitter_description?: string;
    email_subject?: string;
  }

  export interface PostOutput {
    id: string;
    uuid: string;
    title: string;
    slug: string;
    html?: string;
    markdown?: string;
    feature_image?: string;
    featured: boolean;
    status: string;
    visibility: string;
    created_at: string;
    updated_at: string;
    published_at?: string;
    custom_excerpt?: string;
    url: string;
    excerpt?: string;
    reading_time?: number;
    tags?: Array<{ id: string; name: string; slug: string }>;
    authors?: Array<{ id: string; name: string; slug: string }>;
    meta_title?: string;
    meta_description?: string;
  }

  export interface AddOptions {
    source?: 'html' | 'markdown';
  }

  export default class GhostAdminAPI {
    constructor(options: GhostAdminAPIOptions);
    
    posts: {
      add(data: PostInput, options?: AddOptions): Promise<PostOutput>;
      edit(data: PostInput & { id: string }): Promise<PostOutput>;
      delete(options: { id: string }): Promise<void>;
      browse(options?: { limit?: number; filter?: string }): Promise<PostOutput[]>;
      read(options: { id?: string; slug?: string }): Promise<PostOutput>;
    };
    
    pages: {
      add(data: PostInput, options?: AddOptions): Promise<PostOutput>;
      edit(data: PostInput & { id: string }): Promise<PostOutput>;
      delete(options: { id: string }): Promise<void>;
      browse(options?: { limit?: number }): Promise<PostOutput[]>;
      read(options: { id?: string; slug?: string }): Promise<PostOutput>;
    };
    
    tags: {
      add(data: { name: string; slug?: string; description?: string }): Promise<any>;
      edit(data: { id: string; name?: string; slug?: string; description?: string }): Promise<any>;
      delete(options: { id: string }): Promise<void>;
      browse(options?: { limit?: number }): Promise<any[]>;
      read(options: { id?: string; slug?: string }): Promise<any>;
    };
    
    users: {
      browse(options?: { limit?: number }): Promise<any[]>;
      read(options: { id?: string; slug?: string; email?: string }): Promise<any>;
    };
  }
}
