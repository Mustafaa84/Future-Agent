'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { deleteBlogPost } from './actions'

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string | null
  published: boolean
  published_date: string | null
  category: string | null
  featured: boolean
  created_at: string
  updated_at: string
}

export default function BlogAdmin() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadPosts = async () => {
      const { data, error: fetchError } = await supabase
        .from('blog_posts')
        .select(
          'id, title, slug, excerpt, published, published_date, category, featured, created_at, updated_at'
        )
        .order('created_at', { ascending: false })

      if (fetchError) {
        setError(fetchError.message)
      } else {
        setPosts((data as BlogPost[]) || [])
      }
      setLoading(false)
    }

    void loadPosts()
  }, [])

  // ✅ FIXED: Use server action instead of API
  const handleDelete = async (postId: string, postTitle: string) => {
    if (!confirm(`Delete "${postTitle}"? This cannot be undone.`)) {
      return
    }

    try {
      const result = await deleteBlogPost(postId)

      if (result.success) {
        // Remove from local state immediately
        setPosts((prev) => prev.filter((p) => p.id !== postId))
      } else {
        alert('Failed to delete post: ' + result.error)
      }
    } catch (err) {
      alert('Error deleting post')
      console.error(err)
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <p className="text-slate-400">Loading posts...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <div className="bg-red-900/20 border border-red-700 rounded-xl p-6">
          <h1 className="text-2xl font-bold text-white mb-4">Blog Posts</h1>
          <p className="text-red-400 mb-4">Error loading posts: {error}</p>
          <Link
            href="/admin/blog/new"
            className="text-cyan-400 hover:text-cyan-300 underline"
          >
            ← Create First Post
          </Link>
        </div>
      </div>
    )
  }

  const now = new Date()
  const total = posts.length
  const published = posts.filter(
    (p) => p.published && (!p.published_date || new Date(p.published_date) <= now)
  ).length
  const scheduled = posts.filter(
    (p) =>
      p.published && p.published_date && new Date(p.published_date) > now
  ).length
  const drafts = posts.filter((p) => !p.published).length

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Blog Posts</h1>
          <p className="text-slate-400">
            Manage your blog content ({total} posts)
          </p>
        </div>
        <Link
          href="/admin/blog/new"
          className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-bold rounded-xl shadow-lg hover:shadow-emerald-500/25 transition-all"
        >
          ➕ New Post
        </Link>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <div className="text-slate-400 text-sm mb-2">Total Posts</div>
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
      </div>

      {/* Posts table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-950/50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
                  Title
                </th>
                <th className="px-4 py-4 text-left text-sm font-semibold text-slate-300 hidden md:table-cell">
                  Status
                </th>
                <th className="px-4 py-4 text-left text-sm font-semibold text-slate-300 hidden lg:table-cell">
                  Created
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-slate-300">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {posts && posts.length > 0 ? (
                posts.map((post) => {
                  const isScheduled =
                    post.published &&
                    post.published_date &&
                    new Date(post.published_date) > now
                  const isPublished =
                    post.published &&
                    (!post.published_date ||
                      new Date(post.published_date) <= now)

                  return (
                    <tr
                      key={post.id}
                      className="border-t border-slate-800 hover:bg-slate-950/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="font-semibold text-white truncate max-w-[320px]">
                          {post.title}
                        </div>
                        {post.excerpt && (
                          <div className="text-sm text-slate-400 truncate max-w-[320px]">
                            {post.excerpt}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-4 hidden md:table-cell">
                        <div className="flex flex-col gap-1">
                          {isScheduled ? (
                            <>
                              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-orange-500/20 text-orange-400 border border-orange-500/30 inline-flex items-center gap-1 w-fit">
                                🕐 Scheduled
                              </span>
                              {post.published_date && (
                                <span className="text-xs text-slate-500">
                                  {new Date(post.published_date).toLocaleDateString(
                                    'en-US',
                                    {
                                      month: 'short',
                                      day: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit',
                                    }
                                  )}
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
                          {post.category && (
                            <span className="text-xs text-slate-500">
                              {post.category}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4 hidden lg:table-cell text-sm text-slate-400">
                        {new Date(post.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/blog/edit/${post.id}`}
                            className="px-4 py-2 bg-cyan-500/90 hover:bg-cyan-600 text-white text-sm font-semibold rounded-lg transition-all shadow-sm hover:shadow-cyan-500/25"
                          >
                            Edit
                          </Link>
                          <Link
                            href={`/blog/${post.slug}`}
                            target="_blank"
                            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white text-sm font-semibold rounded-lg transition-all"
                          >
                            View
                          </Link>

                          {/* ✅ FIXED DELETE BUTTON */}
                          <button
                            type="button"
                            onClick={() => handleDelete(post.id, post.title)}
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
                  <td colSpan={4} className="px-6 py-12 text-center">
                    <div className="text-slate-500 mb-4">
                      No blog posts yet.{' '}
                      <Link
                        href="/admin/blog/new"
                        className="text-cyan-400 hover:text-cyan-300 font-semibold"
                      >
                        Create your first post
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
