import { MetadataRoute } from 'next'
import { supabase } from '@/lib/supabase'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://futureagent.com'

  // Fetch LIVE published tools
  const { data: tools } = await supabase
    .from('ai_tools')
    .select('slug, updated_at')
    .eq('published', true)

  // ✅ NEW: Fetch LIVE published blog posts (Task 1 indexes make this fast!)
  const { data: posts } = await supabase
    .from('blog_posts')
    .select('slug, updated_at, published_date')
    .eq('published', true)
    .lte('published_date', new Date().toISOString())  // Only live posts
    .order('published_date', { ascending: false })

  // Static pages
  const staticPages = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${siteUrl}/tools`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${siteUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },
    {
      url: `${siteUrl}/quiz`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
    {
      url: `${siteUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${siteUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.3,
    },
    {
      url: `${siteUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.3,
    },
    {
      url: `${siteUrl}/affiliate-disclaimer`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.3,
    },
  ]

  // Dynamic tool pages
  const toolPages = tools?.map((tool) => ({
    url: `${siteUrl}/tools/${tool.slug}`,
    lastModified: new Date(tool.updated_at),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  })) || []

  // ✅ NEW: Dynamic blog post pages (SEO boost!)
  const blogPages = posts?.map((post) => ({
    url: `${siteUrl}/blog/${post.slug}`,
    lastModified: new Date(post.updated_at || post.published_date),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  })) || []

  const { data: categories } = await supabase
    .from('categories')
    .select('slug, created_at')

  // ✅ NEW: Dynamic directory-specific category pages (SEO Depth!)
  const toolCategoryPages = categories?.map((cat) => ({
    url: `${siteUrl}/tools/category/${cat.slug}`,
    lastModified: new Date(cat.created_at || new Date()),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  })) || []

  const blogCategoryPages = categories?.map((cat) => ({
    url: `${siteUrl}/blog/category/${cat.slug}`,
    lastModified: new Date(cat.created_at || new Date()),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  })) || []

  // ✅ NEW: Dynamic tag pages
  const { data: tags } = await supabase
    .from('tags')
    .select('slug')

  const tagPages = tags?.map((tag) => ({
    url: `${siteUrl}/tag/${tag.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  })) || []

  return [
    ...staticPages,
    ...toolPages,
    ...blogPages,
    ...toolCategoryPages,
    ...blogCategoryPages,
    ...tagPages
  ]
}
