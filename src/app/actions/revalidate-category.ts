'use server'

import { revalidatePath } from 'next/cache'

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
