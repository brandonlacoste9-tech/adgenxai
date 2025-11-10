/**
 * Ghost CMS Integration
 * 
 * This module provides integration between AdGenXAI and Ghost CMS,
 * allowing AI-generated content to be published to Ghost sites.
 * 
 * @example
 * ```typescript
 * import { createGhostPublisher } from '@/lib/integrations/ghost';
 * 
 * const publisher = createGhostPublisher({
 *   url: 'https://your-ghost-site.com',
 *   contentApiKey: 'your-content-api-key',
 *   adminApiKey: 'your-admin-api-key'
 * });
 * 
 * await publisher.publishAIContent({
 *   title: 'AI-Generated Ad Copy',
 *   content: '<h1>Amazing Product!</h1><p>Check it out...</p>',
 *   format: 'html'
 * }, {
 *   status: 'published',
 *   tags: ['ai-generated', 'advertising']
 * });
 * ```
 */

export { GhostClient, createGhostClient } from './ghost-client';
export { GhostPublisher, createGhostPublisher } from './ghost-publisher';

export type {
  GhostConfig,
  GhostPost,
  GhostPostResponse
} from './ghost-client';

export type {
  PublishOptions,
  AIGeneratedContent
} from './ghost-publisher';
