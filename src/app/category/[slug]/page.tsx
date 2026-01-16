import type { Metadata } from 'next'
import Link from 'next/link'
import { getPostsByCategorySlug } from '@/lib/blogPosts'

type Params = { slug: string }

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>
}): Promise<Metadata> {
  const { slug } = await params
  const posts = getPostsByCategorySlug(slug)

  if (posts.length === 0) {
    return { title: 'Category Not Found | Future Agent' }
  }

  const name = posts[0].category

  return {
    title: `${name} Articles | Future Agent`,
    description: `Read practical articles about ${name.toLowerCase()} with AI tools and workflows.`,
  }
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<Params>
}) {
  const { slug } = await params
  const posts = getPostsByCategorySlug(slug)

  if (posts.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-2">Category not found</h1>
          <Link href="/blog" className="text-cyan-400 hover:text-cyan-300 text-sm">
            Back to blog
          </Link>
        </div>
      </div>
    )
  }

  const name = posts[0].category

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900">
      {/* Hero */}
      <section className="px-4 pt-12 pb-10 border-b border-slate-800">
        <div className="mx-auto max-w-5xl">
          <div className="flex items-center gap-2 text-sm text-slate-400 mb-6">
            <Link href="/" className="hover:text-cyan-400 transition">
              Home
            </Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-cyan-400 transition">
              Blog
            </Link>
            <span>/</span>
            <span className="text-white">{name}</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            {name} Articles
          </h1>
          <p className="text-slate-300 max-w-2xl">
            Articles focused on {name.toLowerCase()} with AI tools, workflows, and real use cases.
          </p>
        </div>
      </section>

      {/* Posts list */}
      <section className="px-4 py-12">
        <div className="mx-auto max-w-5xl space-y-6">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="block bg-slate-900/60 border border-slate-800 hover:border-cyan-500/50 rounded-xl p-6 transition group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wide">
                  {post.category}
                </span>
                <span className="text-xs text-slate-500">
                  {post.readTime} • {post.date}
                </span>
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-white mb-2 group-hover:text-cyan-400 transition">
                {post.title}
              </h2>
              <p className="text-sm text-slate-400 mb-3">{post.excerpt}</p>
              <span className="text-sm font-semibold text-cyan-400 group-hover:text-cyan-300">
                Read article →
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
