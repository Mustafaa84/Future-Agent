'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import ImageUpload from '@/components/ImageUpload'

interface ReviewSection {
  id?: string
  review_id?: string
  title: string
  content: string
  image_url?: string
  sort_order: number
}

interface ReviewSectionsRepeaterProps {
  toolId: string | null
  mode: 'create' | 'edit'
}

export default function ReviewSectionsRepeater({ toolId, mode }: ReviewSectionsRepeaterProps) {
  const [sections, setSections] = useState<ReviewSection[]>([])
  const [reviewId, setReviewId] = useState<string | null>(null)
  const [loading, setLoading] = useState(mode === 'edit')
  const [saving, setSaving] = useState<string | null>(null)

useEffect(() => {
  const loadReviewAndSections = async () => {
    try {
      const { data: reviewData, error: reviewError } = await supabase
        .from('tool_reviews')
        .select('id')
        .eq('tool_id', toolId)
        .single()

      if (reviewError && reviewError.code !== 'PGRST116') {
        throw reviewError
      }

      if (reviewData) {
        setReviewId(reviewData.id)

        const { data: sectionsData, error: sectionsError } = await supabase
          .from('tool_review_sections')
          .select('*')
          .eq('review_id', reviewData.id)
          .order('sort_order', { ascending: true })

        if (sectionsError) throw sectionsError
        setSections(sectionsData || [])
      }
    } catch (err) {
      console.error('Error loading review sections:', err)
    } finally {
      setLoading(false)
    }
  }

  if (mode === 'edit' && toolId) {
    loadReviewAndSections()
  } else {
    setLoading(false)
  }
}, [toolId, mode])

  const ensureReviewExists = async (): Promise<string | null> => {
    if (reviewId) return reviewId

    try {
      const { data, error } = await supabase
        .from('tool_reviews')
        .insert([{ tool_id: toolId, intro: '' }])
        .select()
        .single()

      if (error) throw error
      setReviewId(data.id)
      return data.id
    } catch (err) {
      console.error('Error creating review:', err)
      return null
    }
  }

  const addSection = async () => {
    const newSection: ReviewSection = {
      title: '',
      content: '',
      image_url: '',
      sort_order: sections.length,
    }

    if (mode === 'edit' && toolId) {
      try {
        setSaving('new-section')
        const currentReviewId = await ensureReviewExists()

        if (!currentReviewId) {
          alert('Failed to create review. Please try again.')
          return
        }

        const { data, error } = await supabase
          .from('tool_review_sections')
          .insert([{ ...newSection, review_id: currentReviewId }])
          .select()
          .single()

        if (error) throw error
        setSections([...sections, data])
      } catch (err) {
        console.error('Error adding section:', err)
        alert('Failed to add section. Please try again.')
      } finally {
        setSaving(null)
      }
    } else {
      setSections([...sections, newSection])
    }
  }

  const updateSection = async (index: number, field: keyof ReviewSection, value: string) => {
    const updated = [...sections]
    updated[index] = { ...updated[index], [field]: value }
    setSections(updated)

    if (mode === 'edit' && updated[index].id) {
      try {
        setSaving(updated[index].id!)
        const { error } = await supabase
          .from('tool_review_sections')
          .update({ [field]: value })
          .eq('id', updated[index].id)

        if (error) throw error
      } catch (err) {
        console.error('Error updating section:', err)
      } finally {
        setSaving(null)
      }
    }
  }

  const deleteSection = async (index: number) => {
    const section = sections[index]

    if (mode === 'edit' && section.id) {
      if (!confirm('Are you sure you want to delete this section?')) return

      try {
        setSaving(section.id)
        const { error } = await supabase
          .from('tool_review_sections')
          .delete()
          .eq('id', section.id)

        if (error) throw error

        const updated = sections.filter((_, i) => i !== index)
        setSections(updated)
        await reorderSections(updated)
      } catch (err) {
        console.error('Error deleting section:', err)
        alert('Failed to delete section. Please try again.')
      } finally {
        setSaving(null)
      }
    } else {
      setSections(sections.filter((_, i) => i !== index))
    }
  }

  const moveSection = async (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === sections.length - 1)
    ) {
      return
    }

    const newIndex = direction === 'up' ? index - 1 : index + 1
    const updated = [...sections]
    const temp = updated[index]
    updated[index] = updated[newIndex]
    updated[newIndex] = temp

    updated.forEach((s, i) => {
      s.sort_order = i
    })

    setSections(updated)

    if (mode === 'edit') {
      await reorderSections(updated)
    }
  }

  const reorderSections = async (orderedSections: ReviewSection[]) => {
    if (mode !== 'edit') return

    try {
      const updates = orderedSections.map((s, index) =>
        supabase.from('tool_review_sections').update({ sort_order: index }).eq('id', s.id),
      )

      await Promise.all(updates)
    } catch (err) {
      console.error('Error reordering sections:', err)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-slate-400">Loading review sections...</div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {sections.length === 0 && (
        <div className="text-center py-8 text-slate-400 bg-slate-900/30 rounded-xl border-2 border-dashed border-slate-700">
          No review sections yet. Add sections manually below.
        </div>
      )}

      {sections.map((section, index) => (
        <div
          key={section.id || index}
          className="relative bg-gradient-to-br from-slate-900/80 to-slate-800/50 border-2 border-slate-700 rounded-xl p-6 hover:border-purple-500/50 transition-all"
        >
          {saving === section.id && (
            <div className="absolute top-4 right-4 text-xs text-purple-400 flex items-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Saving...
            </div>
          )}

          <div className="flex justify-between items-center mb-4">
            <h4 className="text-lg font-bold text-purple-300">Section {index + 1}</h4>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                Section Title
              </label>
              <input
                type="text"
                value={section.title}
                onChange={(e) => updateSection(index, 'title', e.target.value)}
                placeholder="e.g., Key Features, Performance Analysis"
                className="w-full px-4 py-3 bg-white/5 border-2 border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-purple-400 focus:bg-white/10 transition-all"
              />
            </div>

            <ImageUpload
              currentImage={section.image_url || ''}
              onImageChange={(url) => updateSection(index, 'image_url', url || '')}
              folder="reviews"
              label="Section Image (optional)"
            />

            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                Section Content
              </label>
              <textarea
                value={section.content}
                onChange={(e) => updateSection(index, 'content', e.target.value)}
                placeholder="Write the detailed content for this section..."
                rows={6}
                className="w-full px-4 py-3 bg-white/5 border-2 border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-purple-400 focus:bg-white/10 transition-all resize-vertical"
              />
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <button
              type="button"
              onClick={() => moveSection(index, 'up')}
              disabled={index === 0}
              className="px-3 py-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-30 disabled:cursor-not-allowed text-white rounded-lg transition-all text-sm font-medium"
            >
              ↑ Up
            </button>
            <button
              type="button"
              onClick={() => moveSection(index, 'down')}
              disabled={index === sections.length - 1}
              className="px-3 py-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-30 disabled:cursor-not-allowed text-white rounded-lg transition-all text-sm font-medium"
            >
              ↓ Down
            </button>
            <button
              type="button"
              onClick={() => deleteSection(index)}
              disabled={saving === section.id}
              className="ml-auto px-4 py-2 bg-red-900/30 hover:bg-red-900/50 text-red-400 rounded-lg transition-all text-sm font-medium border border-red-800"
            >
              🗑️ Delete
            </button>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addSection}
        disabled={saving === 'new-section'}
        className="w-full py-4 bg-purple-600/20 hover:bg-purple-600/30 border-2 border-dashed border-purple-600 text-purple-400 rounded-xl transition-all font-semibold text-lg disabled:opacity-50"
      >
        {saving === 'new-section' ? '⏳ Adding...' : '+ Add Review Section'}
      </button>
    </div>
  )
}
