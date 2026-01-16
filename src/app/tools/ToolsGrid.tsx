'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Tag } from '@/lib/tags'

interface Tool {
  slug: string
  name: string
  tagline: string
  rating: number
  reviewCount: number
  logo: string
  description: string
  category: string
  tags: string[]
  pricing?: { startingPrice: number | string, period: string }
}

interface ToolsGridProps {
  tools: Tool[]
  tags: Tag[]
}

export default function ToolsGrid({ tools, tags }: ToolsGridProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  // Filter tools based on search and tags
  const filteredTools = tools.filter(tool => {
    // Search filter
    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tool.description.toLowerCase().includes(searchQuery.toLowerCase())
    
    // Tag filter
    const matchesTags = selectedTags.length === 0 || 
                       selectedTags.every(tag => tool.tags.includes(tag))
    
    return matchesSearch && matchesTags
  })

  // Toggle tag selection
  const toggleTag = (tagSlug: string) => {
    setSelectedTags(prev => 
      prev.includes(tagSlug) 
        ? prev.filter(t => t !== tagSlug)
        : [...prev, tagSlug]
    )
  }

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery('')
    setSelectedTags([])
  }

  return (
    <div>
      {/* Search Bar */}
      <div className="mb-8">
        <div className="relative max-w-2xl mx-auto">
          <input
            type="text"
            placeholder="Search tools by name or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-6 py-4 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition"
          />
          <svg 
            className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Tag Filters */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <h3 className="text-sm font-semibold text-white">Filter by:</h3>
          {selectedTags.length > 0 && (
            <button
              onClick={clearFilters}
              className="text-xs text-cyan-400 hover:text-cyan-300 transition"
            >
              Clear all
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {tags.map(tag => (
            <button
              key={tag.slug}
              onClick={() => toggleTag(tag.slug)}
              className={`inline-flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-semibold transition ${
                selectedTags.includes(tag.slug)
                  ? 'bg-cyan-500 text-white'
                  : 'bg-slate-900 border border-slate-800 text-slate-300 hover:border-cyan-500/50'
              }`}
            >
              {tag.icon && <span>{tag.icon}</span>}
              <span>{tag.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-sm text-slate-400">
          Showing <span className="text-white font-semibold">{filteredTools.length}</span> {filteredTools.length === 1 ? 'tool' : 'tools'}
          {(searchQuery || selectedTags.length > 0) && (
            <span> matching your filters</span>
          )}
        </p>
      </div>

      {/* Tools Grid */}
      {filteredTools.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-bold text-white mb-2">No tools found</h3>
          <p className="text-slate-400 mb-6">Try adjusting your search or filters</p>
          <button
            onClick={clearFilters}
            className="px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-white font-semibold rounded-lg transition"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTools.map((tool) => (
            <Link
              key={tool.slug}
              href={`/tools/${tool.slug}`}
              className="bg-slate-900/60 border border-slate-800 hover:border-cyan-500/50 rounded-xl p-6 transition group"
            >
              {/* Tool Header */}
              <div className="flex items-start gap-4 mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                  {tool.logo}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition truncate">
                    {tool.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-yellow-400 text-sm">★★★★★</span>
                    <span className="text-white text-sm font-semibold">{tool.rating}</span>
                    <span className="text-slate-500 text-xs">({tool.reviewCount})</span>
                  </div>
                </div>
              </div>

              {/* Tagline */}
              <p className="text-sm text-slate-400 font-medium mb-3">
                {tool.tagline}
              </p>

              {/* Description */}
              <p className="text-sm text-slate-400 mb-4 line-clamp-2">
                {tool.description}
              </p>

              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <div className="flex flex-wrap gap-1">
                  <span className="px-2 py-1 bg-purple-600/20 text-purple-300 text-xs font-semibold rounded">
                    {tool.category}
                  </span>
                </div>
                {tool.pricing && (
                  <div className="text-right">
                    <div className="text-sm font-bold text-white">
                      {typeof tool.pricing.startingPrice === 'number' 
                        ? `$${tool.pricing.startingPrice}`
                        : tool.pricing.startingPrice}
                    </div>
                    <div className="text-xs text-slate-500">/{tool.pricing.period}</div>
                  </div>
                )}
              </div>

              {/* CTA */}
              <div className="mt-4">
                <span className="text-sm text-cyan-400 font-semibold group-hover:text-cyan-300 transition">
                  View Details →
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
