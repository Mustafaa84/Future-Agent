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
