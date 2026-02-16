import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { cookies } from 'next/headers'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // ✅ SECURITY: Verify user is authenticated
    const cookieStore = await cookies()
    const supabase = createServerClient()

    const {
      data: { session },
      error: authError,
    } = await supabase.auth.getSession()

    if (authError || !session || !session.user) {
      console.error('Authentication failed:', authError?.message || 'No session')
      return NextResponse.json(
        { error: 'Unauthorized: Admin authentication required' },
        { status: 401 }
      )
    }

    const { id } = await params

    console.log('Deleting post ID:', id, 'by user:', session.user.email)

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
