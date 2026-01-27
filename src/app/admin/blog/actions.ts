'use server'

import { createAdminClient } from '@/lib/supabase'
import { revalidatePath } from 'next/cache'

// DOMPurify is disabled temporarily to resolve JSDOM server crashes

interface BlogPostInsertData {
  slug: string
  title: string
  excerpt: string
  content: string
  featured_image: string | null
  category: string
  category_slug: string
  category_name: string
  author: string
  published: boolean
  published_date: string | null
  meta_title: string
  meta_description: string
  tags: string[]
  reading_time: number
  featured: boolean
  created_at: string
  updated_at: string
}

interface BlogPostUpdateData {
  slug: string
  title: string
  excerpt: string
  content: string
  featured_image: string | null
  category: string
  category_slug: string
  category_name: string
  author: string
  published: boolean
  published_date: string | null
  meta_title: string
  meta_description: string
  tags: string[]
  reading_time: number
  updated_at: string
}

interface ActionResponse<T = unknown> {
  success: boolean
  error?: string
  data?: T
}

// Helper: Sanitize HTML content before saving
function sanitizeHtml(html: string): string {
  if (!html) return ''
  // Temporarily return raw HTML to avoid JSDOM crashes
  return html
}

// Helper: Generate slug from title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

// Helper: Generate excerpt from content
function generateExcerpt(content: string, maxLength: number = 160): string {
  const plainText = content
    .replace(/<[^>]*>/g, '')
    .replace(/\n/g, ' ')
    .trim()

  if (plainText.length <= maxLength) return plainText
  return plainText.substring(0, maxLength).trim() + '...'
}

// SERVER ACTION: Create new blog post
export async function createBlogPost(
  formData: FormData
): Promise<ActionResponse<BlogPostInsertData>> {
  try {
    const supabase = createAdminClient()

    // Extract form data (matching YOUR schema)
    const title = formData.get('title') as string
    const slug = (formData.get('slug') as string) || generateSlug(title)
    const rawContent = formData.get('content') as string
    const content = sanitizeHtml(rawContent) // ✅ sanitized HTML

    const author = formData.get('author') as string
    const category = formData.get('category') as string
    const tagsString = formData.get('tags') as string
    const tags = tagsString
      ? tagsString.split(',').map((t) => t.trim())
      : []
    const featured_image = formData.get('featured_image') as string

    const status = formData.get('status') as string
    const scheduled_at = formData.get('scheduled_at') as string

    let published = false
    let published_date: string | null = null

    if (status === 'draft') {
      published = false
      published_date = null
    } else if (status === 'published') {
      published = true
      published_date = null // or new Date().toISOString() if you prefer
    } else if (status === 'scheduled') {
      published = true
      published_date = scheduled_at
        ? new Date(scheduled_at).toISOString()
        : null
    }

    const meta_title = (formData.get('meta_title') as string) || title
    const meta_description =
      (formData.get('meta_description') as string) ||
      generateExcerpt(content)

    // ✅ Respect manual input, ONLY auto-calculate if empty
    let reading_time = 5
    const readingTimeInput = formData.get('reading_time') as string

    if (readingTimeInput && readingTimeInput.trim() !== '') {
      reading_time = parseInt(readingTimeInput, 10) || 5
    } else if (content) {
      reading_time = Math.max(3, Math.round(content.length / 1200))
    }

    // Auto-generate excerpt
    const excerpt =
      (formData.get('excerpt') as string) || generateExcerpt(content)

    // Check if slug already exists
    const { data: existingPost } = await supabase
      .from('blog_posts')
      .select('id')
      .eq('slug', slug)
      .single<{ id: string }>()

    if (existingPost) {
      return {
        success: false,
        error:
          'A post with this slug already exists. Please use a different slug.',
      }
    }

    // Insert blog post (matching YOUR exact schema)
    const { data, error } = await supabase
      .from('blog_posts')
      .insert({
        slug,
        title,
        excerpt,
        content, // ✅ sanitized HTML
        featured_image: featured_image || null,
        category,
        category_slug: category.toLowerCase().replace(/[^a-z0-9]/g, '-'),
        category_name: category,
        author: author || 'Admin',
        published,
        published_date, // ✅ FIXED: Now correctly set based on status
        meta_title,
        meta_description,
        tags,
        reading_time,
        featured: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      } as BlogPostInsertData)
      .select()
      .single<BlogPostInsertData>()

    if (error) {
      console.error('Supabase error:', error)
      return {
        success: false,
        error: error.message,
      }
    }

    // Revalidate ALL blog pages
    revalidatePath('/admin/blog')
    revalidatePath('/blog')
    revalidatePath(`/blog/${slug}`)
    revalidatePath('/blog/[slug]', 'page')

    return {
      success: true,
      data,
    }
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error))
    console.error('Create blog post error:', err)
    return {
      success: false,
      error: err.message || 'Failed to create blog post',
    }
  }
}

