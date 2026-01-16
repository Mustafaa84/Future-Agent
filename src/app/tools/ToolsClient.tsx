'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface Tool {
  id: string
  slug: string
  name: string
  tagline: string
  category: string
  logo: string
  rating: number
  review_count: number
}

interface ToolsClientProps {
  tools: Tool[]
}

export default function ToolsClient({ tools }: ToolsClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [searchQuery, setSearchQuery] = useState<string>('')

  // Get unique categories from tools
  const categories = ['All', ...new Set(tools.map(tool => tool.category))]

  // Filter tools based on category and search
  const filteredTools = tools.filter(tool => {
    // Category filter
    if (selectedCategory !== 'All' && tool.category !== selectedCategory) {
      return false
    }

    // Search filter
    if (searchQuery && 
        !tool.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !tool.tagline.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }

    return true
  })

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <section className="mx-auto max-w-6xl px-4 py-12">
        <header className="max-w-3xl">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            AI & SEO Tools Directory
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-400">
            Compare hand-picked AI writing and SEO tools to build a content workflow that fits your
            goals, budget, and publishing schedule.
          </p>
        </header>

        {/* Search Bar */}
        <div className="mt-8">
          <div className="relative max-w-md">
            <input
              type="text"
              placeholder="Search tools by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-slate-900/70 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
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
        </div>

        {/* Category Filter Buttons */}
        <div className="mt-6 flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                selectedCategory === category
                  ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/30'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              {category}
              {category === 'All' && (
                <span className="ml-1.5 text-xs opacity-70">({tools.length})</span>
              )}
              {category !== 'All' && (
                <span className="ml-1.5 text-xs opacity-70">
                  ({tools.filter(t => t.category === category).length})
                </span>
              )}
            </button>
          ))}
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
            <Link
              key={tool.slug}
              href={`/tools/${tool.slug}`}
              className="group flex h-full flex-col rounded-xl border border-slate-800 bg-slate-900/70 p-4 shadow-sm transition hover:-translate-y-1 hover:border-sky-500 hover:shadow-sky-500/20"
            >
              {/* Top: Logo + Category */}
              <div className="flex items-center gap-3">
                <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg bg-slate-800">
                  {/* Show emoji OR letter fallback */}
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-sky-500 to-indigo-600 text-2xl text-white">
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
                  <span className="text-sm font-semibold text-slate-50 group-hover:text-sky-400">
                    {tool.name}
                  </span>
                  <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
                    {tool.category}
                  </span>
                </div>
              </div>

              {/* Middle: Tagline */}
              <p className="mt-4 line-clamp-3 text-sm text-slate-300">{tool.tagline}</p>

              {/* Bottom: Rating + CTA */}
              <div className="mt-5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  {typeof tool.rating === 'number' && (
                    <>
                      <span className="flex items-center gap-1">
                        <span className="text-amber-400">★</span>
                        <span className="font-semibold text-slate-100">
                          {tool.rating.toFixed(1)}
                        </span>
                      </span>
                      {typeof tool.review_count === 'number' && (
                        <span className="text-slate-500">({tool.review_count}+ reviews)</span>
                      )}
                    </>
                  )}
                </div>
                <span className="inline-flex items-center gap-1 rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-xs font-medium text-sky-400 group-hover:border-sky-500">
                  View review
                  <span aria-hidden>→</span>
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Empty State */}
        {filteredTools.length === 0 && (
          <div className="mt-10 text-center rounded-xl border border-slate-800 bg-slate-900/50 py-12">
            <p className="text-lg text-slate-300 mb-2">No tools found</p>
            <p className="text-sm text-slate-500 mb-4">
              {searchQuery ? `No results for "${searchQuery}"` : 'No tools in this category'}
            </p>
            <button
              onClick={() => {
                setSearchQuery('')
                setSelectedCategory('All')
              }}
              className="rounded-lg bg-sky-500 px-6 py-2 text-sm font-medium text-white hover:bg-sky-600 transition"
            >
              Clear search
            </button>
          </div>
        )}
      </section>
    </div>
  )
}
