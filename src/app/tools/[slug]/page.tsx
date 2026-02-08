import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'

export const revalidate = 3600 // 1 hour
import Link from 'next/link'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import JsonLd from '@/components/SEO/JsonLd'
import TagBadge from '@/components/TagBadge'
import {
  generateProductSchema,
  generateBreadcrumbSchema,
  generateFAQSchema,
} from '@/lib/seo/schemas'
import ErrorBoundary from '@/components/ErrorBoundary'
import Breadcrumbs from '@/components/SEO/Breadcrumbs'

const EmailOptInClient = dynamic(() => import('@/components/EmailOptInClient'))
import CommentsSection from '@/components/CommentsSection'
import FAQAccordion from '@/components/FAQAccordion'

interface PageParams {
  slug: string
}

interface TagRecord {
  id: string
  slug: string
  name: string
  icon: string | null
  color: string | null
}

interface ReviewSection {
  id: string
  title: string
  content: string
  image_url: string | null
}

interface FeatureRecord {
  id: string
  title: string
  description: string
  icon: string | null
}

interface PricingPlanRecord {
  id: string
  is_popular: boolean | null
  plan_name: string
  price: number | null
  period: string
  price_label: string | null
  features: string[] | null
}

interface ProRecord {
  id: string
  text: string
}

interface ConRecord {
  id: string
  text: string
}

interface FaqRecord {
  id: string
  question: string
  answer: string
}

interface ComparisonRow {
  id: string
  feature_name: string
  this_tool_value: string
  competitor_1_name: string | null
  competitor_1_value: string | null
  competitor_2_name: string | null
  competitor_2_value: string | null
}

interface AlternativeRecord {
  id: string
  alternative_slug: string
  alternative_name: string
  reason: string
}

interface IntegrationRecord {
  id: string
  integration_name: string
  integration_logo: string | null
  description: string | null
}

interface ToolRow {
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
  published_date: string | null
  tags: string[] | string | null
  workflow_steps: string[] | null
  review_intro: string | null
}

interface PageProps {
  params: Promise<PageParams>
}

