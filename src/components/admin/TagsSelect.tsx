'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

interface Tag {
  id: string
  slug: string
  name: string
  icon: string
  color: string
}

interface TagsSelectProps {
  defaultValue?: string[] | string | null
}

export default function TagsSelect({
  defaultValue = [],
}: TagsSelectProps) {
  const [tags, setTags] = useState<Tag[]>([])
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Parse defaultValue on component mount
  useEffect(() => {
    let parsedDefault: string[] = []

    if (defaultValue) {
      try {
        if (typeof defaultValue === 'string') {
          parsedDefault = JSON.parse(defaultValue)
        } else if (Array.isArray(defaultValue)) {
          parsedDefault = defaultValue
        }
      } catch (e) {
        console.error('Error parsing default tags:', e)
        parsedDefault = []
      }
    }

    // Normalize to lowercase slugs
    const normalized = (Array.isArray(parsedDefault) ? parsedDefault : []).map(
      (tag: string) => tag.toLowerCase().replace(/\s+/g, '-')
    )
    setSelectedTags(normalized)
  }, [defaultValue])

  useEffect(() => {
    async function fetchTags() {
      try {
        const { data, error: dbError } = await supabase
          .from('tags')
          .select('id, slug, name, icon, color')
          .order('name', { ascending: true })

        if (dbError) {
          setError(dbError.message)
          return
        }

        if (data) {
          setTags(data)
        }
      } catch (err) {
        const tagsError = err instanceof Error ? err : new Error(String(err))
        setError(tagsError.message)
      } finally {
        setLoading(false)
      }
    }

    fetchTags()
  }, [])

  const handleTagToggle = (tagSlug: string) => {
    setSelectedTags((prev) => {
      if (prev.includes(tagSlug)) {
        return prev.filter((t) => t !== tagSlug)
      } else {
        return [...prev, tagSlug]
      }
    })
  }

  if (error) {
    return (
      <div>
        <label className="block text-sm font-semibold text-white mb-2">
          Tags <span className="text-slate-400">(optional)</span>
        </label>
        <div className="p-3 bg-red-900/20 border border-red-800 rounded-xl">
          <p className="text-red-400 text-sm">Error loading tags: {error}</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <label className="block text-sm font-semibold text-white mb-2">
        Tags <span className="text-slate-400">(optional)</span>
      </label>

      {loading ? (
        <div className="p-4 bg-slate-800/30 rounded-xl border border-slate-700">
          <p className="text-slate-400 text-sm">Loading tags...</p>
        </div>
      ) : (
        <>
          {/* Hidden input to store selected tags as JSON */}
          <input
            type="hidden"
            name="tags_json"
            value={JSON.stringify(selectedTags)}
          />

          {/* Tag buttons grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 mb-4">
            {tags.map((tag) => (
              <button
                key={tag.id}
                type="button"
                onClick={() => handleTagToggle(tag.slug)}
                className={`px-4 py-3 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                  selectedTags.includes(tag.slug)
                    ? 'bg-cyan-500/20 border-2 border-cyan-500 text-cyan-300 cursor-pointer'
                    : 'bg-slate-800/50 border-2 border-slate-700 text-slate-300 hover:border-slate-600 hover:bg-slate-800 cursor-pointer'
                }`}
              >
                <span className="text-lg">{tag.icon}</span>
                <span className="flex-1 text-left">{tag.name}</span>
                {selectedTags.includes(tag.slug) && (
                  <span className="text-cyan-400">✓</span>
                )}
              </button>
            ))}
          </div>

          {/* Selected tags summary */}
          {selectedTags.length > 0 && (
            <div className="p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
              <p className="text-xs text-cyan-300 mb-2 font-semibold">
                Selected ({selectedTags.length}):
              </p>
              <div className="flex flex-wrap gap-2">
                {selectedTags.map((tagSlug) => {
                  const tag = tags.find((t) => t.slug === tagSlug)
                  return (
                    <span
                      key={tagSlug}
                      className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs border border-cyan-500/50 flex items-center gap-2"
                    >
                      <span>{tag?.icon}</span>
                      {tag?.name}
                      <button
                        type="button"
                        onClick={() => handleTagToggle(tagSlug)}
                        className="text-cyan-400 hover:text-cyan-200 font-bold"
                      >
                        ×
                      </button>
                    </span>
                  )
                })}
              </div>
            </div>
          )}

          <p className="text-xs text-slate-400 mt-3">
            ℹ️ Select tags to categorize this tool. Tags help with SEO and quiz
            filtering. New tags can be added in Supabase.
          </p>
        </>
      )}
    </div>
  )
}
