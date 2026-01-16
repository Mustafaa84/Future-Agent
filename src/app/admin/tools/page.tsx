'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'

interface AiTool {
  id: string
  name: string
  slug: string
  logo: string | null
  tagline: string | null
  category: string | null
  rating: number | null
  review_count: number | null
  published: boolean
  published_date: string | null
  featured: boolean
  created_at: string
}

export default function AdminToolsPage() {
  const [tools, setTools] = useState<AiTool[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    void fetchTools()
  }, [])

  const fetchTools = async () => {
    const { data } = await supabase
      .from('ai_tools')
      .select('*')
      .order('created_at', { ascending: false })

    setTools((data as AiTool[]) || [])
    setLoading(false)
  }

  const handleDelete = async (toolId: string, toolName: string) => {
    if (!confirm(`Delete "${toolName}"? This cannot be undone.`)) {
      return
    }

    try {
      const { error } = await supabase
        .from('ai_tools')
        .delete()
        .eq('id', toolId)

      if (error) throw error

      setTools((prev) => prev.filter((t) => t.id !== toolId))
      alert('Tool deleted successfully!')
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error))
      alert('Error deleting tool: ' + err.message)
      console.error(err)
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <p className="text-slate-400">Loading tools...</p>
      </div>
    )
  }

  // Calculate stats
  const total = tools.length
  const now = new Date()

  const published = tools.filter((t) => {
    if (!t.published) return false
    if (!t.published_date) return true
    return new Date(t.published_date) <= now
  }).length

  const scheduled = tools.filter((t) => {
    if (!t.published || !t.published_date) return false
    return new Date(t.published_date) > now
  }).length

  const drafts = tools.filter((t) => !t.published).length
  const featured = tools.filter((t) => t.featured).length

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">AI Tools</h1>
          <p className="text-slate-400">
            Manage your AI tools directory ({total} tools)
          </p>
        </div>
        <Link
          href="/admin/tools/add"
          className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-bold rounded-xl shadow-lg hover:shadow-emerald-500/25 transition-all"
        >
          ➕ Add New Tool
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-5 gap-6 mb-8">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <div className="text-slate-400 text-sm mb-2">Total Tools</div>
          <div className="text-3xl font-bold text-white">{total}</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <div className="text-slate-400 text-sm mb-2">Published</div>
          <div className="text-3xl font-bold text-emerald-400">{published}</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <div className="text-slate-400 text-sm mb-2">Scheduled</div>
          <div className="text-3xl font-bold text-orange-400">{scheduled}</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <div className="text-slate-400 text-sm mb-2">Drafts</div>
          <div className="text-3xl font-bold text-amber-400">{drafts}</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <div className="text-slate-400 text-sm mb-2">Featured</div>
          <div className="text-3xl font-bold text-yellow-400">{featured}</div>
        </div>
      </div>

      {/* Tools Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-950/50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
                  Tool Name
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
                  Category
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
                  Rating
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
                  Status
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-slate-300">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {tools && tools.length > 0 ? (
                tools.map((tool) => {
                  const isScheduled =
                    tool.published &&
                    tool.published_date &&
                    new Date(tool.published_date) > now
                  const isPublished =
                    tool.published &&
                    (!tool.published_date ||
                      new Date(tool.published_date) <= now)

                  return (
                    <tr
                      key={tool.id}
                      className="border-t border-slate-800 hover:bg-slate-950/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center text-white text-lg font-semibold flex-shrink-0 overflow-hidden">
                            {tool.logo && tool.logo.startsWith('http') ? (
                              <Image
                                src={tool.logo}
                                alt={`${tool.name} logo`}
                                width={40}
                                height={40}
                                className="h-full w-full object-contain"
                              />
                            ) : tool.logo ? (
                              <span>{tool.logo}</span>
                            ) : (
                              <span>
                                {tool.name.charAt(0).toUpperCase()}
                              </span>
                            )}
                          </div>

                          <div>
                            <div className="text-white font-medium">
                              {tool.name}
                            </div>
                            <div className="text-sm text-slate-400 truncate max-w-xs">
                              {tool.tagline}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-medium">
                          {tool.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          <span className="text-yellow-400">★</span>
                          <span className="text-white font-semibold">
                            {tool.rating}
                          </span>
                          <span className="text-slate-500 text-sm">
                            ({tool.review_count})
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          {isScheduled ? (
                            <>
                              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-orange-500/20 text-orange-400 border border-orange-500/30 inline-flex items-center gap-1 w-fit">
                                🕐 Scheduled
                              </span>
                              {tool.published_date && (
                                <span className="text-xs text-slate-500">
                                  {new Date(
                                    tool.published_date
                                  ).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })}
                                </span>
                              )}
                            </>
                          ) : isPublished ? (
                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 w-fit">
                              ✓ Published
                            </span>
                          ) : (
                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-400 border border-amber-500/30 w-fit">
                              📝 Draft
                            </span>
                          )}
                          {tool.featured && (
                            <span className="text-xs text-yellow-400">
                              ⭐ Featured
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/tools/edit/${tool.id}`}
                            className="px-4 py-2 bg-cyan-500/90 hover:bg-cyan-600 text-white text-sm font-semibold rounded-lg transition-all shadow-sm hover:shadow-cyan-500/25"
                          >
                            Edit
                          </Link>
                          <Link
                            href={`/tools/${tool.slug}`}
                            target="_blank"
                            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white text-sm font-semibold rounded-lg transition-all"
                          >
                            View
                          </Link>
                          <button
                            type="button"
                            onClick={() => handleDelete(tool.id, tool.name)}
                            className="px-4 py-2 bg-red-600/80 hover:bg-red-600 text-white text-sm font-semibold rounded-lg transition-all"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="text-slate-500 mb-4">
                      No tools yet.{' '}
                      <Link
                        href="/admin/tools/add"
                        className="text-cyan-400 hover:text-cyan-300 font-semibold"
                      >
                        Create your first tool
                      </Link>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
