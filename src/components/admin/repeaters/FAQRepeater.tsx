'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

interface FAQ {
  id?: string
  tool_id?: string
  question: string
  answer: string
  sort_order: number
}

interface FAQRepeaterProps {
  toolId: string | null
  mode: 'create' | 'edit'
}

export default function FAQRepeater({ toolId, mode }: FAQRepeaterProps) {
  const [faqs, setFaqs] = useState<FAQ[]>([])
  const [loading, setLoading] = useState(mode === 'edit')
  const [saving, setSaving] = useState<string | null>(null)

  // Load FAQs from database (edit mode only)
useEffect(() => {
  const loadFaqs = async () => {
    try {
      const { data, error } = await supabase
        .from('tool_faqs')
        .select('*')
        .eq('tool_id', toolId)
        .order('sort_order', { ascending: true })

      if (error) throw error
      setFaqs(data || [])
    } catch (err) {
      console.error('Error loading FAQs:', err)
    } finally {
      setLoading(false)
    }
  }

  if (mode === 'edit' && toolId) {
    loadFaqs()
  } else {
    setLoading(false)
  }
}, [toolId, mode])

  const addFaq = async () => {
    const newFaq: FAQ = {
      question: '',
      answer: '',
      sort_order: faqs.length,
    }

    if (mode === 'edit' && toolId) {
      try {
        setSaving('new')
        const { data, error } = await supabase
          .from('tool_faqs')
          .insert([{ ...newFaq, tool_id: toolId }])
          .select()
          .single()

        if (error) throw error
        setFaqs([...faqs, data])
      } catch (err) {
        console.error('Error adding FAQ:', err)
        alert('Failed to add FAQ. Please try again.')
      } finally {
        setSaving(null)
      }
    } else {
      setFaqs([...faqs, newFaq])
    }
  }

  const updateFaq = async (index: number, field: keyof FAQ, value: string) => {
    const updated = [...faqs]
    updated[index] = { ...updated[index], [field]: value }
    setFaqs(updated)

    if (mode === 'edit' && updated[index].id) {
      try {
        setSaving(updated[index].id!)
        const { error } = await supabase
          .from('tool_faqs')
          .update({ [field]: value })
          .eq('id', updated[index].id)

        if (error) throw error
      } catch (err) {
        console.error('Error updating FAQ:', err)
      } finally {
        setSaving(null)
      }
    }
  }

  const deleteFaq = async (index: number) => {
    const faq = faqs[index]

    if (mode === 'edit' && faq.id) {
      if (!confirm('Are you sure you want to delete this FAQ?')) return

      try {
        setSaving(faq.id)
        const { error } = await supabase
          .from('tool_faqs')
          .delete()
          .eq('id', faq.id)

        if (error) throw error

        const updated = faqs.filter((_, i) => i !== index)
        setFaqs(updated)
        await reorderFaqs(updated)
      } catch (err) {
        console.error('Error deleting FAQ:', err)
        alert('Failed to delete FAQ. Please try again.')
      } finally {
        setSaving(null)
      }
    } else {
      setFaqs(faqs.filter((_, i) => i !== index))
    }
  }

  const moveFaq = async (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === faqs.length - 1)
    ) {
      return
    }

    const newIndex = direction === 'up' ? index - 1 : index + 1
    const updated = [...faqs]
    const temp = updated[index]
    updated[index] = updated[newIndex]
    updated[newIndex] = temp

    updated.forEach((f, i) => {
      f.sort_order = i
    })

    setFaqs(updated)

    if (mode === 'edit') {
      await reorderFaqs(updated)
    }
  }

  const reorderFaqs = async (orderedFaqs: FAQ[]) => {
    if (mode !== 'edit') return

    try {
      const updates = orderedFaqs.map((f, index) =>
        supabase.from('tool_faqs').update({ sort_order: index }).eq('id', f.id),
      )

      await Promise.all(updates)
    } catch (err) {
      console.error('Error reordering FAQs:', err)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-slate-400">Loading FAQs...</div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {faqs.length === 0 && (
        <div className="text-center py-8 text-slate-400 bg-slate-900/30 rounded-xl border-2 border-dashed border-slate-700">
          No FAQs yet. Add FAQs manually below.
        </div>
      )}

      {faqs.map((faq, index) => (
        <div
          key={faq.id || index}
          className="relative bg-slate-900/50 border-2 border-slate-700 rounded-xl p-6 hover:border-purple-500/50 transition-all"
        >
          {/* Saving indicator */}
          {saving === faq.id && (
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

          <div className="space-y-4">
            {/* Question */}
            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                Question #{index + 1}
              </label>
              <input
                type="text"
                value={faq.question}
                onChange={(e) => updateFaq(index, 'question', e.target.value)}
                placeholder="e.g., What is this tool used for?"
                className="w-full px-4 py-3 bg-white/5 border-2 border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-purple-400 focus:bg-white/10 transition-all"
              />
            </div>

            {/* Answer */}
            <div>
              <label className="block text-sm font-semibold text-white mb-2">Answer</label>
              <textarea
                value={faq.answer}
                onChange={(e) => updateFaq(index, 'answer', e.target.value)}
                placeholder="Provide a detailed answer..."
                rows={4}
                className="w-full px-4 py-3 bg-white/5 border-2 border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-purple-400 focus:bg-white/10 transition-all resize-vertical"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 mt-4">
            <button
              type="button"
              onClick={() => moveFaq(index, 'up')}
              disabled={index === 0}
              className="px-3 py-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-30 disabled:cursor-not-allowed text-white rounded-lg transition-all text-sm font-medium"
            >
              ↑ Up
            </button>
            <button
              type="button"
              onClick={() => moveFaq(index, 'down')}
              disabled={index === faqs.length - 1}
              className="px-3 py-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-30 disabled:cursor-not-allowed text-white rounded-lg transition-all text-sm font-medium"
            >
              ↓ Down
            </button>
            <button
              type="button"
              onClick={() => deleteFaq(index)}
              disabled={saving === faq.id}
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
        onClick={addFaq}
        disabled={saving === 'new'}
        className="w-full py-4 bg-purple-600/20 hover:bg-purple-600/30 border-2 border-dashed border-purple-600 text-purple-400 rounded-xl transition-all font-semibold text-lg disabled:opacity-50"
      >
        {saving === 'new' ? '⏳ Adding...' : '+ Add FAQ'}
      </button>
    </div>
  )
}
