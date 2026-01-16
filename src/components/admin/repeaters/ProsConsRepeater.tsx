'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

interface Pro {
  id?: string
  tool_id?: string
  text: string
  sort_order: number
}

interface Con {
  id?: string
  tool_id?: string
  text: string
  sort_order: number
}

interface ProsConsRepeaterProps {
  toolId: string | null
  mode: 'create' | 'edit'
}

export default function ProsConsRepeater({ toolId, mode }: ProsConsRepeaterProps) {
  const [pros, setPros] = useState<Pro[]>([])
  const [cons, setCons] = useState<Con[]>([])
  const [loading, setLoading] = useState(mode === 'edit')
  const [saving, setSaving] = useState<string | null>(null)

useEffect(() => {
  const loadData = async () => {
    try {
      const [prosResult, consResult] = await Promise.all([
        supabase
          .from('tool_pros')
          .select('*')
          .eq('tool_id', toolId)
          .order('sort_order', { ascending: true }),
        supabase
          .from('tool_cons')
          .select('*')
          .eq('tool_id', toolId)
          .order('sort_order', { ascending: true }),
      ])

      if (prosResult.error) throw prosResult.error
      if (consResult.error) throw consResult.error

      setPros(prosResult.data || [])
      setCons(consResult.data || [])
    } catch (err) {
      console.error('Error loading pros/cons:', err)
    } finally {
      setLoading(false)
    }
  }

  if (mode === 'edit' && toolId) {
    loadData()
  } else {
    setLoading(false)
  }
}, [toolId, mode])

  const addPro = async () => {
    const newPro: Pro = {
      text: '',
      sort_order: pros.length,
    }

    if (mode === 'edit' && toolId) {
      try {
        setSaving('new-pro')
        const { data, error } = await supabase
          .from('tool_pros')
          .insert([{ ...newPro, tool_id: toolId }])
          .select()
          .single()

        if (error) throw error
        setPros([...pros, data])
      } catch (err) {
        console.error('Error adding pro:', err)
        alert('Failed to add pro. Please try again.')
      } finally {
        setSaving(null)
      }
    } else {
      setPros([...pros, newPro])
    }
  }

  const updatePro = async (index: number, value: string) => {
    const updated = [...pros]
    updated[index] = { ...updated[index], text: value }
    setPros(updated)

    if (mode === 'edit' && updated[index].id) {
      try {
        setSaving(updated[index].id!)
        const { error } = await supabase
          .from('tool_pros')
          .update({ text: value })
          .eq('id', updated[index].id)

        if (error) throw error
      } catch (err) {
        console.error('Error updating pro:', err)
      } finally {
        setSaving(null)
      }
    }
  }

  const deletePro = async (index: number) => {
    const pro = pros[index]

    if (mode === 'edit' && pro.id) {
      if (!confirm('Are you sure you want to delete this pro?')) return

      try {
        setSaving(pro.id)
        const { error } = await supabase
          .from('tool_pros')
          .delete()
          .eq('id', pro.id)

        if (error) throw error

        const updated = pros.filter((_, i) => i !== index)
        setPros(updated)
        await reorderPros(updated)
      } catch (err) {
        console.error('Error deleting pro:', err)
        alert('Failed to delete pro. Please try again.')
      } finally {
        setSaving(null)
      }
    } else {
      setPros(pros.filter((_, i) => i !== index))
    }
  }

  const movePro = async (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === pros.length - 1)
    ) {
      return
    }

    const newIndex = direction === 'up' ? index - 1 : index + 1
    const updated = [...pros]
    const temp = updated[index]
    updated[index] = updated[newIndex]
    updated[newIndex] = temp

    updated.forEach((p, i) => {
      p.sort_order = i
    })

    setPros(updated)

    if (mode === 'edit') {
      await reorderPros(updated)
    }
  }

  const reorderPros = async (orderedPros: Pro[]) => {
    if (mode !== 'edit') return

    try {
      const updates = orderedPros.map((p, index) =>
        supabase.from('tool_pros').update({ sort_order: index }).eq('id', p.id),
      )

      await Promise.all(updates)
    } catch (err) {
      console.error('Error reordering pros:', err)
    }
  }

  const addCon = async () => {
    const newCon: Con = {
      text: '',
      sort_order: cons.length,
    }

    if (mode === 'edit' && toolId) {
      try {
        setSaving('new-con')
        const { data, error } = await supabase
          .from('tool_cons')
          .insert([{ ...newCon, tool_id: toolId }])
          .select()
          .single()

        if (error) throw error
        setCons([...cons, data])
      } catch (err) {
        console.error('Error adding con:', err)
        alert('Failed to add con. Please try again.')
      } finally {
        setSaving(null)
      }
    } else {
      setCons([...cons, newCon])
    }
  }

  const updateCon = async (index: number, value: string) => {
    const updated = [...cons]
    updated[index] = { ...updated[index], text: value }
    setCons(updated)

    if (mode === 'edit' && updated[index].id) {
      try {
        setSaving(updated[index].id!)
        const { error } = await supabase
          .from('tool_cons')
          .update({ text: value })
          .eq('id', updated[index].id)

        if (error) throw error
      } catch (err) {
        console.error('Error updating con:', err)
      } finally {
        setSaving(null)
      }
    }
  }

  const deleteCon = async (index: number) => {
    const con = cons[index]

    if (mode === 'edit' && con.id) {
      if (!confirm('Are you sure you want to delete this con?')) return

      try {
        setSaving(con.id)
        const { error } = await supabase
          .from('tool_cons')
          .delete()
          .eq('id', con.id)

        if (error) throw error

        const updated = cons.filter((_, i) => i !== index)
        setCons(updated)
        await reorderCons(updated)
      } catch (err) {
        console.error('Error deleting con:', err)
        alert('Failed to delete con. Please try again.')
      } finally {
        setSaving(null)
      }
    } else {
      setCons(cons.filter((_, i) => i !== index))
    }
  }

  const moveCon = async (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === cons.length - 1)
    ) {
      return
    }

    const newIndex = direction === 'up' ? index - 1 : index + 1
    const updated = [...cons]
    const temp = updated[index]
    updated[index] = updated[newIndex]
    updated[newIndex] = temp

    updated.forEach((c, i) => {
      c.sort_order = i
    })

    setCons(updated)

    if (mode === 'edit') {
      await reorderCons(updated)
    }
  }

  const reorderCons = async (orderedCons: Con[]) => {
    if (mode !== 'edit') return

    try {
      const updates = orderedCons.map((c, index) =>
        supabase.from('tool_cons').update({ sort_order: index }).eq('id', c.id),
      )

      await Promise.all(updates)
    } catch (err) {
      console.error('Error reordering cons:', err)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-slate-400">Loading pros and cons...</div>
      </div>
    )
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-green-400 flex items-center gap-2">
          <span className="text-2xl">✓</span> Pros
        </h3>

        {pros.length === 0 && (
          <div className="text-center py-8 text-slate-400 bg-green-900/10 rounded-xl border-2 border-dashed border-green-800">
            No pros yet. Add pros manually below.
          </div>
        )}

        {pros.map((pro, index) => (
          <div
            key={pro.id || index}
            className="relative bg-green-900/20 border-2 border-green-800 rounded-xl p-4 hover:border-green-600 transition-all"
          >
            {saving === pro.id && (
              <div className="absolute top-2 right-2 text-xs text-green-400">Saving...</div>
            )}

            <textarea
              value={pro.text}
              onChange={(e) => updatePro(index, e.target.value)}
              placeholder="Enter a pro..."
              rows={2}
              className="w-full px-3 py-2 bg.white/5 border border-green-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-green-400 resize-vertical"
            />

            <div className="flex gap-2 mt-3">
              <button
                type="button"
                onClick={() => movePro(index, 'up')}
                disabled={index === 0}
                className="px-2 py-1 bg-green-800 hover:bg-green-700 disabled:opacity-30 text-white rounded text-sm"
              >
                ↑ Up
              </button>
              <button
                type="button"
                onClick={() => movePro(index, 'down')}
                disabled={index === pros.length - 1}
                className="px-2 py-1 bg-green-800 hover:bg-green-700 disabled:opacity-30 text-white rounded text-sm"
              >
                ↓ Down
              </button>
              <button
                type="button"
                onClick={() => deletePro(index)}
                disabled={saving === pro.id}
                className="ml-auto px-3 py-1 bg-red-900/30 hover:bg-red-900/50 text-red-400 rounded text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={addPro}
          disabled={saving === 'new-pro'}
          className="w-full py-3 bg-green-600/20 hover:bg-green-600/30 border-2 border-dashed border-green-600 text-green-400 rounded-xl font-semibold disabled:opacity-50"
        >
          {saving === 'new-pro' ? 'Adding...' : '+ Add Pro'}
        </button>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-bold text-red-400 flex items-center gap-2">
          <span className="text-2xl">✗</span> Cons
        </h3>

        {cons.length === 0 && (
          <div className="text-center py-8 text-slate-400 bg-red-900/10 rounded-xl border-2 border-dashed border-red-800">
            No cons yet. Add cons manually below.
          </div>
        )}

        {cons.map((con, index) => (
          <div
            key={con.id || index}
            className="relative bg-red-900/20 border-2 border-red-800 rounded-xl p-4 hover:border-red-600 transition-all"
          >
            {saving === con.id && (
              <div className="absolute top-2 right-2 text-xs text-red-400">Saving...</div>
            )}

            <textarea
              value={con.text}
              onChange={(e) => updateCon(index, e.target.value)}
              placeholder="Enter a con..."
              rows={2}
              className="w-full px-3 py-2 bg-white/5 border border-red-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-red-400 resize-vertical"
            />

            <div className="flex gap-2 mt-3">
              <button
                type="button"
                onClick={() => moveCon(index, 'up')}
                disabled={index === 0}
                className="px-2 py-1 bg-red-800 hover:bg-red-700 disabled:opacity-30 text-white rounded text-sm"
              >
                ↑ Up
              </button>
              <button
                type="button"
                onClick={() => moveCon(index, 'down')}
                disabled={index === cons.length - 1}
                className="px-2 py-1 bg-red-800 hover:bg-red-700 disabled:opacity-30 text-white rounded text-sm"
              >
                ↓ Down
              </button>
              <button
                type="button"
                onClick={() => deleteCon(index)}
                disabled={saving === con.id}
                className="ml-auto px-3 py-1 bg-red-900/50 hover:bg-red-900/70 text-red-300 rounded text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={addCon}
          disabled={saving === 'new-con'}
          className="w-full py-3 bg-red-600/20 hover:bg-red-600/30 border-2 border-dashed border-red-600 text-red-400 rounded-xl font-semibold disabled:opacity-50"
        >
          {saving === 'new-con' ? 'Adding...' : '+ Add Con'}
        </button>
      </div>
    </div>
  )
}
