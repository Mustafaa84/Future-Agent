export const seoConfig = {
  siteName: 'Future Agent',
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://futureagent.com',
  siteDescription: 'Discover and compare the best AI tools for your business',
  defaultOgImage: '/images/og-default.jpg',
  twitterHandle: '@futureagent',
  social: {
    twitter: 'https://twitter.com/futureagent',
    facebook: 'https://facebook.com/futureagent',
    linkedin: 'https://linkedin.com/company/futureagent',
  },
};

// Page-specific SEO templates
export const seoTemplates = {
  tool: {
    titleTemplate: (toolName: string) => 
      `${toolName} Review 2025 - Features, Pricing & Alternatives | Future Agent`,
    descriptionTemplate: (toolName: string, shortDesc: string) =>
      `Comprehensive review of ${toolName}. ${shortDesc} Compare features, pricing, pros and cons, and discover the best alternatives.`,
  },
  blog: {
    titleTemplate: (postTitle: string) => 
      `${postTitle} | Future Agent Blog`,
    descriptionTemplate: (excerpt: string) => excerpt,
  },
  category: {
    titleTemplate: (categoryName: string) => 
      `Best ${categoryName} AI Tools 2025 | Future Agent`,
    descriptionTemplate: (categoryName: string) =>
      `Discover the best ${categoryName} AI tools. Compare features, pricing, and reviews to find the perfect solution for your needs.`,
  },
  tag: {
    titleTemplate: (tagName: string) => 
      `${tagName} AI Tools | Future Agent`,
    descriptionTemplate: (tagName: string) =>
      `Browse AI tools tagged with ${tagName}. Find the perfect solution for your specific needs.`,
  },
};
