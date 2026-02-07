import { createAdminClient } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import ComparisonPost from '@/components/blog/ComparisonPost'

interface ComparePageProps {
    searchParams: Promise<{ tools?: string }>
}

export default async function ComparePage({ searchParams }: ComparePageProps) {
    const supabase = createAdminClient()
    const { tools } = await searchParams
    if (!tools) notFound()

    const slugs = tools.split(',').map(s => s.trim().toLowerCase()).filter(Boolean)
    if (slugs.length === 1) {
        const { redirect } = await import('next/navigation')
        redirect(`/tools?compare=true&preselect=${slugs[0]}`)
    }
    if (slugs.length !== 2) notFound()

    const [slugA, slugB] = slugs
    console.log(`[Compare] Starting comparison: ${slugA} vs ${slugB}`)

    // Fetch tools with fallback to name matching (just like blog hydration)
    const { data: latestTools, error: toolsError } = await supabase
        .from('ai_tools')
        .select('id, name, slug, logo, rating, website_url, description, tagline, review_intro, tags, pricing_model, category')
        .or(`slug.in.(${slugs.join(',')}),name.in.(${slugs.map(s => `"${s}"`).join(',')})`)

    if (toolsError || !latestTools || latestTools.length < 2) {
        console.error('[Compare] Tools not found or error:', toolsError)
        notFound()
    }

    const findTool = (slug: string) =>
        latestTools.find(t => t.slug === slug) ||
        latestTools.find(t => t.name.toLowerCase() === slug.replace(/-/g, ' '));

    const toolAData = findTool(slugA)
    const toolBData = findTool(slugB)

    if (!toolAData || !toolBData) {
        console.error('[Compare] Mapping failed for tools:', { slugA, slugB })
        notFound()
    }

    // Re-hydration logic
    const hydrateTool = async (liveTool: any) => {
        console.log(`[Compare] Hydrating ${liveTool.name} (ID: ${liveTool.id})`)
        const [pros, cons, pricing, integrations, affiliateLink, features] = await Promise.all([
            supabase.from('tool_pros').select('text').eq('tool_id', liveTool.id).order('sort_order', { ascending: true }),
            supabase.from('tool_cons').select('text').eq('tool_id', liveTool.id).order('sort_order', { ascending: true }),
            supabase.from('tool_pricing_plans').select('price_label, price, period').eq('tool_id', liveTool.id).order('sort_order', { ascending: true }).limit(1).maybeSingle(),
            supabase.from('tool_integrations').select('integration_name').eq('tool_id', liveTool.id).order('sort_order', { ascending: true }),
            supabase.from('affiliate_links').select('slug').eq('tool_id', liveTool.id).maybeSingle(),
            supabase.from('tool_features').select('title, description').eq('tool_id', liveTool.id).limit(3)
        ]);

        const pricingStr = pricing.data ? (pricing.data.price_label || (pricing.data.price ? `$${pricing.data.price}/${pricing.data.period}` : 'Freemium')) : 'Contact Sales';

        console.log(`[Compare] ${liveTool.name} data - Pros: ${pros.data?.length}, Cons: ${cons.data?.length}, Pricing: ${pricingStr}`)

        return {
            name: liveTool.name,
            slug: liveTool.slug,
            logo: liveTool.logo || `https://placehold.co/400x400/0f172a/06b6d4?text=${liveTool.name[0]}`,
            rating: liveTool.rating || 4.0,
            cta: affiliateLink.data?.slug ? `/go/${affiliateLink.data.slug}` : (liveTool.website_url || '#'),
            pros: pros.data?.map(p => p.text) || [],
            cons: cons.data?.map(c => c.text) || [],
            pricing: pricingStr,
            integrations: integrations.data?.map(i => i.integration_name) || [],
            description: liveTool.review_intro || liveTool.description || `A powerful AI tool for various use cases.`,
            tagline: liveTool.tagline || '',
            useCases: liveTool.tags ? (typeof liveTool.tags === 'string' ? JSON.parse(liveTool.tags) : liveTool.tags) : [],
            subscriptionDetails: liveTool.pricing_model || 'Freemium',
            liveFeatures: features.data || []
        }
    }

    const [tA, tB] = await Promise.all([
        hydrateTool(toolAData),
        hydrateTool(toolBData)
    ])

    // Smart cross-category comparison logic
    const categoriesMatch = toolAData.category?.toLowerCase() === toolBData.category?.toLowerCase()
    const catA = toolAData.category || 'AI Tool'
    const catB = toolBData.category || 'AI Tool'

    // Construct intelligent verdict with HUMAN-SOUNDING copy
    const verdict = {
        winner: tA.rating > tB.rating ? 'toolA' : tB.rating > tA.rating ? 'toolB' : 'tie' as any,
        summary: (() => {
            // Cross-category comparison detected
            if (!categoriesMatch) {
                // Natural, human-written alternatives (randomize for authenticity)
                const styles = [
                    `Hold up — you're comparing apples to oranges here. **${tA.name}** is built for ${catA.toLowerCase()}, while **${tB.name}** tackles ${catB.toLowerCase()}. Totally different categories. Pick ${tA.name} if you need ${catA.toLowerCase()} power. Pick ${tB.name} if you're focused on ${catB.toLowerCase()}. Or honestly? Use both.`,

                    `These aren't really competitors. **${tA.name}** (${catA}) and **${tB.name}** (${catB}) solve completely different problems. It's like comparing a hammer to a screwdriver — both useful, different jobs. Choose based on what you actually need, not which one "wins."`,

                    `Not a fair fight. **${tA.name}** is a ${catA.toLowerCase()} tool, **${tB.name}** is for ${catB.toLowerCase()}. They're in different categories entirely. If your workflow needs both ${catA.toLowerCase()} AND ${catB.toLowerCase()}, grab both. If you only need one, the choice is obvious.`
                ]
                // Pick one randomly for natural variation
                const randomStyle = styles[Math.floor(Math.random() * styles.length)]
                return randomStyle
            }

            // Same category, rating-based verdict
            if (tA.rating === tB.rating) {
                return `Dead heat. Both ${tA.name} and ${tB.name} score ${tA.rating}/5.0 in the ${catA} category. Your call comes down to pricing, integrations, and which UI you vibe with more.`
            }

            const winner = tA.rating > tB.rating ? tA.name : tB.name
            const loser = tA.rating > tB.rating ? tB.name : tA.name
            const winScore = Math.max(tA.rating, tB.rating)
            const loseScore = Math.min(tA.rating, tB.rating)
            const gap = winScore - loseScore

            if (gap >= 0.5) {
                return `**${winner}** takes this one with a ${winScore}/5.0 vs ${loseScore}/5.0 rating. Clear winner in the ${catA} space. ${loser} isn't bad, but ${winner} has the edge in features, polish, and user satisfaction.`
            } else {
                return `Slight edge to **${winner}** (${winScore}/5.0 vs ${loseScore}/5.0), but we're splitting hairs here. Both are top-tier ${catA} tools. Test both free trials and see which workflow clicks better for you.`
            }
        })()
    };

    const comparisonFeatures = [
        { name: 'Expert Rating', toolAValue: `${tA.rating}/5.0`, toolBValue: `${tB.rating}/5.0` },
    ];

    // Add Dynamic features from records
    const maxFeats = Math.max(tA.liveFeatures.length, tB.liveFeatures.length);
    for (let i = 0; i < Math.min(maxFeats, 3); i++) {
        const fA = tA.liveFeatures[i];
        const fB = tB.liveFeatures[i];
        if (fA || fB) {
            comparisonFeatures.push({
                name: fA?.title || fB?.title || `Core Feature ${i + 1}`,
                toolAValue: fA?.description || 'Supported',
                toolBValue: fB?.description || 'Supported'
            });
        }
    }

    // Add integrations as a feature
    comparisonFeatures.push({
        name: 'Integrations',
        toolAValue: tA.integrations.length > 0 ? tA.integrations.slice(0, 3).join(', ') : 'Direct Access',
        toolBValue: tB.integrations.length > 0 ? tB.integrations.slice(0, 3).join(', ') : 'Direct Access'
    });

    return (
        <div className="min-h-screen bg-slate-950 px-4 py-12">
            <div className="mx-auto max-w-5xl">
                <header className="mb-12 text-center">
                    <h1 className="text-4xl md:text-5xl font-black text-white italic tracking-tight mb-4">
                        {tA.name} <span className="text-cyan-500">VS</span> {tB.name}
                    </h1>
                    <div className="flex items-center justify-center gap-2">
                        <span className="h-px w-8 bg-slate-800" />
                        <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-[10px] italic">
                            Live Battle Analysis • 2026
                        </p>
                        <span className="h-px w-8 bg-slate-800" />
                    </div>
                </header>
                <ComparisonPost
                    toolA={tA}
                    toolB={tB}
                    verdict={verdict}
                    features={comparisonFeatures}
                />
            </div>
        </div>
    )
}
