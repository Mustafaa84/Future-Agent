interface Comment {
  id: string
  author_name: string
  rating: number
  comment_text: string
  created_at: string
}

interface CommentsListProps {
  comments: Comment[]
}

export default function CommentsList({ comments }: CommentsListProps) {
  if (comments.length === 0) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center">
        <p className="text-slate-400">No reviews yet. Be the first to review this tool!</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <div
          key={comment.id}
          className="bg-slate-900 border border-slate-800 rounded-2xl p-6"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <div>
              <h4 className="text-white font-semibold">{comment.author_name}</h4>
              <p className="text-sm text-slate-500">
                {new Date(comment.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })}
              </p>
            </div>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <span
                  key={i}
                  className={`text-lg ${
                    i < comment.rating ? 'text-yellow-400' : 'text-slate-700'
                  }`}
                >
                  ★
                </span>
              ))}
            </div>
          </div>

          {/* Comment Text */}
          <p className="text-slate-300 leading-relaxed">{comment.comment_text}</p>
        </div>
      ))}
    </div>
  )
}
