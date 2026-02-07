'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Plus, Edit2, Trash2, Folder, ExternalLink } from 'lucide-react'

interface Category {
    id: string
    name: string
    slug: string
    icon: string
    description: string
}

export default function CategoriesAdminPage() {
    const [categories, setCategories] = useState<Category[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        fetchCategories()
    }, [])

    async function fetchCategories() {
        try {
            setLoading(true)
            const { data, error: dbError } = await supabase
                .from('categories')
                .select('*')
                .order('name', { ascending: true })

            if (dbError) throw dbError
            setCategories(data || [])
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    async function handleDelete(id: string, name: string) {
        if (!confirm(`Are you sure you want to delete "${name}"? This could break tools linked to this category.`)) {
            return
        }

        try {
            const { error: deleteError } = await supabase
                .from('categories')
                .delete()
                .eq('id', id)

            if (deleteError) throw deleteError
            setCategories(categories.filter(c => c.id !== id))
        } catch (err: any) {
            alert(`Error deleting category: ${err.message}`)
        }
    }

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Category Manager</h1>
                    <p className="text-slate-400 text-sm">Organize and brand your AI agent niches.</p>
                </div>
                <Link
                    href="/admin/categories/new"
                    className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition-colors font-medium"
                >
                    <Plus size={18} />
                    Add Category
                </Link>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
                </div>
            ) : error ? (
                <div className="p-4 bg-red-900/20 border border-red-800 rounded-xl text-red-400">
                    {error}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categories.map((category) => (
                        <div
                            key={category.id}
                            className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-all group"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-cyan-400 border border-slate-700">
                                    <Folder size={20} />
                                </div>
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Link
                                        href={`/admin/categories/${category.id}/edit`}
                                        className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
                                    >
                                        <Edit2 size={16} />
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(category.id, category.name)}
                                        className="p-2 hover:bg-red-900/20 rounded-lg text-slate-400 hover:text-red-400 transition-colors"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>

                            <h3 className="text-xl font-bold text-white mb-1">{category.name}</h3>
                            <p className="text-cyan-500 text-xs font-mono mb-3">/{category.slug}</p>
                            <p className="text-slate-400 text-sm line-clamp-2 mb-4 h-10">
                                {category.description || 'No description provided.'}
                            </p>

                            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                                <Link
                                    href={`/tools/category/${category.slug}`}
                                    target="_blank"
                                    className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-cyan-400 transition-colors"
                                >
                                    <ExternalLink size={12} />
                                    View Live Page
                                </Link>
                                <div className="text-[10px] text-slate-600 font-mono">
                                    ID: {category.id.split('-')[0]}...
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
