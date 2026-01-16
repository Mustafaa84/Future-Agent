import Link from 'next/link'
import JsonLd from '@/components/SEO/JsonLd'
import TagBadge from '@/components/TagBadge'
import dynamic from 'next/dynamic'
import { generateProductSchema, generateBreadcrumbSchema, generateFAQSchema } from '@/lib/seo/schemas'

const EmailOptInClient = dynamic(() => import('./EmailOptInClient'))

interface ToolReviewProps {
  tool: {
    name: string
    tagline: string
    rating: number
    reviewCount: number
    logo: string
    description: string
    affiliateUrl: string
    category: string
    lastUpdated?: string
    tags?: string[]
    reviewContent: {
      intro: string
      sections: Array<{
        title: string
        content: string
      }>
    }
    pricing: Array<{
      plan: string
      price: number | string
      period: string
      features: string[]
      popular?: boolean
    }>
    pros: string[]
    cons: string[]
    features: Array<{
      title: string
      description: string
      icon?: string
    }>
    faq: Array<{
      question: string
      answer: string
    }>
    alternatives?: Array<{
      name: string
      slug: string
      reason: string
    }>
    workflowSteps?: string[]
    comparisonTable?: Array<{
      feature: string
      [key: string]: string
    }>
  }
  slug: string
}

export default function ToolReviewTemplate({ tool, slug }: ToolReviewProps) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://futureagent.com'
  const toolUrl = `${siteUrl}/tools/${slug}`

  // Generate schemas
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: siteUrl },
    { name: 'Tools', url: `${siteUrl}/tools` },
    { name: tool.name, url: toolUrl },
  ])

  const productSchema = generateProductSchema({
    name: tool.name,
    description: tool.description,
    image: `${siteUrl}/images/tools/${slug}.jpg`,
    url: toolUrl,
    price: typeof tool.pricing[0]?.price === 'number' ? tool.pricing[0].price : undefined,
    ratingValue: tool.rating,
    reviewCount: tool.reviewCount,
    features: tool.features.map((f) => f.title),
  })

  const faqSchema = generateFAQSchema(tool.faq)

  const tagData: Record<string, { name: string; icon: string; color: string }> = {
    paid: { name: 'Paid', icon: '💎', color: 'purple' },
    free: { name: 'Free', icon: '🆓', color: 'green' },
    'beginner-friendly': { name: 'Beginner Friendly', icon: '👋', color: 'blue' },
    'content-creation': { name: 'Content Creation', icon: '✍️', color: 'indigo' },
    seo: { name: 'SEO', icon: '🔍', color: 'cyan' },
    marketing: { name: 'Marketing', icon: '📢', color: 'pink' },
  }

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={productSchema} />
      <JsonLd data={faqSchema} />

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

            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-8">
              <div className="mb-6 flex items-start gap-6">
                <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-purple-800 text-4xl">
                  {tool.logo}
                </div>
                <div className="flex-1">
                  <h1 className="mb-2 text-4xl font-bold text-white">{tool.name}</h1>
                  <p className="mb-4 text-lg text-slate-400">{tool.tagline}</p>

                  <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-lg text-yellow-400">★★★★★</span>
                      <span className="font-semibold text-white">{tool.rating}</span>
                    </div>
<span className="text-sm text-slate-400">
  ({(tool.reviewCount ?? 0).toLocaleString()} reviews)
