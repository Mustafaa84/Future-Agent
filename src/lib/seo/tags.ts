export interface Tag {
  slug: string;
  name: string;
  description: string;
  color: string; // Tailwind color class
  icon?: string;
}

export const tags: Record<string, Tag> = {
  'free': {
    slug: 'free',
    name: 'Free',
    description: 'Tools with free plans or free trials available',
    color: 'bg-green-600',
    icon: '🆓'
  },
  'paid': {
    slug: 'paid',
    name: 'Paid',
    description: 'Premium tools with paid plans',
    color: 'bg-purple-600',
    icon: '💎'
  },
  'beginner-friendly': {
    slug: 'beginner-friendly',
    name: 'Beginner Friendly',
    description: 'Easy to use tools perfect for beginners',
    color: 'bg-blue-600',
    icon: '👋'
  },
  'content-creation': {
    slug: 'content-creation',
    name: 'Content Creation',
    description: 'Tools for writing, editing, and creating content',
    color: 'bg-indigo-600',
    icon: '✍️'
  },
  'seo': {
    slug: 'seo',
    name: 'SEO',
    description: 'Tools optimized for search engine optimization',
    color: 'bg-cyan-600',
    icon: '🔍'
  },
  'marketing': {
    slug: 'marketing',
    name: 'Marketing',
    description: 'Tools for marketing campaigns and automation',
    color: 'bg-pink-600',
    icon: '📢'
  },
  'design': {
    slug: 'design',
    name: 'Design',
    description: 'Visual design and image generation tools',
    color: 'bg-orange-600',
    icon: '🎨'
  },
  'automation': {
    slug: 'automation',
    name: 'Automation',
    description: 'Workflow automation and productivity tools',
    color: 'bg-yellow-600',
    icon: '⚡'
  },
  'team-collaboration': {
    slug: 'team-collaboration',
    name: 'Team Collaboration',
    description: 'Tools for team communication and collaboration',
    color: 'bg-teal-600',
    icon: '👥'
  },
  'enterprise': {
    slug: 'enterprise',
    name: 'Enterprise',
    description: 'Enterprise-grade tools with advanced features',
    color: 'bg-slate-600',
    icon: '🏢'
  }
};

// Helper function to get tag by slug
export function getTagBySlug(slug: string): Tag | undefined {
  return tags[slug];
}

// Helper function to get all tags
export function getAllTags(): Tag[] {
  return Object.values(tags);
}

// Helper function to get tags by slugs array
export function getTagsBySlugs(slugs: string[]): Tag[] {
  return slugs.map(slug => tags[slug]).filter(Boolean);
}
