import { supabase, fetchWithRetry, withRetry } from '@/lib/supabase'

// Resilient category fetching with cache-friendly sorting
// Resilient category fetching with cache-friendly sorting
export async function fetchCategories() {
    return await fetchWithRetry(
        async () => {
            // console.log('Fetching categories...')
            const result = await supabase
                .from('categories')
                .select('*')
                .order('name', { ascending: true })

            if (result.error) {
                console.error('Supabase categories error:', result.error)
            }
            return result
        },
        [] // Fallback to empty array
    )
}

// Resilient tools fetching for directory
export async function fetchPublishedTools() {
    return await fetchWithRetry(
        async () => await supabase
            .from('ai_tools')
            .select('*')
            .eq('published', true)
            // Relaxed filter: Allow tools scheduled within the next 24 hours (timezone buffer)
            .lte('published_date', new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString())
            .order('published_date', { ascending: false })
            .order('rating', { ascending: false }),
        [] // Fallback
    )
}

// Resilient tool fetching by slug
export async function fetchToolBySlug(slug: string) {
    return await fetchWithRetry(
        async () => await supabase
            .from('ai_tools')
            .select('*')
            .eq('slug', slug)
            .single(),
        null // Fallback
    )
}

// Admin Dashboard Helpers (Resilient)
export async function fetchAdminTableCounts(table: string, filter?: { column: string, value: any }) {
    return await withRetry(async () => {
        let query = supabase.from(table).select('*', { count: 'exact', head: true })
        if (filter) {
            query = query.eq(filter.column, filter.value)
        }
        const { count, error } = await query
        if (error) throw new Error(error.message)
        return count ?? 0
    })
}

// Homepage Helpers (Resilient)
export async function fetchFeaturedTools() {
    return await fetchWithRetry(
        async () => await supabase
            .from('ai_tools')
            .select('id, name, slug, logo, tagline, category, rating')
            .eq('published', true)
            .eq('featured', true)
            .order('rating', { ascending: false })
            .limit(3),
        []
    )
}

export async function fetchLatestBlogPosts() {
    return await fetchWithRetry(
        async () => await supabase
            .from('blog_posts')
            .select('id, slug, title, excerpt, featured_image, category, reading_time')
            .eq('published', true)
            .lte('published_date', new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString())
            .order('created_at', { ascending: false })
            .limit(3),
        []
    )
}

export async function fetchComparisonPosts() {
    return await fetchWithRetry(
        async () => await supabase
            .from('blog_posts')
            .select('title, slug')
            .eq('published', true)
            .ilike('slug', '%-vs-%')
            .order('published_date', { ascending: false }),
        []
    )
}
