import { supabase } from '@/lib/supabase'

type JsonLike = unknown

interface AiToolRow {
  id: string
  name: string
  slug: string
  tagline: string | null
  rating: number | null
  review_count: number | null
  logo: string | null
  description: string | null
  website_url: string | null
  category: string | null
  updated_at: string | null
  tags: JsonLike | null
  review_intro: string | null
  review_sections: JsonLike | null
  pricing_plans: JsonLike | null
  pros: JsonLike | null
  cons: JsonLike | null
  features: JsonLike | null
  faq: JsonLike | null
  alternatives: JsonLike | null
  comparison_table: JsonLike | null
  workflow_steps: JsonLike | null
  published: boolean | null
}

type QuizTool = Pick<
  AiToolRow,
  | 'id'
  | 'name'
  | 'slug'
  | 'category'
  | 'rating'
  | 'review_count'
  | 'logo'
  | 'published'
  | 'tags'
> & {
  pricing_model: string | null
  starting_price: string | number | null
}

function parseField(field: JsonLike): unknown[] {
  if (!field) return []
  if (typeof field === 'string') {
    try {
      const parsed = JSON.parse(field) as unknown
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  }
  return Array.isArray(field) ? field : []
}

export async function getToolData(slug: string) {
  const { data: tool, error } = await supabase
    .from('ai_tools')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single<AiToolRow>()

  if (error || !tool) {
    return null
  }

  return {
    name: tool.name,
    tagline: tool.tagline || '',
    rating: tool.rating || 0,
    reviewCount: tool.review_count || 0,
    logo: tool.logo || tool.name.charAt(0).toUpperCase(),
    description: tool.description || '',
    websiteUrl: tool.website_url || '#',
    category: tool.category || 'AI Tool',
    lastUpdated: tool.updated_at
      ? new Date(tool.updated_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
      : undefined,
    tags: parseField(tool.tags),
    reviewContent: {
      intro:
        tool.review_intro ||
        tool.description ||
        `${tool.name} is a powerful AI tool that helps you work smarter and faster.`,
      sections:
        parseField(tool.review_sections).length > 0
          ? parseField(tool.review_sections)
          : [
            {
              title: `What ${tool.name} Is Best At`,
              content: `${tool.name} is strongest when you need specific solutions for your workflow. The platform provides comprehensive features that help you achieve your goals efficiently.`,
            },
            {
              title: `How ${tool.name} Fits Into Your Stack`,
              content: `${tool.name} integrates seamlessly with your existing tools and workflows, making it easy to adopt without disrupting your current processes.`,
            },
            {
              title: `Key Strengths of ${tool.name}`,
              content:
                'The platform excels at helping teams move faster and achieve better results through intuitive design and powerful automation features.',
            },
            {
              title: `Where ${tool.name} Has Limits`,
              content: `Like any tool, ${tool.name} has specific use cases where it performs best. Understanding these limitations helps you make informed decisions about your toolkit.`,
            },
          ],
    },
    pricing:
      parseField(tool.pricing_plans).length > 0
        ? parseField(tool.pricing_plans)
        : [
          {
            plan: 'Free',
            price: 0,
            period: 'month',
            features: ['Basic features', 'Limited usage'],
            popular: false,
          },
          {
            plan: 'Pro',
            price: 20,
            period: 'month',
            features: ['All features', 'Unlimited usage', 'Priority support'],
            popular: true,
          },
          {
            plan: 'Enterprise',
            price: 'Custom',
            period: 'month',
            features: ['Custom limits', 'Dedicated support', 'SLA'],
            popular: false,
          },
        ],
    pros:
      parseField(tool.pros).length > 0
        ? parseField(tool.pros)
        : ['Easy to use', 'Powerful features', 'Great value'],
    cons:
      parseField(tool.cons).length > 0
        ? parseField(tool.cons)
        : ['Learning curve', 'Some features limited'],
    features:
      parseField(tool.features).length > 0
        ? parseField(tool.features)
        : [
          {
            title: 'Core Feature',
            description: 'Essential functionality that powers your workflow',
          },
          {
            title: 'Advanced Tools',
            description: 'Professional-grade features for expert users',
          },
          {
            title: 'Integrations',
            description: 'Connect with your favorite tools',
          },
        ],
    faq:
      parseField(tool.faq).length > 0
        ? parseField(tool.faq)
        : [
          {
            question: `Who should consider ${tool.name}?`,
            answer: `${tool.name} is a good fit for teams and individuals looking for reliable solutions to improve their workflow and productivity.`,
          },
          {
            question: `Does ${tool.name} replace other tools?`,
            answer: `${tool.name} complements your existing toolkit rather than replacing everything. It's designed to integrate smoothly with what you already use.`,
          },
        ],
    alternatives: parseField(tool.alternatives),
    comparisonTable: parseField(tool.comparison_table),
    workflowSteps: parseField(tool.workflow_steps),
  }
}

export async function getPublishedToolsForQuiz() {
  const { data, error } = await supabase
    .from('ai_tools')
    .select(
      `
      id,
      name,
      slug,
      category,
      rating,
      review_count,
      logo,
      published,
      tags,
      pricing_model,
      starting_price
    `,
    )
    .eq('published', true)
    .order('created_at', { ascending: false })

  if (error || !data) {
    console.error('Error loading published tools for quiz:', error)
    return []
  }

  // Fetch affiliate link status for revenue optimization
  // NOTE: Works with demo data now, will auto-improve when real affiliate links are added
  const toolIds = data.map(t => t.id)
  const { data: affiliateData } = await supabase
    .from('affiliate_links')
    .select('tool_id')
    .in('tool_id', toolIds)

  const affiliateToolIds = new Set(affiliateData?.map(a => a.tool_id) || [])

  return data.map((tool) => {
    const typedTool = tool as QuizTool
    const rawTags = typedTool.tags
    let tags: unknown[] = []

    if (typeof rawTags === 'string') {
      try {
        const parsed = JSON.parse(rawTags) as unknown
        tags = Array.isArray(parsed) ? parsed : []
      } catch {
        tags = []
      }
    } else if (Array.isArray(rawTags)) {
      tags = rawTags
    }

    return {
      ...typedTool,
      tags,
      has_affiliate_link: affiliateToolIds.has(tool.id), // NEW: Revenue optimization flag
      // TODO: Add commission_rate once populated in affiliate_links table
    }
  })
}
