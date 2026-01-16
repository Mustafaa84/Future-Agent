import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import JsonLd from '@/components/SEO/JsonLd'
import { organizationSchema, websiteSchema } from '@/lib/seo/schemas'
import EmailOptInClient from '@/components/EmailOptInClient'
import { supabase } from '@/lib/supabase'

interface AiTool {
  id: string
  name: string
  slug: string
  logo: string | null
  tagline: string | null
  category: string | null
  rating: number | null
}

interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt: string | null
  featured_image: string | null
  category: string | null
  reading_time: number | null
}

export const metadata: Metadata = {
  title:
    'Best AI Tools Directory 2025 | Expert Reviews & Comparisons - Future Agent',
  description:
    'Discover the best AI tools for content creation, marketing, and automation. Compare 500+ AI software with honest reviews, pricing, and exclusive deals. Find your perfect AI tool match today.',
  keywords: [
    'AI tools',
    'best AI tools 2025',
    'AI software reviews',
    'AI content creation tools',
    'AI marketing tools',
    'AI tool directory',
    'compare AI tools',
    'AI automation software',
    'top AI tools',
    'AI tool finder',
  ],
  openGraph: {
    title: 'Best AI Tools Directory 2025 - Future Agent',
    description:
      'Expert reviews and personalized recommendations for 500+ AI tools. Compare features, pricing, and get exclusive deals on top AI software.',
    url: 'https://future-agent.com',
    siteName: 'Future Agent',
    images: [
      {
        url: 'https://future-agent.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Future Agent - Best AI Tools Directory and Reviews',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Best AI Tools Directory 2025 - Future Agent',
    description:
      'Discover 500+ AI tools with expert reviews. Compare features, pricing, and find your perfect match.',
    images: ['https://future-agent.com/og-image.jpg'],
  },
  alternates: {
    canonical: 'https://future-agent.com',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

// Fetch featured tools from Supabase
async function getFeaturedTools(): Promise<AiTool[]> {
  const { data, error } = await supabase
    .from('ai_tools')
    .select('id, name, slug, logo, tagline, category, rating')
    .eq('published', true)
    .eq('featured', true)
    .order('rating', { ascending: false })
    .limit(3)

  if (error) {
    console.error('Error fetching featured tools:', error)
    return []
  }

  return (data as AiTool[]) || []
}

// Fetch latest blog posts from Supabase
async function getLatestBlogPosts(): Promise<BlogPost[]> {
  const { data, error } = await supabase
    .from('blog_posts')
    .select(
      'id, slug, title, excerpt, featured_image, category, reading_time'
    )
    .eq('published', true)
    .order('created_at', { ascending: false })
    .limit(3)

  if (error) {
    console.error('Error fetching blog posts:', error)
    return []
  }

  return (data as BlogPost[]) || []
}

export default async function Home() {
  const featuredTools = await getFeaturedTools()
  const latestPosts = await getLatestBlogPosts()

  return (
    <>
      <JsonLd data={organizationSchema} />
      <JsonLd data={websiteSchema} />

      {/* FAQ Schema for Rich Snippets */}
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: [
            {
              '@type': 'Question',
              name: 'What are the best AI tools for content creation in 2025?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'The best AI content creation tools in 2025 include Jasper AI for long-form marketing content and blogs, Writesonic for SEO-optimized articles at an affordable price, and Copy.ai for quick marketing copy and social media posts. Each tool offers unique features suited to different content needs and budgets.',
              },
            },
            {
              '@type': 'Question',
              name: 'How much do AI tools cost per month?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'AI tool pricing varies widely. Budget-friendly options like Writesonic start around $15-20 per month for basic plans. Mid-tier tools like Copy.ai cost $50-100 monthly for professional features. Enterprise solutions like Jasper AI can range from $100-500+ per month depending on team size and features needed.',
              },
            },
            {
              '@type': 'Question',
              name: 'Are AI content tools worth the investment?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Yes, AI content tools typically provide strong ROI. Users report saving 10-20 hours per week on content creation, improving output quality, and scaling production 3-5x. Most see positive ROI within the first month of use. The key is choosing the right tool for your specific needs and use case.',
              },
            },
            {
              '@type': 'Question',
              name: 'Which AI tool is best for beginners?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Copy.ai is excellent for beginners due to its intuitive interface, pre-built templates, and quick results. It requires minimal learning curve and offers helpful prompts to get started. Writesonic is another beginner-friendly option with straightforward features and affordable pricing.',
              },
            },
            {
              '@type': 'Question',
              name: 'How do I choose the right AI tool for my business?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Consider your primary use case (content creation, marketing, automation), team size, budget, and experience level. Take our free AI Tool Finder Quiz to get personalized recommendations based on your specific needs. Compare features, read honest reviews, and test free trials before committing.',
              },
            },
          ],
        }}
      />

      <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900">
        {/* HERO - Enhanced with trust signals */}
        <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 px-4 pb-24 pt-24 md:pt-32">
          {/* Glow background */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-cyan-500/20 blur-3xl animate-pulse" />
            <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-fuchsia-600/15 blur-3xl" />
          </div>

          <div className="relative mx-auto flex max-w-6xl flex-col items-center text-center">
            {/* Trust badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-400/40 bg-cyan-500/10 px-5 py-2 text-sm font-medium text-cyan-200 backdrop-blur-sm">
              <span className="flex h-2 w-2">
                <span className="absolute inline-flex h-2 w-2 animate-ping rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-400"></span>
              </span>
              Trusted by 10,000+ creators worldwide
            </div>

            {/* Headline */}
            <h1 className="mb-6 text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.1] text-white max-w-5xl">
              Future‑Proof Your Work
              <br />
              with the{' '}
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
                Best AI Tools
              </span>
            </h1>

            {/* Subheadline - more concise */}
            <p className="mb-10 max-w-3xl text-lg md:text-xl text-slate-300 leading-relaxed font-light">
              Stop guessing. We test, review, and curate the top AI software so
              you can
              <span className="font-semibold text-white">
                {' '}
                automate faster, create better, and scale smarter
              </span>
              .
            </p>

            {/* CTA Buttons - Primary emphasis */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-2xl mb-10">
              <Link
                href="/quiz"
                className="group relative w-full sm:w-auto px-10 py-4 rounded-xl bg-gradient-to-r from-fuchsia-600 to-violet-600 text-white text-lg font-bold shadow-2xl shadow-fuchsia-500/50 transition-all hover:from-fuchsia-500 hover:to-violet-500 hover:shadow-fuchsia-400/60 hover:scale-105 flex items-center justify-center gap-2"
              >
                <span>Find My Perfect Tool</span>
                <span className="text-xl group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </Link>

              <Link
                href="/tools"
                className="w-full sm:w-auto px-10 py-4 rounded-xl border-2 border-cyan-500/50 bg-cyan-500/10 text-cyan-300 text-lg font-semibold backdrop-blur-sm transition-all hover:bg-cyan-500/20 hover:border-cyan-400 text-center"
              >
                Browse Directory
              </Link>
            </div>

            {/* Social proof stats */}
            <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-slate-400">
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-yellow-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span>4.9/5 from 2,400+ reviews</span>
              </div>
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>Updated weekly</span>
              </div>
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
                <span>Always free access</span>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURE CARDS - Tighter, more scannable */}
        <section className="px-4 py-20 relative">
          <div className="mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
                Why Creators Choose Future Agent
              </h2>
              <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                The smartest way to discover, compare, and choose AI tools
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
              <div className="group bg-slate-900/60 border border-slate-800 rounded-2xl p-7 hover:border-purple-500/60 hover:bg-slate-900/80 transition-all hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/20">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl flex items-center justify-center text-3xl mb-5 group-hover:scale-110 transition-transform">
                  ⚡
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  Honest Reviews
                </h3>
                <p className="text-slate-400 leading-relaxed">
                  Real-world testing. Clear pros and cons. Zero fluff. Make
                  confident decisions with data-backed insights.
                </p>
              </div>

              <div className="group bg-slate-900/60 border border-slate-800 rounded-2xl p-7 hover:border-fuchsia-500/60 hover:bg-slate-900/80 transition-all hover:scale-[1.02] hover:shadow-2xl hover:shadow-fuchsia-500/20">
                <div className="w-14 h-14 bg-gradient-to-br from-fuchsia-500 to-violet-700 rounded-xl flex items-center justify-center text-3xl mb-5 group-hover:scale-110 transition-transform">
                  🎯
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  Smart Matching
                </h3>
                <p className="text-slate-400 leading-relaxed">
                  AI-powered quiz matches tools to your goals, budget, and
                  experience level in under 60 seconds.
                </p>
              </div>

              <div className="group bg-slate-900/60 border border-slate-800 rounded-2xl p-7 hover:border-green-500/60 hover:bg-slate-900/80 transition-all hover:scale-[1.02] hover:shadow-2xl hover:shadow-green-500/20">
                <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-700 rounded-xl flex items-center justify-center text-3xl mb-5 group-hover:scale-110 transition-transform">
                  💰
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  Exclusive Deals
                </h3>
                <p className="text-slate-400 leading-relaxed">
                  Save thousands with verified discounts and limited-time offers
                  on premium AI tools.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURED PICKS - NOW FROM SUPABASE */}
        <section className="px-4 py-20 bg-slate-950/50">
          <div className="mx-auto max-w-6xl">
            <div className="flex items-end justify-between mb-10">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
                  Top Rated This Week
                </h2>
                <p className="text-slate-400 text-lg">
                  Hand-picked tools crushing it right now
                </p>
              </div>
              <Link
                href="/tools"
                className="hidden md:flex items-center gap-2 text-cyan-400 hover:text-cyan-300 font-semibold group"
              >
                <span>View All</span>
                <span className="group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </Link>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {featuredTools.map((tool) => (
                <Link
                  key={tool.id}
                  href={`/tools/${tool.slug}`}
                  className="group bg-slate-900/80 border border-slate-800 rounded-2xl p-6 hover:border-purple-500/60 transition-all hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/20"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 overflow-hidden">
                        {typeof tool.logo === 'string' &&
                        tool.logo.startsWith('http') ? (
                          <Image
                            src={tool.logo}
                            alt={tool.name}
                            width={48}
                            height={48}
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <span>{tool.logo}</span>
                        )}
                      </div>

                      <div>
                        <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition">
                          {tool.name}
                        </h3>
                        <div className="flex items-center gap-1 text-xs text-yellow-400">
                          <span>★★★★★</span>
                          <span className="text-slate-500">{tool.rating}</span>
                        </div>
                      </div>
                    </div>
                    <span className="px-2 py-1 text-xs font-semibold bg-purple-500/20 text-purple-300 rounded-full border border-purple-500/30">
                      Popular
                    </span>
                  </div>
                  <p className="text-slate-400 text-sm mb-4 leading-relaxed">
                    {tool.tagline}
                  </p>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">{tool.category}</span>
                    <span className="text-purple-400 font-semibold group-hover:text-purple-300">
                      Read Review →
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            <Link
              href="/tools"
              className="md:hidden mt-8 flex items-center justify-center gap-2 text-cyan-400 hover:text-cyan-300 font-semibold"
            >
              <span>View All Tools</span>
              <span>→</span>
            </Link>
          </div>
        </section>

        {/* LATEST INSIGHTS - ✅ FIXED: Proper featured image display with containment */}
        <section className="px-4 py-20">
          <div className="mx-auto max-w-6xl">
            <div className="flex items-end justify-between mb-10">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
                  Latest Insights
                </h2>
                <p className="text-slate-400 text-lg">
                  Expert analysis and AI industry trends
                </p>
              </div>
              <Link
                href="/blog"
                className="hidden md:flex items-center gap-2 text-cyan-400 hover:text-cyan-300 font-semibold group"
              >
                <span>Read Blog</span>
                <span className="group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </Link>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {latestPosts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden hover:border-cyan-500/60 hover:bg-slate-900/80 transition-all hover:scale-[1.02]"
                >
                  {/* ✅ FEATURED IMAGE - PROPERLY CONSTRAINED */}
                  {post.featured_image && (
                    <div className="relative w-full h-48 overflow-hidden bg-slate-800">
                      <Image
                        src={post.featured_image}
                        alt={post.title}
                        width={400}
                        height={192}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}

                  {/* CONTENT SECTION - PROPERLY PADDED */}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                        {post.category}
                      </span>
                      <span className="text-xs text-slate-500">
                        {post.reading_time || 5} min read
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-400 transition leading-tight">
                      {post.title}
                    </h3>

                    <p className="text-slate-400 text-sm mb-4 line-clamp-2 leading-relaxed">
                      {post.excerpt}
                    </p>

                    <span className="text-sm font-semibold text-cyan-400 group-hover:text-cyan-300 flex items-center gap-1">
                      <span>Read article</span>
                      <span className="group-hover:translate-x-1 transition-transform">
                        →
                      </span>
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            <Link
              href="/blog"
              className="md:hidden mt-8 flex items-center justify-center gap-2 text-cyan-400 hover:text-cyan-300 font-semibold"
            >
              <span>View All Articles</span>
              <span>→</span>
            </Link>
          </div>
        </section>

        {/* NEWSLETTER - Moved after value demonstration */}
        <section className="px-4 py-20">
          <div className="mx-auto max-w-5xl">
            <EmailOptInClient />
          </div>
        </section>
      </div>
    </>
  )
}
