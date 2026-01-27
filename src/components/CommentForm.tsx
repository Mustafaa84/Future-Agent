'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

interface CommentFormProps {
  toolId: string
  onCommentAdded: () => void
}

export default function CommentForm({
  toolId,
  onCommentAdded,
}: CommentFormProps) {
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

    // Validation
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
      const { error: insertError } = await supabase
        .from('tool_comments')
        .insert([
          {
            tool_id: toolId,
            author_name: formData.author_name,
            author_email: formData.author_email,
            rating: formData.rating,
            comment_text: formData.comment_text,
            approved: false, // Default to unapproved for moderation
          },
        ])

      if (insertError) throw insertError

      // Reset form
      setFormData({
        author_name: '',
        author_email: '',
        rating: 5,
        comment_text: '',
      })
      setSuccess(true)
      onCommentAdded()

      // Hide success message after 3 seconds
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
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
      <h3 className="text-xl font-bold text-white mb-4">Leave a Review</h3>

      {success && (
        <div className="mb-4 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400">
          ✓ Review submitted successfully!
        </div>
      )}

      {error && (
        <div className="mb-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label
            htmlFor="author_name"
            className="block text-sm font-medium text-slate-300 mb-2"
          >
            Your Name *
          </label>
          <input
            type="text"
            id="author_name"
            required
            value={formData.author_name}
            onChange={(e) =>
              setFormData({ ...formData, author_name: e.target.value })
            }
            className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
            placeholder="John Doe"
          />
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="author_email"
            className="block text-sm font-medium text-slate-300 mb-2"
          >
            Your Email *{' '}
            <span className="text-slate-500 text-xs">(not published)</span>
          </label>
          <input
            type="email"
            id="author_email"
            required
            value={formData.author_email}
            onChange={(e) =>
              setFormData({ ...formData, author_email: e.target.value })
            }
            className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
            placeholder="john@example.com"
          />
        </div>

        {/* Rating */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Your Rating *
          </label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setFormData({ ...formData, rating: star })}
                className={`text-3xl transition-all ${star <= formData.rating
                    ? 'text-yellow-400 hover:text-yellow-300'
                    : 'text-slate-700 hover:text-slate-600'
                  }`}
              >
                ★
              </button>
            ))}
            <span className="ml-2 text-slate-400 self-center">
              {formData.rating} {formData.rating === 1 ? 'star' : 'stars'}
            </span>
          </div>
        </div>

        {/* Comment */}
        <div>
          <label
            htmlFor="comment_text"
            className="block text-sm font-medium text-slate-300 mb-2"
          >
            Your Review *{' '}
            <span className="text-slate-500 text-xs">
              (10-2000 characters)
            </span>
          </label>
          <textarea
            id="comment_text"
            required
            rows={5}
            value={formData.comment_text}
            onChange={(e) =>
              setFormData({ ...formData, comment_text: e.target.value })
            }
            className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 resize-none"
            placeholder="Share your experience with this tool..."
          />
          <div className="mt-1 text-xs text-slate-500 text-right">
            {formData.comment_text.length} / 2000 characters
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full px-6 py-3 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 disabled:from-slate-700 disabled:to-slate-700 text-white font-bold rounded-xl shadow-lg hover:shadow-sky-500/25 transition-all disabled:cursor-not-allowed"
        >
          {loading ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>
    </div>
  )
}
