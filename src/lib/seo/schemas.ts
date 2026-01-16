const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://futureagent.com'

// Organization Schema
export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Future Agent',
  url: siteUrl,
  logo: `${siteUrl}/images/logo.png`,
  description: 'Discover and compare the best AI tools for your business',
  sameAs: [
    'https://twitter.com/futureagent',
    'https://facebook.com/futureagent',
    'https://linkedin.com/company/futureagent',
  ],
}

// Website Schema
export const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Future Agent',
  url: siteUrl,
  description: 'Discover and compare the best AI tools for your business',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${siteUrl}/tools?search={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
}

// Breadcrumb Schema Generator
export function generateBreadcrumbSchema(
  items: { name: string; url: string }[]
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

// Article Schema Generator
export function generateArticleSchema({
  title,
  description,
  url,
  image,
  datePublished,
  dateModified,
  author = 'Future Agent Team',
}: {
  title: string
  description: string
  url: string
  image: string
  datePublished: string
  dateModified?: string
  author?: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: description,
    image: image,
    datePublished: datePublished,
    dateModified: dateModified || datePublished,
    author: {
      '@type': 'Person',
      name: author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Future Agent',
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/images/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
  }
}

interface ProductSchema {
  '@context': string
  '@type': string
  name: string
  description: string
  image: string
  url: string
  applicationCategory: string
  operatingSystem: string
  offers?: {
    '@type': string
    price: number
    priceCurrency: string
    availability: string
  }
  aggregateRating?: {
    '@type': string
    ratingValue: number
    reviewCount: number
    bestRating: number
    worstRating: number
  }
  featureList?: string[]
}

// Product/Tool Schema Generator
export function generateProductSchema({
  name,
  description,
  image,
  url,
  price,
  priceCurrency = 'USD',
  availability = 'InStock',
  ratingValue,
  reviewCount,
  features = [],
}: {
  name: string
  description: string
  image: string
  url: string
  price?: number
  priceCurrency?: string
  availability?: string
  ratingValue?: number
  reviewCount?: number
  features?: string[]
}): ProductSchema {
  const schema: ProductSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: name,
    description: description,
    image: image,
    url: url,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
  }

  if (price) {
    schema.offers = {
      '@type': 'Offer',
      price: price,
      priceCurrency: priceCurrency,
      availability: `https://schema.org/${availability}`,
    }
  }

  if (ratingValue && reviewCount) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: ratingValue,
      reviewCount: reviewCount,
      bestRating: 5,
      worstRating: 1,
    }
  }

  if (features.length > 0) {
    schema.featureList = features
  }

  return schema
}

// FAQ Schema Generator
export function generateFAQSchema(
  faqs: { question: string; answer: string }[]
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}

// How-To Schema Generator
export function generateHowToSchema({
  name,
  description,
  steps,
  totalTime,
}: {
  name: string
  description: string
  steps: { name: string; text: string }[]
  totalTime?: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: name,
    description: description,
    totalTime: totalTime,
    step: steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.name,
      text: step.text,
    })),
  }
}