export default async function ToolPage({ params }: PageProps) {
  const { slug } = await params

  const { data: tool, error } = await supabase
    .from('ai_tools')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single<ToolRow>()

  if (error || !tool) {
    notFound()
  }

  const { data: affiliateLink } = await supabase
    .from('affiliate_links')
    .select('slug')
    .eq('tool_id', tool.id)
    .maybeSingle<{ slug: string }>()

  const affiliateSlug = affiliateLink?.slug || null

  const primaryCtaHref = affiliateSlug ? `/go/${affiliateSlug}` : tool.website_url || '#'

  let tagSlugs: string[] = []
  try {
    if (tool.tags) {
      tagSlugs = Array.isArray(tool.tags)
        ? tool.tags
        : (JSON.parse(tool.tags) as string[])
    }
  } catch {
    tagSlugs = []
  }

  const normalizedTagSlugs = tagSlugs.map((tag) =>
    tag.toLowerCase().replace(/\s+/g, '-'),
  )

  const { data: allTags } = await supabase
    .from('tags')
    .select('id, slug, name, icon, color')
    .order('name', { ascending: true })

  const tagsArray: TagRecord[] = (allTags || []) as TagRecord[]

  const tagDataMap = tagsArray.reduce<
    Record<string, { name: string; icon: string | null; color: string | null }>
  >((acc, tag) => {
    acc[tag.slug] = {
      name: tag.name,
      icon: tag.icon,
      color: tag.color,
    }
    return acc
  }, {})

  const toolTags = normalizedTagSlugs
    .map((slugValue) => ({
      slug: slugValue,
      ...tagDataMap[slugValue],
    }))
    .filter((tag) => Boolean(tag.name))

  if (tool.published_date) {
    const publishDate = new Date(tool.published_date)
    const now = new Date()
    if (publishDate > now) {
      notFound()
    }
  }

  const [
    pricingPlansRes,
    prosRes,
    consRes,
    featuresRes,
    faqsRes,
    alternativesRes,
    comparisonsRes,
    reviewDataRes,
    commentsRes,
    integrationsRes,
    categoryDataRes,
  ] = await Promise.all([
    supabase.from('tool_pricing_plans').select('*').eq('tool_id', tool.id).order('sort_order', { ascending: true }),
    supabase.from('tool_pros').select('*').eq('tool_id', tool.id).order('sort_order', { ascending: true }),
    supabase.from('tool_cons').select('*').eq('tool_id', tool.id).order('sort_order', { ascending: true }),
    supabase.from('tool_features').select('*').eq('tool_id', tool.id).order('sort_order', { ascending: true }),
    supabase.from('tool_faqs').select('*').eq('tool_id', tool.id).order('sort_order', { ascending: true }),
    supabase.from('tool_alternatives').select('*').eq('tool_id', tool.id).order('sort_order', { ascending: true }),
    supabase.from('tool_comparisons').select('*').eq('tool_id', tool.id).order('sort_order', { ascending: true }),
    supabase.from('tool_reviews').select('id, intro').eq('tool_id', tool.id).maybeSingle<{ id: string; intro: string | null }>(),
    supabase.from('tool_comments').select('*').eq('tool_id', tool.id).eq('approved', true).order('created_at', { ascending: false }),
    supabase.from('tool_integrations').select('*').eq('tool_id', tool.id).order('sort_order', { ascending: true }),
    supabase.from('categories').select('slug').eq('name', tool.category).maybeSingle<{ slug: string }>(),
  ])

  const pricingPlans = pricingPlansRes.data
  const pros = prosRes.data
  const cons = consRes.data
  const features = featuresRes.data
  const faqs = faqsRes.data
  const alternatives = alternativesRes.data
  const comparisons = comparisonsRes.data
  const reviewData = reviewDataRes.data
  const comments = commentsRes.data
  const integrations = integrationsRes.data
  const categorySlug = categoryDataRes.data?.slug

  let reviewSections: ReviewSection[] | null = null
  if (reviewData) {
    const { data: sections } = await supabase
      .from('tool_review_sections')
      .select('*')
      .eq('review_id', reviewData.id)
      .order('sort_order', { ascending: true })

    reviewSections = (sections || []) as ReviewSection[]
  }

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || 'https://futureagent.com'
  const toolUrl = `${siteUrl}/tools/${slug}`

  /* Breadcrumb Schema handled by Breadcrumbs component now */
  const breadcrumbItems = [
    { name: 'Home', url: siteUrl },
    { name: 'Tools', url: `${siteUrl}/tools` },
    { name: tool.category || 'Category', url: `${siteUrl}/tools/category/${categorySlug}` },
    { name: tool.name, url: toolUrl },
  ]

  const productSchema = generateProductSchema({
    name: tool.name,
    description: tool.description ?? '',
    image: `${siteUrl}/images/tools/${slug}.jpg`,
    url: toolUrl,
    price: (pricingPlans as PricingPlanRecord[] | null)?.[0]?.price ?? undefined,
    ratingValue: tool.rating ?? undefined,
    reviewCount: tool.review_count ?? undefined,
    features: (features as FeatureRecord[] | null)?.map((f) => f.title) || [],
  })

  const faqSchema =
    faqs && faqs.length > 0
      ? generateFAQSchema(
        (faqs as FaqRecord[]).map((faq) => ({
          question: faq.question,
          answer: faq.answer,
        })),
      )
      : null

  return (
    <>
      <JsonLd data={productSchema} />
      {faqSchema && <JsonLd data={faqSchema} />}

      <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900">
        {/* Hero Section */}
        <section className="px-4 pt-12 pb-16 border-b border-slate-800">
          <div className="mx-auto max-w-5xl">
            {/* Breadcrumbs */}
            <Breadcrumbs items={breadcrumbItems} />

            {/* Hero Box */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 rounded-2xl blur-xl opacity-50 group-hover:opacity-100 transition duration-1000"></div>
              <div className="relative rounded-2xl border border-slate-800 bg-slate-900/60 p-8 backdrop-blur-xl">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                  {/* Logo - Premium Squircle */}
                  <div className="flex-shrink-0">
                    <div className="w-24 h-24 rounded-2xl bg-slate-950 flex items-center justify-center overflow-hidden shadow-2xl relative group/logo">
                      {tool.logo && tool.logo.startsWith('http') ? (
                        <Image
                          src={tool.logo}
                          alt={`${tool.name} logo`}
                          width={96}
                          height={96}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-3xl font-bold text-white uppercase italic">
                          {tool.logo || tool.name.charAt(0)}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex-1 text-center md:text-left">
                    <div className="flex flex-col md:flex-row items-center md:items-end gap-3 mb-3">
                      <h1 className="text-4xl md:text-5xl font-black text-white italic tracking-tight">
                        {tool.name}
                      </h1>
                      <div className="flex items-center gap-2 pb-1">
                        <span className="px-2 py-0.5 text-[10px] font-black bg-cyan-500/10 text-cyan-400 rounded-full border border-cyan-500/20 flex items-center gap-1">
                          <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                          Verified
                        </span>
                      </div>
                    </div>

                    <p className="text-xl text-slate-400 font-medium mb-6">
                      {tool.tagline}
                    </p>

                    <div className="flex flex-wrap justify-center md:justify-start items-center gap-6">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 text-sm font-black text-yellow-400 bg-yellow-400/10 px-2 py-1 rounded">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          {tool.rating}
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Expert Choice</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-300">{(tool.review_count ?? 0).toLocaleString()}</span>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">User Reviews</span>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <Link
                          href={`/tools/category/${categorySlug}`}
                          className="px-2 py-0.5 text-[10px] font-bold bg-slate-800 text-slate-400 rounded uppercase tracking-widest hover:bg-slate-700 transition-colors"
                        >
                          {tool.category}
                        </Link>
                        {toolTags.map((tag) => (
                          <TagBadge
                            key={tag.slug}
                            slug={tag.slug}
                            name={tag.name ?? ''}
                            icon={tag.icon ?? ''}
                            color={tag.color ?? ''}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 w-full md:w-auto">
                    <a
                      href={primaryCtaHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 px-8 py-4 text-center font-bold text-white shadow-lg shadow-cyan-500/25 transition-all hover:scale-105 active:scale-95"
                    >
                      Visit Website ↗
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>



        {/* In-Depth Review Section */}
        {(tool.review_intro || (reviewSections && reviewSections.length > 0)) && (
          <section className="px-4 py-16">
            <div className="mx-auto max-w-4xl">
              <h2 className="mb-6 text-3xl font-bold text-white">
                Our {tool.name} Review
              </h2>
              <div className="prose max-w-none prose-invert">
                {tool.review_intro && (
                  <p className="mb-6 leading-relaxed text-slate-300">
                    {tool.review_intro}
                  </p>
                )}
                {reviewSections &&
                  reviewSections.map((section) => (
                    <div key={section.id} className="mb-8">
                      <h3 className="mb-4 text-2xl font-bold text-white">
                        {section.title}
                      </h3>

                      {/* Section Image */}
                      {section.image_url && (
                        <div className="w-full mb-6 flex justify-center">
                          <Image
                            src={section.image_url}
                            alt={section.title}
                            width={1024}
                            height={576}
                            className="max-w-3xl w-full h-auto rounded-xl shadow-xl object-contain"
                          />
                        </div>
                      )}

                      <p className="leading-relaxed text-slate-300">
                        {section.content}
                      </p>
                    </div>
                  ))}
              </div>
            </div>
          </section>
        )}



        {/* Email OptIn */}
        <EmailOptInClient />

        {/* Key Features */}
        <ErrorBoundary>
          {features && features.length > 0 && (
            <section className="px-4 py-16">
              <div className="mx-auto max-w-6xl">
                <h2 className="mb-3 text-center text-3xl font-bold text-white">
                  Key Features
                </h2>
                <p className="mb-10 text-center text-slate-400">
                  Everything you need to know about {tool.name}
                </p>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {(features as FeatureRecord[]).map((feature) => (
                    <div
                      key={feature.id}
                      className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 transition hover:border-purple-500/50"
                    >
                      {feature.icon && feature.icon.length <= 4 && (
                        <div className="mb-3 text-3xl">{feature.icon}</div>
                      )}

                      <h3 className="mb-2 text-lg font-bold text-white">
                        {feature.title}
                      </h3>
                      <p className="text-sm leading-relaxed text-slate-400">
                        {feature.description}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-10 text-center">
                  <a
                    href={primaryCtaHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 px-8 py-4 text-lg font-semibold text-white transition hover:from-purple-500 hover:to-indigo-500"
                  >
                    Try {tool.name} Now →
                  </a>
                </div>
              </div>
            </section>
          )}
        </ErrorBoundary>

        {/* Integrations Section - Compact Layout */}
        <ErrorBoundary>
          {integrations && integrations.length > 0 && (
            <section className="px-4 py-16 border-t border-slate-800/50">
              <div className="mx-auto max-w-5xl">
                <h2 className="mb-3 text-center text-3xl font-bold text-white">
                  Integrations
                </h2>
                <p className="mb-10 text-center text-slate-400">
                  {tool.name} works seamlessly with your favorite tools
                </p>

                <div className="flex flex-wrap gap-3 justify-center">
                  {(integrations as IntegrationRecord[]).map((integration) => (
                    <div
                      key={integration.id}
                      className="group flex items-center gap-3 px-4 py-2 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-800/80 transition-all duration-300"
                    >
                      <div className="relative w-6 h-6 rounded flex-shrink-0 bg-slate-950 border border-white/5 flex items-center justify-center overflow-hidden">
                        {integration.integration_logo ? (
                          <Image
                            src={integration.integration_logo}
                            alt={integration.integration_name}
                            fill
                            className="object-contain p-1"
                          />
                        ) : (
                          <span className="text-[10px] font-black text-slate-500">{integration.integration_name.charAt(0)}</span>
                        )}
                      </div>
                      <span className="text-sm font-bold text-slate-300 group-hover:text-white transition-colors">
                        {integration.integration_name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}
        </ErrorBoundary>

        {/* Pricing Section */}
        <ErrorBoundary>
          {pricingPlans && pricingPlans.length > 0 && (
            <section className="px-4 py-16 bg-slate-950/50">
              <div className="mx-auto max-w-6xl">
                <h2 className="mb-3 text-center text-3xl font-bold text-white">
                  {tool.name} Pricing
                </h2>
                <p className="mb-10 text-center text-slate-400">
                  Choose the plan that fits your needs
                </p>

                <div className="grid gap-6 md:grid-cols-3">
                  {(pricingPlans as PricingPlanRecord[]).map((plan) => (
                    <div
                      key={plan.id}
                      className={`relative rounded-2xl border transition-all duration-500 ${plan.is_popular
                        ? 'border-cyan-500/50 bg-slate-900/80 shadow-2xl shadow-cyan-500/10 scale-[1.02] z-10'
                        : 'border-slate-800 bg-slate-900/40 hover:border-slate-700'
                        } p-6 overflow-hidden group`}
                    >
                      {plan.is_popular === true && (
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-blue-500" />
                      )}

                      <div className="mb-6 text-center">
                        <h3 className="mb-3 text-sm font-black text-slate-400 group-hover:text-cyan-400 transition-colors uppercase tracking-[0.2em] italic">
                          {plan.plan_name}
                        </h3>
                        <div className="flex flex-col gap-1 italic">
                          <div className="flex items-baseline justify-center gap-1">
                            {plan.price !== null ? (
                              <>
                                <span className="text-3xl md:text-4xl font-black text-white tracking-tighter">
                                  ${plan.price}
                                </span>
                                {plan.period !== 'one-time' && (
                                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                    / {plan.period}
                                  </span>
                                )}
                              </>
                            ) : (
                              <span className="text-2xl font-black text-white tracking-tight uppercase">
                                {plan.price_label || 'Contact'}
                              </span>
                            )}
                          </div>

                          {plan.price_label && plan.price !== null && (
                            <div className="mt-1 text-[10px] font-black text-cyan-400/80 uppercase tracking-widest italic">
                              {plan.price_label}
                            </div>
                          )}
                        </div>
                      </div>

                      <ul className="mb-8 space-y-3">
                        {plan.features &&
                          Array.isArray(plan.features) &&
                          plan.features.map((feature, j) => (
                            <li
                              key={j}
                              className="flex items-start gap-2.5 text-xs font-bold text-slate-400 transition-colors group-hover:text-slate-300"
                            >
                              <span className="mt-0.5 flex-shrink-0 w-4 h-4 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-400 text-[10px] font-black">
                                ✓
                              </span>
                              <span>{feature}</span>
                            </li>
                          ))}
                      </ul>

                      <a
                        href={primaryCtaHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`block w-full rounded-xl px-4 py-3 text-center font-black text-[10px] uppercase tracking-[0.2em] transition-all italic ${plan.is_popular
                          ? 'bg-gradient-to-r from-cyan-500/80 to-blue-600/80 text-white shadow-lg shadow-cyan-500/20 hover:scale-[1.02] active:scale-95'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                          }`}
                      >
                        Select Plan ↗
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Pros & Cons */}
          {((pros && pros.length > 0) || (cons && cons.length > 0)) && (
            <section className="px-4 py-16 bg-slate-950/50">
              <div className="mx-auto max-w-5xl">
                <h2 className="mb-10 text-center text-3xl font-bold text-white">
                  Pros & Cons
                </h2>

                <div className="grid gap-8 md:grid-cols-2">
                  {/* Pros */}
                  {pros && pros.length > 0 && (
                    <div className="relative rounded-3xl border border-emerald-900/30 bg-slate-900/40 p-8 backdrop-blur-sm group hover:border-emerald-500/30 transition-all">
                      <div className="absolute top-0 left-8 px-3 py-1 bg-emerald-500 rounded-b-lg text-[10px] font-black uppercase text-slate-950 tracking-widest">Pros</div>
                      <ul className="mt-4 space-y-4">
                        {(pros as ProRecord[]).map((pro) => (
                          <li
                            key={pro.id}
                            className="flex items-start gap-3 text-sm font-medium text-slate-400 group-hover:text-slate-300 transition-colors"
                          >
                            <span className="mt-1 flex-shrink-0 w-4 h-4 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 text-[10px] font-black">
                              ✓
                            </span>
                            <span>{pro.text}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Cons */}
                  {cons && cons.length > 0 && (
                    <div className="relative rounded-3xl border border-red-900/30 bg-slate-900/40 p-8 backdrop-blur-sm group hover:border-red-500/30 transition-all">
                      <div className="absolute top-0 left-8 px-3 py-1 bg-red-500 rounded-b-lg text-[10px] font-black uppercase text-slate-950 tracking-widest">Cons</div>
                      <ul className="mt-4 space-y-4">
                        {(cons as ConRecord[]).map((con) => (
                          <li
                            key={con.id}
                            className="flex items-start gap-4 text-sm font-medium text-slate-400 group-hover:text-slate-300 transition-colors"
                          >
                            <span className="mt-1 flex-shrink-0 w-4 h-4 rounded-full bg-red-500/10 flex items-center justify-center text-red-400 text-[10px] font-black">
                              ✕
                            </span>
                            <span>{con.text}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </section>
          )}
        </ErrorBoundary>

        {/* FAQ Section */}
        {faqs && faqs.length > 0 && (
          <section className="px-4 py-16">
            <div className="mx-auto max-w-3xl">
              <h2 className="mb-3 text-center text-3xl font-bold text-white">
                Frequently Asked Questions
              </h2>
              <p className="mb-10 text-center text-slate-400">
                Everything you need to know about {tool.name}
              </p>

              <div className="space-y-4">
                <FAQAccordion faqs={faqs as FaqRecord[]} />
              </div>
            </div>
          </section>
        )}

        {/* Custom Battle Section */}
        <section className="px-4 py-16 bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950 border-y border-white/5 relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-white/5 bg-[size:32px_32px] [mask-image:radial-gradient(white,transparent_85%)] pointer-events-none" />
          <div className="mx-auto max-w-4xl relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/20 mb-6">
              <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest">Live Battle Engine</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-white italic tracking-tight mb-6">
              Is <span className="text-cyan-400">{tool.name}</span> the best fit for you?
            </h2>
            <p className="text-lg text-slate-400 mb-10 max-w-2xl mx-auto">
              Put it to the test. Compare {tool.name} side-by-side with any other AI agent in our database to find your perfect match.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href={`/tools?compare=true&preselect=${tool.slug}`}
                className="px-8 py-4 rounded-xl bg-white text-slate-950 font-black uppercase tracking-wider transition-all hover:bg-cyan-400 hover:scale-105 active:scale-95 shadow-xl text-center"
              >
                Compare {tool.name} 🆚
              </Link>
              <Link
                href="/tools?compare=true"
                className="px-8 py-4 rounded-xl border border-white/20 text-white font-bold transition-all hover:bg-white/10 text-center"
              >
                Select Other Tools
              </Link>
            </div>
          </div>
        </section>

        {/* Comparison Table */}
        <ErrorBoundary>
          {comparisons && comparisons.length > 0 && (
            <section className="bg-slate-950/50 px-4 py-16">
              <div className="mx-auto max-w-6xl">
                <h2 className="mb-8 text-center text-3xl font-bold text-white">
                  {tool.name} vs Competitors
                </h2>

                <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/40 backdrop-blur-sm overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-800/50">
                        <th className="p-5 text-xs font-black uppercase tracking-[0.2em] text-slate-500 border-b border-slate-800">Feature</th>
                        <th className="p-5 text-xs font-black uppercase tracking-[0.2em] text-cyan-400 border-b border-slate-800">{tool.name}</th>
                        {(comparisons as ComparisonRow[])[0]?.competitor_1_name && (
                          <th className="p-5 text-xs font-black uppercase tracking-[0.2em] text-white border-b border-slate-800">
                            {(comparisons as ComparisonRow[])[0].competitor_1_name}
                          </th>
                        )}
                        {(comparisons as ComparisonRow[])[0]?.competitor_2_name && (
                          <th className="p-5 text-xs font-black uppercase tracking-[0.2em] text-white border-b border-slate-800">
                            {(comparisons as ComparisonRow[])[0].competitor_2_name}
                          </th>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {(comparisons as ComparisonRow[]).map((row) => (
                        <tr key={row.id} className="group hover:bg-slate-800/30 transition-colors">
                          <td className="p-5 text-sm font-bold text-slate-400 group-hover:text-slate-300 border-b border-slate-800/50">{row.feature_name}</td>
                          <td className="p-5 text-sm font-black text-cyan-400 border-b border-slate-800/50 italic">{row.this_tool_value}</td>
                          {row.competitor_1_value && (
                            <td className="p-5 text-sm font-medium text-slate-500 group-hover:text-slate-400 border-b border-slate-800/50">{row.competitor_1_value}</td>
                          )}
                          {row.competitor_2_value && (
                            <td className="p-5 text-sm font-medium text-slate-500 group-hover:text-slate-400 border-b border-slate-800/50">{row.competitor_2_value}</td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          )}

          {/* Alternatives */}
          {alternatives && alternatives.length > 0 && (
            <section className="bg-gradient-to-b from-slate-900/50 to-slate-950/80 px-4 py-16">
              <div className="mx-auto max-w-5xl">
                <div className="mb-16 text-center">
                  <h2 className="mb-4 bg-gradient-to-r from-white to-slate-200 bg-clip-text text-3xl font-bold text-transparent md:text-4xl">
                    Explore Top Alternatives
                  </h2>
                  <p className="mx-auto max-w-2xl text-lg text-slate-400">
                    See how {tool.name} compares to other leading AI tools
                  </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {(alternatives as AlternativeRecord[]).map((alt) => (
                    <Link
                      key={alt.id}
                      href={`/tools/${alt.alternative_slug}`}
                      className="group relative h-full rounded-3xl border border-slate-800/50 bg-gradient-to-br from-slate-900/80 via-slate-800/50 to-slate-900/80 p-8 backdrop-blur-xl transition-all duration-500 hover:-translate-y-3 hover:scale-[1.02] hover:border-cyan-500/60 hover:shadow-2xl hover:shadow-cyan-500/20"
                    >
                      <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-cyan-500/0 via-cyan-500/5 to-indigo-500/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                      <div className="relative z-10">
                        <h3 className="mb-4 text-2xl font-bold text-white transition-all duration-300 group-hover:text-cyan-400">
                          {alt.alternative_name}
                        </h3>
                        <p className="leading-relaxed text-slate-300 transition-colors group-hover:text-slate-200">
                          {alt.reason}
                        </p>
                      </div>

                      <div className="absolute bottom-6 right-6 h-8 w-8 translate-y-2 rotate-45 border-b-2 border-r-2 border-white/30 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:rotate-0 group-hover:border-cyan-400 group-hover:opacity-100" />
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Getting Started Steps (Workflow) */}
          {tool.workflow_steps &&
            Array.isArray(tool.workflow_steps) &&
            tool.workflow_steps.length > 0 && (
              <section className="px-4 py-16 bg-slate-950/50">
                <div className="mx-auto max-w-4xl">
                  <h2 className="mb-3 text-center text-3xl font-bold text-white">
                    How to Get Started with {tool.name}
                  </h2>
                  <p className="mb-10 text-center text-slate-400">
                    Follow these simple steps to start using {tool.name}
                  </p>

                  <div className="flex flex-col gap-4 max-w-2xl mx-auto">
                    {tool.workflow_steps.map((step, i) => (
                      <div
                        key={i}
                        className="group flex items-center gap-6 rounded-2xl border border-slate-800 bg-slate-900/60 p-5 hover:border-cyan-500/30 transition-all hover:bg-slate-900 duration-500"
                      >
                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-slate-950 border border-slate-800 font-black text-cyan-400 group-hover:text-white group-hover:bg-cyan-500 transition-all duration-500 italic">
                          0{i + 1}
                        </div>
                        <p className="flex-1 text-sm font-bold text-slate-400 tracking-tight group-hover:text-slate-200 transition-colors">
                          {step}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}
        </ErrorBoundary>

        {/* Final CTA */}
        <section className="border-t border-slate-800 bg-gradient-to-r from-slate-900 to-slate-800 px-4 py-16">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
              Ready to try {tool.name}?
            </h2>
            <p className="mb-8 text-lg text-slate-300">
              Join thousands of users leveraging {tool.name} to enhance their workflow.
            </p>
            <a
              href={primaryCtaHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block rounded-lg bg-gradient-to-r from-cyan-500 to-indigo-500 px-10 py-4 text-lg font-semibold text-white shadow-lg shadow-cyan-500/30 transition hover:from-cyan-400 hover:to-indigo-400"
            >
              Start Your Free Trial Today →
            </a>
            <p className="mt-4 text-sm text-slate-500">
              No credit card required • 7-day free trial
            </p>
          </div>
        </section>

        {/* ✅ USER REVIEWS SECTION - LUXURY UPGRADE */}
        <section className="px-4 py-24 bg-slate-950 relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-slate-800 to-transparent"></div>
          <div className="mx-auto max-w-4xl relative">
            <div className="text-center mb-16">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-cyan-500 mb-4 inline-block">Community Insights</span>
              <h2 className="text-4xl font-black text-white italic tracking-tight">What Real Users Think</h2>
              <div className="mt-4 flex justify-center items-center gap-2">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-sm font-bold text-slate-400">Based on {(tool.review_count ?? 0).toLocaleString()} reviews</span>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-900 bg-slate-900/20 p-8 backdrop-blur-xl">
              <CommentsSection
                contentId={tool.id}
                contentType="tool"
                comments={(comments || []) as any[]}
              />
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
