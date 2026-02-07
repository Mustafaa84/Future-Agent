'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Comment {
  id: string
  author_name: string
  author_email: string
  rating: number
  comment_text: string
  created_at: string
}

interface CommentsSectionProps {
  contentId: string
  contentType: 'tool' | 'post'
  comments: Comment[]
}

export default function CommentsSection({
  contentId,
  contentType,
  comments,
}: CommentsSectionProps) {
  const router = useRouter()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [formData, setFormData] = useState({
    author_name: '',
    author_email: '',
    rating: 5,
    comment_text: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess(false)

    if (formData.comment_text.length < 10) {
      setError('Comment must be at least 10 characters long')
      setLoading(false)
      return
    }

    if (formData.comment_text.length > 2000) {
      setError('Comment must be less than 2000 characters')
      setLoading(false)
      return
    }

    try {
      // Use the API endpoint instead of direct DB access
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          [contentType === 'tool' ? 'tool_id' : 'post_id']: contentId,
          author_name: formData.author_name,
          author_email: formData.author_email,
          content: formData.comment_text,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit comment')
      }

      setFormData({
        author_name: '',
        author_email: '',
        rating: 5,
        comment_text: '',
      })
      setSuccess(true)
      setIsFormOpen(false)
      router.refresh()

      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      const commentError =
        err instanceof Error ? err : new Error(String(err))
      setError(commentError.message || 'Failed to submit comment')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">
          User Reviews ({comments.length})
        </h2>
        <button
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white font-semibold rounded-lg transition-all"
        >
          {isFormOpen ? 'Close' : 'Leave a Review'}
        </button>
      </div>

      {success && (
        <div className="mb-4 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400">
          ✓ Review submitted! It will appear after moderation.
        </div>
      )}

      {/* Dropdown Form */}
      {isFormOpen && (
        <div className="mb-6 bg-slate-950 border border-slate-700 rounded-xl p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
                {error}
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Your Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.author_name}
                  onChange={(e) =>
                    setFormData({ ...formData, author_name: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:border-sky-500 focus:outline-none"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Your Email *{' '}
                  <span className="text-slate-500 text-xs">(not published)</span>
                </label>
                <input
                  type="email"
                  required
                  value={formData.author_email}
                  onChange={(e) =>
                    setFormData({ ...formData, author_email: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:border-sky-500 focus:outline-none"
                  placeholder="john@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Your Rating *
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, rating: star })
                    }
                    className={`text-2xl transition-all ${star <= formData.rating
                      ? 'text-yellow-400 hover:text-yellow-300'
                      : 'text-slate-700 hover:text-slate-600'
                      }`}
                  >
                    ★
                  </button>
                ))}
                <span className="ml-2 text-slate-400 self-center text-sm">
                  {formData.rating} {formData.rating === 1 ? 'star' : 'stars'}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Your Review *{' '}
                <span className="text-slate-500 text-xs">
                  (10-2000 characters)
                </span>
              </label>
              <textarea
                required
                rows={4}
                value={formData.comment_text}
                onChange={(e) =>
                  setFormData({ ...formData, comment_text: e.target.value })
                }
                className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:border-sky-500 focus:outline-none resize-none"
                placeholder="Share your experience..."
              />
              <div className="mt-1 text-xs text-slate-500 text-right">
                {formData.comment_text.length} / 2000
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 disabled:from-slate-700 disabled:to-slate-700 text-white font-bold rounded-lg transition-all disabled:cursor-not-allowed"
            >
              {loading ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-4">
        {comments.length === 0 && !isFormOpen && (
          <p className="text-slate-400 text-center py-8">
            No reviews yet. Be the first to review!
          </p>
        )}

        {comments.map((comment) => (
          <div
            key={comment.id}
            className="bg-slate-950 border border-slate-700 rounded-xl p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <div>
                <h4 className="text-white font-semibold">
                  {comment.author_name}
                </h4>
                <p className="text-xs text-slate-500">
                  {new Date(comment.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </p>
              </div>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className={`text-sm ${i < comment.rating
                      ? 'text-yellow-400'
                      : 'text-slate-700'
                      }`}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">
              {comment.comment_text}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
