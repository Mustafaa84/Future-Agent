'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import ImageUpload from '@/components/ImageUpload'

interface Integration {
    id?: string
    tool_id?: string
    integration_name: string
    integration_logo: string
    description: string
    sort_order: number
}

interface IntegrationsRepeaterProps {
    toolId: string | null
    mode: 'create' | 'edit'
}

export default function IntegrationsRepeater({ toolId, mode }: IntegrationsRepeaterProps) {
    const [integrations, setIntegrations] = useState<Integration[]>([])
    const [loading, setLoading] = useState(mode === 'edit')
    const [saving, setSaving] = useState<string | null>(null)

    useEffect(() => {
        // Expose data to window for form submission in 'create' mode
        (window as any).__integrationsData = integrations

        const loadIntegrations = async () => {
            try {
                const { data, error } = await supabase
                    .from('tool_integrations')
                    .select('*')
                    .eq('tool_id', toolId)
                    .order('sort_order', { ascending: true })

                if (error) throw error
                setIntegrations(data || [])
            } catch (err) {
                console.error('Error loading integrations:', err)
            } finally {
                setLoading(false)
            }
        }

        if (mode === 'edit' && toolId) {
            loadIntegrations()
        } else {
            setLoading(false)
        }
    }, [toolId, mode, integrations]) // Added integrations to dependency to keep window object updated

    const addIntegration = async () => {
        const newIntegration: Integration = {
            integration_name: '',
            integration_logo: '',
            description: '',
            sort_order: integrations.length,
        }

        if (mode === 'edit' && toolId) {
            try {
                setSaving('new')
                const { data, error } = await supabase
                    .from('tool_integrations')
                    .insert([{ ...newIntegration, tool_id: toolId }])
                    .select()
                    .single()

                if (error) throw error
                setIntegrations([...integrations, data])
            } catch (err) {
                console.error('Error adding integration:', err)
                alert('Failed to add integration. Please try again.')
            } finally {
                setSaving(null)
            }
        } else {
            setIntegrations([...integrations, newIntegration])
        }
    }

    const updateIntegration = async (index: number, field: keyof Integration, value: string) => {
        const updated = [...integrations]
        updated[index] = { ...updated[index], [field]: value }
        setIntegrations(updated)

        if (mode === 'edit' && updated[index].id) {
            try {
                setSaving(updated[index].id!)
                const { error } = await supabase
                    .from('tool_integrations')
                    .update({ [field]: value })
                    .eq('id', updated[index].id)

                if (error) throw error
            } catch (err) {
                console.error('Error updating integration:', err)
            } finally {
                setSaving(null)
            }
        }
    }

    const deleteIntegration = async (index: number) => {
        const integration = integrations[index]

        if (mode === 'edit' && integration.id) {
            if (!confirm('Are you sure you want to delete this integration?')) return

            try {
                setSaving(integration.id)
                const { error } = await supabase
                    .from('tool_integrations')
                    .delete()
                    .eq('id', integration.id)

                if (error) throw error

                const updated = integrations.filter((_, i) => i !== index)
                setIntegrations(updated)
                await reorderIntegrations(updated)
            } catch (err) {
                console.error('Error deleting integration:', err)
                alert('Failed to delete integration. Please try again.')
            } finally {
                setSaving(null)
            }
        } else {
            setIntegrations(integrations.filter((_, i) => i !== index))
        }
    }

    const moveIntegration = async (index: number, direction: 'up' | 'down') => {
        if (
            (direction === 'up' && index === 0) ||
            (direction === 'down' && index === integrations.length - 1)
        ) {
            return
        }

        const newIndex = direction === 'up' ? index - 1 : index + 1
        const updated = [...integrations]
        const temp = updated[index]
        updated[index] = updated[newIndex]
        updated[newIndex] = temp

        updated.forEach((f, i) => {
            f.sort_order = i
        })

        setIntegrations(updated)

        if (mode === 'edit') {
            await reorderIntegrations(updated)
        }
    }

    const reorderIntegrations = async (orderedIntegrations: Integration[]) => {
        if (mode !== 'edit') return

        try {
            const updates = orderedIntegrations.map((f, index) =>
                supabase.from('tool_integrations').update({ sort_order: index }).eq('id', f.id),
            )

            await Promise.all(updates)
        } catch (err) {
            console.error('Error reordering integrations:', err)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center py-8">
                <div className="text-slate-400">Loading integrations...</div>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {integrations.length === 0 && (
                <div className="text-center py-8 text-slate-400 bg-slate-900/30 rounded-xl border-2 border-dashed border-slate-700">
                    No integrations added yet.
                </div>
            )}

            {integrations.map((integration, index) => (
                <div
                    key={integration.id || index}
                    className="relative bg-gradient-to-br from-slate-900/80 to-slate-800/50 border-2 border-slate-700 rounded-xl p-6 hover:border-cyan-500/50 transition-all"
                >
                    {saving === integration.id && (
                        <div className="absolute top-4 right-4 text-xs text-cyan-400 flex items-center gap-2">
                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Saving...
                        </div>
                    )}

                    <div className="grid md:grid-cols-3 gap-6">
                        {/* Logo Upload - Takes 1 column */}
                        <div className="md:col-span-1">
                            <label className="block text-sm font-semibold text-white mb-2">
                                Integration Logo
                            </label>
                            <ImageUpload
                                currentImage={integration.integration_logo || ''}
                                onImageChange={(url) => updateIntegration(index, 'integration_logo', url || '')}
                                folder="logos"
                                label="Upload Logo"
                            />
                        </div>

                        {/* Fields - Takes 2 columns */}
                        <div className="md:col-span-2 space-y-4">
                            {/* Integration Name */}
                            <div>
                                <label className="block text-sm font-semibold text-white mb-2">
                                    Integration Name
                                </label>
                                <input
                                    type="text"
                                    value={integration.integration_name}
                                    onChange={(e) => updateIntegration(index, 'integration_name', e.target.value)}
                                    placeholder="e.g., Zapier, Slack, Salesforce"
                                    className="w-full px-4 py-3 bg-white/5 border-2 border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400 focus:bg-white/10 transition-all"
                                />
                            </div>

                            {/* Description (Optional) */}
                            <div>
                                <label className="block text-sm font-semibold text-white mb-2">
                                    Short Description (Optional)
                                </label>
                                <input
                                    type="text"
                                    value={integration.description || ''}
                                    onChange={(e) => updateIntegration(index, 'description', e.target.value)}
                                    placeholder="e.g., Syncs contacts automatically"
                                    className="w-full px-4 py-3 bg-white/5 border-2 border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400 focus:bg-white/10 transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 mt-4">
                        <button
                            type="button"
                            onClick={() => moveIntegration(index, 'up')}
                            disabled={index === 0}
                            className="px-3 py-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-30 disabled:cursor-not-allowed text-white rounded-lg transition-all text-sm font-medium"
                        >
                            ↑ Up
                        </button>
                        <button
                            type="button"
                            onClick={() => moveIntegration(index, 'down')}
                            disabled={index === integrations.length - 1}
                            className="px-3 py-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-30 disabled:cursor-not-allowed text-white rounded-lg transition-all text-sm font-medium"
                        >
                            ↓ Down
                        </button>
                        <button
                            type="button"
                            onClick={() => deleteIntegration(index)}
                            disabled={saving === integration.id}
                            className="ml-auto px-4 py-2 bg-red-900/30 hover:bg-red-900/50 text-red-400 rounded-lg transition-all text-sm font-medium border border-red-800"
                        >
                            🗑️ Delete
                        </button>
                    </div>
                </div>
            ))}

            <button
                type="button"
                onClick={addIntegration}
                disabled={saving === 'new'}
                className="w-full py-4 bg-cyan-600/20 hover:bg-cyan-600/30 border-2 border-dashed border-cyan-600 text-cyan-400 rounded-xl transition-all font-semibold text-lg disabled:opacity-50"
            >
                {saving === 'new' ? '⏳ Adding...' : '+ Add Integration'}
            </button>
        </div>
    )
}
