'use client'

import { useState, useEffect, Suspense, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'


interface Tool {
  id: string
  slug: string
  name: string
  tagline: string
  category: string
  logo: string
  rating: number
  review_count: number
  pricing_model?: string
  free_trial?: boolean
  published_date?: string
}

interface Category {
  name: string
  slug: string
}

interface ToolsClientProps {
  tools: Tool[]
  initialCategories: Category[]
  initialCategory?: string
}

function ToolsContent({ tools, initialCategories, initialCategory = 'All' }: ToolsClientProps) {
  const searchParams = useSearchParams()
  // Determine if initialCategory is a name OR a slug (best to use slug)
  // But for backward compatibility with existing Server Components, we find the slug if name is passed
  const initialSlug = initialCategories.find(c => c.name === initialCategory || c.slug === initialCategory)?.slug || 'All'

  const [selectedCategory, setSelectedCategory] = useState<string>(initialSlug)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [pricingFilter, setPricingFilter] = useState<'All' | 'Free' | 'Paid'>('All')
  const [minRating, setMinRating] = useState<number>(0)
  const [sortBy, setSortBy] = useState<'newest' | 'rating' | 'reviews'>('newest')
  const [selectedTools, setSelectedTools] = useState<Tool[]>([])

  const toggleToolSelection = (tool: Tool) => {
    setSelectedTools(prev => {
      const isSelected = prev.find(t => t.id === tool.id)
      if (isSelected) {
        return prev.filter(t => t.id !== tool.id)
      }
      if (prev.length >= 2) {
        // Replace the second one or show a limit message (we'll just replace the second for now)
        return [prev[0], tool]
      }
      return [...prev, tool]
    })
  }

  // Sync state if initialCategory prop changes (important for navigation)
  useEffect(() => {
    const slug = initialCategories.find(c => c.name === initialCategory || c.slug === initialCategory)?.slug || 'All'
    setSelectedCategory(slug)
  }, [initialCategory, initialCategories])

  const hasHandledPreselect = useRef(false)

  // Handle initial search query and pre-selection from URL
  useEffect(() => {
    const query = searchParams.get('q')
    if (query) {
      setSearchQuery(query)
    }

    if (hasHandledPreselect.current) return

    const preselectSlug = searchParams.get('preselect')
    if (preselectSlug) {
      const tool = tools.find(t => t.slug === preselectSlug)
      if (tool) {
        setSelectedTools(prev => {
          if (prev.find(t => t.id === tool.id)) return prev
          if (prev.length >= 2) return [prev[0], tool]
          const newTools = [...prev, tool]
          if (newTools.length > 0) {
            hasHandledPreselect.current = true
          }
          return newTools
        })
      }
    }
  }, [searchParams, tools])

  // Filter and Sort tools
  const filteredTools = tools
    .filter(tool => {
      // Category filter
      if (selectedCategory !== 'All') {
        const toolCategorySlug = initialCategories.find(c => c.name === tool.category || c.slug === tool.category)?.slug
        if (toolCategorySlug !== selectedCategory && tool.category !== selectedCategory) {
          return false
        }
      }

      // Search filter
      if (searchQuery &&
        !tool.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !tool.tagline.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false
      }

      // Pricing filter
      if (pricingFilter !== 'All') {
        const isFree = tool.pricing_model?.toLowerCase().includes('free')
        if (pricingFilter === 'Free' && !isFree) return false
        if (pricingFilter === 'Paid' && isFree) return false
      }

      // Rating filter
      if (minRating > 0 && (tool.rating || 0) < minRating) {
        return false
      }

      return true
    })
    .sort((a, b) => {
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0)
      if (sortBy === 'reviews') return (b.review_count || 0) - (a.review_count || 0)
      // Default: newest
      const dateA = a.published_date ? new Date(a.published_date).getTime() : 0
      const dateB = b.published_date ? new Date(b.published_date).getTime() : 0
      return dateB - dateA
    })

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <section className="mx-auto max-w-6xl px-4 py-12">
        <header className="max-w-4xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h1 className={`${searchParams.get('compare') === 'true' ? 'text-2xl sm:text-4xl' : 'text-4xl sm:text-5xl'} font-extrabold tracking-tight`}>
              {searchParams.get('compare') === 'true' ? (
                <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent italic">
                  Battle Engine: Select Agents
                </span>
              ) : (
                'Best AI Agents & Workflows'
              )}
            </h1>

            {searchParams.get('compare') === 'true' && (
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/30 w-fit shrink-0 backdrop-blur-sm self-start md:self-auto">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400"></span>
                </span>
                <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest leading-none">Selection Mode Active</span>
              </div>
            )}
          </div>
          <p className="mt-4 text-sm sm:text-base text-slate-400 max-w-2xl font-medium">
            {searchParams.get('compare') === 'true'
              ? 'Click the "+" button on any two agents below to initiate a live side-by-side battle analysis.'
              : 'Compare hand-picked autonomous AI agents and automated tools to build a workflow that actually gets work done.'}
          </p>
        </header>

        {/* Filter Controls Row */}
        <div className="mt-8 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col md:flex-row gap-4 flex-1">
            {/* Search Bar */}
            <div className="relative flex-1 md:max-w-sm">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search tools..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-900/70 pl-10 pr-10 py-3 text-sm text-white placeholder-slate-500 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Pricing Filter */}
            <div className="flex bg-slate-900/70 border border-slate-800 rounded-xl p-1 shrink-0">
              {(['All', 'Free', 'Paid'] as const).map((option) => (
                <button
                  key={option}
                  onClick={() => setPricingFilter(option)}
                  className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${pricingFilter === option
                    ? 'bg-sky-500 text-white shadow-lg'
                    : 'text-slate-400 hover:text-slate-200'
                    }`}
                >
                  {option}
                </button>
              ))}
            </div>

            {/* Rating Filter */}
            <select
              value={minRating}
              onChange={(e) => setMinRating(parseFloat(e.target.value))}
              className="bg-slate-900/70 border border-slate-800 text-slate-300 text-xs font-bold rounded-xl px-4 py-3 outline-none focus:border-sky-500 transition-all cursor-pointer"
            >
              <option value="0">Any Rating</option>
              <option value="4.5">★ 4.5+</option>
              <option value="4">★ 4.0+</option>
            </select>
          </div>

          {/* Sort Control */}
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 whitespace-nowrap">Sort by</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-slate-900/70 border border-slate-800 text-sky-400 text-xs font-bold rounded-xl px-4 py-3 outline-none focus:border-sky-500 transition-all cursor-pointer min-w-[140px]"
            >
              <option value="newest">Latest First</option>
              <option value="rating">Top Rated</option>
              <option value="reviews">Most Reviews</option>
            </select>
          </div>
        </div>

        {/* Category Pills - Modern Horizontal Scroll */}
        <div className="mt-8 relative">
          <div className="flex gap-2 pb-4 overflow-x-auto no-scrollbar scroll-smooth">
            <button
              onClick={() => setSelectedCategory('All')}
              className={`whitespace-nowrap rounded-full px-5 py-2 text-xs font-black uppercase tracking-widest transition-all italic border ${selectedCategory === 'All'
                ? 'bg-cyan-500 border-cyan-400 text-slate-950 shadow-lg shadow-cyan-500/20'
                : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
            >
              All Tools
            </button>
            {initialCategories.map((category) => (
              <button
                key={category.slug}
                onClick={() => setSelectedCategory(category.slug)}
                className={`whitespace-nowrap rounded-full px-5 py-2 text-xs font-black uppercase tracking-widest transition-all italic border ${selectedCategory === category.slug
                  ? 'bg-cyan-500 border-cyan-400 text-slate-950 shadow-lg shadow-cyan-500/20'
                  : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
              >
                {category.name}
              </button>
            ))}
          </div>
          {/* Active Filter Indicators */}
          {(pricingFilter !== 'All' || minRating > 0 || searchQuery) && (
            <div className="mt-2 flex flex-wrap gap-2">
              <button
                onClick={() => {
                  setPricingFilter('All')
                  setMinRating(0)
                  setSearchQuery('')
                  setSelectedCategory('All')
                }}
                className="text-[10px] font-bold text-slate-500 hover:text-cyan-400 transition-colors uppercase tracking-widest flex items-center gap-1"
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Clear all filters
              </button>
            </div>
          )}
        </div>

        {/* Results Count */}
        {searchQuery && (
          <div className="mt-4 text-sm text-slate-400">
            Found <span className="font-semibold text-white">{filteredTools.length}</span> tools
          </div>
        )}

        {/* Tools Grid */}
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredTools.map((tool) => (
            <div
              key={tool.slug}
              className={`group relative flex h-full flex-col rounded-xl border p-4 shadow-sm transition-all hover:-translate-y-1 ${selectedTools.find(t => t.id === tool.id)
                ? 'border-cyan-500 bg-cyan-500/5 shadow-cyan-500/20'
                : 'border-slate-800 bg-slate-900/70 hover:border-sky-500 hover:shadow-sky-500/20'
                }`}
            >
              {/* Overlay Link for the whole card */}
              <Link
                href={`/tools/${tool.slug}`}
                className="absolute inset-0 z-0"
                aria-label={`View details for ${tool.name}`}
              />

              {/* Compare Toggle */}
              <button
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  toggleToolSelection(tool)
                }}
                className={`absolute top-4 right-4 z-20 flex h-6 w-6 items-center justify-center rounded-lg border transition-all ${selectedTools.find(t => t.id === tool.id)
                  ? 'bg-cyan-500 border-cyan-400 text-slate-950'
                  : 'bg-slate-900 border-slate-700 text-slate-500 hover:border-cyan-500 hover:text-cyan-400'
                  }`}
                title="Add to comparison"
              >
                {selectedTools.find(t => t.id === tool.id) ? (
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                  </svg>
                )}
              </button>

              {/* Top: Logo + Category */}
              <div className="relative z-10 flex items-center gap-3 pointer-events-none pr-8">
                <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg bg-slate-800">
                  {/* Show emoji OR letter fallback */}
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-sky-500 to-indigo-600 text-2xl text-white font-black italic">
                    {tool.logo && !tool.logo.startsWith('http') ? (
                      // Show emoji if logo is emoji
                      tool.logo
                    ) : (
                      // Show first letter if logo is URL or missing
                      tool.name.charAt(0).toUpperCase()
                    )}
                  </div>

                  {/* Logo image (only if it's a URL) */}
                  {tool.logo && tool.logo.startsWith('http') && (
                    <Image
                      src={tool.logo}
                      alt={tool.name}
                      width={40}
                      height={40}
                      className="absolute inset-0 h-full w-full object-contain"
                      onError={(e) => {
                        e.currentTarget.style.opacity = '0'
                      }}
                    />
                  )}
                </div>

                <div className="flex flex-col">
                  <span className={`text-sm font-black italic uppercase tracking-tight transition-colors ${selectedTools.find(t => t.id === tool.id) ? 'text-cyan-400' : 'text-slate-50 group-hover:text-sky-400'
                    }`}>
                    {tool.name}
                  </span>
                  <div className="pointer-events-auto">
                    <Link
                      href={`/tools/category/${initialCategories.find(c => c.name === tool.category)?.slug || tool.category.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')}`}
                      className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-sky-500 transition-colors italic"
                    >
                      {tool.category}
                    </Link>
                  </div>
                </div>
              </div>

              {/* Middle: Tagline */}
              <p className="relative z-10 mt-4 line-clamp-3 text-sm text-slate-300 pointer-events-none leading-relaxed">{tool.tagline}</p>

              {/* Bottom: Rating + Status */}
              <div className="relative z-10 mt-auto flex items-center justify-between gap-3 pointer-events-none pt-4 border-t border-slate-800/50">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    {typeof tool.rating === 'number' && (
                      <span className="flex items-center gap-1">
                        <span className="text-amber-400 text-sm">★</span>
                        <span className="font-bold text-slate-100 italic">
                          {tool.rating.toFixed(1)}
                        </span>
                      </span>
                    )}
                    {typeof tool.review_count === 'number' && (
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">({tool.review_count}+)</span>
                    )}
                  </div>
                  {tool.pricing_model && (
                    <span className="text-[10px] font-black uppercase tracking-widest text-cyan-400/80 italic">
                      {tool.pricing_model}
                    </span>
                  )}
                </div>
                <span className={`inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-[10px] font-black uppercase tracking-widest transition-all italic ${selectedTools.find(t => t.id === tool.id)
                  ? 'bg-cyan-500 border-cyan-400 text-slate-950'
                  : 'bg-slate-900/50 border-slate-700 text-sky-400 group-hover:border-sky-500 shadow-lg'
                  }`}>
                  Review
                  <span aria-hidden>→</span>
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Floating Comparison Tray */}
        {selectedTools.length > 0 && (
          <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 w-full max-w-2xl px-4 animate-fadeIn">
            <div className="bg-slate-900/90 backdrop-blur-xl border border-cyan-500/50 rounded-2xl p-4 shadow-2xl shadow-cyan-500/20 flex items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="flex -space-x-3">
                  {selectedTools.map(tool => (
                    <div key={tool.id} className="h-12 w-12 rounded-xl border-2 border-slate-900 bg-slate-800 overflow-hidden relative">
                      {tool.logo && tool.logo.startsWith('http') ? (
                        <Image src={tool.logo} alt={tool.name} width={48} height={48} className="object-cover h-full w-full" />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center bg-cyan-500 text-slate-950 font-black italic">{tool.name.charAt(0)}</div>
                      )}
                    </div>
                  ))}
                  {selectedTools.length === 1 && (
                    <div className="h-12 w-12 rounded-xl border-2 border-dashed border-slate-700 flex items-center justify-center text-slate-600 bg-slate-900/50">
                      <span className="text-xs font-bold whitespace-nowrap px-4">+ Pick One</span>
                    </div>
                  )}
                </div>
                <div className="hidden sm:block">
                  <p className="text-xs font-black uppercase tracking-widest text-white italic">Comparison Selection</p>
                  <p className="text-[10px] text-slate-400 font-bold">{selectedTools.length} of 2 agents selected</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSelectedTools([])}
                  className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors italic px-2"
                >
                  Reset
                </button>
                <Link
                  href={selectedTools.length === 2 ? `/compare?tools=${selectedTools[0].slug},${selectedTools[1].slug}` : '#'}
                  className={`px-6 py-3 rounded-xl font-black text-xs uppercase tracking-[0.15em] italic transition-all shadow-lg ${selectedTools.length === 2
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-cyan-500/30 hover:scale-[1.05] hover:shadow-cyan-500/50'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                    }`}
                >
                  Battle Now 🆚
                </Link>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}

export default function ToolsClient(props: ToolsClientProps) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 px-4 py-12 flex items-center justify-center text-white">Loading directory...</div>}>
      <ToolsContent {...props} />
    </Suspense>
  )
}
