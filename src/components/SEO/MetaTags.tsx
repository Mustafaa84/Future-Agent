export interface MetaTagsProps {
  title: string;
  description: string;
  canonical?: string;
  ogType?: 'website' | 'article' | 'product';
  ogImage?: string;
  ogImageAlt?: string;
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  keywords?: string;
  noindex?: boolean;
}

export function generateMetadata({
  title,
  description,
  canonical,
  ogType = 'website',
  ogImage = '/images/og-default.jpg',
  ogImageAlt = 'Future Agent - AI Tools Directory',
  keywords,
  noindex = false
}: MetaTagsProps) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://futureagent.com';
  const fullCanonical = canonical || siteUrl;
  const fullOgImage = ogImage.startsWith('http') ? ogImage : `${siteUrl}${ogImage}`;
  const fullTitle = title.includes('Future Agent') ? title : `${title} | Future Agent`;

  return {
    title: fullTitle,
    description: description,
    keywords: keywords,
    robots: noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large',
    alternates: {
      canonical: fullCanonical,
    },
    openGraph: {
      type: ogType,
      title: fullTitle,
      description: description,
      url: fullCanonical,
      siteName: 'Future Agent',
      locale: 'en_US',
      images: [
        {
          url: fullOgImage,
          alt: ogImageAlt,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: description,
      images: [fullOgImage],
    },
  };
}
