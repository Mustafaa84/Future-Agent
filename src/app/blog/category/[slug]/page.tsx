import { supabase } from '@/lib/supabase'
import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import BlogCard from '@/components/blog/BlogCard'

interface BlogCategoryPageProps {
    params: Promise<{ slug: string }>
}

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

export async function generateMetadata({ params }: BlogCategoryPageProps): Promise<Metadata> {
    const { slug } = await params
    const { data: category } = await supabase
        .from('categories')
        .select('name, meta_title, meta_description')
        .eq('slug', slug)
        .single()

    if (!category) return { title: 'Blog Category' }

    return {
        title: category.meta_title || `${category.name} Guides & AI Insights | Future Agent`,
        description: category.meta_description || `Expert guides, reviews, and latest news about ${category.name}. Master the latest AI tools and workflows with our in-depth analysis.`,
    }
}

export default async function BlogCategoryPage({ params }: BlogCategoryPageProps) {
    const { slug } = await params

    // 1. Fetch Category
    const { data: category } = await supabase
        .from('categories')
        .select('*')
        .eq('slug', slug)
        .single()

    if (!category) notFound()

    // 2. Fetch Blog Posts for this category
    const { data: posts } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('published', true)
        .eq('category_slug', slug)
        .order('published_date', { ascending: false })
        .limit(100)

    // 3. Fetch all categories for the filter bar
    const { data: allCats } = await supabase
        .from('categories')
        .select('name, slug, icon')
        .order('name', { ascending: true })

    const postsWithReadingTime = (posts as BlogPost[])
        ?.map((post) => ({
            ...post,
            reading_time:
                post.reading_time ||
                Math.max(3, Math.round((post.content?.length || 0) / 1200) || 5),
        })) || []

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
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                        {category.name} INSIGHTS
                    </div>
                    <h1 className="text-5xl font-bold text-slate-100 mb-4">
                        {category.name} Blog
                    </h1>
                    <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                        {category.description || `The latest guides, reviews, and tutorials specifically for ${category.name}.`}
                    </p>
                </div>

                {/* CATEGORY FILTERS */}
                <div className="mb-8">
                    <h3 className="text-sm font-semibold text-slate-400 mb-3 uppercase tracking-tighter">
                        📁 Explore Topics
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        <Link
                            href="/blog"
                            className="px-4 py-2 rounded-lg text-sm font-medium transition-all bg-slate-800 text-slate-300 hover:bg-slate-700"
                        >
                            All Posts
                        </Link>
                        {allCats?.map((cat) => (
                            <Link
                                key={cat.slug}
                                href={`/blog/category/${cat.slug}`}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${slug === cat.slug
                                    ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/20'
                                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                                    }`}
                            >
                                <span>{getIcon((cat as any).icon)}</span>
                                {cat.name}
                            </Link>
                        ))}
                    </div>
                </div>

                {/* POSTS GRID */}
                {postsWithReadingTime.length === 0 ? (
                    <div className="text-center py-24 rounded-2xl border border-white/5 bg-white/[0.02]">
                        <p className="text-slate-400 text-lg">
                            No posts found in {category.name} yet.
                        </p>
                        <Link
                            href="/blog"
                            className="inline-block mt-4 text-cyan-400 hover:text-cyan-300 underline underline-offset-4"
                        >
                            View all insights
                        </Link>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {postsWithReadingTime.map((post) => (
                            <BlogCard key={post.id} post={post} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
