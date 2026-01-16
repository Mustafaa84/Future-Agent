// src/app/blog/[slug]/page.tsx
// REFINED WITH seoConfig + generateArticleSchema + Breadcrumb Schema


import type { Metadata } from 'next'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import { seoConfig, seoTemplates } from '@/lib/seo/config'
import { generateArticleSchema, generateBreadcrumbSchema } from '@/lib/seo/schemas'
import EmailOptInSidebar from '@/components/blog/EmailOptInSidebar'
import CommentSection from '@/components/blog/CommentSection'
import CategoryNavigation from '@/components/blog/CategoryNavigation'
import Image from 'next/image'
import React from 'react'
import JsonLd from '@/components/SEO/JsonLd'


type Params = { slug: string }


export async function generateMetadata({
  params,
}: {
  params: Promise<Params>
}): Promise<Metadata> {
  const { slug } = await params
  
  const { data: post } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .single()


  if (!post) {
    return { title: 'Post Not Found | Future Agent' }
  }


  // ✅ USE seoTemplates for consistent title/description
  const title = post.meta_title || seoTemplates.blog.titleTemplate(post.title)
  const description = post.meta_description || seoTemplates.blog.descriptionTemplate(post.excerpt)
  const postUrl = `${seoConfig.siteUrl}/blog/${post.slug}`
  const ogImage = post.featured_image || seoConfig.defaultOgImage


  return {
    title,
    description,
    keywords: post.tags?.join(', '),
    authors: [{ name: post.author || 'Future Agent' }],
    creator: post.author || 'Future Agent',
    publisher: 'Future Agent',
    alternates: {
      canonical: postUrl,
    },
    openGraph: {
      type: 'article',
      title,
      description,
      url: postUrl,
      siteName: seoConfig.siteName,
      locale: 'en_US',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
      publishedTime: post.published_date || post.created_at,
      modifiedTime: post.updated_at,
      authors: [post.author || 'Future Agent'],
      section: post.category,
      tags: post.tags || [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
      creator: seoConfig.twitterHandle,
    },
    robots: {
      index: post.published,
      follow: post.published,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  }
}


export default async function BlogPostPage({
  params,
}: {
  params: Promise<Params>
}) {
  const { slug } = await params


  // Fetch the current post
  const { data: post } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .single()


  // Check if post is published and not scheduled for future
  if (post && post.published && post.published_date) {
    const publishDate = new Date(post.published_date)
    const now = new Date()
    if (publishDate > now) {
      // Post is scheduled for future - treat as not found
      return (
        <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 pt-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-2">Post not published yet</h1>
            <p className="text-slate-400 mb-4">This post is scheduled for {publishDate.toLocaleDateString()}</p>
            <Link href="/blog" className="text-cyan-400 hover:text-cyan-300 text-sm">
              Back to blog
            </Link>
          </div>
        </div>
      )
    }
  }


  if (!post) {
    notFound()
  }


  // Fetch related posts with smart algorithm
  const { data: allPublishedPosts } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('published', true)
    .lte('published_date', new Date().toISOString())
    .neq('slug', slug)
    .order('created_at', { ascending: false })


  // Calculate relevance scores
  const scoredPosts = allPublishedPosts?.map(relatedPost => {
    let score = 0
    
    // +3 points for same category
    if (relatedPost.category === post.category) {
      score += 3
    }
    
    // +1 point for each shared tag
    const postTags = post.tags || []
    const relatedTags = relatedPost.tags || []
    const sharedTags = postTags.filter((tag: string) => relatedTags.includes(tag))
    score += sharedTags.length
    
    return { ...relatedPost, relevanceScore: score }
  }) || []


  // Sort by relevance score (highest first), then by date
  const relatedPosts = scoredPosts
    .sort((a, b) => {
      if (b.relevanceScore !== a.relevanceScore) {
        return b.relevanceScore - a.relevanceScore
      }
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    })
    .slice(0, 3)


  // ✅ USE generateArticleSchema from helpers
  const articleSchema = generateArticleSchema({
    title: post.meta_title || post.title,
    description: post.meta_description || post.excerpt,
    url: `${seoConfig.siteUrl}/blog/${post.slug}`,
    image: post.featured_image || seoConfig.defaultOgImage,
    datePublished: post.published_date || post.created_at,
    dateModified: post.updated_at || post.published_date || post.created_at,
    author: post.author || 'Future Agent Team',
  })


  // ✅ ADD breadcrumbSchema for SEO (kept for schema but removed visual display on mobile)
  const breadcrumbs = [
    { name: 'Home', url: seoConfig.siteUrl },
    { name: 'Blog', url: `${seoConfig.siteUrl}/blog` },
    { name: post.title, url: `${seoConfig.siteUrl}/blog/${post.slug}` },
  ]
  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbs)


  return (
    <>
      {/* ✅ JSON-LD Schemas */}
      <JsonLd data={articleSchema} />
      <JsonLd data={breadcrumbSchema} />


      <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 pt-1">
        {/* Header - Breadcrumb removed on mobile, kept on desktop for SEO */}
        <section className="px-4 pt-12 pb-10 border-b border-slate-800">
          <div className="mx-auto max-w-6xl">
            {/* Breadcrumb Navigation - Desktop Only */}
            <div className="hidden md:flex items-center gap-2 text-sm text-slate-400 mb-4">
              {breadcrumbs.map((crumb, index) => (
                <div key={crumb.url} className="flex items-center gap-2">
                  {index > 0 && <span>/</span>}
                  {index < breadcrumbs.length - 1 ? (
                    <Link href={crumb.url} className="hover:text-cyan-400 transition-colors">
                      {crumb.name}
                    </Link>
                  ) : (
                    <span className="text-white">{crumb.name}</span>
                  )}
                </div>
              ))}
            </div>


            <span className="inline-block px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 text-xs font-semibold mb-3">
              {post.category}
            </span>


            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
              {post.title}
            </h1>
            
            <div className="flex items-center gap-3 text-xs text-slate-400 mb-4">
              <span>
                {new Date(post.created_at).toLocaleDateString('en-US', { 
                  month: 'long', 
                  day: 'numeric', 
                  year: 'numeric' 
                })}
              </span>
              <span>•</span>
              <span>{post.reading_time || 5} min read</span>
            </div>
            
            {/* Share buttons */}
            <div className="flex flex-wrap items-center gap-3 text-xs">
              <span className="text-slate-400">Share:</span>
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(`${seoConfig.siteUrl}/blog/${post.slug}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-full bg-slate-900 border border-slate-700 text-slate-200 hover:border-cyan-500 hover:text-cyan-300 transition-colors"
              >
                Twitter / X
              </a>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`${seoConfig.siteUrl}/blog/${post.slug}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-full bg-slate-900 border border-slate-700 text-slate-200 hover:border-cyan-500 hover:text-cyan-300 transition-colors"
              >
                Facebook
              </a>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`${seoConfig.siteUrl}/blog/${post.slug}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-full bg-slate-900 border border-slate-700 text-slate-200 hover:border-cyan-500 hover:text-cyan-300 transition-colors"
              >
                LinkedIn
              </a>
            </div>
          </div>
        </section>


        {/* Body + Sidebar */}
        <section className="px-4 py-10">
          <div className="mx-auto max-w-6xl grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.1fr)]">
            {/* Main content + Author box */}
            <div className="space-y-8">
              {/* Featured Image */}
              {post.featured_image && (
                <div className="relative w-full h-[400px] rounded-xl overflow-hidden">
                  <Image
                    src={post.featured_image}
                    alt={post.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}


              {/* Article content - HTML MODE with professional styling */}
              <article className="text-slate-200">
                {post.content ? (
                  <div 
                    dangerouslySetInnerHTML={{ __html: post.content }} 
                    className="
                      // Base text styling
                      text-slate-300 leading-relaxed


                      // H2 Headings (Section headers)
                      [&>h2]:text-3xl [&>h2]:font-bold [&>h2]:text-white
                      [&>h2]:mt-8 [&>h2]:mb-4 [&>h2]:leading-tight


                      // H3 Headings (Subsections)
                      [&>h3]:text-2xl [&>h3]:font-bold [&>h3]:text-white
                      [&>h3]:mt-6 [&>h3]:mb-3 [&>h3]:leading-tight


                      // H4 Headings
                      [&>h4]:text-xl [&>h4]:font-semibold [&>h4]:text-white
                      [&>h4]:mt-4 [&>h4]:mb-2


                      // Paragraphs
                      [&>p]:text-lg [&>p]:mb-6 [&>p]:leading-relaxed
                      [&>p]:text-slate-300


                      // Unordered Lists
                      [&>ul]:list-disc [&>ul]:list-inside [&>ul]:mb-6 [&>ul]:space-y-2
                      [&>li]:text-lg [&>li]:text-slate-300 [&>li]:leading-relaxed


                      // Ordered Lists
                      [&>ol]:list-decimal [&>ol]:list-inside [&>ol]:mb-6 [&>ol]:space-y-2


                      // Links
                      [&>a]:text-cyan-400 [&>a]:underline [&>a]:hover:text-cyan-300
                      [&>a]:transition-colors


                      // Strong text
                      [&>strong]:font-bold [&>strong]:text-white


                      // Emphasis
                      [&>em]:italic [&>em]:text-slate-200


                      // Blockquotes
                      [&>blockquote]:border-l-4 [&>blockquote]:border-cyan-500
                      [&>blockquote]:pl-4 [&>blockquote]:italic [&>blockquote]:my-6
                      [&>blockquote]:text-slate-300 [&>blockquote]:bg-slate-900/50 [&>blockquote]:py-2


                      // Code blocks
                      [&>pre]:bg-slate-950 [&>pre]:text-cyan-100 [&>pre]:p-4
                      [&>pre]:rounded-lg [&>pre]:overflow-auto [&>pre]:mb-6
                      [&>pre]:border [&>pre]:border-slate-800
                      [&>code]:font-mono [&>code]:text-sm [&>code]:bg-slate-900
                      [&>code]:px-2 [&>code]:py-1 [&>code]:rounded [&>code]:text-cyan-300


                      // Images
                      [&>img]:max-w-full [&>img]:h-auto [&>img]:rounded-lg
                      [&>img]:my-8 [&>img]:shadow-lg


                      // Horizontal rule
                      [&>hr]:my-8 [&>hr]:border-slate-800
                    "
                  />
                ) : (
                  <p className="text-slate-400 italic">Content not available yet.</p>
                )}
              </article>


              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
                  <h3 className="text-sm font-semibold text-slate-400 mb-3">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag: string, index: number) => (
                      <span
                        key={index}
                        className="px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 text-sm hover:border-cyan-500/50 transition-colors"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}


              {/* Author box */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-indigo-500 rounded-2xl flex items-center justify-center text-2xl font-semibold flex-shrink-0">
                    FA
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-white mb-1">{post.author || 'Future Agent'}</h3>
                    <p className="text-sm text-slate-400 mb-2">
                      AI tools researcher & digital entrepreneur. Building workflows that save time
                      and scale businesses.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <a
                        href={seoConfig.social.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
                      >
                        Twitter
                      </a>
                      <a
                        href={seoConfig.social.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-slate-400 hover:text-slate-300 transition-colors"
                      >
                        LinkedIn
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Sidebar */}
            <aside className="space-y-6 lg:sticky lg:top-24 lg:h-fit">
              <EmailOptInSidebar />
              <CategoryNavigation />
            </aside>
          </div>
        </section>


        {/* Related posts */}
        <section className="px-4 py-10 bg-slate-950/50">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              Related articles
            </h2>
            {relatedPosts && relatedPosts.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedPosts.map((relatedPost: (typeof scoredPosts)[number]) => {
                  const postTags = post.tags || []
                  const relatedTags = relatedPost.tags || []
                  const sharedTags = postTags.filter((tag: string) => relatedTags.includes(tag))
                  const sameCategory = relatedPost.category === post.category


                  return (
                    <Link
                      key={relatedPost.slug}
                      href={`/blog/${relatedPost.slug}`}
                      className="group bg-slate-900/60 border border-slate-800 hover:border-cyan-500/50 rounded-xl p-6 transition-all hover:scale-[1.02]"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wide">
                          {relatedPost.category}
                        </span>
                        {sameCategory && (
                          <span className="text-xs bg-cyan-900/30 text-cyan-400 px-2 py-0.5 rounded">
                            Same topic
                          </span>
                        )}
                      </div>


                      <h3 className="text-lg font-semibold text-white group-hover:text-cyan-400 mb-2 transition-colors line-clamp-2">
                        {relatedPost.title}
                      </h3>


                      <p className="text-sm text-slate-400 line-clamp-2 mb-3">
                        {relatedPost.excerpt}
                      </p>


                      {sharedTags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-slate-800">
                          <span className="text-xs text-slate-500">Related:</span>
                          {sharedTags.slice(0, 2).map((tag: string) => (
                            <span
                              key={tag}
                              className="text-xs bg-slate-800 text-slate-400 px-2 py-0.5 rounded"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </Link>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-slate-400 text-lg">
                  More articles in this category coming soon.
                </p>
              </div>
            )}
          </div>
        </section>


        {/* COMMENT SECTION */}
        <CommentSection postId={post.id} />
      </div>
    </>
  )
}