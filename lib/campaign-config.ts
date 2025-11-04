// Campaign Configuration Constants
// Centralized configuration for AI campaign orchestration

export const CAMPAIGN_DEFAULTS = {
  DURATION_SECONDS: 90,
  ASPECT_RATIOS: ['16:9', '9:16', '1:1', '4:5'],
  PLATFORMS: ['instagram', 'tiktok', 'youtube', 'facebook'],
  CAMPAIGN_TYPE: 'product_launch'
} as const;

export const AI_MODELS = [
  {
    name: 'Kimi-linear',
    emoji: '🧠',
    description: 'Strategic ad copy generation',
    specialization: 'copywriting',
    cost: 0.02
  },
  {
    name: 'Hunyuan 3D',
    emoji: '🔮',
    description: '3D product model generation',
    specialization: '3d_modeling',
    cost: 0.15
  },
  {
    name: 'WorldGrow',
    emoji: '🌍',
    description: 'Environment and scene creation',
    specialization: 'environments',
    cost: 0.08
  },
  {
    name: 'LongCat-Video',
    emoji: '🎬',
    description: 'AI video generation',
    specialization: 'video_generation',
    cost: 0.25
  },
  {
    name: 'Ditto',
    emoji: '✂️',
    description: 'Video editing and effects',
    specialization: 'video_editing',
    cost: 0.12
  },
  {
    name: 'Nitro-E',
    emoji: '🖼️',
    description: 'Thumbnail optimization',
    specialization: 'thumbnails',
    cost: 0.05
  },
  {
    name: 'DeepSeek-R1',
    emoji: '🔍',
    description: 'Market research and analysis',
    specialization: 'research',
    cost: 0.03
  },
  {
    name: 'GPT-4o',
    emoji: '✍️',
    description: 'Content refinement',
    specialization: 'content_refinement',
    cost: 0.04
  },
  {
    name: 'Claude 3.5',
    emoji: '📝',
    description: 'Brand voice optimization',
    specialization: 'brand_voice',
    cost: 0.04
  },
  {
    name: 'Gemini-2.0',
    emoji: '🎨',
    description: 'Creative direction',
    specialization: 'creative_direction',
    cost: 0.03
  },
  {
    name: 'DALL-E 3',
    emoji: '🖼️',
    description: 'High-quality image generation',
    specialization: 'image_generation',
    cost: 0.10
  }
] as const;

export type CampaignType = 
  | 'product_launch'
  | 'brand_awareness'
  | 'seasonal_promo'
  | 'social_media'
  | 'video_ad';

export type Platform = typeof CAMPAIGN_DEFAULTS.PLATFORMS[number];
export type AspectRatio = typeof CAMPAIGN_DEFAULTS.ASPECT_RATIOS[number];