'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'

interface Comment {
    id: string
    author_name: string
    author_email: string
    rating: number
    comment_text: string
    approved: boolean
    created_at: string
    // For tool comments
    tool_id?: string
    tool_name?: string
    // For blog comments
    post_id?: string
    post_title?: string
}

type CommentTab = 'pending' | 'approved' | 'all'

export default function CommentsAdminPage() {
    const [comments, setComments] = useState<Comment[]>([])
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState<CommentTab>('pending')
    const [actionLoading, setActionLoading] = useState<string | null>(null)

    const fetchComments = useCallback(async () => {
        setLoading(true)

        // 1. Fetch tool comments (NO JOIN to avoid schema cache issues)
        const { data: toolComments, error: toolError } = await supabase
            .from('tool_comments')
            .select(`
                id,
                author_name,
                author_email,
                rating,
                comment_text,
                approved,
                created_at,
                tool_id
            `)
            .order('created_at', { ascending: false })

        // 2. Fetch blog comments
        const { data: blogComments, error: blogError } = await supabase
            .from('blog_comments')
            .select(`
                id,
                author_name,
                author_email,
                rating,
                comment_text,
                approved,
                created_at,
                post_id,
                blog_posts(title)
            `)
            .order('created_at', { ascending: false })

        if (toolError) {
            console.error('Error fetching tool comments:', toolError)
            alert(`Error fetching tool comments: ${toolError.message}`)
        }
        if (blogError) {
            console.error('Error fetching blog comments:', blogError)
            alert(`Error fetching blog comments: ${blogError.message}`)
        }

        // 3. Manually fetch tool names if we have tool comments
        let toolMap: Record<string, string> = {}
        if (toolComments && toolComments.length > 0) {
            const toolIds = Array.from(new Set(toolComments.map(c => c.tool_id)))
            const { data: tools } = await supabase
                .from('ai_tools')
                .select('id, name')
                .in('id', toolIds)

            if (tools) {
                tools.forEach(t => {
                    toolMap[t.id] = t.name
                })
            }
        }

        // Combine and format comments
        const formattedToolComments: Comment[] = (toolComments || []).map((c) => ({
            id: `tool_${c.id}`,
            author_name: c.author_name,
            author_email: c.author_email,
            rating: c.rating,
            comment_text: c.comment_text,
            approved: c.approved,
            created_at: c.created_at,
            tool_id: c.tool_id,
            tool_name: toolMap[c.tool_id] || 'Unknown Tool',
        }))

        const formattedBlogComments: Comment[] = (blogComments || []).map((c) => {
            // Handle relation possibly being an array or object
            const postData = Array.isArray(c.blog_posts) ? c.blog_posts[0] : c.blog_posts

            return {
                id: `blog_${c.id}`,
                author_name: c.author_name,
                author_email: c.author_email,
                rating: c.rating,
                comment_text: c.comment_text,
                approved: c.approved,
                created_at: c.created_at,
                post_id: c.post_id,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                post_title: (postData as any)?.title || 'Unknown Post',
            }
        })

        // Combine and sort by date
        const allComments = [...formattedToolComments, ...formattedBlogComments].sort(
            (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )

        setComments(allComments)
        setLoading(false)
    }, [])

    useEffect(() => {
        fetchComments()
    }, [fetchComments])

    const handleApprove = async (commentId: string) => {
        setActionLoading(commentId)

        const [type, id] = commentId.split('_')
        const table = type === 'tool' ? 'tool_comments' : 'blog_comments'

        const { error } = await supabase
            .from(table)
            .update({ approved: true })
            .eq('id', id)

        if (error) {
            console.error('Error approving comment:', error)
            alert('Failed to approve comment')
        } else {
            // Update local state
            setComments(prev =>
                prev.map(c => c.id === commentId ? { ...c, approved: true } : c)
            )
        }

        setActionLoading(null)
    }

    const handleReject = async (commentId: string) => {
        if (!confirm('Are you sure you want to delete this comment?')) return

        setActionLoading(commentId)

        const [type, id] = commentId.split('_')
        const table = type === 'tool' ? 'tool_comments' : 'blog_comments'

        const { error } = await supabase
            .from(table)
            .delete()
            .eq('id', id)

        if (error) {
            console.error('Error deleting comment:', error)
            alert('Failed to delete comment')
        } else {
            // Remove from local state
            setComments(prev => prev.filter(c => c.id !== commentId))
        }

        setActionLoading(null)
    }

    const handleUnapprove = async (commentId: string) => {
        setActionLoading(commentId)

        const [type, id] = commentId.split('_')
        const table = type === 'tool' ? 'tool_comments' : 'blog_comments'

        const { error } = await supabase
            .from(table)
            .update({ approved: false })
            .eq('id', id)

        if (error) {
            console.error('Error unapproving comment:', error)
            alert('Failed to unapprove comment')
        } else {
            setComments(prev =>
                prev.map(c => c.id === commentId ? { ...c, approved: false } : c)
            )
        }

        setActionLoading(null)
    }

    // Filter comments based on active tab
    const filteredComments = comments.filter(c => {
        if (activeTab === 'pending') return !c.approved
        if (activeTab === 'approved') return c.approved
        return true // 'all' tab
    })

    const pendingCount = comments.filter(c => !c.approved).length
    const approvedCount = comments.filter(c => c.approved).length

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white">Comment Moderation</h1>
                    <p className="text-slate-400 mt-1">
                        Review and approve user comments
                    </p>
                </div>
                <button
                    onClick={fetchComments}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors"
                >
                    ↻ Refresh
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
                <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-xl p-4">
                    <div className="text-3xl font-bold text-yellow-400">{pendingCount}</div>
                    <div className="text-sm text-yellow-300">Pending Review</div>
                </div>
                <div className="bg-green-900/20 border border-green-600/30 rounded-xl p-4">
                    <div className="text-3xl font-bold text-green-400">{approvedCount}</div>
                    <div className="text-sm text-green-300">Approved</div>
                </div>
                <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
                    <div className="text-3xl font-bold text-white">{comments.length}</div>
                    <div className="text-sm text-slate-400">Total Comments</div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 border-b border-slate-700 pb-2">
                {(['pending', 'approved', 'all'] as CommentTab[]).map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 rounded-lg font-semibold transition-colors ${activeTab === tab
                            ? 'bg-cyan-500 text-white'
                            : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                            }`}
                    >
                        {tab === 'pending' && `⏳ Pending (${pendingCount})`}
                        {tab === 'approved' && `✓ Approved (${approvedCount})`}
                        {tab === 'all' && `📋 All (${comments.length})`}
                    </button>
                ))}
            </div>

            {/* Comments List */}
            {loading ? (
                <div className="text-center py-12 text-slate-400">Loading comments...</div>
            ) : filteredComments.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                    {activeTab === 'pending'
                        ? '🎉 No pending comments to review!'
                        : 'No comments found.'}
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredComments.map((comment) => (
                        <div
                            key={comment.id}
                            className={`bg-slate-900 border rounded-xl p-5 ${comment.approved
                                ? 'border-green-600/30'
                                : 'border-yellow-600/30'
                                }`}
                        >
                            {/* Header */}
                            <div className="flex items-start justify-between mb-3">
                                <div>
                                    <div className="flex items-center gap-3">
                                        <h3 className="text-lg font-semibold text-white">
                                            {comment.author_name}
                                        </h3>
                                        {comment.approved ? (
                                            <span className="px-2 py-0.5 text-xs bg-green-500/20 text-green-400 rounded-full">
                                                ✓ Approved
                                            </span>
                                        ) : (
                                            <span className="px-2 py-0.5 text-xs bg-yellow-500/20 text-yellow-400 rounded-full">
                                                ⏳ Pending
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm text-slate-500">{comment.author_email}</p>
                                </div>
                                <div className="text-right">
                                    <div className="flex items-center gap-1 text-yellow-400">
                                        {[...Array(5)].map((_, i) => (
                                            <span key={i} className={i < comment.rating ? '' : 'opacity-30'}>
                                                ★
                                            </span>
                                        ))}
                                    </div>
                                    <p className="text-xs text-slate-500 mt-1">
                                        {new Date(comment.created_at).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}
                                    </p>
                                </div>
                            </div>

                            {/* Content Location */}
                            <div className="mb-3 text-sm">
                                {comment.tool_name && (
                                    <span className="text-purple-400">
                                        🔧 Tool Review: <strong>{comment.tool_name}</strong>
                                    </span>
                                )}
                                {comment.post_title && (
                                    <span className="text-cyan-400">
                                        📝 Blog Comment: <strong>{comment.post_title}</strong>
                                    </span>
                                )}
                            </div>

                            {/* Comment Text */}
                            <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 mb-4">
                                <p className="text-slate-300 whitespace-pre-wrap">
                                    {comment.comment_text}
                                </p>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3">
                                {!comment.approved ? (
                                    <>
                                        <button
                                            onClick={() => handleApprove(comment.id)}
                                            disabled={actionLoading === comment.id}
                                            className="px-4 py-2 bg-green-600 hover:bg-green-500 disabled:bg-slate-700 text-white font-semibold rounded-lg transition-colors"
                                        >
                                            {actionLoading === comment.id ? 'Processing...' : '✓ Approve'}
                                        </button>
                                        <button
                                            onClick={() => handleReject(comment.id)}
                                            disabled={actionLoading === comment.id}
                                            className="px-4 py-2 bg-red-600 hover:bg-red-500 disabled:bg-slate-700 text-white font-semibold rounded-lg transition-colors"
                                        >
                                            {actionLoading === comment.id ? 'Processing...' : '✗ Reject & Delete'}
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button
                                            onClick={() => handleUnapprove(comment.id)}
                                            disabled={actionLoading === comment.id}
                                            className="px-4 py-2 bg-yellow-600 hover:bg-yellow-500 disabled:bg-slate-700 text-white font-semibold rounded-lg transition-colors"
                                        >
                                            {actionLoading === comment.id ? 'Processing...' : '↩ Unapprove'}
                                        </button>
                                        <button
                                            onClick={() => handleReject(comment.id)}
                                            disabled={actionLoading === comment.id}
                                            className="px-4 py-2 bg-red-600 hover:bg-red-500 disabled:bg-slate-700 text-white font-semibold rounded-lg transition-colors"
                                        >
                                            {actionLoading === comment.id ? 'Processing...' : '✗ Delete'}
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
