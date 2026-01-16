# Blog Post Creation Guide

## Quick Start: Create a New Blog Post

### Step 1: Add to blogPosts.ts
Open: `src/lib/blogPosts.ts`

Add your new post:
{
slug: 'your-post-slug',
title: 'Your Post Title',
excerpt: 'Short description for listing page',
category: 'Category Name',
categorySlug: 'category-name',
readTime: '8 min read',
date: 'March 15, 2025',
content: '',
featuredImage: 'https://placehold.co/1200x630/1e293b/64ffda?text=Your+Title',
featuredImageAlt: 'Description of the image',
}

text

### Step 2: Create Post Page
Create: `src/app/blog/your-post-slug/page.tsx`

Copy from: `src/app/blog/getting-started-with-ai-tools/page.tsx`

Update:
1. Change the `post` object (title, date, slug, etc.)
2. Write your content inside `<BlogPostTemplate>`
3. Add images where needed

---

## Available Components

Import these from `@/components/BlogPostTemplate`:

### Text Components
- `<H2>` - Main section headings
- `<H3>` - Sub-section headings
- `<H4>` - Small headings
- `<Paragraph>` - Regular paragraphs

### Content Boxes
- `<InfoBox title="Tip">` - Blue info boxes with 💡 icon
- `<ContentBox title="Title">` - Gray content boxes
- `<CTABox>` - Gradient call-to-action boxes

### Lists & Steps
- `<BulletList items={[...]} />` - Bullet point lists
- `<StepBox number={1}>` - Numbered step boxes

### Comparisons
- `<ComparisonBox before={{...}} after={{...}} />` - Side-by-side comparison

### Tools
- `<ToolCard icon="🎯" title="..." description="..." tools={[...]} />`

### Images
- `<PlaceholderImage title="..." color="cyan" />` - Colored placeholders
- `<BlogImage src="..." alt="..." caption="..." />` - Real images
- `<InfographicBox src="..." alt="..." title="..." />` - Infographic boxes

---

## Image Management

### Placeholder Images (Current)
<PlaceholderImage
title="Your infographic title"
color="cyan" // or "blue" or "purple"
/>

text

### Real Images (Future)
Place images in: `public/images/blog/`

Use like this:
<BlogImage src="/images/blog/my-image.jpg" alt="Description of image" caption="Optional caption text" />

text

Or use external URLs:
<BlogImage src="https://images.unsplash.com/photo-xyz" alt="Description" />

text

---

## Featured Images

### For Blog Listing Cards
Update in `blogPosts.ts`:
featuredImage: 'https://placehold.co/1200x630/1e293b/64ffda?text=Title',

text

Later replace with real image:
featuredImage: '/images/blog/my-featured-image.jpg',

text

---

## Folder Structure

src/
├── app/
│ └── blog/
│ ├── page.tsx (Blog listing)
│ ├── [slug]/
│ │ ├── page.tsx (Dynamic fallback)
│ │ └── EmailOptInSidebar.tsx
│ ├── getting-started-with-ai-tools/
│ │ └── page.tsx (Custom post)
│ └── ai-content-workflow/
│ └── page.tsx (Custom post)
│
├── components/
│ └── BlogPostTemplate.tsx (Reusable components)
│
└── lib/
└── blogPosts.ts (Post metadata)

public/
└── images/
└── blog/
├── your-images.jpg
└── infographics/
└── your-infographics.jpg

text

---

## Quick Copy-Paste Template

import type { Metadata } from 'next';
import Link from 'next/link';
import { blogPosts } from '@/lib/blogPosts';
import EmailOptInSidebar from '../[slug]/EmailOptInSidebar';
import BlogPostTemplate, {
H2, H3, H4, Paragraph, InfoBox, ContentBox,
StepBox, CTABox, ToolCard, BulletList,
ComparisonBox, PlaceholderImage, BlogImage,
} from '@/components/BlogPostTemplate';

const post = {
slug: 'your-slug',
title: 'Your Title',
category: 'Category',
categorySlug: 'category',
date: 'March 15, 2025',
readTime: '8 min read',
};

export const metadata: Metadata = {
title: ${post.title} | Future Agent,
description: 'Your description',
};

export default function YourPostPage() {
const relatedPosts = blogPosts.filter(
(p) => p.categorySlug === post.categorySlug && p.slug !== post.slug
);

return (
<div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 pt-1">
{/* Use same header/sidebar structure from existing posts */}

text
  <BlogPostTemplate>
    <PlaceholderImage title="Featured Image" color="cyan" />
    
    <Paragraph>Your content here...</Paragraph>
    
    <H2>Your Section</H2>
    <Paragraph>More content...</Paragraph>
  </BlogPostTemplate>
  
  {/* Use same footer structure from existing posts */}
</div>
);
}

text

---

## Tips

1. **Always add post to `blogPosts.ts` first** - so it appears in listing
2. **Use placeholder images initially** - replace with real images later
3. **Copy existing post structure** - faster than starting from scratch
4. **Add 2-3 images per post** - improves engagement
5. **Use InfoBox for key takeaways** - makes content scannable

---

## Need Help?

- Check existing posts: `getting-started-with-ai-tools` and `ai-content-workflow`
- All components: `src/components/BlogPostTemplate.tsx`
- Post metadata: `src/lib/blogPosts.ts`