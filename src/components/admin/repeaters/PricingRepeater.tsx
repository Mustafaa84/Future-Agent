'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

interface PricingPlan {
  id?: string
  tool_id?: string
  plan_name: string
  price: number | null
  period: string
  features: string[]
  is_popular: boolean
  price_label: string | null
  sort_order: number
}

interface PricingRepeaterProps {
  toolId: string | null
  mode: 'create' | 'edit'
}

export default function PricingRepeater({
  toolId,
  mode,
}: PricingRepeaterProps) {
  const [plans, setPlans] = useState<PricingPlan[]>([])
  const [loading, setLoading] = useState(mode === 'edit')
  const [saving, setSaving] = useState<string | null>(null)

  // Load pricing plans from database (edit mode only)
  useEffect(() => {
    const loadPlans = async () => {
      try {
        const { data, error } = await supabase
          .from('tool_pricing_plans')
          .select('*')
          .eq('tool_id', toolId)
          .order('sort_order', { ascending: true })

        if (error) throw error
        setPlans(data || [])
      } catch (err) {
        console.error('Error loading pricing plans:', err)
      } finally {
        setLoading(false)
      }
    }

    if (mode === 'edit' && toolId) {
      loadPlans()
    } else {
      setLoading(false)
    }
  }, [toolId, mode])

  const addPlan = async () => {
    const newPlan: PricingPlan = {
      plan_name: 'New Plan',
      price: 0,
      period: 'month',
      features: [],
      is_popular: false,
      price_label: null,
      sort_order: plans.length,
    }

    if (mode === 'edit' && toolId) {
      try {
        setSaving('new')
        const { data, error } = await supabase
          .from('tool_pricing_plans')
          .insert([{ ...newPlan, tool_id: toolId }])
          .select()
          .single()

        if (error) throw error
        setPlans([...plans, data])
      } catch (err) {
        console.error('Error adding plan:', err)
        alert('Failed to add plan. Please try again.')
      } finally {
        setSaving(null)
      }
    } else {
      setPlans([...plans, newPlan])
    }
  }

  const updatePlan = async (
    index: number,
    field: keyof PricingPlan,
    value: string | number | boolean | null
  ) => {
    const updated = [...plans]

    // If marking as popular, unmark all others
    if (field === 'is_popular' && value === true) {
      updated.forEach((p, i) => {
        if (i !== index) {
          p.is_popular = false
        }
      })

      if (mode === 'edit') {
        try {
          const unmarkUpdates = updated
            .filter((p, i) => i !== index && p.id)
            .map((p) =>
              supabase
                .from('tool_pricing_plans')
                .update({ is_popular: false })
                .eq('id', p.id)
            )

          await Promise.all(unmarkUpdates)
        } catch (err) {
          console.error('Error unmarking other plans:', err)
        }
      }
    }

    updated[index] = { ...updated[index], [field]: value }
    setPlans(updated)

    if (mode === 'edit' && updated[index].id) {
      try {
        setSaving(updated[index].id!)
        const { error } = await supabase
          .from('tool_pricing_plans')
          .update({ [field]: value })
          .eq('id', updated[index].id)

        if (error) throw error
      } catch (err) {
        console.error('Error updating plan:', err)
      } finally {
        setSaving(null)
      }
    }
  }

  const deletePlan = async (index: number) => {
    const plan = plans[index]

    if (mode === 'edit' && plan.id) {
      if (!confirm('Are you sure you want to delete this pricing plan?'))
        return

      try {
        setSaving(plan.id)
        const { error } = await supabase
          .from('tool_pricing_plans')
          .delete()
          .eq('id', plan.id)

        if (error) throw error

        const updated = plans.filter((_, i) => i !== index)
        setPlans(updated)
        await reorderPlans(updated)
      } catch (err) {
        console.error('Error deleting plan:', err)
        alert('Failed to delete plan. Please try again.')
      } finally {
        setSaving(null)
      }
    } else {
      setPlans(plans.filter((_, i) => i !== index))
    }
  }

  const movePlan = async (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === plans.length - 1)
    ) {
      return
    }

    const newIndex = direction === 'up' ? index - 1 : index + 1
    const updated = [...plans]
    const temp = updated[index]
    updated[index] = updated[newIndex]
    updated[newIndex] = temp

    updated.forEach((p, i) => {
      p.sort_order = i
    })

    setPlans(updated)

    if (mode === 'edit') {
      await reorderPlans(updated)
    }
  }

  const reorderPlans = async (orderedPlans: PricingPlan[]) => {
    if (mode !== 'edit') return

    try {
      const updates = orderedPlans.map((p, index) =>
        supabase
          .from('tool_pricing_plans')
          .update({ sort_order: index })
          .eq('id', p.id)
      )

      await Promise.all(updates)
    } catch (err) {
      console.error('Error reordering plans:', err)
    }
  }

  // Feature management within a plan
  const addFeature = (planIndex: number) => {
    const updated = [...plans]
    updated[planIndex].features = [...updated[planIndex].features, '']
    setPlans(updated)
  }

  const updateFeature = async (
    planIndex: number,
    featureIndex: number,
    value: string
  ) => {
    const updated = [...plans]
    updated[planIndex].features[featureIndex] = value
    setPlans(updated)

    if (mode === 'edit' && updated[planIndex].id) {
      try {
        setSaving(updated[planIndex].id!)
        const { error } = await supabase
          .from('tool_pricing_plans')
          .update({ features: updated[planIndex].features })
          .eq('id', updated[planIndex].id)

        if (error) throw error
      } catch (err) {
        console.error('Error updating features:', err)
      } finally {
        setSaving(null)
      }
    }
  }

  const deleteFeature = async (planIndex: number, featureIndex: number) => {
    const updated = [...plans]
    updated[planIndex].features = updated[planIndex].features.filter(
      (_, i) => i !== featureIndex
    )
    setPlans(updated)

    if (mode === 'edit' && updated[planIndex].id) {
      try {
        const { error } = await supabase
          .from('tool_pricing_plans')
          .update({ features: updated[planIndex].features })
          .eq('id', updated[planIndex].id)

        if (error) throw error
      } catch (err) {
        console.error('Error deleting feature:', err)
      }
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-slate-400">Loading pricing plans...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {plans.length === 0 && (
        <div className="text-center py-8 text-slate-400 bg-slate-900/30 rounded-xl border-2 border-dashed border-slate-700">
          No pricing plans yet. Add plans manually below.
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((plan, planIndex) => (
          <div
            key={plan.id || planIndex}
            className={`relative rounded-xl border-2 p-6 transition-all ${
              plan.is_popular
                ? 'border-cyan-500 bg-cyan-900/20 scale-105'
                : 'border-slate-700 bg-slate-900/50 hover:border-cyan-600'
            }`}
          >
            {/* Saving indicator */}
            {saving === plan.id && (
              <div className="absolute top-2 right-2 text-xs text-cyan-400 flex items-center gap-1">
                <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24">
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

            {/* Popular badge toggle */}
            <div className="mb-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={plan.is_popular}
                  onChange={(e) =>
                    updatePlan(planIndex, 'is_popular', e.target.checked)
                  }
                  className="w-4 h-4 text-cyan-500 rounded"
                />
                <span className="text-sm text-cyan-400 font-semibold">
                  {plan.is_popular ? '⭐ POPULAR' : 'Mark as Popular'}
                </span>
              </label>
            </div>

            {/* Plan Name */}
            <div className="mb-4">
              <label className="block text-xs font-semibold text-white mb-2">
                Plan Name
              </label>
              <input
                type="text"
                value={plan.plan_name}
                onChange={(e) =>
                  updatePlan(planIndex, 'plan_name', e.target.value)
                }
                placeholder="e.g., Pro Plan"
                className="w-full px-3 py-2 bg-white/5 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400"
              />
            </div>

            {/* Price */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <label className="block text-xs font-semibold text-white mb-2">
                  Price ($)
                </label>
                <input
                  type="number"
                  value={plan.price === null ? '' : plan.price}
                  onChange={(e) =>
                    updatePlan(
                      planIndex,
                      'price',
                      e.target.value === '' ? null : parseFloat(e.target.value)
                    )
                  }
                  placeholder="29"
                  step="0.01"
                  className="w-full px-3 py-2 bg-white/5 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-white mb-2">
                  Period
                </label>
                <select
                  value={plan.period || ''}
                  onChange={(e) =>
                    updatePlan(planIndex, 'period', e.target.value)
                  }
                  className="w-full px-3 py-2 bg-white/5 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                >
                  <option value="month">month</option>
                  <option value="year">year</option>
                  <option value="one-time">one-time</option>
                </select>
              </div>
            </div>

            {/* Price Label (optional) */}
            <div className="mb-4">
              <label className="block text-xs font-semibold text-white mb-2">
                Price Label (optional)
              </label>
              <input
                type="text"
                value={plan.price_label || ''}
                onChange={(e) =>
                  updatePlan(
                    planIndex,
                    'price_label',
                    e.target.value || null
                  )
                }
                placeholder="e.g., Contact Sales, Free"
                className="w-full px-3 py-2 bg-white/5 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400 text-sm"
              />
            </div>

            {/* Features */}
            <div className="mb-4">
              <label className="block text-xs font-semibold text-white mb-2">
                Features
              </label>
              <div className="space-y-2">
                {plan.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex gap-2">
                    <input
                      type="text"
                      value={feature}
                      onChange={(e) =>
                        updateFeature(
                          planIndex,
                          featureIndex,
                          e.target.value
                        )
                      }
                      placeholder="Feature description"
                      className="flex-1 px-3 py-2 bg-white/5 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400 text-sm"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        deleteFeature(planIndex, featureIndex)
                      }
                      className="px-2 py-1 bg-red-900/30 hover:bg-red-900/50 text-red-400 rounded text-xs"
                    >
                      ✕
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addFeature(planIndex)}
                  className="w-full py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm"
                >
                  + Add Feature
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-4 border-t border-slate-700">
              <button
                type="button"
                onClick={() => movePlan(planIndex, 'up')}
                disabled={planIndex === 0}
                className="px-3 py-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-30 text-white rounded text-sm"
              >
                ←
              </button>
              <button
                type="button"
                onClick={() => movePlan(planIndex, 'down')}
                disabled={planIndex === plans.length - 1}
                className="px-3 py-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-30 text-white rounded text-sm"
              >
                →
              </button>
              <button
                type="button"
                onClick={() => deletePlan(planIndex)}
                disabled={saving === plan.id}
                className="ml-auto px-4 py-2 bg-red-900/30 hover:bg-red-900/50 text-red-400 rounded text-sm"
              >
                Delete Plan
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Plan Button */}
      <button
        type="button"
        onClick={addPlan}
        disabled={saving === 'new'}
        className="w-full py-4 bg-cyan-600/20 hover:bg-cyan-600/30 border-2 border-dashed border-cyan-600 text-cyan-400 rounded-xl transition-all font-semibold text-lg disabled:opacity-50"
      >
        {saving === 'new' ? '⏳ Adding...' : '+ Add Pricing Plan'}
      </button>
    </div>
  )
}
