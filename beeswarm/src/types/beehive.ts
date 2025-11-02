export interface FeedItem {
  id: string;
  type: 'ad' | 'storyboard' | 'voice' | 'sentiment';
  title: string;
  description: string;
  timestamp: Date;
  swarmSize: number;
  engagement: number;
  author: string;
  tags: string[];
  thumbnail?: string;
}

export interface Persona {
  id: string;
  name: string;
  slug: string;
  archetype: string;
  traits: string[];
  energy: number;
  glyph: string;
  description: string;
  isActive?: boolean;
}

export interface SwarmStats {
  activeCreatives: number;
  pulsingHives: number;
  dailyOutputs: number;
  globalReach: number;
}

export interface CreativeContext {
  persona: Persona;
  targetAudience: string;
  emotionalTone: string;
  keyMessages: string[];
  brandVoice: string;
  visualStyle: string;
}

export interface AdGenRequest {
  persona: string;
  productName: string;
  targetAudience: string;
  platform: string;
  tone?: string;
  duration?: number;
}

export interface GeneratedAd {
  id: string;
  headline: string;
  copy: string;
  visualElements: string[];
  callToAction: string;
  platform: string;
  persona: string;
  timestamp: Date;
  engagement?: {
    clicks: number;
    impressions: number;
    conversions: number;
  };
}

export interface Storyboard {
  id: string;
  title: string;
  frames: Array<{
    id: string;
    description: string;
    visualCues: string;
    duration: number;
  }>;
  totalDuration: number;
  persona: string;
  timestamp: Date;
}

export type Theme = 'aurora' | 'plasma' | 'hive' | 'mythic';

export interface BeeHiveConfig {
  theme: Theme;
  animationSpeed: 'slow' | 'normal' | 'fast';
  autoPolling: boolean;
  pollingInterval: number;
  enableCeremony: boolean;
  enableGlow: boolean;
}