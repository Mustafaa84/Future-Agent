# 🤖 Future Agent - Complete Codebase Documentation

> **AI Tools Directory & Blog Platform**
> Last Updated: January 24, 2026

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [Database Schema (Supabase)](#database-schema)
5. [Core Features Deep Dive](#core-features-deep-dive)
6. [Component Library](#component-library)
7. [API Routes](#api-routes)
8. [Admin Dashboard](#admin-dashboard)
9. [SEO System](#seo-system)
10. [Third-Party Integrations](#third-party-integrations)
11. [Development Workflow](#development-workflow)
12. [Common Tasks Guide](#common-tasks-guide)

---

## 🎯 Project Overview

**Future Agent** is a comprehensive AI tools discovery platform built with Next.js 16. It serves as:

- 📚 **AI Tools Directory** - Users can browse, search, and compare AI tools
- 📝 **Blog Platform** - Educational content about AI tools and workflows
- 🎮 **Tool Finder Quiz** - Interactive quiz for personalized tool recommendations
- 🔗 **Affiliate Tracking** - Monetization through tracked affiliate links

**Target Audience**: Businesses, marketers, content creators, and individuals looking for AI tools.

---

## 🏗️ Tech Stack

| Category | Technology | Version | Purpose |
|----------|------------|---------|---------|
| **Framework** | Next.js | 16.0.7 | React App Router + Turbopack |
| **Language** | TypeScript | ^5 | Type safety |
| **UI Library** | React | 19.2.0 | UI components |
| **Styling** | TailwindCSS | ^4 | Utility-first CSS |
| **Database** | Supabase | ^2.89.0 | PostgreSQL + Auth + Storage |
| **Email** | Resend | ^6.6.0 | Contact form emails |
| **Email Marketing** | MailerLite | API | Newsletter subscriptions |
| **Icons** | Lucide React | ^0.561.0 | Icon library |
| **Security** | DOMPurify + JSDOM | - | HTML sanitization |

---

## 📁 Project Structure

```
future-agent/
├── 📁 src/
│   ├── 📁 app/                    # Next.js App Router
│   │   ├── 📄 layout.tsx          # Root layout (Header + Footer)
│   │   ├── 📄 page.tsx            # Homepage (522 lines)
│   │   ├── 📄 globals.css         # Global styles
│   │   ├── 📄 robots.ts           # SEO robots.txt
│   │   ├── 📄 sitemap.ts          # Dynamic sitemap generator
│   │   │
│   │   ├── 📁 admin/              # 🔐 Admin Dashboard
│   │   │   ├── 📄 layout.tsx      # Admin layout + auth guard
│   │   │   ├── 📄 page.tsx        # Admin dashboard home
│   │   │   ├── 📁 login/          # Admin authentication
│   │   │   ├── 📁 blog/           # Blog management (CRUD)
│   │   │   │   ├── 📄 page.tsx    # Blog posts list
│   │   │   │   ├── 📄 BlogPostForm.tsx  # Create/Edit form (842 lines)
│   │   │   │   ├── 📄 actions.ts  # Server actions (create, update, delete)
│   │   │   │   ├── 📁 new/        # Create new post page
│   │   │   │   └── 📁 edit/       # Edit post page
│   │   │   ├── 📁 tools/          # Tools management (CRUD)
│   │   │   │   ├── 📄 page.tsx    # Tools list
│   │   │   │   ├── 📄 ToolForm.tsx    # Create/Edit form (787 lines)
│   │   │   │   ├── 📁 add/        # Add new tool page
│   │   │   │   └── 📁 edit/       # Edit tool page
│   │   │   └── 📁 affiliate-links/    # Affiliate link management
│   │   │
│   │   ├── 📁 api/                # API Routes
│   │   │   ├── 📁 comments/       # Blog comments API
│   │   │   │   └── 📄 route.ts    # GET (fetch) + POST (create)
│   │   │   ├── 📁 contact/        # Contact form API
│   │   │   │   └── 📄 route.ts    # POST → Resend email
│   │   │   ├── 📁 subscribe/      # Newsletter API
│   │   │   │   └── 📄 route.ts    # POST → MailerLite
│   │   │   ├── 📁 tags/           # Tags management API
│   │   │   ├── 📁 admin/          # Admin APIs
│   │   │   ├── 📁 blog/           # Blog API routes
│   │   │   └── 📁 perplexity/     # AI content generation
│   │   │
│   │   ├── 📁 blog/               # 📝 Blog Section
│   │   │   ├── 📄 page.tsx        # Blog listing page
│   │   │   └── 📁 [slug]/         # Dynamic blog post pages
│   │   │       └── 📄 page.tsx    # Individual blog post (517 lines)
│   │   │
│   │   ├── 📁 tools/              # 🔧 Tools Directory
│   │   │   ├── 📄 page.tsx        # Tools listing
│   │   │   ├── 📄 ToolsClient.tsx # Client-side search/filter
│   │   │   ├── 📄 ToolsGrid.tsx   # Tools grid component
│   │   │   └── 📁 [slug]/         # Dynamic tool review pages
│   │   │       └── 📄 page.tsx    # Tool review page (819 lines)
│   │   │
│   │   ├── 📁 quiz/               # 🎮 Tool Finder Quiz
│   │   │   ├── 📄 page.tsx        # Quiz entry point
│   │   │   └── 📄 QuizClient.tsx  # Interactive quiz (1015 lines)
│   │   │
│   │   ├── 📁 go/                 # 🔗 Affiliate Redirects
│   │   │   └── 📁 [slug]/
│   │   │       └── 📄 route.ts    # Redirect + click tracking
│   │   │
│   │   ├── 📁 category/           # Category browser
│   │   ├── 📁 tag/                # Tag-based filtering
│   │   ├── 📁 contact/            # Contact page
│   │   ├── 📁 privacy/            # Privacy policy
│   │   ├── 📁 terms/              # Terms of service
│   │   ├── 📁 affiliate-disclaimer/  # Legal disclosure
│   │   └── 📁 test-db/            # DB connection test
│   │
│   ├── 📁 components/             # 🧩 React Components
│   │   ├── 📄 Header.tsx          # Site navigation + animated logo
│   │   ├── 📄 Footer.tsx          # Site footer (335 lines)
│   │   ├── 📄 BlogPostTemplate.tsx    # Blog content components
│   │   ├── 📄 ToolReviewTemplate.tsx  # Tool review layout
│   │   ├── 📄 CommentsSection.tsx     # Comments system
│   │   ├── 📄 CommentForm.tsx         # Comment submission
│   │   ├── 📄 EmailOptInClient.tsx    # Newsletter signup
│   │   ├── 📄 ContactFormClient.tsx   # Contact form
│   │   ├── 📄 ImageUpload.tsx         # Image upload component
│   │   ├── 📄 Logo.tsx                # Brand logo
│   │   ├── 📄 TagBadge.tsx            # Tag display component
│   │   │
│   │   ├── 📁 SEO/                # SEO Components
│   │   │   └── 📄 JsonLd.tsx      # JSON-LD schema renderer
│   │   │
│   │   ├── 📁 blog/               # Blog-specific components
│   │   │   ├── 📄 CommentSection.tsx
│   │   │   ├── 📄 ContentTemplates.tsx   # Rich content blocks
│   │   │   ├── 📄 EmailOptInSidebar.tsx
│   │   │   └── 📄 CategoryNavigation.tsx
│   │   │
│   │   └── 📁 admin/              # Admin components
│   │       ├── 📄 CategorySelect.tsx  # Category dropdown
│   │       ├── 📄 TagsSelect.tsx      # Multi-select tags
│   │       └── 📁 repeaters/          # Dynamic form repeaters
│   │           ├── 📄 FeatureRepeater.tsx
│   │           ├── 📄 PricingRepeater.tsx
│   │           ├── 📄 ProsConsRepeater.tsx
│   │           ├── 📄 FAQRepeater.tsx
│   │           ├── 📄 ReviewSectionsRepeater.tsx
│   │           ├── 📄 AlternativesRepeater.tsx
│   │           ├── 📄 ComparisonTableRepeater.tsx
│   │           ├── 📄 TagsRepeater.tsx
│   │           └── 📄 WorkflowStepsRepeater.tsx
│   │
│   ├── 📁 lib/                    # 📚 Utility Functions
│   │   ├── 📄 supabase.ts         # Supabase client (browser + server)
│   │   ├── 📄 tools.ts            # Static tools data (legacy)
│   │   ├── 📄 blogPosts.ts        # Static blog metadata (legacy)
│   │   ├── 📄 getToolData.ts      # Fetch tool data from DB
│   │   ├── 📄 getCategories.ts    # Category utilities
│   │   ├── 📄 tags.ts             # Tags management
│   │   ├── 📄 content.ts          # Content utilities
│   │   ├── 📄 uploadImage.ts      # Supabase Storage upload
│   │   │
│   │   └── 📁 seo/                # SEO Utilities
│   │       ├── 📄 config.ts       # Site-wide SEO config
│   │       ├── 📄 schemas.ts      # JSON-LD schema generators
│   │       └── 📄 tags.ts         # Tag-related SEO
│   │
│   └── 📁 types/                  # 📋 TypeScript Types
│       └── 📄 index.ts            # All app types (189 lines)
│
├── 📁 public/                     # Static Assets
│   ├── 📁 images/                 # Tool logos, blog images
│   └── *.svg                      # Icons
│
├── 📄 package.json                # Dependencies
├── 📄 BLOG_GUIDE.md               # Blog creation guide
├── 📄 .env.local                  # Environment variables
├── 📄 next.config.ts              # Next.js configuration
├── 📄 tailwind.config.ts          # Tailwind configuration
└── 📄 tsconfig.json               # TypeScript configuration
```

---

## 🗄️ Database Schema

The app uses **Supabase (PostgreSQL)**. Here are the main tables:

### Core Tables

| Table | Purpose | Key Columns |
|-------|---------|-------------|
| `ai_tools` | AI tools directory | id, name, slug, category, rating, description, published |
| `blog_posts` | Blog articles | id, slug, title, content, category, published, tags |
| `comments` | Blog comments | id, post_id, author_name, content, created_at |
| `tags` | Tool/post tags | id, slug, name, icon, color |
| `affiliate_links` | Affiliate tracking | id, slug, target_url, tool_id |
| `affiliate_clicks` | Click analytics | id, tool_id, user_ip, referrer, created_at |

### Tool-Related Tables (Normalized)

| Table | Purpose | Linked To |
|-------|---------|-----------|
| `tool_features` | Tool features list | ai_tools.id |
| `tool_pricing_plans` | Pricing tiers | ai_tools.id |
| `tool_pros` | Advantages | ai_tools.id |
| `tool_cons` | Disadvantages | ai_tools.id |
| `tool_faqs` | FAQ items | ai_tools.id |
| `tool_reviews` | In-depth review intro | ai_tools.id |
| `tool_review_sections` | Review content blocks | tool_reviews.id |
| `tool_alternatives` | Similar tools | ai_tools.id |
| `tool_comparisons` | Comparison table data | ai_tools.id |

---

## 🔥 Core Features Deep Dive

### 1. AI Tools Directory (`/tools`)

**Files**: 
- `src/app/tools/page.tsx` - Main listing
- `src/app/tools/ToolsClient.tsx` - Client search/filter
- `src/app/tools/[slug]/page.tsx` - Individual tool review (819 lines)

**Features**:
- Category filtering
- Search functionality
- Star ratings display
- Tag-based filtering
- Detailed tool review pages with:
  - Hero section with logo, rating
  - In-depth review sections (with images)
  - Features grid
  - Pricing comparison
  - Pros & Cons
  - FAQs
  - Competitor comparison table
  - Alternatives recommendations
  - Getting started workflow

**Data Flow**:
```
Supabase ai_tools → page.tsx → Render tool page
                 ↓
         tool_pricing_plans
         tool_features
         tool_pros/cons
         tool_faqs
         tool_reviews → tool_review_sections
         tool_alternatives
         tool_comparisons
```

---

### 2. Blog Platform (`/blog`)

**Files**:
- `src/app/blog/page.tsx` - Blog listing
- `src/app/blog/[slug]/page.tsx` - Individual post (517 lines)
- `src/components/BlogPostTemplate.tsx` - Content components

**Features**:
- Category & tag filtering
- Related posts (smart algorithm based on category + shared tags)
- Social sharing buttons
- Comment system
- Email opt-in sidebar
- SEO-optimized with JSON-LD schemas

**Blog Post Components** (from `BlogPostTemplate.tsx`):
| Component | Purpose |
|-----------|---------|
| `H2`, `H3`, `H4` | Headings |
| `Paragraph` | Text content |
| `InfoBox` | Tip/info callout (💡) |
| `ContentBox` | Gray content box |
| `CTABox` | Call-to-action gradient box |
| `StepBox` | Numbered steps |
| `BulletList` | Bullet point lists |
| `ComparisonBox` | Before/After comparison |
| `ToolCard` | Tool recommendation card |
| `BlogImage` | Image with caption |
| `PlaceholderImage` | Colored placeholder |
| `InfographicBox` | Infographic display |

---

### 3. Tool Finder Quiz (`/quiz`)

**Files**:
- `src/app/quiz/page.tsx` - Entry point
- `src/app/quiz/QuizClient.tsx` - Quiz logic (1015 lines)

**Quiz Flow**:
1. **Goal Selection** - What do you want to achieve?
2. **Team Size** - Solo or team?
3. **Budget** - Free, mid-range, enterprise?
4. **Experience** - Beginner to expert?
5. **Use Case** - Specific application area
6. **Priority** - Speed, quality, or ease?
7. **Email** - Optional newsletter signup
8. **Results** - Personalized tool recommendations

**Recommendation Algorithm** (in `getRecommendations()`):
- Filters tools from database based on answers
- Matches category to use case
- Filters by pricing model
- Returns top matching tools

---

### 4. Affiliate System (`/go/[slug]`)

**Files**:
- `src/app/go/[slug]/route.ts` - Redirect handler

**Flow**:
1. User clicks affiliate link (e.g., `/go/chatgpt`)
2. System looks up `affiliate_links` table
3. Logs click to `affiliate_clicks` (IP, user agent, referrer)
4. Redirects to `target_url` (302 redirect)

**Click Tracking Data**:
- `tool_id` - Which tool was clicked
- `user_ip` - Visitor IP
- `user_agent` - Browser info
- `referrer` - Where they came from
- `created_at` - Timestamp

---

## 🧩 Component Library

### Layout Components

| Component | File | Purpose |
|-----------|------|---------|
| `Header` | `Header.tsx` | Navigation with animated robot logo, mobile menu |
| `Footer` | `Footer.tsx` | Site footer with links, scroll-to-top |

### Form Components

| Component | File | Purpose |
|-----------|------|---------|
| `BlogPostForm` | `admin/blog/BlogPostForm.tsx` | Rich blog editor with AI generation |
| `ToolForm` | `admin/tools/ToolForm.tsx` | Comprehensive tool editor |
| `CommentForm` | `CommentForm.tsx` | Blog comment submission |
| `ContactFormClient` | `ContactFormClient.tsx` | Contact page form |
| `EmailOptInClient` | `EmailOptInClient.tsx` | Newsletter signup |
| `ImageUpload` | `ImageUpload.tsx` | Supabase Storage uploader |

### Admin Repeaters (Dynamic Form Fields)

| Repeater | Purpose |
|----------|---------|
| `FeatureRepeater` | Add/remove tool features |
| `PricingRepeater` | Manage pricing plans |
| `ProsConsRepeater` | Add pros/cons lists |
| `FAQRepeater` | Manage FAQ items |
| `ReviewSectionsRepeater` | Build review content blocks |
| `AlternativesRepeater` | Link alternative tools |
| `ComparisonTableRepeater` | Build comparison tables |
| `WorkflowStepsRepeater` | Add getting started steps |
| `TagsRepeater` | Manage tags |

---

## 🔌 API Routes

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/comments` | GET | Fetch comments for a post |
| `/api/comments` | POST | Submit new comment |
| `/api/contact` | POST | Send contact form → Resend email |
| `/api/subscribe` | POST | Subscribe to newsletter → MailerLite |
| `/api/tags` | - | Tag management |
| `/api/admin/*` | - | Admin operations |
| `/api/perplexity` | POST | AI content generation |

### Contact Form Flow
```
User submits → /api/contact → Resend API → roayaonline1@gmail.com
```

### Newsletter Flow
```
User submits → /api/subscribe → MailerLite API → Add to group
```

---

## 🔐 Admin Dashboard

**Access**: `/admin` (requires Supabase Auth)

### Authentication Flow
```typescript
// src/app/admin/layout.tsx
1. Check session via supabase.auth.getSession()
2. If no session → redirect to /admin/login
3. Listen for auth changes
4. Show admin UI with logout button
```

### Admin Features

#### Blog Management (`/admin/blog`)
- View all posts (published + drafts)
- Create new posts with rich editor
- AI content generation (Perplexity integration)
- Image upload to Supabase Storage
- Tag & category management
- Schedule posts for future
- Edit/delete posts

#### Tools Management (`/admin/tools`)
- View all tools
- Add new tools with comprehensive form
- Manage features, pricing, pros/cons, FAQs
- Add review sections with images
- Link alternatives
- Build comparison tables
- Toggle publish status

#### Affiliate Links (`/admin/affiliate-links`)
- Create/edit affiliate links
- View click statistics

---

## 🎯 SEO System

### Configuration (`src/lib/seo/config.ts`)
```typescript
seoConfig = {
  siteName: 'Future Agent',
  siteUrl: 'https://futureagent.com',
  defaultOgImage: '/images/og-default.jpg',
  twitterHandle: '@futureagent',
  social: { twitter, facebook, linkedin }
}
```

### JSON-LD Schemas (`src/lib/seo/schemas.ts`)

| Schema | Used On | Purpose |
|--------|---------|---------|
| `organizationSchema` | Homepage | Company info |
| `websiteSchema` | Homepage | Site info + search |
| `generateBreadcrumbSchema()` | All pages | Navigation breadcrumbs |
| `generateArticleSchema()` | Blog posts | Article metadata |
| `generateProductSchema()` | Tool pages | Software product info |
| `generateFAQSchema()` | Tool pages | FAQ structured data |
| `generateHowToSchema()` | - | Tutorial steps |

### Usage
```tsx
import JsonLd from '@/components/SEO/JsonLd'

<JsonLd data={articleSchema} />
<JsonLd data={breadcrumbSchema} />
```

---

## 🔗 Third-Party Integrations

### 1. Supabase
- **Database**: PostgreSQL for all data
- **Auth**: Admin authentication
- **Storage**: Image uploads

### 2. Resend (Email)
```typescript
// Contact form emails
await resend.emails.send({
  from: 'Future Agent <onboarding@resend.dev>',
  to: 'roayaonline1@gmail.com',
  subject: `New Contact Form: ${subject}`,
  html: emailTemplate
})
```

### 3. MailerLite (Newsletter)
```typescript
// Newsletter subscriptions
await fetch('https://connect.mailerlite.com/api/subscribers', {
  headers: { Authorization: `Bearer ${MAILERLITE_API_KEY}` },
  body: JSON.stringify({ email, groups: [MAILERLITE_GROUP_ID] })
})
```

### 4. Perplexity AI (Content Generation)
- Used in admin for AI-assisted blog writing
- Accessed via `/api/perplexity`

---

## 💻 Development Workflow

### Commands
```bash
# Install dependencies
npm install

# Start dev server (Turbopack)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint

# Run data migration
npm run migrate
```

### Environment Variables (`.env.local`)
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_key

# Email
RESEND_API_KEY=your_resend_key
MAILERLITE_API_KEY=your_mailerlite_key
MAILERLITE_GROUP_ID=your_group_id

# Site
NEXT_PUBLIC_SITE_URL=https://futureagent.com
```

---

## 📋 Common Tasks Guide

### Add a New AI Tool
1. Login to `/admin`
2. Go to `/admin/tools/add`
3. Fill in basic info (name, slug, category, description)
4. Add features, pricing, pros/cons
5. Write review sections with images
6. Add FAQs and alternatives
7. Set to Published → Save

### Create a Blog Post
1. Login to `/admin`
2. Go to `/admin/blog/new`
3. Enter title (slug auto-generates)
4. Optional: Use AI to generate content
5. Write/edit content in HTML editor
6. Add featured image
7. Select category and tags
8. Set status (Draft/Published/Scheduled)
9. Save

### Add New Category
Categories are just strings stored with tools/posts. To add:
1. Add to `PRESET_CATEGORIES` array in `BlogPostForm.tsx`
2. Or simply type new category when creating content

### Add New Tag
1. Go to admin or use API
2. Insert into `tags` table with slug, name, icon, color

### Track Affiliate Performance
1. Create affiliate link in `/admin/affiliate-links`
2. Link to tool with unique slug (e.g., `/go/chatgpt`)
3. View clicks in `affiliate_clicks` table

---

## 🎨 Design System

### Colors (Dark Theme)
- **Background**: Slate-950 → Slate-900 gradient
- **Primary**: Cyan-500 → Indigo-500 gradient
- **Accent**: Purple-600, Fuchsia-400
- **Text**: White (headings), Slate-300/400 (body)
- **Borders**: Slate-800

### Typography
- **Font**: Inter (Google Fonts)
- **Headings**: Bold, white
- **Body**: Relaxed line-height, slate-300

### Animation
- Subtle hover transitions
- Logo eye blinking animation
- Card scale/lift on hover
- Smooth color transitions

---

## 📞 Support

For questions or issues:
- Check existing code patterns
- Review `BLOG_GUIDE.md` for blog creation
- Contact: roayaonline1@gmail.com

---

*Documentation generated by AI assistant - January 2026*
