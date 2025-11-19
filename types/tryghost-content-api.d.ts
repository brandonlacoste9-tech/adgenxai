declare module '@tryghost/content-api' {
  export interface GhostContentAPIOptions {
    url: string;
    key: string;
    version: string;
  }

  export interface Post {
    id: string;
    uuid: string;
    title: string;
    slug: string;
    html?: string;
    comment_id?: string;
    feature_image?: string;
    featured?: boolean;
    visibility?: string;
    created_at: string;
    updated_at: string;
    published_at?: string;
    custom_excerpt?: string;
    codeinjection_head?: string;
    codeinjection_foot?: string;
    custom_template?: string;
    canonical_url?: string;
    url: string;
    excerpt?: string;
    reading_time?: number;
    access?: boolean;
    og_image?: string;
    og_title?: string;
    og_description?: string;
    twitter_image?: string;
    twitter_title?: string;
    twitter_description?: string;
    meta_title?: string;
    meta_description?: string;
    email_subject?: string;
    tags?: Array<{ id: string; name: string; slug: string }>;
    authors?: Array<{ id: string; name: string; slug: string }>;
  }

  export interface Tag {
    id: string;
    name: string;
    slug: string;
    description?: string;
  }

  export interface Author {
    id: string;
    name: string;
    slug: string;
    profile_image?: string;
    cover_image?: string;
    bio?: string;
    website?: string;
    location?: string;
    facebook?: string;
    twitter?: string;
  }

  export interface Settings {
    title?: string;
    description?: string;
    logo?: string;
    icon?: string;
    cover_image?: string;
    facebook?: string;
    twitter?: string;
    lang?: string;
    timezone?: string;
    codeinjection_head?: string;
    codeinjection_foot?: string;
    navigation?: Array<{ label: string; url: string }>;
    version?: string;
  }

  export interface BrowseOptions {
    limit?: number | string;
    filter?: string;
    include?: string;
    page?: number;
    order?: string;
  }

  export interface ReadOptions {
    id?: string;
    slug?: string;
  }

  export default class GhostContentAPI {
    constructor(options: GhostContentAPIOptions);
    
    posts: {
      browse(options?: BrowseOptions): Promise<Post[]>;
      read(options: ReadOptions, readOptions?: { include?: string }): Promise<Post>;
    };
    
    tags: {
      browse(options?: BrowseOptions): Promise<Tag[]>;
      read(options: ReadOptions): Promise<Tag>;
    };
    
    authors: {
      browse(options?: BrowseOptions): Promise<Author[]>;
      read(options: ReadOptions): Promise<Author>;
    };
    
    settings: {
      browse(): Promise<Settings>;
    };
  }
}
