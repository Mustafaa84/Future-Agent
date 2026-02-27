'use server'

import { createAdminClient } from '@/lib/supabase'
import { revalidatePath } from 'next/cache'

interface ActionResponse<T = unknown> {
    success: boolean
    error?: string
    data?: T
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
