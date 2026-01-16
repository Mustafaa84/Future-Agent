export type BlogPost = {
  slug: string
  title: string
  excerpt: string
  category: string
  categorySlug: string
  readTime: string
  date: string
  content: string  // Empty for custom pages - content lives in page files
  featuredImage: string       // ✅ New field
  featuredImageAlt: string    // ✅ New field
}


export const blogPosts: BlogPost[] = [
  // Getting Started Category
  {
    slug: 'getting-started-with-ai-tools',
    title: 'Getting Started with AI Tools for Your Business in 2026',
    excerpt: 'A simple, non-technical guide to choosing and integrating your first AI tools without wasting money or time. Learn the proven 3-step framework for AI adoption.',
    category: 'Getting Started',
    categorySlug: 'getting-started',
    readTime: '7 min read',
    date: 'January 15, 2025',
    content: '', // Custom page at /blog/getting-started-with-ai-tools
    featuredImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=630&fit=crop',  // AI/Tech workspace
    featuredImageAlt: 'Modern workspace with AI technology and laptop',
  },

  // Content Creation Category
  {
    slug: 'ai-content-workflow',
    title: 'How to Build a Reliable AI Content Workflow in 2026',
    excerpt: 'Learn a step-by-step workflow for using AI to plan, draft, and optimize content while keeping quality high. A proven 5-stage system used by top content teams.',
    category: 'Content Creation',
    categorySlug: 'content-creation',
    readTime: '10 min read',
    date: 'February 2, 2025',
    content: '', // Custom page at /blog/ai-content-workflow
    featuredImage: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=630&fit=crop',  // Team collaboration/workflow
    featuredImageAlt: 'Team collaborating on content workflow with documents and laptop',
  },
]


export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug)
}


export function getPostsByCategorySlug(categorySlug: string): BlogPost[] {
  return blogPosts.filter((p) => p.categorySlug === categorySlug)
}
