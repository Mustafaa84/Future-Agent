'use client'

import { useState, useCallback } from 'react'

interface TagsRepeaterProps {
  initialTags: string | string[] | null | undefined
}

const availableTags = [
  { slug: 'paid', name: 'Paid', icon: '💎' },
  { slug: 'free', name: 'Free', icon: '🆓' },
  { slug: 'beginner-friendly', name: 'Beginner Friendly', icon: '👋' },
  { slug: 'content-creation', name: 'Content Creation', icon: '✍️' },
  { slug: 'seo', name: 'SEO', icon: '🔍' },
  { slug: 'marketing', name: 'Marketing', icon: '📢' },
  { slug: 'ai-writing', name: 'AI Writing', icon: '✨' },
  { slug: 'image-generation', name: 'Image Generation', icon: '🎨' },
  { slug: 'productivity', name: 'Productivity', icon: '⚡' },
  { slug: 'automation', name: 'Automation', icon: '🤖' },
]

export default function TagsRepeater({ initialTags }: TagsRepeaterProps) {
  const [selectedTags, setSelectedTags] = useState<string[]>(() => {
    let parsed: string[] = []

    if (initialTags) {
      if (typeof initialTags === 'string') {
        try {
          parsed = JSON.parse(initialTags)
        } catch {
          parsed = []
        }
      } else if (Array.isArray(initialTags)) {
        parsed = initialTags
      }
    }

    return Array.isArray(parsed) ? parsed : []
  })

  const toggleTag = useCallback((slug: string) => {
    setSelectedTags((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug],
    )
  }, [])

  return (
    <div className="space-y-4">
      <input type="hidden" name="tags_json" value={JSON.stringify(selectedTags)} />

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {availableTags.map((tag) => (
          <label
            key={tag.slug}
            className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
              selectedTags.includes(tag.slug)
                ? 'bg-cyan-600/30 border-cyan-500'
                : 'bg-white/5 border-slate-600 hover:border-cyan-400'
            }`}
          >
            <input
              type="checkbox"
              checked={selectedTags.includes(tag.slug)}
              onChange={() => toggleTag(tag.slug)}
              className="w-5 h-5 cursor-pointer"
            />
            <span className="text-lg">{tag.icon}</span>
            <span className="text-white font-medium">{tag.name}</span>
          </label>
        ))}
      </div>

      <div className="mt-6 p-4 bg-white/5 rounded-xl border border-slate-600">
        <p className="text-sm text-slate-400 mb-3">Selected Tags:</p>
        <div className="flex flex-wrap gap-2">
          {selectedTags && Array.isArray(selectedTags) && selectedTags.length > 0 ? (
            selectedTags.map((slug) => {
              const tag = availableTags.find((t) => t.slug === slug)
              return tag ? (
                <span
                  key={slug}
                  className="px-3 py-1 bg-cyan-600/30 text-cyan-300 rounded-full text-sm font-medium flex items-center gap-2"
                >
                  {tag.icon} {tag.name}
                </span>
              ) : (
                <span
                  key={slug}
                  className="px-3 py-1 bg-purple-600/30 text-purple-300 rounded-full text-sm font-medium"
                >
                  {slug}
                </span>
              )
            })
          ) : (
            <p className="text-slate-500 text-sm">
              No tags selected. Choose tags from the list above.
            </p>
          )}
        </div>
      </div>

      <div className="mt-4 p-3 bg-slate-900/50 rounded-lg border border-slate-700">
        <p className="text-xs text-slate-400 mb-2">JSON Output:</p>
        <code className="text-xs text-slate-300 font-mono break-all">
          {JSON.stringify(selectedTags)}
        </code>
      </div>
    </div>
  )
}
