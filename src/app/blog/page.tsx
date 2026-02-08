import Image from 'next/image'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import BlogCard from '@/components/blog/BlogCard'

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
    .lte('published_date', new Date().toISOString())
    .order('published_date', { ascending: false })
    .limit(100) // Ensure a high enough limit to see all posts

  if (selectedCategory) {
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

  // Fetch official categories for the filter buttons
  const { data: categoriesData } = await supabase
    .from('categories')
    .select('name, slug, icon')
    .order('name', { ascending: true })

  const categories: Category[] = categoriesData || []

  // Icon mapper for emojis
  const getIcon = (iconName: string | null) => {
    const icons: Record<string, string> = {
      'Megaphone': '📣',
      'Code2': '💻',
      'PenTool': '✍️',
      'Zap': '⚡',
      'Search': '🔍',
      'Video': '🎥',
      'Image': '🖼️',
      'MessageSquare': '💬'
    }
    return iconName ? (icons[iconName] || '📁') : '📁'
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* HEADER */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-extrabold text-slate-100 mb-4">
            Agentic AI Blog
          </h1>
          <p className="text-xl text-slate-400">
            Insights, guides, and reviews for the autonomous era
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
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${!selectedCategory
                ? 'bg-cyan-500 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
            >
              All Posts
            </Link>
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/blog/category/${category.slug}`}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${selectedCategory === category.slug
                  ? 'bg-cyan-500 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
              >
                <span>{getIcon((category as any).icon)}</span>
                {category.name}
              </Link>
            ))}
            {selectedCategory && (
              <Link
                href="/blog"
                className="px-4 py-2 rounded-lg text-sm font-medium transition-all bg-slate-800/50 text-slate-500 hover:text-white"
              >
                Clear Filters
              </Link>
            )}
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
              <BlogCard key={post.id} post={post} />
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
