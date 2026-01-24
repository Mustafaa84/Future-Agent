import { NextRequest, NextResponse } from 'next/server'
import { supabase, createAdminClient } from '@/lib/supabase'

interface CommentRequestBody {
  post_id?: string
  tool_id?: string
  author_name: string
  author_email?: string
  content: string
}

// GET - Fetch comments for a post or tool
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const postId = searchParams.get('post_id')
    const toolId = searchParams.get('tool_id')

    if (!postId && !toolId) {
      return NextResponse.json(
        { error: 'post_id or tool_id is required' },
        { status: 400 }
      )
    }

    const tableName = toolId ? 'tool_comments' : 'blog_comments'
    const idField = toolId ? 'tool_id' : 'post_id'
    const idValue = toolId || postId

    const { data: comments, error } = await supabase
      .from(tableName)
      .select('*')
      .eq(idField, idValue)
      .eq('approved', true) // Only show approved
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
    const adminAuthClient = createAdminClient() // ✅ Use Admin Client

    const tableName = body.tool_id ? 'tool_comments' : 'blog_comments'
    const idField = body.tool_id ? 'tool_id' : 'post_id'
    const idValue = body.tool_id || body.post_id
    const parentTable = body.tool_id ? 'ai_tools' : 'blog_posts'

    // Validate required fields
    if (!idValue || !body.author_name || !body.content) {
      return NextResponse.json(
        { error: 'ID (post/tool), author_name, and content are required' },
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

    // Verify parent exists first
    const { data: parentExists } = await adminAuthClient
      .from(parentTable)
      .select('id')
      .eq('id', idValue)
      .single()

    if (!parentExists) {
      return NextResponse.json(
        { error: `${parentTable} item not found. Cannot comment on non-existent item.` },
        { status: 404 }
      )
    }

    const { data, error } = await adminAuthClient
      .from(tableName)
      .insert({
        [idField]: idValue,
        author_name: body.author_name.trim(),
        author_email: body.author_email?.trim() || null,
        comment_text: body.content.trim(),
        rating: 5, // Default rating
        approved: false,
        created_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error('Supabase Insert Error:', error)
      throw new Error(error.message || 'Database error')
    }

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
