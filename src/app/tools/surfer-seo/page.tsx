import { Metadata } from 'next'
import ToolReviewTemplate from '@/components/ToolReviewTemplate'

const surferSeoTool = {
  name: 'Surfer SEO',
  tagline: 'Data-driven on-page SEO platform with content scoring and SERP analysis.',
  rating: 4.6,
  reviewCount: 320,
  logo: 'S',
  description:
    'Surfer SEO is an on-page optimization platform that analyzes top-ranking pages and provides data-backed guidelines. Content teams use its Content Editor, SERP Analyzer, and audit tools to create articles that align with what already ranks on Google, improving rankings through structured on-page improvements.',
  affiliateUrl: 'https://surferseo.com',
  category: 'SEO & Content Optimization',
  tags: ['seo', 'content-creation'],
  reviewContent: {
    intro:
      'Surfer SEO takes a data-first approach to on-page optimization by reverse-engineering what already works in search results. Instead of generic SEO checklists, it analyzes live SERPs to give you specific recommendations for word count, structure, keywords, and entities so your content can realistically compete.',
    sections: [
      {
        title: 'What Surfer SEO Does Differently',
        content:
          'Surfer SEO starts by scraping and analyzing the pages that currently rank on page one for your target keyword. It then extracts patterns around content length, heading structure, keyword usage, and semantic entities, turning those insights into an actionable content brief. You write or paste your draft into the Content Editor, where a live score shows how closely you match the competition and what to fix next.',
      },
      {
        title: 'How Surfer Fits Into Content Workflows',
        content:
          'Most teams use Surfer at two stages: planning new content and auditing existing pages. For new articles, you generate a brief from keyword research, write to the Content Editor guidelines, and publish when you hit the target score. For existing content, the Content Audit identifies underperforming URLs and suggests prioritized fixes. This makes Surfer valuable both for proactive optimization and recovering lost rankings.',
      },
      {
        title: 'Where Surfer SEO Excels',
        content:
          'Surfer stands out for turning vague SEO theory into concrete checklists tailored to each keyword. The Content Editor’s real-time scoring gives writers clear feedback, while the SERP Analyzer helps you understand competitive gaps before investing time. For agencies and content teams, Surfer creates a shared optimization standard so everyone knows what “SEO-ready” actually means.',
      },
      {
        title: 'Surfer SEO Limitations',
        content:
          'Surfer focuses specifically on on-page content optimization and does not handle technical SEO, backlinks, or broader site architecture. It also requires human judgment to prioritize which recommendations matter most in context. Small blogs may find the pricing high relative to publishing volume, and highly creative or experiential content may not benefit as much from formulaic scoring.',
      },
    ],
  },
  pricing: [
    {
      plan: 'Essential',
      price: 'From around $79',
      period: 'per month (billed annually)',
      features: [
        'Core Content Editor access with limited monthly credits',
        'Content Audit for a set number of existing URLs',
        'Basic SERP Analyzer for key target keywords',
        'Keyword research suitable for smaller content calendars',
      ],
      popular: false,
    },
    {
      plan: 'Scale',
      price: 'From around $175',
      period: 'per month (billed annually)',
      features: [
        'Higher Content Editor and Content Audit limits for growing teams',
        'More SERP Analyzer queries across broader keyword sets',
        'Team seats for collaboration between writers and SEOs',
        'Best for sites publishing or optimizing multiple articles weekly',
      ],
      popular: true,
    },
    {
      plan: 'Enterprise',
      price: 'Custom',
      period: 'contact sales',
      features: [
        'Custom limits tailored to high-volume content operations',
        'Dedicated support, onboarding, and team management features',
        'Advanced reporting for complex SEO programs',
        'Ideal when SEO drives significant revenue across multiple sites',
      ],
      popular: false,
    },
  ],
  pros: [
    'Content Editor provides clear, real-time optimization scoring and actionable suggestions.',
    'Data-driven approach analyzes actual SERPs instead of generic SEO rules.',
    'Content Audit helps prioritize which existing pages to improve for maximum impact.',
    'Strong fit for agencies and teams needing standardized SEO workflows.',
    'Integrates well with content platforms and writing tools for practical use.',
  ],
  cons: [
    'Pricing feels high for small blogs or low-volume publishers.',
    'Risk of over-optimizing for scores instead of reader experience if used mechanically.',
    'Learning curve to understand which metrics matter most for your niche.',
    'Does not replace technical SEO, backlink tools, or site-wide analytics platforms.',
  ],
  features: [
    {
      title: 'Content Editor',
      description:
        'Real-time content scoring with guidelines for word count, headings, keywords, and entities based on top-ranking competitors. Follow suggestions to improve your score and align with proven SERP patterns.',
    },
    {
      title: 'SERP Analyzer',
      description:
        'Compare your page against top competitors across dozens of on-page factors including length, structure, and keyword coverage. Understand exactly what it takes to rank before you start writing.',
    },
    {
      title: 'Content Audit',
      description:
        'Scan existing URLs to find optimization opportunities and prioritize pages closest to performing. Get specific recommendations to refresh content and recover lost organic traffic.',
    },
    {
      title: 'Keyword Research & Clustering',
      description:
        'Discover related keywords and build topic clusters around core themes. Plan content strategically to develop topical authority instead of targeting isolated phrases.',
    },
    {
      title: 'Team Collaboration',
      description:
        'Share briefs, guidelines, and optimization workspaces so writers, editors, and SEOs work from the same data. Standardize quality across your content team.',
    },
  ],
  comparisonTable: [
  {
    feature: 'Best For',
    'Surfer SEO': 'On-page SEO optimization',
    'Clearscope': 'Content briefs & research',
    'Frase': 'AI content + SEO together'
  },
  {
    feature: 'Starting Price',
    'Surfer SEO': '$89/month (Essential)',
    'Clearscope': '$170/month (Essentials)',
    'Frase': '$15/month (Solo)'
  },
  {
    feature: 'Content Score',
    'Surfer SEO': 'Real-time (100-point scale)',
    'Clearscope': 'Letter grade (A-F)',
    'Frase': 'Topic score'
  },
  {
    feature: 'SERP Analysis',
    'Surfer SEO': 'Excellent (50+ factors)',
    'Clearscope': 'Good',
    'Frase': 'Moderate'
  },
  {
    feature: 'AI Writing',
    'Surfer SEO': 'No (optimization only)',
    'Clearscope': 'No',
    'Frase': 'Yes (built-in)'
  },
  {
    feature: 'Ease of Use',
    'Surfer SEO': 'Easy (visual editor)',
    'Clearscope': 'Moderate',
    'Frase': 'Easy'
  }
],

  faq: [
    {
      question: 'Who should use Surfer SEO?',
      answer:
        'Surfer SEO is best for content teams, agencies, and serious bloggers who publish or optimize SEO content regularly. It delivers strong ROI when you treat organic search as a primary channel and actively manage content performance.',
    },
    {
      question: 'Is Surfer SEO worth it for small blogs?',
      answer:
        'Small blogs can benefit from Surfer, but the subscription makes more sense when you publish or optimize multiple articles monthly. If you only post occasionally, test it on high-value pages first before committing long-term.',
    },
    {
      question: 'Does Surfer SEO write content for you?',
      answer:
        'Surfer SEO focuses on optimization guidance and SERP analysis rather than content generation. It offers some AI writing assistance, but its core value is the structured on-page recommendations that help human writers create competitive content.',
    },
    {
      question: 'Can Surfer SEO replace other SEO tools?',
      answer:
        'Surfer specializes in on-page content optimization and works best alongside rank trackers, technical SEO tools, and analytics platforms. It fills the content optimization gap without replacing broader SEO infrastructure.',
    },
    {
      question: 'How accurate is Surfer SEO scoring?',
      answer:
        'Surfer scores reflect patterns from current SERPs, but correlation does not guarantee causation. Use scores as guidance alongside other signals like user behavior, technical health, and backlink quality for a complete ranking picture.',
    },
  ],
  alternatives: [
    {
      name: 'Jasper AI',
      slug: 'jasper-ai',
      reason:
        'Better for content generation and marketing workflows; pair with Surfer if you need both drafting speed and SEO optimization.',
    },
    {
      name: 'Writesonic',
      slug: 'writesonic',
      reason:
        'Stronger general-purpose AI writer across formats; use Surfer alongside it for deeper on-page analysis and scoring.',
    },
    {
      name: 'Frase',
      slug: 'frase',
      reason:
        'Direct competitor focused on content research and briefs; similar optimization approach with different interface and workflows.',
    },
  ],
}

export async function generateMetadata(): Promise<Metadata> {
  const title =
    'Surfer SEO Review: Data-Driven On-Page Optimization for Content Teams'
  const description =
    'Detailed Surfer SEO review covering Content Editor, SERP Analyzer, pricing, and use cases. Learn how Surfer helps blogs and agencies optimize content to match top-ranking pages and improve organic rankings.'

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://futureagent.com'
  const url = `${baseUrl}/tools/surfer-seo`

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      type: 'article',
    },
  }
}

export default function SurferSeoPage() {
  return <ToolReviewTemplate tool={surferSeoTool} slug="surfer-seo" />
}
