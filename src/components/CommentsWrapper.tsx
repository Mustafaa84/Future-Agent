'use client'

import { useRouter } from 'next/navigation'
import CommentForm from './CommentForm'

interface CommentsWrapperProps {
  toolId: string
}

export default function CommentsWrapper({ toolId }: CommentsWrapperProps) {
  const router = useRouter()

  const handleCommentAdded = () => {
    // Refresh the page to show new comment
    router.refresh()
  }

  return <CommentForm toolId={toolId} onCommentAdded={handleCommentAdded} />
}
