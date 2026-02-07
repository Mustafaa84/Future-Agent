'use server'

import { createServerClient } from '@/lib/supabase'

interface ComparisonTool {
    slug: string
    name: string
    logo: string
    rating: number
    cta: string
    pros?: string[]
    cons?: string[]
    pricing?: string
    description?: string // New
    tagline?: string // New
    useCases?: string[] // New
    integrations?: string[] // New
    subscriptionDetails?: string // New
}
//...

interface ComparisonFeature {
    name: string
    toolAValue: string
    toolBValue: string
}

interface ComparisonData {
    toolA: ComparisonTool
    toolB: ComparisonTool
    verdict: {
        winner: 'toolA' | 'toolB' | 'tie'
        summary: string
    }
    features: ComparisonFeature[]
}

export async function generateComparisonData(
    toolASlug: string,
    toolBSlug: string
): Promise<{ success: boolean; data?: ComparisonData; error?: string }> {
    try {
        const supabase = createServerClient()

        // Fetch both tools
        const { data: tools, error: toolsError } = await supabase
            .from('ai_tools')
            .select('id, name, slug, logo, rating, website_url, description, review_intro, tagline, tags')
            .in('slug', [toolASlug, toolBSlug])
            .eq('published', true)

        if (toolsError || !tools || tools.length !== 2) {
            return {
                success: false,
                error: 'Failed to fetch tools or tools not found',
            }
        }

        const toolA = tools.find((t) => t.slug === toolASlug)
        const toolB = tools.find((t) => t.slug === toolBSlug)

        if (!toolA || !toolB) {
            return { success: false, error: 'One or both tools not found' }
        }

        // Fetch affiliate links for both tools
        const { data: affiliateLinks } = await supabase
            .from('affiliate_links')
            .select('tool_id, slug')
            .in('tool_id', [toolA.id, toolB.id])

        const affiliateLinkA = affiliateLinks?.find((l) => l.tool_id === toolA.id)
        const affiliateLinkB = affiliateLinks?.find((l) => l.tool_id === toolB.id)

        // Fetch pros for both tools
        const { data: prosA } = await supabase
            .from('tool_pros')
            .select('text')
            .eq('tool_id', toolA.id)
            .order('sort_order', { ascending: true })

        const { data: prosB } = await supabase
            .from('tool_pros')
            .select('text')
            .eq('tool_id', toolB.id)
            .order('sort_order', { ascending: true })

        // Fetch cons for both tools
        const { data: consA } = await supabase
            .from('tool_cons')
            .select('text')
            .eq('tool_id', toolA.id)
            .order('sort_order', { ascending: true })

        const { data: consB } = await supabase
            .from('tool_cons')
            .select('text')
            .eq('tool_id', toolB.id)
            .order('sort_order', { ascending: true })

        // Fetch integrations for both tools
        const { data: integrationsA } = await supabase
            .from('tool_integrations')
            .select('integration_name')
            .eq('tool_id', toolA.id)
            .order('sort_order', { ascending: true })

        const { data: integrationsB } = await supabase
            .from('tool_integrations')
            .select('integration_name')
            .eq('tool_id', toolB.id)
            .order('sort_order', { ascending: true })

        // Fetch pricing plans for both tools (get the most popular or first one)
        const { data: pricingA } = await supabase
            .from('tool_pricing_plans')
            .select('price_label, price, period')
            .eq('tool_id', toolA.id)
            .order('is_popular', { ascending: false })
            .order('sort_order', { ascending: true })
            .limit(1)
            .maybeSingle()

        const { data: pricingB } = await supabase
            .from('tool_pricing_plans')
            .select('price_label, price, period')
            .eq('tool_id', toolB.id)
            .order('is_popular', { ascending: false })
            .order('sort_order', { ascending: true })
            .limit(1)
            .maybeSingle()

        // Fetch features for both tools
        const { data: featuresA } = await supabase
            .from('tool_features')
            .select('title, description')
            .eq('tool_id', toolA.id)
            .order('id', { ascending: true })
            .limit(5)

        const { data: featuresB } = await supabase
            .from('tool_features')
            .select('title, description')
            .eq('tool_id', toolB.id)
            .order('id', { ascending: true })
            .limit(5)

        // Build comparison features (match by title or create generic rows)
        const comparisonFeatures: ComparisonFeature[] = []

        // Add common core comparison metrics
        comparisonFeatures.push({
            name: 'Rating',
            toolAValue: `${toolA.rating || 'N/A'} / 5.0`,
            toolBValue: `${toolB.rating || 'N/A'} / 5.0`,
        })

        comparisonFeatures.push({
            name: 'Pricing',
            toolAValue: pricingA?.price_label || (pricingA?.price ? `$${pricingA.price}/${pricingA.period}` : 'Contact Sales'),
            toolBValue: pricingB?.price_label || (pricingB?.price ? `$${pricingB.price}/${pricingB.period}` : 'Contact Sales'),
        })

        // Add feature-based comparisons
        const maxFeatures = Math.max(featuresA?.length || 0, featuresB?.length || 0)
        for (let i = 0; i < Math.min(maxFeatures, 3); i++) {
            const featureA = featuresA?.[i]
            const featureB = featuresB?.[i]

            if (featureA || featureB) {
                comparisonFeatures.push({
                    name: featureA?.title || featureB?.title || `Feature ${i + 1}`,
                    toolAValue: featureA?.description || 'Not specified',
                    toolBValue: featureB?.description || 'Not specified',
                })
            }
        }

        // Generate a simple verdict (can be enhanced with AI later)
        const ratingDiff = (toolA.rating || 0) - (toolB.rating || 0)
        let winner: 'toolA' | 'toolB' | 'tie' = 'tie'
        let summary = `Both ${toolA.name} and ${toolB.name} are excellent AI tools with their own strengths.`

        if (Math.abs(ratingDiff) > 0.3) {
            winner = ratingDiff > 0 ? 'toolA' : 'toolB'
            const winnerName = winner === 'toolA' ? toolA.name : toolB.name
            summary = `${winnerName} edges ahead with a higher overall rating and more comprehensive feature set, making it the recommended choice for most users.`
        }

        // Build final comparison data
        const comparisonData: ComparisonData = {
            toolA: {
                slug: toolA.slug,
                name: toolA.name,
                logo: toolA.logo || `https://placehold.co/400x400/0f172a/06b6d4?text=${toolA.name[0]}`,
                rating: toolA.rating || 4.0,
                cta: affiliateLinkA ? `/go/${affiliateLinkA.slug}` : toolA.website_url || '#',
                pros: prosA?.map((p) => p.text) || [],
                cons: consA?.map((c) => c.text) || [],
                pricing: pricingA?.price_label || (pricingA?.price ? `$${pricingA.price}/${pricingA.period}` : 'Contact Sales'),
                description: toolA.review_intro || toolA.description || `A powerful AI tool for various use cases.`,
                tagline: toolA.tagline || '',
                useCases: toolA.tags ? (typeof toolA.tags === 'string' ? JSON.parse(toolA.tags) : toolA.tags) : [],
                integrations: integrationsA?.map((i) => i.integration_name) || [],
                subscriptionDetails: pricingA?.price_label || (pricingA?.price ? `$${pricingA.price}/${pricingA.period}` : 'Contact Sales'),
            },
            toolB: {
                slug: toolB.slug,
                name: toolB.name,
                logo: toolB.logo || `https://placehold.co/400x400/0f172a/8b5cf6?text=${toolB.name[0]}`,
                rating: toolB.rating || 4.0,
                cta: affiliateLinkB ? `/go/${affiliateLinkB.slug}` : toolB.website_url || '#',
                pros: prosB?.map((p) => p.text) || [],
                cons: consB?.map((c) => c.text) || [],
                pricing: pricingB?.price_label || (pricingB?.price ? `$${pricingB.price}/${pricingB.period}` : 'Contact Sales'),
                description: toolB.review_intro || toolB.description || `A leading AI solution in the market.`,
                tagline: toolB.tagline || '',
                useCases: toolB.tags ? (typeof toolB.tags === 'string' ? JSON.parse(toolB.tags) : toolB.tags) : [],
                integrations: integrationsB?.map((i) => i.integration_name) || [],
                subscriptionDetails: pricingB?.price_label || (pricingB?.price ? `$${pricingB.price}/${pricingB.period}` : 'Contact Sales'),
            },
            verdict: {
                winner,
                summary,
            },
            features: comparisonFeatures,
        }

        return { success: true, data: comparisonData }
    } catch (error) {
        console.error('Error generating comparison data:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
        }
    }
}
