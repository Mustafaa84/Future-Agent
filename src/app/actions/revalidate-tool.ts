'use server'

import { revalidatePath } from 'next/cache'

export async function revalidateTool(slug: string, categorySlug?: string) {
    try {
        // Revalidate homepage
        revalidatePath('/')

        // Revalidate the tool detail page
        revalidatePath(`/tools/${slug}`)

        // Revalidate the category page if provided
        if (categorySlug) {
            revalidatePath(`/tools/category/${categorySlug}`)
        }

        // Revalidate the general tools directory
        revalidatePath('/tools')

        return { success: true }
    } catch (error) {
        console.error(`Failed to revalidate tool ${slug}:`, error)
        return { success: false, error }
    }
}
