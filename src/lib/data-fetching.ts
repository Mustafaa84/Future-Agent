import { supabase, fetchWithRetry, withRetry } from '@/lib/supabase'

// Resilient category fetching with cache-friendly sorting
export async function fetchCategories() {
    return await fetchWithRetry(
        async () => {
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
// Uses `or` so tools with NULL published_date are always shown when published=true
export async function fetchPublishedTools() {
    const now = new Date().toISOString()
    return await fetchWithRetry(
        async () => await supabase
            .from('ai_tools')
            .select('id, name, slug, logo, tagline, description, category, rating, review_count, pricing_model, starting_price, free_trial, featured, published_date, tags, meta_title, meta_description')
            .eq('published', true)
            .or(`published_date.is.null,published_date.lte.${now}`)
            .order('published_date', { ascending: false, nullsFirst: false })
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
    // First try: tools published in the last 30 days, ordered by rating
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
    const recent = await fetchWithRetry(
        async () => await supabase
            .from('ai_tools')
            .select('id, name, slug, logo, tagline, category, rating')
            .eq('published', true)
            .or(`published_date.is.null,published_date.lte.${new Date().toISOString()}`)
            .gte('published_date', thirtyDaysAgo)
            .order('rating', { ascending: false })
            .limit(3),
        []
    )
    // If we have 3 recent tools, use them
    if (recent.length >= 3) return recent

    // Fallback: top-rated published tools regardless of date
    return await fetchWithRetry(
        async () => await supabase
            .from('ai_tools')
            .select('id, name, slug, logo, tagline, category, rating')
            .eq('published', true)
            .or(`published_date.is.null,published_date.lte.${new Date().toISOString()}`)
            .order('rating', { ascending: false })
            .order('published_date', { ascending: false })
            .limit(3),
        []
    )
}

export async function fetchLatestBlogPosts() {
    const now = new Date().toISOString()
    return await fetchWithRetry(
        async () => await supabase
            .from('blog_posts')
            .select('id, slug, title, excerpt, featured_image, category, category_slug, reading_time, tags, published_date')
            .eq('published', true)
            .or(`published_date.is.null,published_date.lte.${now}`)
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
            .order('published_date', { ascending: false })
            .limit(10),
        []
    )
}
