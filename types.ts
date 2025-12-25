
export enum ToolType {
  DASHBOARD = 'DASHBOARD',
  CHAT = 'CHAT',
  RESEARCH = 'RESEARCH',
  BLOG_SEO = 'BLOG_SEO',
  SOCIAL_POST = 'SOCIAL_POST',
  VIDEO_GEN = 'VIDEO_GEN',
  INFOGRAPHIC = 'INFOGRAPHIC',
  CAROUSEL = 'CAROUSEL',
  ADS_COPY = 'ADS_COPY',
  ADVISOR = 'ADVISOR',
  BRAND_VOICE = 'BRAND_VOICE',
  BATCH_GEN = 'BATCH_GEN',
  REPURPOSE = 'REPURPOSE'
}

export interface ContentItem {
  id: string;
  type: ToolType;
  title: string;
  data: any;
  timestamp: number;
}

export interface ResearchResult {
  summary: string;
  keyPoints: string[];
  sources: string[];
}

export interface CarouselSlide {
  title: string;
  content: string;
  visualPrompt: string;
}

export interface VoiceProfile {
  name: string;
  samples: string[];
  description: string;
}
