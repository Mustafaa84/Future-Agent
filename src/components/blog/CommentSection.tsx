'use client'

import { useState, useEffect, useCallback } from 'react'

interface Comment {
  id: string
  author_name: string
  content: string
  created_at: string
}

interface CommentSectionProps {
  postId: string
}

export default function CommentSection({ postId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [formOpen, setFormOpen] = useState(false)
  const [formData, setFormData] = useState({
    author_name: '',
    author_email: '',
    content: '',
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  // Fetch comments on mount
  const fetchComments = useCallback(async () => {
    try {
      const response = await fetch(`/api/comments?post_id=${postId}`)
      const data = await response.json()

      if (response.ok) {
        setComments(data.comments || [])
      }
    } catch (err) {
      console.error('Failed to fetch comments:', err)
    } finally {
      setLoading(false)
    }
  }, [postId])

  useEffect(() => {
    fetchComments()
  }, [postId, fetchComments])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess(false)
    setSubmitting(true)

    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          post_id: postId,
          author_name: formData.author_name,
          author_email: formData.author_email,
          content: formData.content,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit comment')
      }

      // Success! Clear form and refresh comments
      setFormData({ author_name: '', author_email: '', content: '' })
      setSuccess(true)
      setFormOpen(false)
      fetchComments()

      // Hide success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      const commentError =
        err instanceof Error ? err : new Error(String(err))
      setError(commentError.message || 'Failed to submit comment')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto mt-16 px-4 pb-16">
      {/* SECTION HEADER */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-100 mb-2">
          💬 Comments ({comments.length})
        </h2>
        <p className="text-slate-400">
          Share your thoughts and join the discussion
        </p>
      </div>

      {/* COLLAPSIBLE COMMENT FORM */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl mb-8 overflow-hidden">
        {/* FORM HEADER - CLICK TO TOGGLE */}
        <button
          onClick={() => setFormOpen(!formOpen)}
          className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-800/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">💭</span>
            <span className="text-lg font-semibold text-slate-200">
              Leave a Comment
            </span>
          </div>
          <svg
            className={`w-5 h-5 text-slate-400 transition-transform ${
              formOpen ? 'rotate-180' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {/* FORM CONTENT - COLLAPSIBLE */}
        {formOpen && (
          <div className="px-6 pb-6 border-t border-slate-800">
            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
              {/* NAME FIELD */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={formData.author_name}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      author_name: e.target.value,
                    })
                  }
                  className="w-full p-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                  placeholder="Your name"
                  required
                  minLength={2}
                />
              </div>

              {/* EMAIL FIELD (OPTIONAL) */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Email{' '}
                  <span className="text-slate-500 text-xs">
                    (Optional - won&apos;t be displayed)
                  </span>
                </label>
                <input
                  type="email"
                  value={formData.author_email}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      author_email: e.target.value,
                    })
                  }
                  className="w-full p-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                  placeholder="your@email.com"
                />
              </div>

              {/* COMMENT FIELD */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Comment <span className="text-red-400">*</span>
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                  rows={4}
                  className="w-full p-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:ring-2 focus:ring-cyan-400 focus:border-transparent resize-none"
                  placeholder="Share your thoughts..."
                  required
                  minLength={3}
                  maxLength={1000}
                />
                <p className="text-xs text-slate-500 mt-1">
                  {formData.content.length}/1000 characters
                </p>
              </div>

              {/* ERROR MESSAGE */}
              {error && (
                <div className="bg-red-900/20 border border-red-700 text-red-400 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {/* BUTTONS */}
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-gradient-to-r from-cyan-400 to-indigo-500 text-white py-3 px-6 rounded-lg font-medium hover:from-cyan-500 hover:to-indigo-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Posting...' : 'Post Comment'}
                </button>
                <button
                  type="button"
                  onClick={() => setFormOpen(false)}
                  className="px-6 py-3 border border-slate-700 text-slate-300 rounded-lg hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* SUCCESS MESSAGE */}
      {success && (
        <div className="bg-green-900/20 border border-green-700 text-green-400 px-4 py-3 rounded-lg text-sm mb-6">
          ✅ Comment posted successfully!
        </div>
      )}

      {/* COMMENTS LIST */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-8">
            <p className="text-slate-400">Loading comments...</p>
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-8 bg-slate-900 border border-slate-800 rounded-xl">
            <p className="text-slate-400">
              No comments yet. Be the first to comment! 🎉
            </p>
          </div>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.id}
              className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition-colors"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold">
                    {comment.author_name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-200">
                      {comment.author_name}
                    </p>
                    <p className="text-xs text-slate-500">
                      {new Date(comment.created_at).toLocaleDateString(
                        'en-US',
                        {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        }
                      )}
                    </p>
                  </div>
                </div>
              </div>
              <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                {comment.content}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