</span>

                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-purple-600/20 px-3 py-1 text-xs font-semibold text-purple-300">
                        {tool.category}
                      </span>
                      {tool.tags?.map((tagSlug) => {
                        const tag = tagData[tagSlug]
                        if (!tag) return null
                        return (
                          <TagBadge
                            key={tagSlug}
                            slug={tagSlug}
                            name={tag.name}
                            icon={tag.icon}
                            color={tag.color}
                          />
                        )
                      })}
                    </div>
                  </div>

                  {tool.lastUpdated && (
                    <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-slate-400">
                      <span>📅 Last reviewed: {tool.lastUpdated}</span>
                    </div>
                  )}
                </div>
              </div>

              <p className="mb-6 leading-relaxed text-slate-300">{tool.description}</p>

              <div className="flex flex-col gap-3 sm:flex-row">
                <a
                  href={tool.affiliateUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg bg-gradient-to-r from-cyan-500 to-indigo-500 px-6 py-3 text-center font-semibold text-white transition hover:from-cyan-400 hover:to-indigo-400"
                >
                  Try {tool.name} Free →
                </a>
                <a
                  href={tool.affiliateUrl}
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

        {/* In-Depth Review */}
        <section className="px-4 py-16">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-6 text-3xl font-bold text-white">Our {tool.name} Review</h2>
            <div className="prose max-w-none prose-invert">
              <p className="mb-6 leading-relaxed text-slate-300">{tool.reviewContent.intro}</p>
              {tool.reviewContent.sections.map((section, i) => (
                <div key={i} className="mb-8">
                  <h3 className="mb-4 text-2xl font-bold text-white">{section.title}</h3>
                  <p className="leading-relaxed text-slate-300">{section.content}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <EmailOptInClient />

        {/* Pricing */}
        <section className="px-4 py-16">
          <div className="mx-auto max-w-6xl">
            <h2 className="mb-3 text-center text-3xl font-bold text-white">
              {tool.name} Pricing
            </h2>
            <p className="mb-10 text-center text-slate-400">
              Choose the plan that fits your needs
            </p>

            <div className="grid gap-6 md:grid-cols-3">
              {tool.pricing.map((plan, i) => (
                <div
                  key={i}
                  className={`relative rounded-xl border p-6 bg-slate-900/60 ${
                    plan.popular ? 'border-cyan-500 scale-105' : 'border-slate-800'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-cyan-500 px-4 py-1 text-xs font-bold text-slate-950">
                      MOST POPULAR
                    </div>
                  )}

                  <div className="mb-6 text-center">
                    <h3 className="mb-3 text-xl font-bold text-white">{plan.plan}</h3>
                    <div className="mb-4">
                      {typeof plan.price === 'number' ? (
                        <>
                          <span className="text-4xl font-bold text-white">${plan.price}</span>
                          <span className="text-sm text-slate-400">/{plan.period}</span>
                        </>
                      ) : (
                        <span className="text-3xl font-bold text-white">{plan.price}</span>
                      )}
                    </div>
                  </div>

                  <ul className="mb-6 space-y-3">
                    {plan.features.map((feature, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm text-slate-300">
                        <span className="mt-0.5 flex-shrink-0 text-cyan-400">✓</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <a
                    href={tool.affiliateUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`block w-full rounded-lg px-6 py-3 text-center font-semibold text-white transition ${
                      plan.popular
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

        {/* Pros & Cons */}
        <section className="bg-slate-950/50 px-4 py-16">
          <div className="mx-auto max-w-5xl">
            <h2 className="mb-10 text-center text-3xl font-bold text-white">Pros & Cons</h2>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-xl border border-green-800/50 bg-green-900/20 p-6">
                <h3 className="mb-4 flex items-center gap-2 text-xl font-bold text-green-400">
                  <span className="text-2xl">✓</span> Pros
                </h3>
                <ul className="space-y-3">
                  {tool.pros.map((pro, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-slate-300">
                      <span className="mt-0.5 font-bold text-green-400">+</span>
                      <span>{pro}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl border border-red-800/50 bg-red-900/20 p-6">
                <h3 className="mb-4 flex items-center gap-2 text-xl font-bold text-red-400">
                  <span className="text-2xl">✗</span> Cons
                </h3>
                <ul className="space-y-3">
                  {tool.cons.map((con, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-slate-300">
                      <span className="mt-0.5 font-bold text-red-400">-</span>
                      <span>{con}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Key Features */}
        <section className="px-4 py-16">
          <div className="mx-auto max-w-6xl">
            <h2 className="mb-3 text-center text-3xl font-bold text-white">Key Features</h2>
            <p className="mb-10 text-center text-slate-400">
              Everything you need to create amazing content
            </p>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {tool.features.map((feature, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 transition hover:border-purple-500/50"
                >
                  <h3 className="mb-2 text-lg font-bold text-white">{feature.title}</h3>
                  <p className="text-sm leading-relaxed text-slate-400">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-10 text-center">
              <a
                href={tool.affiliateUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 px-8 py-4 text-lg font-semibold text-white transition hover:from-purple-500 hover:to-indigo-500"
              >
                Start Your Free Trial →
              </a>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="bg-slate-950/50 px-4 py-16">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-3 text-center text-3xl font-bold text-white">
              Frequently Asked Questions
            </h2>
            <p className="mb-10 text-center text-slate-400">
              Everything you need to know about {tool.name}
            </p>

            <div className="space-y-4">
              {tool.faq.map((item, i) => (
                <div key={i} className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
                  <h3 className="mb-2 text-lg font-semibold text-white">{item.question}</h3>
                  <p className="leading-relaxed text-slate-400">{item.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Comparison Table */}
        {tool.comparisonTable && tool.comparisonTable.length > 0 && (
          <section className="bg-slate-950/50 px-4 py-16">
            <div className="mx-auto max-w-5xl">
              <h2 className="mb-8 text-center text-3xl font-bold text-white">
                {tool.name} vs Top Alternatives
              </h2>

              <div className="overflow-x-auto">
                <table className="w-full rounded-xl border border-slate-800 bg-slate-900/60">
                  <thead>
                    <tr>
                      <th className="border-b border-slate-700 p-4 text-left text-sm font-semibold text-white">
                        Feature
                      </th>
                      {Object.keys(tool.comparisonTable[0])
                        .filter((key) => key !== 'feature')
                        .map((toolName, i) => (
                          <th
                            key={i}
                            className="border-b border-slate-700 p-4 text-left text-sm font-semibold text-white capitalize"
                          >
                            {toolName
                              .replace(/-/g, ' ')
                              .replace(/\b\w/g, (l) => l.toUpperCase())}
                          </th>
                        ))}
                    </tr>
                  </thead>
                  <tbody>
                    {tool.comparisonTable.map((row, i) => (
                      <tr key={i} className="border-b border-slate-800 last:border-b-0">
                        <td className="p-4 text-sm font-medium text-slate-300">{row.feature}</td>
                        {Object.keys(row)
                          .filter((key) => key !== 'feature')
                          .map((toolName, j) => (
                            <td key={j} className="p-4 text-sm font-semibold text-slate-200">
                              {row[toolName]}
                            </td>
                          ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

        {/* Alternatives */}
        {tool.alternatives && tool.alternatives.length > 0 && (
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
                {tool.alternatives.map((alt, i) => (
                  <a
                    key={i}
                    href={`/tools/${alt.slug}`}
                    className="group relative h-full rounded-3xl border border-slate-800/50 bg-gradient-to-br from-slate-900/80 via-slate-800/50 to-slate-900/80 p-8 backdrop-blur-xl transition-all duration-500 hover:-translate-y-3 hover:scale-[1.02] hover:border-cyan-500/60 hover:shadow-2xl hover:shadow-cyan-500/20"
                  >
                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-cyan-500/0 via-cyan-500/5 to-indigo-500/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                    <div className="absolute top-4 right-4 h-24 w-24 -translate-x-4 translate-y-4 rounded-2xl bg-gradient-to-l from-white/20 to-transparent opacity-0 transition-all duration-700 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100" />

                    <div className="relative z-10">
                      <h3 className="mb-4 bg-gradient-to-r from-transparent via-white/20 to-transparent bg-clip-text text-2xl font-bold text-white transition-all duration-300 group-hover:from-cyan-400 group-hover:text-cyan-400">
                        {alt.name}
                      </h3>
                      <p className="leading-relaxed text-slate-300 transition-colors group-hover:text-slate-200">
                        {alt.reason}
                      </p>
                    </div>

                    <div className="absolute bottom-6 right-6 h-8 w-8 translate-y-2 rotate-45 border-b-2 border-r-2 border-white/30 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:rotate-0 group-hover:border-cyan-400 group-hover:opacity-100" />
                  </a>
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
              Join thousands of businesses using {tool.name} to create better content faster.
            </p>
            <a
              href={tool.affiliateUrl}
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