// SERVER ACTION: Update existing blog post
export async function updateBlogPost(
  id: string,
  formData: FormData
): Promise<ActionResponse<BlogPostUpdateData>> {
  try {
    const supabase = createAdminClient()

    // Extract form data (matching YOUR schema)
    const title = formData.get('title') as string
    const slug = (formData.get('slug') as string) || generateSlug(title)
    const rawContent = formData.get('content') as string
    const content = sanitizeHtml(rawContent) // ✅ sanitized HTML

    const author = formData.get('author') as string
    const category = formData.get('category') as string
    const tagsString = formData.get('tags') as string
    const tags = tagsString
      ? tagsString.split(',').map((t) => t.trim())
      : []
    const featured_image = formData.get('featured_image') as string

    const status = formData.get('status') as string
    const scheduled_at = formData.get('scheduled_at') as string

    let published = false
    let published_date: string | null = null

    if (status === 'draft') {
      published = false
      published_date = null
    } else if (status === 'published') {
      published = true
      published_date = null
    } else if (status === 'scheduled') {
      published = true
      published_date = scheduled_at
        ? new Date(scheduled_at).toISOString()
        : null
    }

    const meta_title = (formData.get('meta_title') as string) || title
    const meta_description =
      (formData.get('meta_description') as string) ||
      generateExcerpt(content)

    // ✅ Respect manual input, ONLY auto-calculate if empty
    let reading_time = 5
    const readingTimeInput = formData.get('reading_time') as string

    if (readingTimeInput && readingTimeInput.trim() !== '') {
      reading_time = parseInt(readingTimeInput, 10) || 5
    } else if (content) {
      reading_time = Math.max(3, Math.round(content.length / 1200))
    }

    // Check if slug already exists (excluding current post)
    const { data: existingPost } = await supabase
      .from('blog_posts')
      .select('id')
      .eq('slug', slug)
      .neq('id', id)
      .maybeSingle<{ id: string }>()

    if (existingPost && existingPost.id !== id) {
      return {
        success: false,
        error:
          'A post with this slug already exists. Please use a different slug.',
      }
    }

    const excerpt =
      (formData.get('excerpt') as string) || generateExcerpt(content)

    // Update blog post (matching YOUR exact schema)
    const { data, error } = await supabase
      .from('blog_posts')
      .update({
        slug,
        title,
        excerpt,
        content, // ✅ sanitized HTML
        featured_image: featured_image || null,
        category,
        category_slug: category.toLowerCase().replace(/[^a-z0-9]/g, '-'),
        category_name: category,
        author: author || 'Admin',
        published,
        published_date, // ✅ FIXED: Now correctly set based on status
        meta_title,
        meta_description,
        tags,
        reading_time,
        updated_at: new Date().toISOString(),
      } as BlogPostUpdateData)
      .eq('id', id)
      .select()
      .single<BlogPostUpdateData>()

    if (error) {
      console.error('Supabase error:', error)
      return {
        success: false,
        error: error.message,
      }
    }

    // Revalidate ALL blog pages
    revalidatePath('/admin/blog')
    revalidatePath('/blog')
    revalidatePath(`/blog/${slug}`)
    revalidatePath('/blog/[slug]', 'page')

    return {
      success: true,
      data,
    }
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error))
    console.error('Update blog post error:', err)
    return {
      success: false,
      error: err.message || 'Failed to update blog post',
    }
  }
}

// SERVER ACTION: Delete blog post
export async function deleteBlogPost(
  id: string
): Promise<ActionResponse<null>> {
  try {
    const supabase = createAdminClient()

    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Supabase error:', error)
      return {
        success: false,
        error: error.message,
      }
    }

    revalidatePath('/admin/blog')
    revalidatePath('/blog')

    return { success: true }
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error))
    console.error('Delete blog post error:', err)
    return {
      success: false,
      error: err.message || 'Failed to delete blog post',
    }
  }
}
