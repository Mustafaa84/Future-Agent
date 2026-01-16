'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

interface ComparisonRow {
  id?: string
  tool_id?: string
  feature_name: string
  this_tool_value: string
  competitor_1_name: string
  competitor_1_value: string
  competitor_2_name: string
  competitor_2_value: string
  sort_order: number
}

interface ComparisonTableRepeaterProps {
  toolId: string | null
  mode: 'create' | 'edit'
}

export default function ComparisonTableRepeater({ toolId, mode }: ComparisonTableRepeaterProps) {
  const [rows, setRows] = useState<ComparisonRow[]>([])
  const [loading, setLoading] = useState(mode === 'edit')
  const [saving, setSaving] = useState<string | null>(null)

useEffect(() => {
  const loadComparisonRows = async () => {
    try {
      const { data, error } = await supabase
        .from('tool_comparisons')
        .select('*')
        .eq('tool_id', toolId)
        .order('sort_order', { ascending: true })

      if (error) throw error
      setRows(data || [])
    } catch (err) {
      console.error('Error loading comparison rows:', err)
    } finally {
      setLoading(false)
    }
  }

  if (mode === 'edit' && toolId) {
    loadComparisonRows()
  } else {
    setLoading(false)
  }
}, [toolId, mode])

  const addRow = async () => {
    const newRow: ComparisonRow = {
      feature_name: '',
      this_tool_value: '',
      competitor_1_name: '',
      competitor_1_value: '',
      competitor_2_name: '',
      competitor_2_value: '',
      sort_order: rows.length,
    }

    if (mode === 'edit' && toolId) {
      try {
        setSaving('new')
        const { data, error } = await supabase
          .from('tool_comparisons')
          .insert([{ ...newRow, tool_id: toolId }])
          .select()
          .single()

        if (error) throw error
        setRows([...rows, data])
      } catch (err) {
        console.error('Error adding row:', err)
        alert('Failed to add comparison row. Please try again.')
      } finally {
        setSaving(null)
      }
    } else {
      setRows([...rows, newRow])
    }
  }

  const updateRow = async (index: number, field: keyof ComparisonRow, value: string) => {
    const updated = [...rows]
    updated[index] = { ...updated[index], [field]: value }
    setRows(updated)

    if (mode === 'edit' && updated[index].id) {
      try {
        setSaving(updated[index].id!)
        const { error } = await supabase
          .from('tool_comparisons')
          .update({ [field]: value })
          .eq('id', updated[index].id)

        if (error) throw error
      } catch (err) {
        console.error('Error updating row:', err)
      } finally {
        setSaving(null)
      }
    }
  }

  const deleteRow = async (index: number) => {
    const row = rows[index]

    if (mode === 'edit' && row.id) {
      if (!confirm('Are you sure you want to delete this comparison row?')) return

      try {
        setSaving(row.id)
        const { error } = await supabase
          .from('tool_comparisons')
          .delete()
          .eq('id', row.id)

        if (error) throw error

        const updated = rows.filter((_, i) => i !== index)
        setRows(updated)
        await reorderRows(updated)
      } catch (err) {
        console.error('Error deleting row:', err)
        alert('Failed to delete comparison row. Please try again.')
      } finally {
        setSaving(null)
      }
    } else {
      setRows(rows.filter((_, i) => i !== index))
    }
  }

  const moveRow = async (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === rows.length - 1)
    ) {
      return
    }

    const newIndex = direction === 'up' ? index - 1 : index + 1
    const updated = [...rows]
    const temp = updated[index]
    updated[index] = updated[newIndex]
    updated[newIndex] = temp

    updated.forEach((r, i) => {
      r.sort_order = i
    })

    setRows(updated)

    if (mode === 'edit') {
      await reorderRows(updated)
    }
  }

  const reorderRows = async (orderedRows: ComparisonRow[]) => {
    if (mode !== 'edit') return

    try {
      const updates = orderedRows.map((r, index) =>
        supabase.from('tool_comparisons').update({ sort_order: index }).eq('id', r.id),
      )

      await Promise.all(updates)
    } catch (err) {
      console.error('Error reordering rows:', err)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-slate-400">Loading comparison table...</div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {rows.length === 0 && (
        <div className="text-center py-8 text-slate-400 bg-slate-900/30 rounded-xl border-2 border-dashed border-slate-700">
          No comparison rows yet. Click &quot;Add Row&quot; to get started.
        </div>
      )}

      {rows.length > 0 && (
        <div className="grid grid-cols-4 gap-4 px-6 py-3 bg-gradient-to-r from-cyan-900/30 to-blue-900/30 border-2 border-cyan-700/50 rounded-xl">
          <div className="text-sm font-bold text-cyan-300">Feature</div>
          <div className="text-sm font-bold text-cyan-300">This Tool</div>
          <div className="text-sm font-bold text-cyan-300">Competitor 1</div>
          <div className="text-sm font-bold text-cyan-300">Competitor 2</div>
        </div>
      )}

      {rows.map((row, index) => (
        <div
          key={row.id || index}
          className="relative bg-gradient-to-br from-slate-900/80 to-slate-800/50 border-2 border-slate-700 rounded-xl p-6 hover:border-cyan-500/50 transition-all"
        >
          {saving === row.id && (
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

          <div className="grid grid-cols-1 gap-4 mb-4">
            {/* Feature Name */}
            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                Feature #{index + 1}
              </label>
              <input
                type="text"
                value={row.feature_name}
                onChange={(e) => updateRow(index, 'feature_name', e.target.value)}
                placeholder="e.g., Price, Speed, AI Models"
                className="w-full px-4 py-3 bg-white/5 border-2 border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400 focus:bg-white/10 transition-all"
              />
            </div>

            {/* This Tool Value */}
            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                This Tool Value
              </label>
              <input
                type="text"
                value={row.this_tool_value}
                onChange={(e) => updateRow(index, 'this_tool_value', e.target.value)}
                placeholder="e.g., $29/mo, Fast, GPT-4"
                className="w-full px-4 py-3 bg-white/5 border-2 border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400 focus:bg-white/10 transition-all"
              />
            </div>

            {/* Competitor 1 */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Competitor 1 Name
                </label>
                <input
                  type="text"
                  value={row.competitor_1_name}
                  onChange={(e) => updateRow(index, 'competitor_1_name', e.target.value)}
                  placeholder="e.g., ChatGPT"
                  className="w-full px-4 py-3 bg-white/5 border-2 border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400 focus:bg-white/10 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Competitor 1 Value
                </label>
                <input
                  type="text"
                  value={row.competitor_1_value}
                  onChange={(e) => updateRow(index, 'competitor_1_value', e.target.value)}
                  placeholder="e.g., $20/mo"
                  className="w-full px-4 py-3 bg-white/5 border-2 border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400 focus:bg-white/10 transition-all"
                />
              </div>
            </div>

            {/* Competitor 2 */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Competitor 2 Name (Optional)
                </label>
                <input
                  type="text"
                  value={row.competitor_2_name}
                  onChange={(e) => updateRow(index, 'competitor_2_name', e.target.value)}
                  placeholder="e.g., Claude"
                  className="w-full px-4 py-3 bg-white/5 border-2 border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400 focus:bg-white/10 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Competitor 2 Value
                </label>
                <input
                  type="text"
                  value={row.competitor_2_value}
                  onChange={(e) => updateRow(index, 'competitor_2_value', e.target.value)}
                  placeholder="e.g., $25/mo"
                  className="w-full px-4 py-3 bg-white/5 border-2 border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400 focus:bg-white/10 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => moveRow(index, 'up')}
              disabled={index === 0}
              className="px-3 py-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-30 disabled:cursor-not-allowed text-white rounded-lg transition-all text-sm font-medium"
            >
              ↑ Up
            </button>
            <button
              type="button"
              onClick={() => moveRow(index, 'down')}
              disabled={index === rows.length - 1}
              className="px-3 py-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-30 disabled:cursor-not-allowed text-white rounded-lg transition-all text-sm font-medium"
            >
              ↓ Down
            </button>
            <button
              type="button"
              onClick={() => deleteRow(index)}
              disabled={saving === row.id}
              className="ml-auto px-4 py-2 bg-red-900/30 hover:bg-red-900/50 text-red-400 rounded-lg transition-all text-sm font-medium border border-red-800"
            >
              🗑️ Delete
            </button>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addRow}
        disabled={saving === 'new'}
        className="w-full py-4 bg-cyan-600/20 hover:bg-cyan-600/30 border-2 border-dashed border-cyan-600 text-cyan-400 rounded-xl transition-all font-semibold text-lg disabled:opacity-50"
      >
        {saving === 'new' ? '⏳ Adding...' : '+ Add Comparison Row'}
      </button>
    </div>
  )
}
