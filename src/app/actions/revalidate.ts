'use server'

import { revalidatePath } from 'next/cache'

export async function triggerRevalidation(path: string, type?: 'page' | 'layout') {
    try {
        revalidatePath(path, type)
        return { success: true }
    } catch (error) {
        console.error(`Failed to revalidate ${path}:`, error)
        return { success: false, error }
    }
}

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

export async function revalidateCategory(slug: string) {
    try {
        // Revalidate homepage
        revalidatePath('/')

        // Revalidate the general tools directory
        revalidatePath('/tools')

        // Revalidate the specific category page
        revalidatePath(`/tools/category/${slug}`)

        return { success: true }
    } catch (error) {
        console.error(`Failed to revalidate category ${slug}:`, error)
        return { success: false, error }
    }
}
