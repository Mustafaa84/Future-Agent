import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getTagBySlug } from '@/lib/tags'

interface Tool {
  name: string
  slug: string
  tagline: string
  rating: number
  reviewCount: number
  logo: string
  description: string
  category: string
  tags: string[]
}

// For now, we'll use the same tools data structure
// Later this will come from Supabase
const tools: Record<string, Tool> = {
  'jasper-ai': {
    name: 'Jasper AI',
    slug: 'jasper-ai',
    tagline: 'AI Copilot for Marketing Teams',
    rating: 4.8,
    reviewCount: 187,
    logo: '✍️',
    description:
      'Jasper AI is the leading AI writing platform trusted by over 100,000 businesses worldwide.',
    category: 'Content Creation',
    tags: ['paid', 'content-creation', 'seo', 'marketing', 'beginner-friendly'],
  },
}

interface TagMetadataParams {
  params: Promise<{ slug: string }>
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: TagMetadataParams): Promise<Metadata> {
  const { slug } = await params
  const tag = getTagBySlug(slug)

  if (!tag) {
    return {
      title: 'Tag Not Found',
    }
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://futureagent.com'

  return {
    title: `${tag.name} AI Tools 2025 | Future Agent`,
    description: `${tag.description}. Browse our curated collection of ${tag.name.toLowerCase()} AI tools and find the perfect solution for your needs.`,
    alternates: {
      canonical: `${siteUrl}/tag/${slug}`,
    },
    openGraph: {
      title: `${tag.name} AI Tools`,
      description: tag.description,
      url: `${siteUrl}/tag/${slug}`,
      type: 'website',
    },
  }
}

export default async function TagPage({
  params,
}: TagMetadataParams) {
  const { slug } = await params
  const tag = getTagBySlug(slug)

  if (!tag) {
    notFound()
  }

  // Filter tools by tag
  const filteredTools = Object.values(tools).filter(
    (tool) => tool.tags && tool.tags.includes(slug)
  )

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900">
      {/* Hero Section */}
      <section className="px-4 pt-12 pb-16 border-b border-slate-800">
        <div className="mx-auto max-w-5xl">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-slate-400 mb-6">
            <Link href="/" className="hover:text-cyan-400 transition">
              Home
            </Link>
            <span>/</span>
            <Link href="/tools" className="hover:text-cyan-400 transition">
              Tools
            </Link>
            <span>/</span>
            <span className="text-white">{tag.name}</span>
          </div>

          {/* Tag Header */}
          <div className="text-center">
            <div className="inline-flex items-center gap-3 mb-4">
              {tag.icon && <span className="text-5xl">{tag.icon}</span>}
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                {tag.name} AI Tools
              </h1>
            </div>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto mb-6">
              {tag.description}
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-slate-400">
              <span>
                {filteredTools.length}{' '}
                {filteredTools.length === 1 ? 'tool' : 'tools'} found
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-6xl">
          {filteredTools.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-slate-400 text-lg">
                No tools found with this tag yet.
              </p>
              <Link
                href="/tools"
                className="inline-block mt-6 px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-white font-semibold rounded-lg transition"
              >
                Browse All Tools
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTools.map((tool) => (
                <Link
                  key={tool.slug}
                  href={`/tools/${tool.slug}`}
                  className="bg-slate-900/60 border border-slate-800 hover:border-cyan-500/50 rounded-xl p-6 transition group"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-800 rounded-lg flex items-center justify-center text-2xl">
                      {tool.logo}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition">
                        {tool.name}
                      </h3>
                      <div className="text-xs text-yellow-400">
                        ★★★★★ {tool.rating}
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-slate-400 mb-3 line-clamp-2">
                    {tool.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-purple-300">
                      {tool.category}
                    </span>
                    <span className="text-xs text-cyan-400 font-semibold">
                      Learn More →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-16 bg-slate-950/50">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Can&apos;t find what you&apos;re looking for?
          </h2>
          <p className="text-slate-300 mb-8">
            Take our quick quiz to get personalized AI tool recommendations
            based on your needs.
          </p>
          <Link
            href="/quiz"
            className="inline-block px-8 py-4 bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 text-white font-semibold rounded-lg transition text-lg"
          >
            Take the AI Tool Finder Quiz →
          </Link>
        </div>
      </section>
    </div>
  )
}
