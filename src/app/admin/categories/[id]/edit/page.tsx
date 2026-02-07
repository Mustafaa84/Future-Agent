'use client'

import { useEffect, useState, use } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { ArrowLeft, Save, Loader2, Info } from 'lucide-react'
import Link from 'next/link'
import { revalidateCategory } from '@/app/actions/revalidate'

interface CategoryFormProps {
    params: Promise<{ id: string }>
}

export default function CategoryEditPage({ params }: CategoryFormProps) {
    const router = useRouter()
    const resolvedParams = use(params)
    const isEdit = resolvedParams.id !== 'new'
    const [loading, setLoading] = useState(isEdit)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        description: '',
        long_description: '',
        icon: 'Folder',
        meta_title: '',
        meta_description: '',
        image_url: ''
    })

    useEffect(() => {
        if (isEdit) {
            fetchCategory()
        }
    }, [isEdit])

    async function fetchCategory() {
        try {
            const { data, error: dbError } = await supabase
                .from('categories')
                .select('*')
                .eq('id', resolvedParams.id)
                .single()

            if (dbError) throw dbError
            if (data) {
                setFormData({
                    name: data.name || '',
                    slug: data.slug || '',
                    description: data.description || '',
                    long_description: data.long_description || '',
                    icon: data.icon || 'Folder',
                    meta_title: data.meta_title || '',
                    meta_description: data.meta_description || '',
                    image_url: data.image_url || ''
                })
            }
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.value
        setFormData(prev => ({
            ...prev,
            name,
            // Only auto-generate slug for new categories
            slug: !isEdit ? name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') : prev.slug
        }))
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setSaving(true)
        setError(null)

        try {
            if (isEdit) {
                const { error: updateError } = await supabase
                    .from('categories')
                    .update(formData)
                    .eq('id', resolvedParams.id)
                if (updateError) throw updateError
            } else {
                const { error: insertError } = await supabase
                    .from('categories')
                    .insert([formData])
                if (insertError) throw insertError
            }

            // Trigger On-Demand Revalidation for this category
            await revalidateCategory(formData.slug)

            router.push('/admin/categories')
            router.refresh()
        } catch (err: any) {
            setError(err.message)
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="animate-spin text-cyan-500" size={40} />
            </div>
        )
    }

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <Link
                href="/admin/categories"
                className="flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors group"
            >
                <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                Back to Categories
            </Link>

            <div className="mb-10">
                <h1 className="text-4xl font-bold text-white mb-2">
                    {isEdit ? 'Edit Category' : 'Create New Category'}
                </h1>
                <p className="text-slate-400">
                    Define how this pillar appears in the directory and SEO rankings.
                </p>
            </div>

            {error && (
                <div className="mb-8 p-4 bg-red-900/20 border border-red-800 rounded-xl text-red-400 text-sm">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Basic Info */}
                    <div className="space-y-6 bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
                        <h2 className="text-lg font-semibold text-white border-b border-slate-800 pb-4 mb-4">Display & Logic</h2>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Internal Name</label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={handleNameChange}
                                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/20"
                                placeholder="e.g. Marketing Agents"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">URL Slug</label>
                            <input
                                type="text"
                                required
                                value={formData.slug}
                                onChange={e => setFormData({ ...formData, slug: e.target.value })}
                                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono text-sm focus:border-cyan-500 focus:outline-none"
                                placeholder="marketing-agents"
                            />
                            <p className="mt-2 text-[10px] text-slate-500">
                                <Info size={10} className="inline mr-1" />
                                Changing this will break existing tool URLs. Handle with care.
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Icon Name (Lucide)</label>
                            <input
                                type="text"
                                value={formData.icon}
                                onChange={e => setFormData({ ...formData, icon: e.target.value })}
                                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-cyan-500 focus:outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Premium Header Image (URL)</label>
                            <input
                                type="text"
                                value={formData.image_url}
                                onChange={e => setFormData({ ...formData, image_url: e.target.value })}
                                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-cyan-500 focus:outline-none font-mono text-xs"
                                placeholder="/categories/marketing.png"
                            />
                            <p className="mt-2 text-[10px] text-slate-500">
                                Link to an abstract 3D asset or high-res tech image. Leave blank for default mapping.
                            </p>
                        </div>
                    </div>

                    {/* Descriptive Content */}
                    <div className="space-y-6 bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
                        <h2 className="text-lg font-semibold text-white border-b border-slate-800 pb-4 mb-4">Content</h2>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Short Description</label>
                            <textarea
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                rows={3}
                                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-cyan-500 focus:outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Long Description (HTML/Markdown)</label>
                            <textarea
                                value={formData.long_description}
                                onChange={e => setFormData({ ...formData, long_description: e.target.value })}
                                rows={5}
                                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-cyan-500 focus:outline-none"
                            />
                        </div>
                    </div>
                </div>

                {/* SEO Settings */}
                <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
                    <h2 className="text-lg font-semibold text-white border-b border-slate-800 pb-4 mb-4">SEO Metadata</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Meta Title</label>
                            <input
                                type="text"
                                value={formData.meta_title}
                                onChange={e => setFormData({ ...formData, meta_title: e.target.value })}
                                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-cyan-500 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Meta Description</label>
                            <textarea
                                value={formData.meta_description}
                                onChange={e => setFormData({ ...formData, meta_description: e.target.value })}
                                rows={2}
                                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-cyan-500 focus:outline-none"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-4 pt-6 border-t border-slate-800">
                    <Link
                        href="/admin/categories"
                        className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-colors font-medium"
                    >
                        Cancel
                    </Link>
                    <button
                        type="submit"
                        disabled={saving}
                        className="flex items-center gap-2 px-8 py-3 bg-cyan-600 hover:bg-cyan-500 disabled:bg-cyan-800 text-white rounded-xl transition-colors font-bold"
                    >
                        {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                        {isEdit ? 'Update Category' : 'Save Category'}
                    </button>
                </div>
            </form>
        </div>
    )
}
