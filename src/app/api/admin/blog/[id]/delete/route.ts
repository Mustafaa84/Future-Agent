import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    console.log('Deleting post ID:', id) // Debug log
    
    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Supabase delete error:', error)
      throw error
    }

    console.log('Post deleted successfully')
    return NextResponse.json({ success: true })
  } catch (error) {
    const deleteError = error instanceof Error ? error : new Error(String(error))
    console.error('Delete error:', deleteError)
    return NextResponse.json(
      { error: deleteError.message || 'Failed to delete post' }, 
      { status: 500 }
    )
  }
}
