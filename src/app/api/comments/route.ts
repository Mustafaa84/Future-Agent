import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

interface Comment {
  id: string
  post_id: string
  author_name: string
  author_email: string | null
  content: string
  created_at: string
  updated_at: string
}

interface CommentRequestBody {
  post_id: string
  author_name: string
  author_email?: string
  content: string
}

// GET - Fetch comments for a post
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const postId = searchParams.get('post_id')

    if (!postId) {
      return NextResponse.json(
        { error: 'post_id is required' },
        { status: 400 }
      )
    }

    const { data: comments, error } = await supabase
      .from('comments')
      .select('*')
      .eq('post_id', postId)
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json({ comments })
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error))
    console.error('Fetch comments error:', err)
    return NextResponse.json(
      { error: err?.message || 'Failed to fetch comments' },
      { status: 500 }
    )
  }
}

// POST - Submit a new comment
export async function POST(request: NextRequest) {
  try {
    const body: CommentRequestBody = await request.json()

    // Validate required fields
    if (!body.post_id || !body.author_name || !body.content) {
      return NextResponse.json(
        { error: 'post_id, author_name, and content are required' },
        { status: 400 }
      )
    }

    // Basic validation
    if (body.author_name.trim().length < 2) {
      return NextResponse.json(
        { error: 'Name must be at least 2 characters' },
        { status: 400 }
      )
    }

    if (body.content.trim().length < 3) {
      return NextResponse.json(
        { error: 'Comment must be at least 3 characters' },
        { status: 400 }
      )
    }

    if (body.content.trim().length > 1000) {
      return NextResponse.json(
        { error: 'Comment must be less than 1000 characters' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('comments')
      .insert({
        post_id: body.post_id,
        author_name: body.author_name.trim(),
        author_email: body.author_email?.trim() || null,
        content: body.content.trim(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      } as Comment)
      .select()
      .single<Comment>()

    if (error) throw error

    return NextResponse.json({ success: true, comment: data })
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error))
    console.error('Create comment error:', err)
    return NextResponse.json(
      { error: err?.message || 'Failed to create comment' },
      { status: 500 }
    )
  }
}
