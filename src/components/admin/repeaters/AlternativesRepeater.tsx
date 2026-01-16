'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

interface Alternative {
  id?: string
  tool_id?: string
  alternative_name: string
  alternative_slug: string
  reason: string
  sort_order: number
}

interface AlternativesRepeaterProps {
  toolId: string | null
  mode: 'create' | 'edit'
}

export default function AlternativesRepeater({
  toolId,
  mode,
}: AlternativesRepeaterProps) {
  const [alternatives, setAlternatives] = useState<Alternative[]>([])
  const [loading, setLoading] = useState(mode === 'edit')
  const [saving, setSaving] = useState<string | null>(null)

  // Load alternatives from database (edit mode only)
  useEffect(() => {
    const loadAlternatives = async () => {
      try {
        const { data, error } = await supabase
          .from('tool_alternatives')
          .select('*')
          .eq('tool_id', toolId)
          .order('sort_order', { ascending: true })

        if (error) throw error
        setAlternatives(data || [])
      } catch (err) {
        console.error('Error loading alternatives:', err)
      } finally {
        setLoading(false)
      }
    }

    if (mode === 'edit' && toolId) {
      loadAlternatives()
    } else {
      setLoading(false)
    }
  }, [toolId, mode])

  const addAlternative = async () => {
    const newAlternative: Alternative = {
      alternative_name: '',
      alternative_slug: '',
      reason: '',
      sort_order: alternatives.length,
    }

    if (mode === 'edit' && toolId) {
      try {
        setSaving('new')
        const { data, error } = await supabase
          .from('tool_alternatives')
          .insert([{ ...newAlternative, tool_id: toolId }])
          .select()
          .single()

        if (error) throw error
        setAlternatives([...alternatives, data])
      } catch (err) {
        console.error('Error adding alternative:', err)
        alert('Failed to add alternative. Please try again.')
      } finally {
        setSaving(null)
      }
    } else {
      setAlternatives([...alternatives, newAlternative])
    }
  }

  const updateAlternative = async (
    index: number,
    field: keyof Alternative,
    value: string
  ) => {
    const updated = [...alternatives]
    updated[index] = { ...updated[index], [field]: value }

    // Auto-generate slug from name if name changes
    if (field === 'alternative_name') {
      updated[index].alternative_slug = value
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '')
    }

    setAlternatives(updated)

    if (mode === 'edit' && updated[index].id) {
      try {
        setSaving(updated[index].id!)

        const updateData =
          field === 'alternative_name'
            ? {
                alternative_name: value,
                alternative_slug: updated[index].alternative_slug,
              }
            : { [field]: value }

        const { error } = await supabase
          .from('tool_alternatives')
          .update(updateData)
          .eq('id', updated[index].id)

        if (error) throw error
      } catch (err) {
        console.error('Error updating alternative:', err)
      } finally {
        setSaving(null)
      }
    }
  }

  const deleteAlternative = async (index: number) => {
    const alternative = alternatives[index]

    if (mode === 'edit' && alternative.id) {
      if (
        !confirm(
          'Are you sure you want to delete this alternative?'
        )
      )
        return

      try {
        setSaving(alternative.id)
        const { error } = await supabase
          .from('tool_alternatives')
          .delete()
          .eq('id', alternative.id)

        if (error) throw error

        const updated = alternatives.filter((_, i) => i !== index)
        setAlternatives(updated)
        await reorderAlternatives(updated)
      } catch (err) {
        console.error('Error deleting alternative:', err)
        alert('Failed to delete alternative. Please try again.')
      } finally {
        setSaving(null)
      }
    } else {
      setAlternatives(alternatives.filter((_, i) => i !== index))
    }
  }

  const moveAlternative = async (
    index: number,
    direction: 'up' | 'down'
  ) => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === alternatives.length - 1)
    ) {
      return
    }

    const newIndex = direction === 'up' ? index - 1 : index + 1
    const updated = [...alternatives]
    const temp = updated[index]
    updated[index] = updated[newIndex]
    updated[newIndex] = temp

    updated.forEach((a, i) => {
      a.sort_order = i
    })

    setAlternatives(updated)

    if (mode === 'edit') {
      await reorderAlternatives(updated)
    }
  }

  const reorderAlternatives = async (
    orderedAlternatives: Alternative[]
  ) => {
    if (mode !== 'edit') return

    try {
      const updates = orderedAlternatives.map((a, index) =>
        supabase
          .from('tool_alternatives')
          .update({ sort_order: index })
          .eq('id', a.id)
      )

      await Promise.all(updates)
    } catch (err) {
      console.error('Error reordering alternatives:', err)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-slate-400">Loading alternatives...</div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {alternatives.length === 0 && (
        <div className="text-center py-8 text-slate-400 bg-slate-900/30 rounded-xl border-2 border-dashed border-slate-700">
          No alternatives yet. Add alternatives manually below.
        </div>
      )}

      {alternatives.map((alternative, index) => (
        <div
          key={alternative.id || index}
          className="relative bg-gradient-to-br from-slate-900/80 to-slate-800/50 border-2 border-slate-700 rounded-xl p-6 hover:border-indigo-500/50 transition-all"
        >
          {/* Saving indicator */}
          {saving === alternative.id && (
            <div className="absolute top-4 right-4 text-xs text-indigo-400 flex items-center gap-2">
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

          <div className="space-y-4">
            {/* Alternative Name */}
            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                Alternative Tool Name #{index + 1}
              </label>
              <input
                type="text"
                value={alternative.alternative_name}
                onChange={(e) =>
                  updateAlternative(
                    index,
                    'alternative_name',
                    e.target.value
                  )
                }
                placeholder="e.g., Copy.ai, Jasper AI"
                className="w-full px-4 py-3 bg-white/5 border-2 border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-indigo-400 focus:bg-white/10 transition-all"
              />
            </div>

            {/* Slug (auto-generated, read-only display) */}
            <div>
              <label className="block text-sm font-semibold text-slate-400 mb-2">
                Slug (auto-generated)
              </label>
              <input
                type="text"
                value={alternative.alternative_slug}
                readOnly
                className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-400 text-sm cursor-not-allowed"
              />
              <p className="text-xs text-slate-500 mt-1">
                Links to: /tools/{alternative.alternative_slug || 'tool-name'}
              </p>
            </div>

            {/* Reason */}
            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                Why It&apos;s a Good Alternative
              </label>
              <textarea
                value={alternative.reason}
                onChange={(e) =>
                  updateAlternative(index, 'reason', e.target.value)
                }
                placeholder="Explain why users might prefer this alternative..."
                rows={3}
                className="w-full px-4 py-3 bg-white/5 border-2 border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-indigo-400 focus:bg-white/10 transition-all resize-vertical"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 mt-4">
            <button
              type="button"
              onClick={() => moveAlternative(index, 'up')}
              disabled={index === 0}
              className="px-3 py-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-30 disabled:cursor-not-allowed text-white rounded-lg transition-all text-sm font-medium"
            >
              ↑ Up
            </button>
            <button
              type="button"
              onClick={() => moveAlternative(index, 'down')}
              disabled={index === alternatives.length - 1}
              className="px-3 py-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-30 disabled:cursor-not-allowed text-white rounded-lg transition-all text-sm font-medium"
            >
              ↓ Down
            </button>
            <button
              type="button"
              onClick={() => deleteAlternative(index)}
              disabled={saving === alternative.id}
              className="ml-auto px-4 py-2 bg-red-900/30 hover:bg-red-900/50 text-red-400 rounded-lg transition-all text-sm font-medium border border-red-800"
            >
              🗑️ Delete
            </button>
          </div>
        </div>
      ))}

      {/* Add Button */}
      <button
        type="button"
        onClick={addAlternative}
        disabled={saving === 'new'}
        className="w-full py-4 bg-indigo-600/20 hover:bg-indigo-600/30 border-2 border-dashed border-indigo-600 text-indigo-400 rounded-xl transition-all font-semibold text-lg disabled:opacity-50"
      >
        {saving === 'new' ? '⏳ Adding...' : '+ Add Alternative'}
      </button>
    </div>
  )
}
