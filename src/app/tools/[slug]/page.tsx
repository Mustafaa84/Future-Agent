import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
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

const EmailOptInClient = dynamic(() => import('@/components/EmailOptInClient'))

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
    { data: pricingPlans },
    { data: pros },
    { data: cons },
    { data: features },
    { data: faqs },
    { data: alternatives },
    { data: comparisons },
    { data: reviewData },
  ] = await Promise.all([
    supabase
      .from('tool_pricing_plans')
      .select('*')
      .eq('tool_id', tool.id)
      .order('sort_order', { ascending: true }),
    supabase
      .from('tool_pros')
      .select('*')
      .eq('tool_id', tool.id)
      .order('sort_order', { ascending: true }),
    supabase
      .from('tool_cons')
      .select('*')
      .eq('tool_id', tool.id)
      .order('sort_order', { ascending: true }),
    supabase
      .from('tool_features')
      .select('*')
      .eq('tool_id', tool.id)
      .order('sort_order', { ascending: true }),
    supabase
      .from('tool_faqs')
      .select('*')
      .eq('tool_id', tool.id)
      .order('sort_order', { ascending: true }),
    supabase
      .from('tool_alternatives')
      .select('*')
      .eq('tool_id', tool.id)
      .order('sort_order', { ascending: true }),
    supabase
      .from('tool_comparisons')
      .select('*')
      .eq('tool_id', tool.id)
      .order('sort_order', { ascending: true }),
    supabase
      .from('tool_reviews')
      .select('id, intro')
      .eq('tool_id', tool.id)
      .single<{ id: string; intro: string | null }>(),
  ])

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

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: siteUrl },
    { name: 'Tools', url: `${siteUrl}/tools` },
    { name: tool.name, url: toolUrl },
  ])

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
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={productSchema} />
      {faqSchema && <JsonLd data={faqSchema} />}

      <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900">
        {/* Hero Section */}
        <section className="px-4 pt-12 pb-16 border-b border-slate-800">
          <div className="mx-auto max-w-5xl">
            {/* Breadcrumb */}
            <div className="mb-6 flex items-center gap-2 text-sm text-slate-400">
              <Link href="/" className="transition hover:text-cyan-400">
                Home
              </Link>
              <span>/</span>
              <Link href="/tools" className="transition hover:text-cyan-400">
                Tools
              </Link>
              <span>/</span>
              <span className="text-white">{tool.name}</span>
            </div>

            {/* Hero Box */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-8">
              <div className="mb-6 flex items-start gap-6">
                {/* Logo */}
                <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-purple-800 text-4xl overflow-hidden">
                  {tool.logo && tool.logo.startsWith('http') ? (
                    <Image
                      src={tool.logo}
                      alt={`${tool.name} logo`}
                      width={80}
                      height={80}
                      className="h-full w-full object-contain"
                    />
                  ) : tool.logo ? (
                    <span>{tool.logo}</span>
                  ) : (
                    <span>{tool.name.charAt(0).toUpperCase()}</span>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h1 className="mb-2 text-4xl font-bold text-white">
                    {tool.name}
                  </h1>
                  <p className="mb-4 text-lg text-slate-400">
                    {tool.tagline}
                  </p>

                  {/* Rating & Category */}
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-lg text-yellow-400">★★★★★</span>
                      <span className="font-semibold text-white">
                        {tool.rating}
                      </span>
                    </div>
                    <span className="text-sm text-slate-400">
                      {(tool.review_count ?? 0).toLocaleString()} reviews
                    </span>

                    {/* Category & Tags */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-purple-600/20 px-3 py-1 text-xs font-semibold text-purple-300">
                        {tool.category}
                      </span>
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
              </div>

              {/* Description */}
              <p className="mb-6 leading-relaxed text-slate-300">
                {tool.description}
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col gap-3 sm:flex-row">
                <a
                  href={primaryCtaHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg bg-gradient-to-r from-cyan-500 to-indigo-500 px-6 py-3 text-center font-semibold text-white transition hover:from-cyan-400 hover:to-indigo-400"
                >
                  Try {tool.name} Free →
                </a>
                <a
                  href={primaryCtaHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg bg-slate-800 px-6 py-3 text-center font-semibold text-white transition hover:bg-slate-700"
                >
                  View Pricing
                </a>
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

        {/* Pricing Section */}
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
                    className={`relative rounded-xl border p-6 bg-slate-900/60 transition hover:scale-105 ${
                      plan.is_popular ? 'border-cyan-500 scale-105' : 'border-slate-800'
                    }`}
                  >
                    {plan.is_popular === true && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-cyan-500 px-4 py-1 text-xs font-bold text-slate-950">
                        MOST POPULAR
                      </div>
                    )}

                    <div className="mb-6 text-center">
                      <h3 className="mb-3 text-xl font-bold text-white">
                        {plan.plan_name}
                      </h3>
                      <div className="mb-4">
                        {/* Main price */}
                        <div className="flex items-baseline justify-center gap-1">
                          {plan.price !== null ? (
                            <>
                              <span className="text-4xl font-bold text-white">
                                ${plan.price}
                              </span>
                              {plan.period !== 'one-time' && (
                                <span className="text-sm text-slate-300">
                                  / {plan.period}
                                </span>
                              )}
                            </>
                          ) : (
                            <span className="text-3xl font-bold text-white">
                              {plan.price_label || 'Contact'}
                            </span>
                          )}
                        </div>

                        {/* Price label as small boxed note */}
                        {plan.price_label && plan.price !== null && (
                          <div className="mt-2 inline-flex rounded-full border border-slate-600 bg-slate-800/70 px-3 py-1 text-xs font-medium text-slate-200">
                            {plan.price_label}
                          </div>
                        )}
                      </div>
                    </div>

                    <ul className="mb-6 space-y-3">
                      {plan.features &&
                        Array.isArray(plan.features) &&
                        plan.features.map((feature, j) => (
                          <li
                            key={j}
                            className="flex items-start gap-2 text-sm text-slate-300"
                          >
                            <span className="mt-0.5 flex-shrink-0 text-cyan-400">
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
                      className={`block w-full rounded-lg px-6 py-3 text-center font-semibold text-white transition ${
                        plan.is_popular
                          ? 'bg-cyan-500 hover:bg-cyan-400'
                          : 'bg-slate-800 hover:bg-slate-700'
                      }`}
                    >
                      Get Started
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

              <div className="grid gap-6 md:grid-cols-2">
                {/* Pros */}
                {pros && pros.length > 0 && (
                  <div className="rounded-xl border border-green-800/50 bg-green-900/20 p-6">
                    <h3 className="mb-4 flex items-center gap-2 text-xl font-bold text-green-400">
                      <span className="text-2xl">✓</span> Pros
                    </h3>
                    <ul className="space-y-3">
                      {(pros as ProRecord[]).map((pro) => (
                        <li
                          key={pro.id}
                          className="flex items-start gap-3 text-sm text-slate-300"
                        >
                          <span className="mt-0.5 font-bold text-green-400">
                            +
                          </span>
                          <span>{pro.text}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Cons */}
                {cons && cons.length > 0 && (
                  <div className="rounded-xl border border-red-800/50 bg-red-900/20 p-6">
                    <h3 className="mb-4 flex items-center gap-2 text-xl font-bold text-red-400">
                      <span className="text-2xl">✗</span> Cons
                    </h3>
                    <ul className="space-y-3">
                      {(cons as ConRecord[]).map((con) => (
                        <li
                          key={con.id}
                          className="flex items-start gap-3 text-sm text-slate-300"
                        >
                          <span className="mt-0.5 font-bold text-red-400">
                            -
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
                {(faqs as FaqRecord[]).map((faq) => (
                  <div
                    key={faq.id}
                    className="rounded-xl border border-slate-800 bg-slate-900/60 p-6"
                  >
                    <h3 className="mb-2 text-lg font-semibold text-white">
                      {faq.question}
                    </h3>
                    <p className="leading-relaxed text-slate-400">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Comparison Table */}
        {comparisons && comparisons.length > 0 && (
          <section className="bg-slate-950/50 px-4 py-16">
            <div className="mx-auto max-w-6xl">
              <h2 className="mb-8 text-center text-3xl font-bold text-white">
                {tool.name} vs Competitors
              </h2>

              <div className="overflow-x-auto">
                <table className="w-full rounded-xl border border-slate-800 bg-slate-900/60">
                  <thead>
                    <tr className="border-b border-slate-700">
                      <th className="p-4 text-left text-sm font-semibold text-white">
                        Feature
                      </th>
                      <th className="p-4 text-left text-sm font-semibold text-cyan-400">
                        {tool.name}
                      </th>
                      {(comparisons as ComparisonRow[])[0]
                        ?.competitor_1_name && (
                        <th className="p-4 text-left text-sm font-semibold text-white">
                          {
                            (comparisons as ComparisonRow[])[0]
                              .competitor_1_name
                          }
                        </th>
                      )}
                      {(comparisons as ComparisonRow[])[0]
                        ?.competitor_2_name && (
                        <th className="p-4 text-left text-sm font-semibold text-white">
                          {
                            (comparisons as ComparisonRow[])[0]
                              .competitor_2_name
                          }
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {(comparisons as ComparisonRow[]).map((row) => (
                      <tr
                        key={row.id}
                        className="border-b border-slate-800 last:border-b-0"
                      >
                        <td className="p-4 text-sm font-medium text-slate-300">
                          {row.feature_name}
                        </td>
                        <td className="p-4 text-sm font-semibold text-cyan-400">
                          {row.this_tool_value}
                        </td>
                        {row.competitor_1_value && (
                          <td className="p-4 text-sm text-slate-200">
                            {row.competitor_1_value}
                          </td>
                        )}
                        {row.competitor_2_value && (
                          <td className="p-4 text-sm text-slate-200">
                            {row.competitor_2_value}
                          </td>
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

                <div className="space-y-4">
                  {tool.workflow_steps.map((step, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-4 rounded-xl border border-slate-800 bg-slate-900/60 p-6"
                    >
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-indigo-500 font-bold text-white">
                        {i + 1}
                      </div>
                      <p className="flex-1 pt-2 text-slate-300">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

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
      </div>
    </>
  )
}
