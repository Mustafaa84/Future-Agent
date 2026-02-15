import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'

export const dynamic = 'force-dynamic'

import JsonLd from '@/components/SEO/JsonLd'
import { organizationSchema, websiteSchema } from '@/lib/seo/schemas'
import EmailOptInClient from '@/components/EmailOptInClient'
import { getCategoryIcon } from '@/lib/icons'
import { getCategoryImage } from '@/lib/category-assets'
import ErrorBoundary from '@/components/ErrorBoundary'
import {
  fetchFeaturedTools,
  fetchLatestBlogPosts,
  fetchCategories,
  fetchComparisonPosts
} from '@/lib/data-fetching'

export const metadata: Metadata = {
  title: 'Future Agent | Agentic AI Specialists & Autonomous Workflow Research',
  description:
    'Master the era of autonomous agents. We provide data-backed research and blueprints for high-impact AI agents and automated workflows.',
  keywords: [
    'AI tools',
    'best AI tools 2025',
    'AI software reviews',
    'AI content creation tools',
    'AI tool directory',
    'compare AI tools',
    'AI automation software',
    'top AI tools',
    'AI tool finder',
  ],
  openGraph: {
    title: 'Future Agent | Top AI Agents & Autonomous Workflows Directory',
    description:
      'Discover, compare, and implement the best autonomous AI agents for your business. From research to coding, find tools that work for you.',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://futureagent.com',
    siteName: 'Future Agent',
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://futureagent.com'}/og-image.jpg`,
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
    images: [`${process.env.NEXT_PUBLIC_SITE_URL || 'https://futureagent.com'}/og-image.jpg`],
  },
  alternates: {
    canonical: process.env.NEXT_PUBLIC_SITE_URL || 'https://futureagent.com',
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

async function getComparisonData() {
  const data = await fetchComparisonPosts()

  const colors = [
    "from-blue-500 to-indigo-500",
    "from-purple-500 to-fuchsia-500",
    "from-orange-500 to-red-500",
    "from-emerald-500 to-cyan-500",
    "from-pink-500 to-rose-500",
    "from-amber-500 to-yellow-500"
  ]

  // Fallback data if no dynamic posts match
  const fallbackPosts = [
    { a: "Jasper", b: "Copy.ai", s: "jasper-vs-copy-ai", color: colors[0] },
    { a: "Midjourney", b: "DALL-E 3", s: "midjourney-vs-dalle-3", color: colors[1] },
    { a: "Claude", b: "ChatGPT", s: "claude-vs-chatgpt", color: colors[2] },
    { a: "Perplexity", b: "Search", s: "perplexity-vs-google-search", color: colors[3] },
  ]

  if (!data || data.length === 0) return fallbackPosts

  try {
    return data.map((post, idx) => {
      // Extract A and B from title "A vs B: Full Comparison" or slug "a-vs-b"
      const slugParts = post.slug.split('-vs-')
      if (slugParts.length < 2) return fallbackPosts[idx % fallbackPosts.length] // Safety fallback

      const a = slugParts[0].charAt(0).toUpperCase() + slugParts[0].slice(1)
      const b = (slugParts[1] || '').split('-')[0].charAt(0).toUpperCase() + (slugParts[1] || '').split('-')[0].slice(1)

      return {
        a,
        b: b || 'Alternative',
        s: post.slug,
        color: colors[idx % colors.length]
      }
    })
  } catch (err) {
    console.error("Error parsing comparison data:", err)
    return fallbackPosts
  }
}

export default async function Home() {
  const [featuredTools, latestPosts, comparisonPosts, categoriesData] = await Promise.all([
    fetchFeaturedTools(),
    fetchLatestBlogPosts(),
    getComparisonData(),
    fetchCategories()
  ])

  const categories = categoriesData.filter(c => c.slug !== 'comparisons')

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
              name: 'What are autonomous AI agents?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Autonomous AI agents are software systems capable of performing complex tasks with minimal human intervention. Unlike standard AI chatbots that just respond to prompts, agents can plan, execute multi-step workflows, and interact with other tools to achieve specific goals.',
              },
            },
            {
              '@type': 'Question',
              name: 'What are the best AI agents for coding in 2026?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'The best AI coding agents currently include Cursor for an integrated AI-first IDE experience, GitHub Copilot for powerful autocomplete and chat, and Devin or OpenDevin for autonomous software engineering tasks.',
              },
            },
            {
              '@type': 'Question',
              name: 'Can AI agents automate my business workflows?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Yes, platforms like Zapier Central, CrewAI, and Microsoft Autogen allow you to build custom agents that connect to your business data and handle repetitive tasks like lead qualification, research, and data entry automatically.',
              },
            },
            {
              '@type': 'Question',
              name: 'Are AI agents more expensive than standard chatbots?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'While basic chatbots are often cheaper, AI agents provide higher ROI by automating labor. ROI is typically seen through time savings—where an agent can do in minutes what a human would take hours to coordinate.',
              },
            },
            {
              '@type': 'Question',
              name: 'How do I choose the right AI agent for my needs?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Focus on the specific task you want to automate. Consider the tools the agent needs to integrate with, your technical expertise, and whether you need a ready-made solution or a customizable framework. Use our AI Agent Finder Quiz for a personalized recommendation.',
              },
            },
          ],
        }}
      />

      <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900">
        <ErrorBoundary>
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
                Built for creators, marketers, and founders who rely on AI every day
              </div>

              {/* Headline */}
              <h1 className="mb-6 text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.1] text-white max-w-5xl">
                Discover AI Agents That
                <span className="block mt-2 bg-gradient-to-r from-cyan-400 via-white to-fuchsia-400 bg-clip-text text-transparent">
                  Work Autonomously
                </span>
              </h1>

              {/* Sub-headline */}
              <p className="mb-10 max-w-2xl text-lg md:text-xl text-slate-300 leading-relaxed font-medium">
                The definitive resource for autonomous AI agents, multi-step workflows, and task execution tools. Stop chatting, start automating.
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
                  <span>Independent Reviews</span>
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
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                  <span>Real-World Insights</span>
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
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span>Weekly Updates</span>
                </div>
              </div>
            </div>
          </section>
        </ErrorBoundary>



        {/* TOP COMPARISONS STRIP - INFINITY LOOP */}
        {comparisonPosts.length > 0 && (
          <section className="px-4 py-3 bg-slate-900/20 border-b border-slate-800/30 overflow-hidden relative group">
            <div className="mx-auto max-w-7xl flex items-center gap-8">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 whitespace-nowrap z-10 bg-slate-950/20 px-4 py-1 rounded backdrop-blur-sm border border-slate-800/50">
                Top Face-Offs
              </span>

              <div className="relative flex overflow-hidden">
                <div className="flex animate-marquee whitespace-nowrap gap-4 py-1">
                  {[...comparisonPosts, ...comparisonPosts].map((comp, idx) => (
                    <Link
                      key={`${comp.s}-${idx}`}
                      href={`/blog/${comp.s}`}
                      className="group flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/50 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-800 transition-all"
                    >
                      <span className="text-xs font-bold text-slate-300 group-hover:text-white transition-colors">{comp.a}</span>
                      <span className={`text-[10px] font-black px-1.5 py-0.5 rounded bg-gradient-to-br ${comp.color} text-white scale-90`}>VS</span>
                      <span className="text-xs font-bold text-slate-300 group-hover:text-white transition-colors">{comp.b}</span>
                    </Link>
                  ))}
                </div>
                {/* Second track for seamless loop */}
                <div className="flex absolute top-0 animate-marquee2 whitespace-nowrap gap-4 py-1">
                  {[...comparisonPosts, ...comparisonPosts].map((comp, idx) => (
                    <Link
                      key={`${comp.s}-loop-${idx}`}
                      href={`/blog/${comp.s}`}
                      className="group flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/50 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-800 transition-all"
                    >
                      <span className="text-xs font-bold text-slate-300 group-hover:text-white transition-colors">{comp.a}</span>
                      <span className={`text-[10px] font-black px-1.5 py-0.5 rounded bg-gradient-to-br ${comp.color} text-white scale-90`}>VS</span>
                      <span className="text-xs font-bold text-slate-300 group-hover:text-white transition-colors">{comp.b}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Live Battle Engine Promo */}
        <ErrorBoundary>
          <section className="px-4 py-24 relative z-10">
            <div className="max-w-6xl mx-auto">
              <div className="group relative overflow-hidden rounded-[2.5rem] bg-[#0b1222] border border-white/10 shadow-[0_0_50px_rgba(6,182,212,0.15)] p-8 md:p-12 lg:p-16">
                {/* Background ambient glows */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/10 blur-[120px] -translate-y-1/2 translate-x-1/2 rounded-full pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/10 blur-[120px] translate-y-1/2 -translate-x-1/2 rounded-full pointer-events-none" />

                <div className="relative flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                  <div className="flex-1 space-y-8 text-center lg:text-left">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-400/20">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400"></span>
                      </span>
                      <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">Live Battle Engine</span>
                    </div>

                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white italic tracking-tight leading-[1.1]">
                      Which Solution <br />
                      <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                        Wins the Battle?
                      </span>
                    </h2>

                    <p className="text-base text-slate-400 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                      Compare any two AI agents side-by-side. Our engine analyzes thousands of data points,
                      pricing models, and core capabilities to help you choose the champion.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                      <Link
                        href="/tools?compare=true"
                        className="px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-600 to-cyan-400 hover:from-cyan-500 hover:to-cyan-300 text-white text-sm font-black uppercase tracking-wider transition-all shadow-xl shadow-cyan-500/20 hover:scale-105 active:scale-95 text-center"
                      >
                        Start Comparison
                      </Link>
                      <Link
                        href="/blog/category/comparisons"
                        className="px-8 py-4 rounded-2xl border border-white/10 bg-white/5 text-white text-sm font-bold transition-all hover:bg-white/10 text-center"
                      >
                        Expert Battles
                      </Link>
                    </div>
                  </div>

                  <div className="flex-1 relative">
                    {/* Visual representation of a battle */}
                    <div className="relative aspect-square max-w-[400px] mx-auto">
                      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse" />
                      <div className="absolute inset-4 rounded-[2rem] border border-white/10 bg-slate-900/50 backdrop-blur-xl flex flex-col items-center justify-center p-8 overflow-hidden">
                        <div className="flex items-center gap-4 w-full justify-between mb-8">
                          <div className="w-16 h-16 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center shadow-lg transform -rotate-12">
                            <span className="text-2xl">🤖</span>
                          </div>
                          <div className="relative">
                            <div className="w-12 h-12 rounded-full bg-slate-800 border border-white/20 flex items-center justify-center z-10 relative">
                              <span className="text-xs font-black text-white">VS</span>
                            </div>
                            <div className="absolute -inset-2 bg-white/10 rounded-full animate-ping" />
                          </div>
                          <div className="w-16 h-16 rounded-2xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center shadow-lg transform rotate-12">
                            <span className="text-2xl">⚡</span>
                          </div>
                        </div>

                        <div className="w-full space-y-3">
                          <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full w-[70%] bg-cyan-500" />
                          </div>
                          <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full w-[85%] bg-purple-500" />
                          </div>
                          <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full w-[45%] bg-pink-500" />
                          </div>
                        </div>

                        <div className="mt-8 pt-8 border-t border-white/10 w-full text-center">
                          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Processing Live Data...</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </ErrorBoundary>

        {/* INDUSTRY RESEARCH HUBS */}
        <section className="py-24 px-4 relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none" />

          <div className="mx-auto max-w-7xl relative">
            <div className="flex flex-col items-center text-center mb-16">
              <div className="max-w-3xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-bold uppercase tracking-widest mb-4 mx-auto">
                  Strategic Framework
                </div>
                <h2 className="text-4xl md:text-5xl font-black text-white italic tracking-tight">
                  Industry <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent italic">Research Hubs</span>.
                </h2>
                <p className="mt-4 text-slate-400 text-lg leading-relaxed font-medium max-w-2xl mx-auto">
                  We categorize the agentic revolution into core execution pillars. Dive deep into the data, tools, and workflows redefining your industry.
                </p>
                <Link href="/tools" className="mt-6 text-cyan-400 font-bold hover:text-cyan-300 transition-colors flex items-center justify-center gap-2 group">
                  Browse all categories <span className="group-hover:translate-x-1 transition-transform">→</span>
                </Link>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-4 md:gap-6 pb-12 transition-all">
              {categories.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/tools/category/${cat.slug}`}
                  className="group relative w-[180px] md:w-[210px] h-[320px] md:h-[340px] rounded-[2rem] overflow-hidden border border-slate-800/50 hover:border-cyan-500/50 transition-all duration-700 shadow-2xl"
                >
                  {/* Background Image */}
                  <Image
                    src={getCategoryImage(cat.slug, (cat as any).image_url)}
                    alt={cat.name}
                    fill
                    className="object-cover opacity-40 group-hover:opacity-60 group-hover:scale-110 transition-all duration-1000"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent transition-opacity group-hover:opacity-60" />

                  {/* Content Overlay */}
                  <div className="absolute inset-0 p-6 flex flex-col justify-end">
                    <h3 className="text-white font-black text-lg md:text-xl tracking-tight mb-2 transform group-hover:-translate-y-1 transition-transform duration-500">
                      {cat.name}
                    </h3>
                    <p className="text-slate-400 text-[10px] md:text-xs leading-relaxed group-hover:text-slate-100 transition-colors duration-500 line-clamp-2">
                      {cat.description || `Advanced tools for ${cat.name.toLowerCase()} workflows.`}
                    </p>
                    <div className="mt-4 flex items-center gap-2 text-cyan-400 text-[9px] font-black uppercase tracking-[0.15em] opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-500 delay-100">
                      Insights <span>→</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 py-20 relative">
          <div className="mx-auto max-w-6xl">
            <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
              {/* Card 1: Benchmarks */}
              <div className="group bg-slate-900/60 border border-slate-800 rounded-2xl p-7 hover:border-purple-500/60 hover:bg-slate-900/80 transition-all hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/20 flex flex-col items-center text-center">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center mb-5 mx-auto group-hover:scale-110 transition-transform">
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    <circle cx="12" cy="12" r="9" className="opacity-20" strokeWidth={1} />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  Data-Driven Benchmarks
                </h3>
                <p className="text-slate-400 leading-relaxed text-sm">
                  We don&apos;t just write reviews. Our team stress-tests every tool for 48+ hours to uncover hidden limits, pricing &quot;gotchas,&quot; and actual output quality.
                </p>
              </div>

              {/* Card 2: Blueprinting */}
              <div className="group bg-slate-900/60 border border-slate-800 rounded-2xl p-7 hover:border-amber-500/60 hover:bg-slate-900/80 transition-all hover:scale-[1.02] hover:shadow-2xl hover:shadow-amber-500/20 flex flex-col items-center text-center">
                <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-orange-600 rounded-xl flex items-center justify-center mb-5 mx-auto group-hover:scale-110 transition-transform">
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    <path strokeLinecap="round" strokeWidth={2} d="M12 12v3m-3-3h1" className="opacity-40" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  Workflow Blueprinting
                </h3>
                <p className="text-slate-400 leading-relaxed text-sm">
                  Get more than a name. Our smart matching doesn’t just find a tool—it builds a custom AI stack tailored to your specific business goals and team size.
                </p>
              </div>

              {/* Card 3: ROI */}
              <div className="group bg-slate-900/60 border border-slate-800 rounded-2xl p-7 hover:border-green-500/60 hover:bg-slate-900/80 transition-all hover:scale-[1.02] hover:shadow-2xl hover:shadow-green-500/20 flex flex-col items-center text-center">
                <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-700 rounded-xl flex items-center justify-center mb-5 mx-auto group-hover:scale-110 transition-transform">
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  ROI-Focused Curation
                </h3>
                <p className="text-slate-400 leading-relaxed text-sm">
                  We skip the hype. Every tool in our directory includes a calculated projection of potential time-savings and ROI based on real user data.
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
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden">
                        {typeof tool.logo === 'string' &&
                          tool.logo.startsWith('http') ? (
                          <Image
                            src={tool.logo}
                            alt={tool.name}
                            width={48}
                            height={48}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white font-bold">
                            {tool.name.charAt(0)}
                          </div>
                        )}
                      </div>

                      <div>
                        <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors">
                          {tool.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-0.5">
                          <div className="flex items-center gap-1 text-xs font-bold text-yellow-400 bg-yellow-400/10 px-1.5 py-0.5 rounded">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            {tool.rating}
                          </div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Expert Choice</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="px-2 py-0.5 text-[10px] font-bold bg-cyan-500/10 text-cyan-400 rounded-full border border-cyan-500/20 flex items-center gap-1">
                        <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                        Verified
                      </span>
                    </div>
                  </div>
                  <p className="text-slate-400 text-sm mb-4 leading-relaxed">
                    {tool.tagline}
                  </p>
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-800/50">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 bg-slate-800/50 px-2 py-1 rounded flex items-center gap-1.5">
                      <span>{getCategoryIcon(categories.find(c => c.name === tool.category)?.icon || null)}</span>
                      {tool.category}
                    </span>
                    <span className="text-xs font-bold text-purple-400 group-hover:text-purple-300 flex items-center gap-1 transition-colors">
                      Review <span className="group-hover:translate-x-1 transition-transform">→</span>
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

        {/* OUR TESTING PROCESS */}
        <section className="px-4 py-24 bg-slate-950/50 border-y border-slate-800/30">
          <div className="mx-auto max-w-6xl">
            <div className="text-center mb-20">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-extrabold uppercase tracking-widest mb-4">
                Quality Assurance
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 italic tracking-tight">
                5-Step Evaluation Process
              </h2>
              <p className="text-slate-500 text-sm max-w-2xl mx-auto font-medium">
                We don&apos;t just list tools. We architect your success through a rigorous, expert-led testing methodology that filters the hype from the ROI.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 lg:gap-8 relative">
              {/* Connector Line (Desktop Only) */}
              <div className="hidden md:block absolute top-10 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-slate-700 to-transparent -z-10" />

              {[
                {
                  step: "01",
                  title: "Discovery",
                  desc: "Scouring the market for emerging AI tools and disruptors.",
                  color: "from-indigo-400 to-indigo-600",
                  glow: "shadow-indigo-500/20",
                  icon: (
                    <svg className="w-9 h-9 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  ),
                },
                {
                  step: "02",
                  title: "Verification",
                  desc: "Validating company legacy, security protocols, and reliability.",
                  color: "from-cyan-400 to-cyan-600",
                  glow: "shadow-cyan-500/20",
                  icon: (
                    <svg className="w-9 h-9 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  ),
                },
                {
                  step: "03",
                  title: "Stress-Testing",
                  desc: "48+ hours of hands-on testing in real-world professional workflows.",
                  color: "from-fuchsia-400 to-fuchsia-600",
                  glow: "shadow-fuchsia-500/20",
                  icon: (
                    <svg className="w-9 h-9 text-fuchsia-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  ),
                },
                {
                  step: "04",
                  title: "ROI Analysis",
                  desc: "Deep-dive into pricing models vs. actual business output.",
                  color: "from-orange-400 to-orange-600",
                  glow: "shadow-orange-500/20",
                  icon: (
                    <svg className="w-9 h-9 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ),
                },
                {
                  step: "05",
                  title: "Verdict",
                  desc: "Independent scoring and placement by our expert curators.",
                  color: "from-emerald-400 to-emerald-600",
                  glow: "shadow-emerald-500/20",
                  icon: (
                    <svg className="w-9 h-9 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M5 13l4 4L19 7" />
                    </svg>
                  ),
                },
              ].map((item, idx) => (
                <div key={idx} className="group flex flex-col items-center text-center">
                  <div className={`w-20 h-20 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mb-6 group-hover:border-white/20 transition-all relative shadow-2xl ${item.glow} group-hover:scale-110 duration-500`}>
                    <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity rounded-2xl" />
                    {item.icon}
                    <div className={`absolute -bottom-2 px-2 py-0.5 bg-gradient-to-r ${item.color} rounded text-[10px] font-black text-white shadow-lg`}>
                      STEP {item.step}
                    </div>
                  </div>
                  <h3 className="text-sm font-black text-white mb-2 uppercase tracking-wider group-hover:text-cyan-400 transition">
                    {item.title}
                  </h3>
                  <p className="text-slate-500 text-[11px] leading-relaxed font-semibold px-2">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* LATEST INSIGHTS */}
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
                  <div className="relative w-full h-48 overflow-hidden bg-slate-800">
                    {post.featured_image ? (
                      <Image
                        src={post.featured_image}
                        alt={post.title}
                        width={400}
                        height={192}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-slate-900 flex items-center justify-center">
                        <span className="text-slate-800 font-black text-4xl opacity-20">F.A</span>
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-1.5">
                        <span>{getCategoryIcon(categories.find(c => c.name === post.category)?.icon || null)}</span>
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
          </div>
        </section>

        {/* NEWSLETTER */}
        <section className="px-4 py-20">
          <div className="mx-auto max-w-5xl">
            <EmailOptInClient />
          </div>
        </section>
      </div>
    </>
  )
}
