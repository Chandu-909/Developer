export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  publishedAt: string; // ISO date e.g. "2026-03-15"
  updatedAt?: string;
  readTime: string;    // e.g. "5 min read"
  tags: string[];      // e.g. ["React", "TypeScript", "Architecture"]
  content: string;     // Full markdown text
  draft?: boolean;
  featured?: boolean;
}

export interface TableOfContentItem {
  id: string;
  text: string;
  level: number; // 2 for h2, 3 for h3
}

export interface JourneyMilestone {
  year: string;
  role: string;
  organization: string;
  description: string;
}

export interface SkillCategory {
  title: string;
  skills: string[];
}

export interface SiteConfig {
  name: string;
  handle: string;
  domain: string;
  role: string;
  bioShort: string;
  bioLong: string[];
  statusText: string;
  email: string;
  githubUrl: string;
  linkedinUrl: string;
  twitterUrl?: string;
  skills: SkillCategory[];
  journey: JourneyMilestone[];
}
