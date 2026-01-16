import Image from 'next/image'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt: string | null
  featured_image: string | null
  category: string | null
  category_slug: string | null
  published_date: string | null
  reading_time: number | null
  content: string | null
  tags: string[]
}

interface Category {
  slug: string
  name: string
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; tag?: string }>
}) {
  const params = await searchParams
  const selectedCategory = params.category

  // Build query with filters
  let query = supabase
    .from('blog_posts')
    .select('*')
    .eq('published', true)
    .lte('published_date', new Date().toISOString()) // Only show posts with date <= now
    .order('published_date', { ascending: false }) // Sort by publish date

  if (selectedCategory) {
    // Filter by category_slug using slug from query string
    query = query.eq('category_slug', selectedCategory)
  }

  const { data: posts } = await query

  // Add reading time fallback
  const postsWithReadingTime = (posts as BlogPost[])
    ?.map((post) => ({
      ...post,
      reading_time:
        post.reading_time ||
        Math.max(3, Math.round((post.content?.length || 0) / 1200) || 5),
    })) || []

  // Get all unique categories for filter buttons (slug + name)
  const { data: allPosts } = await supabase
    .from('blog_posts')
    .select('category, category_slug')
    .eq('published', true)

  const categories: Category[] =
    Array.from(
      new Map(
        ((allPosts as Array<{ category: string | null; category_slug: string | null }>) || [])
          .filter((p) => p.category && p.category_slug)
          .map((p) => [
            p.category_slug as string,
            {
              slug: p.category_slug as string,
              name: p.category as string,
            },
          ])
      ).values()
    ) || []

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* HEADER */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-slate-100 mb-4">
            AI Tools Blog
          </h1>
          <p className="text-xl text-slate-400">
            Latest insights, guides, and reviews
          </p>
        </div>

        {/* CATEGORY FILTERS */}
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-slate-400 mb-3">
            📁 CATEGORIES
          </h3>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/blog"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                !selectedCategory
                  ? 'bg-cyan-500 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              All Posts
            </Link>
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/blog?category=${encodeURIComponent(category.slug)}`}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedCategory === category.slug
                    ? 'bg-cyan-500 text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {category.name}
              </Link>
            ))}
          </div>
        </div>

        {/* ACTIVE FILTER BADGE */}
        {selectedCategory && (
          <div className="mb-8 flex items-center gap-3">
            <span className="text-sm text-slate-400">Filtered by:</span>
            <div className="flex items-center gap-2 bg-cyan-900/30 border border-cyan-700 px-3 py-1.5 rounded-lg">
              <span className="text-sm text-cyan-300">
                {categories.find((c) => c.slug === selectedCategory)?.name ||
                  selectedCategory}
              </span>
              <Link
                href="/blog"
                className="text-cyan-400 hover:text-cyan-300"
              >
                ✕
              </Link>
            </div>
          </div>
        )}

        {/* POSTS GRID */}
        {!posts || posts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-slate-400 text-lg">
              No posts found for this filter.
            </p>
            <Link
              href="/blog"
              className="inline-block mt-4 text-cyan-400 hover:text-cyan-300 underline"
            >
              View all posts
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {postsWithReadingTime.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-cyan-500 transition-all"
              >
                {post.featured_image && (
                  <div className="aspect-video overflow-hidden">
                    <Image
                      src={post.featured_image}
                      alt={post.title}
                      width={500}
                      height={280}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-2 py-1 bg-cyan-900/30 border border-cyan-700 text-cyan-400 text-xs rounded">
                      {post.category}
                    </span>
                    <span className="text-xs text-slate-500">
                      {post.published_date
                        ? new Date(post.published_date).toLocaleDateString(
                            'en-US',
                            {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            }
                          )
                        : ''}
                      {post.reading_time && (
                        <>
                          {' '}
                          • {post.reading_time} min read
                        </>
                      )}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-100 group-hover:text-cyan-400 transition-colors mb-2">
                    {post.title}
                  </h3>
                  <p className="text-slate-400 text-sm line-clamp-2 mb-4">
                    {post.excerpt}
                  </p>
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {post.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 bg-slate-800 text-slate-400 text-xs rounded"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* RESULTS COUNT */}
        {posts && posts.length > 0 && (
          <div className="mt-12 text-center">
            <p className="text-slate-500 text-sm">
              Showing {posts.length} {posts.length === 1 ? 'post' : 'posts'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
