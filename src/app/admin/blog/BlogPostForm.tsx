'use client'

// Add this helper function inside BlogPostForm.tsx
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

// ✅ NEW: Helper to clean AI-generated HTML
function cleanAiContent(html: string): string {
  let cleaned = html

  // Remove reference tags like [1], [2], [3], etc.
  cleaned = cleaned.replace(/\[\d+\]/g, '')

  // Remove trailing spaces in paragraphs
  cleaned = cleaned.replace(/<p>\s+/g, '<p>')
  cleaned = cleaned.replace(/\s+<\/p>/g, '</p>')

  // Clean up multiple spaces (but preserve intentional line breaks)
  cleaned = cleaned.replace(/&nbsp;\s+/g, ' ')
  cleaned = cleaned.replace(/  +/g, ' ')

  // Ensure proper spacing between sections
  cleaned = cleaned.replace(/<\/p>\s*<h2>/g, '</p>\n\n<h2>')
  cleaned = cleaned.replace(/<\/p>\s*<h3>/g, '</p>\n\n<h3>')

  // Remove any stray markdown syntax
  cleaned = cleaned.replace(/^#+\s+/gm, '') // Remove markdown headings

  // Ensure lists are properly formatted
  cleaned = cleaned.replace(/<ul>\s*/g, '<ul>')
  cleaned = cleaned.replace(/\s*<\/ul>/g, '</ul>')

  // Clean up list items
  cleaned = cleaned.replace(/<li>\s+/g, '<li>')
  cleaned = cleaned.replace(/\s+<\/li>/g, '</li>')

  return cleaned.trim()
}

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import ContentTemplates from '@/components/blog/ContentTemplates'
import { createBlogPost, updateBlogPost } from './actions'
import { generateComparisonData } from './comparison-generator-action'
import ImageUpload from '@/components/ImageUpload'
import { supabase } from '@/lib/supabase'

interface InitialData {
  id?: string
  content?: string
  title?: string
  slug?: string
  featured_image?: string
  category?: string
  tags?: string[]
  status?: 'draft' | 'published' | 'scheduled'
  scheduled_at?: string
  meta_title?: string
  meta_description?: string
  author?: string
  excerpt?: string
  reading_time?: number
}

interface FormDataState {
  title: string
  slug: string
  featured_image: string
  category: string
  tags: string
  status: 'draft' | 'published' | 'scheduled'
  scheduled_at: string
  meta_title: string
  meta_description: string
  author: string
  excerpt: string
  content: string
  reading_time: string
  keywords: string
  tone: 'neutral' | 'friendly' | 'expert'
  length: 'short' | 'standard' | 'long' | 'comparison'
}

interface PerplexityResponse {
  success: boolean
  error?: string
  content: string
  excerpt: string
  meta_title: string
  meta_description: string
  tags: string[]
  reading_time?: number
  featured_image_suggestion?: string
}

// ✅ Dynamic category type
interface DbCategory {
  name: string
  slug: string
}

export default function BlogPostForm({
  initialData,
}: {
  initialData?: InitialData
}) {
  const [formData, setFormData] = useState<FormDataState>({
    title: '',
    slug: '',
    featured_image: '',
    category: 'AI Tools',
    tags: '',
    status: 'published',
    scheduled_at: '',
    meta_title: '',
    meta_description: '',
    author: '',
    excerpt: '',
    content: '',
    reading_time: '',
    keywords: '',
    tone: 'neutral',
    length: 'standard',
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [isEdit, setIsEdit] = useState(false)
  const [aiGenerating, setAiGenerating] = useState(false)
  const [featuredImageSuggestion, setFeaturedImageSuggestion] = useState('')
  const [dbCategories, setDbCategories] = useState<DbCategory[]>([])
  const [fetchingCategories, setFetchingCategories] = useState(true)

  // ✅ NEW: track custom category mode + value
  const [categoryMode, setCategoryMode] = useState<'preset' | 'custom'>(
    'preset'
  )
  const [customCategory, setCustomCategory] = useState('')

  // ✅ NEW: Comparison Generator States
  const [showComparisonGenerator, setShowComparisonGenerator] = useState(false)
  const [selectedToolA, setSelectedToolA] = useState('')
  const [selectedToolB, setSelectedToolB] = useState('')
  const [availableTools, setAvailableTools] = useState<Array<{ id: string; name: string; slug: string; logo: string }>>([])
  const [generatingComparison, setGeneratingComparison] = useState(false)

  const router = useRouter()

  // ✅ NEW: ref to the content textarea
  const contentRef = useRef<HTMLTextAreaElement | null>(null)

  // ✅ UPDATED: Handle template insertion at cursor
  const handleInsertTemplate = (html: string) => {
    const textarea = contentRef.current

    // Fallback: if ref missing, append at end
    if (!textarea) {
      setFormData((prev) => ({
        ...prev,
        content: prev.content + (prev.content ? '\n\n' : '') + html,
      }))
      return
    }

    const { selectionStart, selectionEnd } = textarea
    const current = formData.content || ''

    const before = current.slice(0, selectionStart)
    const after = current.slice(selectionEnd)

    const next = before + html + after

    setFormData((prev) => ({
      ...prev,
      content: next,
    }))

    // Move caret after inserted template
    requestAnimationFrame(() => {
      const pos = before.length + html.length
      textarea.focus()
      textarea.selectionStart = textarea.selectionEnd = pos
    })
  }

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        slug: initialData.slug || '',
        featured_image: initialData.featured_image || '',
        category: initialData.category || 'AI Tools',
        tags: initialData.tags?.join(', ') || '',
        status: initialData.status || 'published',
        scheduled_at: initialData.scheduled_at
          ? (() => {
            const date = new Date(initialData.scheduled_at)
            const offset = date.getTimezoneOffset()
            const localDate = new Date(date.getTime() - offset * 60 * 1000)
            return localDate.toISOString().slice(0, 16)
          })()
          : '',
        meta_title: initialData.meta_title || '',
        meta_description: initialData.meta_description || '',
        author: initialData.author || '',
        excerpt: initialData.excerpt || '',
        content: initialData.content || '',
        reading_time: initialData.reading_time?.toString() || '',
        keywords: '',
        tone: 'neutral',
        length: 'standard',
      })
      setIsEdit(true)

      // If existing category is not in presets, switch to custom mode
      if (initialData.category) {
        // We will check against dbCategories in a separate effect once they load
      }
    }
  }, [initialData])

  // ✅ NEW: Fetch categories from DB
  useEffect(() => {
    async function loadCategories() {
      setFetchingCategories(true)
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('name, slug')
          .order('name', { ascending: true })

        if (!error && data) {
          setDbCategories(data)

          // Legacy check: if initialData exists and category is not in the list, set custom
          if (initialData?.category) {
            const exists = data.some(c => c.name === initialData.category)
            if (!exists) {
              setCategoryMode('custom')
              setCustomCategory(initialData.category)
            }
          }
        }
      } catch (err) {
        console.error('Error fetching categories:', err)
      } finally {
        setFetchingCategories(false)
      }
    }
    loadCategories()
  }, [initialData])

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Auto-generate slug when title changes (only for new posts)
    if (name === 'title' && !isEdit) {
      setFormData((prev) => ({ ...prev, slug: generateSlug(value) }))
    }
  }

  // ✅ NEW: handle category select change
  const handleCategorySelectChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = e.target.value

    if (value === '__custom__') {
      setCategoryMode('custom')
      // keep formData.category as-is for now; will overwrite on submit
    } else {
      setCategoryMode('preset')
      setCustomCategory('')
      setFormData((prev) => ({ ...prev, category: value }))
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      // Resolve final category value: preset or custom
      const finalCategory =
        categoryMode === 'custom' && customCategory.trim()
          ? customCategory.trim()
          : formData.category

      // ✅ NEW: Resolve final category slug from DB if preset
      let finalCategorySlug = ''
      if (categoryMode === 'preset') {
        const matchingCat = dbCategories.find(c => c.name === formData.category)
        if (matchingCat) {
          finalCategorySlug = matchingCat.slug
        }
      }

      // Auto-extract featured image from content if not provided
      let featuredImage = formData.featured_image
      if (!featuredImage && formData.content) {
        const imgMatch = formData.content.match(/<img[^>]+src="([^">]+)"/)
        if (imgMatch && imgMatch[1]) {
          featuredImage = imgMatch[1]
        }
      }

      // Auto-calculate reading time if empty
      let readingTime = formData.reading_time
        ? parseInt(formData.reading_time, 10)
        : 5
      if (!formData.reading_time && formData.content) {
        readingTime = Math.max(3, Math.round(formData.content.length / 1200))
      }

      // Create FormData
      const data = new FormData()
      data.append('title', formData.title)
      data.append('slug', formData.slug || generateSlug(formData.title))
      data.append('content', formData.content)
      data.append('excerpt', formData.excerpt)
      data.append('author', formData.author || 'Admin')
      data.append('category', finalCategory)
      if (finalCategorySlug) {
        data.append('category_slug', finalCategorySlug)
      }
      data.append('tags', formData.tags)
      data.append('featured_image', featuredImage || '')
      data.append('status', formData.status)
      // FIX: Ensure we send a proper ISO string for the server to interpret correctly
      if (formData.scheduled_at) {
        data.append('scheduled_at', new Date(formData.scheduled_at).toISOString())
      } else {
        data.append('scheduled_at', '')
      }
      data.append('reading_time', readingTime.toString())

      let result: { success: boolean; error?: string }
      if (isEdit && initialData?.id) {
        result = await updateBlogPost(initialData.id, data)
      } else {
        result = await createBlogPost(data)
      }

      if (result.success) {
        setSuccess(true)
        setSuccessMessage(
          `Post ${isEdit ? 'updated' : 'created'} successfully! Redirecting...`
        )
        router.refresh()
        setTimeout(() => {
          router.push('/admin/blog')
        }, 500)
      } else {
        setError(result.error || 'Failed to save post')
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err))
      setError(error.message || 'An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  // ✅ IMPROVED: Handle AI generation with content cleaning
  const handleAiGenerate = async () => {
    if (!formData.title.trim()) {
      setError('Please enter a title first')
      return
    }

    setAiGenerating(true)
    setError(null)
    setFeaturedImageSuggestion('')

    try {
      const formDataToSend = new FormData()
      formDataToSend.append('title', formData.title)

      // Use final category (respect custom mode for AI context too)
      const aiCategory =
        categoryMode === 'custom' && customCategory.trim()
          ? customCategory.trim()
          : formData.category

      formDataToSend.append('category', aiCategory)
      formDataToSend.append('keywords', formData.keywords)
      formDataToSend.append('tone', formData.tone)

      // ✅ AUTO-DETECT COMPARISON MODE
      const finalLength = (aiCategory.toLowerCase().includes('comparison') || formData.length === 'comparison')
        ? 'comparison'
        : formData.length
      formDataToSend.append('length', finalLength)

      const response = await fetch('/api/perplexity', {
        method: 'POST',
        body: formDataToSend,
      })

      const result: PerplexityResponse = await response.json()

      if (result.success) {
        // ✅ NEW: Clean up AI content before using it
        const cleanedContent = cleanAiContent(result.content)

        // AUTO-FILL ALL FIELDS
        setFormData((prev) => ({
          ...prev,
          content: cleanedContent, // Use cleaned content
          excerpt: result.excerpt,
          meta_title: result.meta_title,
          meta_description: result.meta_description,
          tags: result.tags.join(', '),
          reading_time: result.reading_time?.toString() || '5',
        }))

        // NEW: Store featured image suggestion and show UI
        if (result.featured_image_suggestion) {
          setFeaturedImageSuggestion(result.featured_image_suggestion)
        }

        // Show success message
        setSuccessMessage('✅ Content + SEO fields generated!')
        setTimeout(() => setSuccessMessage(''), 5000) // Auto-hide after 5s
      } else {
        setError(result.error || 'Generation failed')
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err))
      setError(`Error: ${error.message}`)
      console.error('Perplexity API error:', err)
    } finally {
      setAiGenerating(false)
    }
  }

  // ✅ NEW: Load available tools on mount
  useEffect(() => {
    async function loadTools() {
      const { data, error } = await supabase
        .from('ai_tools')
        .select('id, name, slug, logo')
        .eq('published', true)
        .order('name', { ascending: true })

      if (!error && data) {
        setAvailableTools(data)
      }
    }
    loadTools()
  }, [])

  // ✅ NEW: Handle comparison generation
  const handleGenerateComparison = async () => {
    if (!selectedToolA || !selectedToolB) {
      setError('Please select both Tool A and Tool B')
      return
    }

    if (selectedToolA === selectedToolB) {
      setError('Please select two different tools')
      return
    }

    setGeneratingComparison(true)
    setError(null)

    try {
      const result = await generateComparisonData(selectedToolA, selectedToolB)

      if (result.success && result.data) {
        // Build the <script> tag with JSON (Widget Data)
        const scriptTag = `<script type="application/json" id="comparison-data">
${JSON.stringify(result.data, null, 2)}
</script>`

        // Insert into content editor
        setFormData((prev) => ({
          ...prev,
          content: scriptTag,
          category: 'Comparisons',
          length: 'comparison',
          // ✅ Auto-generate featured image for comparisons (Dynamic OG)
          // Use relative path for Next.js Image component compatibility
          featured_image: `/api/og?a=${encodeURIComponent(result.data.toolA.name)}&b=${encodeURIComponent(result.data.toolB.name)}`
        }))

        // Auto-suggest title if empty
        const suggestedTitle = `${result.data.toolA.name} vs ${result.data.toolB.name}: Which AI Tool is Better in 2026?`
        if (!formData.title || formData.title.trim() === '') {
          setFormData((prev) => ({
            ...prev,
            title: suggestedTitle,
            slug: generateSlug(suggestedTitle),
          }))
        }

        setSuccessMessage('✅ Comparison data generated successfully!')
        setTimeout(() => setSuccessMessage(''), 3000)
        setShowComparisonGenerator(false)
      } else {
        setError(result.error || 'Failed to generate comparison data')
      }
    } catch (err) {
      setError('An error occurred while generating comparison')
      console.error(err)
    } finally {
      setGeneratingComparison(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-8 bg-slate-900 rounded-lg">
      <h1 className="text-3xl font-bold text-slate-100 mb-8">
        {isEdit ? 'Edit Post' : 'New Post'}
      </h1>

      {/* Success Message */}
      {success && (
        <div className="mb-6 p-4 bg-green-900/50 border border-green-700 rounded-lg text-green-300">
          ✅ Post {isEdit ? 'updated' : 'created'} successfully! Redirecting...
        </div>
      )}

      {/* AI Generation Success Message */}
      {successMessage && (
        <div className="mb-6 p-4 bg-blue-900/50 border border-blue-700 rounded-lg text-blue-300 animate-pulse">
          {successMessage}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-900/50 border border-red-700 rounded-lg text-red-300">
          ❌ {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* TITLE FIELD */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Post Title <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="w-full p-4 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
            placeholder="Best AI Tools for Creators (2025)"
            required
          />
        </div>

        {/* SLUG FIELD */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            URL Slug <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            name="slug"
            value={formData.slug}
            onChange={handleInputChange}
            className="w-full p-4 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:ring-2 focus:ring-cyan-400 focus:border-transparent font-mono"
            placeholder="best-ai-tools-for-creators-2025"
            required
          />
          <p className="text-xs text-slate-500 mt-2">
            URL: /blog/
            <span className="text-cyan-400">
              {formData.slug || 'your-slug-here'}
            </span>
          </p>
        </div>

        {/* AUTHOR FIELD */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Author <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            name="author"
            value={formData.author}
            onChange={handleInputChange}
            className="w-full p-4 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
            placeholder="Your Name"
            required
          />
        </div>

        {/* CATEGORY FIELD – PRESET + CUSTOM */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Category <span className="text-red-400">*</span>
          </label>
          <div className="space-y-2">
            <select
              name="category-select"
              value={categoryMode === 'preset' ? formData.category : '__custom__'}
              onChange={handleCategorySelectChange}
              className="w-full p-4 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:ring-2 focus:ring-cyan-400 focus:border-transparent disabled:opacity-50"
              required
              disabled={fetchingCategories}
            >
              {fetchingCategories ? (
                <option>Loading categories...</option>
              ) : (
                <>
                  {dbCategories.map((cat) => (
                    <option key={cat.slug} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </>
              )}
              <option value="__custom__">➕ Custom category…</option>
            </select>

            {categoryMode === 'custom' && (
              <input
                type="text"
                name="customCategory"
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                className="w-full p-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                placeholder="e.g., Email Marketing"
              />
            )}

            <p className="text-xs text-slate-500">
              Choose an existing category or add a new one. New categories will
              appear automatically in filters.
            </p>
          </div>
        </div>

        {/* TAGS FIELD */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Tags (comma-separated)
          </label>
          <input
            type="text"
            name="tags"
            value={formData.tags}
            onChange={handleInputChange}
            className="w-full p-4 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
            placeholder="chatgpt, ai writing, content creation"
          />
          <p className="text-xs text-slate-500 mt-2">
            Separate tags with commas. Example: chatgpt, ai writing, automation
          </p>
        </div>

        {/* READING TIME FIELD */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Reading Time (minutes)
          </label>
          <input
            type="number"
            name="reading_time"
            value={formData.reading_time}
            onChange={handleInputChange}
            min="1"
            max="60"
            className="w-full p-4 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
            placeholder="5"
          />
          <p className="text-xs text-slate-500 mt-2">
            Leave empty to auto-calculate from content (~1200 chars = 1 minute,
            minimum 3 minutes)
          </p>
        </div>

        {/* FEATURED IMAGE FIELD */}
        <div className="bg-slate-800/30 p-6 rounded-xl border border-slate-700/50">
          <label className="block text-sm font-bold text-slate-200 uppercase tracking-widest mb-4">
            Featured Visual Asset
          </label>

          <div className="grid md:grid-cols-2 gap-8 items-start">
            <ImageUpload
              currentImage={formData.featured_image}
              onImageChange={(url) => setFormData(prev => ({ ...prev, featured_image: url || '' }))}
              folder="blog"
              label="Upload Cover Image"
            />

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                  OR: External Asset URL
                </label>
                <input
                  type="url"
                  name="featured_image"
                  value={formData.featured_image}
                  onChange={handleInputChange}
                  className="w-full p-4 bg-slate-800 border-2 border-slate-700 rounded-xl text-slate-200 focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all"
                  placeholder="https://images.unsplash.com/photo-..."
                />
              </div>
              <p className="text-xs text-slate-500 italic">
                Note: Uploaded images are optimized and served via our global CDN for maximum speed.
              </p>
            </div>
          </div>
        </div>

        {/* ✅ NEW: CONTENT TEMPLATES */}
        <ContentTemplates onInsert={handleInsertTemplate} />

        {/* AI GENERATION CONTROLS SECTION */}
        <div className="border-t border-slate-700 pt-6 mt-6 bg-slate-800/30 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-slate-200 mb-4">
            ✨ AI Content Generation
          </h3>
          <p className="text-xs text-slate-400 mb-4">
            Customize how Perplexity generates your content. Title and category
            are always used.
          </p>

          {/* KEYWORDS FIELD */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Primary Keywords (optional)
            </label>
            <input
              type="text"
              name="keywords"
              value={formData.keywords}
              onChange={handleInputChange}
              className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-200 focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
              placeholder="e.g., ChatGPT, AI writing tools, content automation"
            />
            <p className="text-xs text-slate-500 mt-2">
              Comma-separated. AI will integrate these into the content and SEO
              fields.
            </p>
          </div>

          {/* TONE & LENGTH SELECTORS */}
          <div className="mb-4 grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Tone
              </label>
              <select
                name="tone"
                value={formData.tone}
                onChange={handleInputChange}
                className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-200 focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
              >
                <option value="neutral">
                  Neutral (Professional, Balanced)
                </option>
                <option value="friendly">
                  Friendly (Conversational, Helpful)
                </option>
                <option value="expert">
                  Expert (Technical, Authoritative)
                </option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Length
              </label>
              <select
                name="length"
                value={formData.length}
                onChange={handleInputChange}
                className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-200 focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
              >
                <option value="short">Short (500-800 words)</option>
                <option value="standard">Standard (1200-1500 words)</option>
                <option value="long">Long (2000+ words)</option>
                <option value="comparison">
                  Comparison (Specialized Battle UI)
                </option>
              </select>
            </div>
          </div>

          {/* AI GENERATE BUTTON */}
          <button
            type="button"
            onClick={handleAiGenerate}
            disabled={aiGenerating || !formData.title.trim()}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-6 rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {aiGenerating ? '🔄 Generating content...' : '✨ Generate with Perplexity AI'}
          </button>
        </div>

        {/* FEATURED IMAGE SUGGESTION SECTION */}
        {featuredImageSuggestion && (
          <div className="border-l-4 border-amber-500 bg-amber-900/20 p-4 rounded-lg">
            <h4 className="text-sm font-semibold text-amber-200 mb-2">
              💡 Featured Image Suggestion
            </h4>
            <p className="text-sm text-amber-100 mb-3">
              {featuredImageSuggestion}
            </p>
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(featuredImageSuggestion)
                setSuccessMessage('✅ Image description copied to clipboard!')
                setTimeout(() => setSuccessMessage(''), 3000)
              }}
              className="text-sm px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded transition-colors"
            >
              Copy Description
            </button>
          </div>
        )}

        {/* ✅ NEW: COMPARISON GENERATOR SECTION */}
        <div className="border-t border-slate-700 pt-6 mt-6">
          <button
            type="button"
            onClick={() => setShowComparisonGenerator(!showComparisonGenerator)}
            className="w-full bg-gradient-to-r from-cyan-600 to-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:from-cyan-700 hover:to-purple-700 transition-all flex items-center justify-between"
          >
            <span>🆚 Auto-Generate Comparison</span>
            <span>{showComparisonGenerator ? '▼' : '▶'}</span>
          </button>

          {showComparisonGenerator && (
            <div className="mt-4 p-6 bg-slate-800 border border-slate-700 rounded-lg space-y-4">
              <p className="text-sm text-slate-300 mb-4">
                Select two tools to automatically generate a comparison blog post. The system will pull data from existing tool review pages.
              </p>

              {/* Tool A Selection */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Tool A
                </label>
                <select
                  value={selectedToolA}
                  onChange={(e) => setSelectedToolA(e.target.value)}
                  className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-200 focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                >
                  <option value="">Select first tool...</option>
                  {availableTools.map((tool) => (
                    <option key={tool.id} value={tool.slug}>
                      {tool.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Tool B Selection */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Tool B
                </label>
                <select
                  value={selectedToolB}
                  onChange={(e) => setSelectedToolB(e.target.value)}
                  className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-200 focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                >
                  <option value="">Select second tool...</option>
                  {availableTools.map((tool) => (
                    <option key={tool.id} value={tool.slug}>
                      {tool.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Generate Button */}
              <button
                type="button"
                onClick={handleGenerateComparison}
                disabled={generatingComparison || !selectedToolA || !selectedToolB}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-6 rounded-lg font-medium hover:from-green-700 hover:to-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {generatingComparison ? '🔄 Generating comparison...' : '🚀 Generate Comparison Data'}
              </button>

              <p className="text-xs text-slate-500 mt-3">
                💡 After generation, you can still edit the title, meta description, tags, and content as needed.
              </p>
            </div>
          )}
        </div>

        {/* HTML CONTENT FIELD */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Post Content (HTML) <span className="text-red-400">*</span>
          </label>
          <textarea
            ref={contentRef}
            name="content"
            value={formData.content}
            onChange={handleInputChange}
            rows={20}
            className="w-full p-4 bg-slate-800 border border-slate-700 rounded-lg font-mono text-sm text-slate-200 focus:ring-2 focus:ring-cyan-400 focus:border-transparent resize-vertical"
            placeholder="<p>Your HTML content here...</p>"
            required
          />
          <p className="text-xs text-slate-500 mt-2">
            {formData.content.length} characters
          </p>
        </div>

        {/* EXCERPT FIELD */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Excerpt (Optional - Auto-generated if empty)
          </label>
          <textarea
            name="excerpt"
            value={formData.excerpt}
            onChange={handleInputChange}
            rows={3}
            maxLength={200}
            className="w-full p-4 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:ring-2 focus:ring-cyan-400 focus:border-transparent resize-none"
            placeholder="Brief summary of the post (160 characters recommended)"
          />
          <p className="text-xs text-slate-500 mt-2">
            {formData.excerpt.length}/200 characters
          </p>
        </div>

        {/* SEO SECTION */}
        <div className="border-t border-slate-700 pt-6 mt-6">
          <h3 className="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
            🔍 SEO Settings
            <span className="text-xs font-normal text-slate-500">
              (Optional - Auto-generated if empty)
            </span>
          </h3>

          {/* META TITLE */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Meta Title
              <span className="text-xs text-slate-500 ml-2">
                ({formData.meta_title.length}/60 characters)
              </span>
            </label>
            <input
              type="text"
              name="meta_title"
              value={formData.meta_title}
              onChange={handleInputChange}
              maxLength={60}
              className="w-full p-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
              placeholder="Leave empty to use post title"
            />
          </div>

          {/* META DESCRIPTION */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Meta Description
              <span className="text-xs text-slate-500 ml-2">
                ({formData.meta_description.length}/160 characters)
              </span>
            </label>
            <textarea
              name="meta_description"
              value={formData.meta_description}
              onChange={handleInputChange}
              maxLength={160}
              rows={3}
              className="w-full p-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:ring-2 focus:ring-cyan-400 focus:border-transparent resize-none"
              placeholder="Leave empty to auto-generate from content"
            />
          </div>
        </div>

        {/* STATUS & SCHEDULING */}
        <div className="border-t border-slate-700 pt-6 mt-6">
          <h3 className="text-lg font-semibold text-slate-200 mb-4">
            📅 Publishing Options
          </h3>

          {/* STATUS SELECTOR */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Status <span className="text-red-400">*</span>
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="w-full p-4 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
              required
            >
              <option value="draft">Draft (Hidden)</option>
              <option value="published">Published (Live now)</option>
              <option value="scheduled">Scheduled (Future date)</option>
            </select>
          </div>

          {/* SCHEDULED DATE */}
          {formData.status === 'scheduled' && (
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Schedule Date & Time <span className="text-red-400">*</span>
              </label>
              <input
                type="datetime-local"
                name="scheduled_at"
                value={formData.scheduled_at}
                onChange={handleInputChange}
                className="w-full p-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                required
              />
              <p className="text-xs text-slate-500 mt-2">
                Post will be published automatically at this date/time
              </p>
            </div>
          )}
        </div>

        {/* SUBMIT BUTTONS */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading || aiGenerating}
            className="flex-1 bg-gradient-to-r from-cyan-400 to-indigo-500 text-white py-3 px-6 rounded-lg font-medium hover:from-cyan-500 hover:to-indigo-600 transition-all disabled:opacity-50"
          >
            {loading ? 'Saving...' : isEdit ? 'Update Post' : 'Create Post'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 border border-slate-700 text-slate-300 rounded-lg hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
