export const categoryImages: Record<string, string> = {
    'marketing': '/categories/marketing.png',
    'coding': '/categories/coding.png',
    'writing': '/categories/content.png',
    'automation': '/categories/workflows.png',
    'research': '/categories/intelligence.png'
}

export function getCategoryImage(slug: string | null, dbImageUrl?: string | null): string {
    // 1. If we have a direct URL from database, use it
    if (dbImageUrl) return dbImageUrl

    // 2. If no DB URL, check our mapping
    if (!slug) return '/categories/default.png'
    return categoryImages[slug] || '/categories/default.png'
}
