'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

interface Feature {
  id?: string
  tool_id?: string
  icon: string
  title: string
  description: string
  sort_order: number
}

interface FeatureRepeaterProps {
  toolId: string | null
  mode: 'create' | 'edit'
}

export default function FeatureRepeater({ toolId, mode }: FeatureRepeaterProps) {
  const [features, setFeatures] = useState<Feature[]>([])
  const [loading, setLoading] = useState(mode === 'edit')
  const [saving, setSaving] = useState<string | null>(null)

useEffect(() => {
  const loadFeatures = async () => {
    try {
      const { data, error } = await supabase
        .from('tool_features')
        .select('*')
        .eq('tool_id', toolId)
        .order('sort_order', { ascending: true })

      if (error) throw error
      setFeatures(data || [])
    } catch (err) {
      console.error('Error loading features:', err)
    } finally {
      setLoading(false)
    }
  }

  if (mode === 'edit' && toolId) {
    loadFeatures()
  } else {
    setLoading(false)
  }
}, [toolId, mode])

  const addFeature = async () => {
    const newFeature: Feature = {
      icon: '',
      title: '',
      description: '',
      sort_order: features.length,
    }

    if (mode === 'edit' && toolId) {
      try {
        setSaving('new')
        const { data, error } = await supabase
          .from('tool_features')
          .insert([{ ...newFeature, tool_id: toolId }])
          .select()
          .single()

        if (error) throw error
        setFeatures([...features, data])
      } catch (err) {
        console.error('Error adding feature:', err)
        alert('Failed to add feature. Please try again.')
      } finally {
        setSaving(null)
      }
    } else {
      setFeatures([...features, newFeature])
    }
  }

  const updateFeature = async (index: number, field: keyof Feature, value: string) => {
    const updated = [...features]
    updated[index] = { ...updated[index], [field]: value }
    setFeatures(updated)

    if (mode === 'edit' && updated[index].id) {
      try {
        setSaving(updated[index].id!)
        const { error } = await supabase
          .from('tool_features')
          .update({ [field]: value })
          .eq('id', updated[index].id)

        if (error) throw error
      } catch (err) {
        console.error('Error updating feature:', err)
      } finally {
        setSaving(null)
      }
    }
  }

  const deleteFeature = async (index: number) => {
    const feature = features[index]

    if (mode === 'edit' && feature.id) {
      if (!confirm('Are you sure you want to delete this feature?')) return

      try {
        setSaving(feature.id)
        const { error } = await supabase
          .from('tool_features')
          .delete()
          .eq('id', feature.id)

        if (error) throw error

        const updated = features.filter((_, i) => i !== index)
        setFeatures(updated)
        await reorderFeatures(updated)
      } catch (err) {
        console.error('Error deleting feature:', err)
        alert('Failed to delete feature. Please try again.')
      } finally {
        setSaving(null)
      }
    } else {
      setFeatures(features.filter((_, i) => i !== index))
    }
  }

  const moveFeature = async (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === features.length - 1)
    ) {
      return
    }

    const newIndex = direction === 'up' ? index - 1 : index + 1
    const updated = [...features]
    const temp = updated[index]
    updated[index] = updated[newIndex]
    updated[newIndex] = temp

    updated.forEach((f, i) => {
      f.sort_order = i
    })

    setFeatures(updated)

    if (mode === 'edit') {
      await reorderFeatures(updated)
    }
  }

  const reorderFeatures = async (orderedFeatures: Feature[]) => {
    if (mode !== 'edit') return

    try {
      const updates = orderedFeatures.map((f, index) =>
        supabase.from('tool_features').update({ sort_order: index }).eq('id', f.id),
      )

      await Promise.all(updates)
    } catch (err) {
      console.error('Error reordering features:', err)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-slate-400">Loading features...</div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {features.length === 0 && (
        <div className="text-center py-8 text-slate-400 bg-slate-900/30 rounded-xl border-2 border-dashed border-slate-700">
          No features yet. Add features manually below.
        </div>
      )}

      {features.map((feature, index) => (
        <div
          key={feature.id || index}
          className="relative bg-gradient-to-br from-slate-900/80 to-slate-800/50 border-2 border-slate-700 rounded-xl p-6 hover:border-purple-500/50 transition-all"
        >
          {saving === feature.id && (
            <div className="absolute top-4 right-4 text-xs text-cyan-400 flex items-center gap-2">
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
            {/* Icon Input */}
            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                Icon (Emoji)
              </label>
              <input
                type="text"
                value={feature.icon}
                onChange={(e) => updateFeature(index, 'icon', e.target.value)}
                placeholder="e.g., 🎯 or ⚡ or 🚀"
                maxLength={4}
                className="w-full px-4 py-3 bg-white/5 border-2 border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-purple-400 focus:bg-white/10 transition-all text-2xl"
              />
              <p className="mt-1 text-xs text-slate-400">
                Use a single emoji (max 4 chars). Examples: 🎯 ⚡ 🚀 💡 ✨ 🔥 🌟
              </p>
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                Feature Title
              </label>
              <input
                type="text"
                value={feature.title}
                onChange={(e) => updateFeature(index, 'title', e.target.value)}
                placeholder="e.g., Real-Time Web Search"
                className="w-full px-4 py-3 bg-white/5 border-2 border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-purple-400 focus:bg-white/10 transition-all"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                Feature Description
              </label>
              <textarea
                value={feature.description}
                onChange={(e) => updateFeature(index, 'description', e.target.value)}
                placeholder="Describe this feature..."
                rows={3}
                className="w-full px-4 py-3 bg-white/5 border-2 border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-purple-400 focus:bg-white/10 transition-all resize-none"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 mt-4">
            <button
              type="button"
              onClick={() => moveFeature(index, 'up')}
              disabled={index === 0}
              className="px-3 py-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-30 disabled:cursor-not-allowed text-white rounded-lg transition-all text-sm font-medium"
            >
              ↑ Up
            </button>
            <button
              type="button"
              onClick={() => moveFeature(index, 'down')}
              disabled={index === features.length - 1}
              className="px-3 py-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-30 disabled:cursor-not-allowed text-white rounded-lg transition-all text-sm font-medium"
            >
              ↓ Down
            </button>
            <button
              type="button"
              onClick={() => deleteFeature(index)}
              disabled={saving === feature.id}
              className="ml-auto px-4 py-2 bg-red-900/30 hover:bg-red-900/50 text-red-400 rounded-lg transition-all text-sm font-medium border border-red-800"
            >
              🗑️ Delete
            </button>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addFeature}
        disabled={saving === 'new'}
        className="w-full py-4 bg-purple-600/20 hover:bg-purple-600/30 border-2 border-dashed border-purple-600 text-purple-400 rounded-xl transition-all font-semibold text-lg disabled:opacity-50"
      >
        {saving === 'new' ? '⏳ Adding...' : '+ Add Feature'}
      </button>
    </div>
  )
}
