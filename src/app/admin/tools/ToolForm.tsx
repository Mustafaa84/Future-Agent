'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import FeatureRepeater from '@/components/admin/repeaters/FeatureRepeater'
import PricingRepeater from '@/components/admin/repeaters/PricingRepeater'
import ProsConsRepeater from '@/components/admin/repeaters/ProsConsRepeater'
import FAQRepeater from '@/components/admin/repeaters/FAQRepeater'
import ReviewSectionsRepeater from '@/components/admin/repeaters/ReviewSectionsRepeater'
import WorkflowStepsRepeater from '@/components/admin/repeaters/WorkflowStepsRepeater'
import ComparisonTableRepeater from '@/components/admin/repeaters/ComparisonTableRepeater'
import AlternativesRepeater from '@/components/admin/repeaters/AlternativesRepeater'
import CategorySelect from '@/components/admin/CategorySelect'
import TagsSelect from '@/components/admin/TagsSelect'
import ImageUpload from '@/components/ImageUpload'
/* eslint-disable @typescript-eslint/no-explicit-any */

type Tool = any

interface ToolFormProps {
  mode: 'create' | 'edit'
  toolId?: string
}

export default function ToolForm({ mode, toolId }: ToolFormProps) {
  const router = useRouter()
  const isEdit = mode === 'edit'
  const [tool, setTool] = useState<Tool | null>(null)
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isEdit && toolId) {
      const fetchTool = async () => {
        try {
          const { data, error } = await supabase
            .from('ai_tools')
            .select('*')
            .eq('id', toolId)
            .single()

          if (error) throw error

          setTool(data)
        } catch (err: any) {
          setError(err.message)
        } finally {
          setLoading(false)
        }
      }
      fetchTool()
    } else {
      setLoading(false)
    }
  }, [isEdit, toolId])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSaving(true)
    setError('')

    const formData = new FormData(e.currentTarget)

    const parseJsonField = (name: string): any => {
      const value = formData.get(name) as string
      if (!value || value.trim() === '') return null
      try {
        return JSON.parse(value)
      } catch {
        setError(`Invalid JSON in field: ${name}. Please check the format.`)
        return null
      }
    }

    const payload: Partial<Tool> = {
      // Basic Info
      name: formData.get('name') as string,
      slug: (formData.get('name') as string)
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, ''),
      tagline: (formData.get('tagline') as string) || null,
      description: formData.get('description') as string,
      category: formData.get('category') as string,
      logo: (formData.get('logo') as string) || null,

      // URLs
      website_url: (formData.get('website_url') as string) || null,
      // Legacy: no longer used by CTAs, kept only so old data is not lost.
      affiliate_url: (formData.get('affiliate_url') as string) || null,

      // Rating
      rating: parseFloat(formData.get('rating') as string) || 0,
      review_count: parseInt(formData.get('review_count') as string) || 0,

      // Pricing Info
      pricing_model: (formData.get('pricing_model') as string) || null,
      starting_price: (formData.get('starting_price') as string) || null,
      free_trial: formData.get('free_trial') === 'on',

      // Status
      published: formData.get('published') === 'on',
      published_date: (() => {
        const isPublished = formData.get('published') === 'on'
        const dateValue = formData.get('published_date') as string

        if (!isPublished) return null
        if (dateValue) return new Date(dateValue).toISOString()
        return new Date().toISOString()
      })(),
      featured: formData.get('featured') === 'on',

      // Content
      review_intro: (formData.get('review_intro') as string) || null,

      // SEO
      meta_title: (formData.get('meta_title') as string) || null,
      meta_description: (formData.get('meta_description') as string) || null,
      og_image: (formData.get('og_image') as string) || null,

      // JSON fields (legacy)
      review_sections: parseJsonField('review_sections_json'),
      tags: parseJsonField('tags_json'),
      workflow_steps: parseJsonField('workflow_steps_json'),
    }

    if (error) {
      setSaving(false)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    try {
      if (isEdit && toolId) {
        const { error } = await supabase.from('ai_tools').update(payload).eq('id', toolId)

        if (error) throw error
      } else {
        const { data: newTool, error: insertError } = await supabase
          .from('ai_tools')
          .insert([payload])
          .select()
          .single()

        if (insertError) throw insertError

        const newToolId = newTool.id

        const featuresData = (window as any).__featuresData
        const prosData = (window as any).__prosData
        const consData = (window as any).__consData
        const pricingData = (window as any).__pricingData
        const faqsData = (window as any).__faqsData
        const alternativesData = (window as any).__alternativesData
        const comparisonData = (window as any).__comparisonData

        // Features
        if (featuresData && featuresData.length > 0) {
          const features = featuresData.map((f: any, index: number) => ({
            tool_id: newToolId,
            icon: f.icon,
            title: f.title,
            description: f.description,
            sort_order: index,
          }))
          await supabase.from('tool_features').insert(features)
        }

        // Pros
        if (prosData && prosData.length > 0) {
          const pros = prosData.map((p: any, index: number) => ({
            tool_id: newToolId,
            text: p.text,
            sort_order: index,
          }))
          await supabase.from('tool_pros').insert(pros)
        }

        // Cons
        if (consData && consData.length > 0) {
          const cons = consData.map((c: any, index: number) => ({
            tool_id: newToolId,
            text: c.text,
            sort_order: index,
          }))
          await supabase.from('tool_cons').insert(cons)
        }

        // Pricing plans
        if (pricingData && pricingData.length > 0) {
          const plans = pricingData.map((p: any, index: number) => ({
            tool_id: newToolId,
            plan_name: p.plan_name,
            price: p.price,
            features: p.features,
            is_popular: p.is_popular || false,
            sort_order: index,
          }))
          await supabase.from('tool_pricing_plans').insert(plans)
        }

        // FAQs
        if (faqsData && faqsData.length > 0) {
          const faqs = faqsData.map((f: any, index: number) => ({
            tool_id: newToolId,
            question: f.question,
            answer: f.answer,
            sort_order: index,
          }))
          await supabase.from('tool_faqs').insert(faqs)
        }

        // Alternatives
        if (alternativesData && alternativesData.length > 0) {
          const alternatives = alternativesData.map((a: any, index: number) => ({
            tool_id: newToolId,
            alternative_name: a.alternative_name,
            alternative_slug: a.alternative_slug,
            reason: a.reason,
            sort_order: index,
          }))
          await supabase.from('tool_alternatives').insert(alternatives)
        }

        // Comparison table
        if (comparisonData && comparisonData.length > 0) {
          const comparison = comparisonData.map((c: any, index: number) => ({
            tool_id: newToolId,
            feature_name: c.feature_name,
            this_tool_value: c.this_tool_value,
            competitor_1_name: c.competitor_1_name,
            competitor_1_value: c.competitor_1_value,
            competitor_2_name: c.competitor_2_name,
            competitor_2_value: c.competitor_2_value,
            sort_order: index,
          }))
          await supabase.from('tool_comparisons').insert(comparison)
        }

        // Review sections
        const reviewSectionsData = (window as any).__reviewSectionsData
        if (reviewSectionsData && reviewSectionsData.length > 0) {
          const { data: reviewData, error: reviewError } = await supabase
            .from('tool_reviews')
            .insert([
              {
                tool_id: newToolId,
                intro: payload.review_intro || '',
              },
            ])
            .select()
            .single()

          if (reviewError) throw reviewError

          const sections = reviewSectionsData.map((s: any, index: number) => ({
            review_id: reviewData.id,
            title: s.title,
            content: s.content,
            sort_order: index,
          }))
          await supabase.from('tool_review_sections').insert(sections)
        }
      }

      router.push('/admin/tools')
      router.refresh()
    } catch (err: any) {
      setError(err.message)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
    setSaving(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-white text-lg">Loading tool...</div>
      </div>
    )
  }

  if (error && !tool) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <div className="bg-red-900/20 border border-red-700 rounded-xl p-6">
          <p className="text-red-400 mb-4">Error: {error}</p>
          <Link href="/admin/tools" className="text-cyan-400 hover:text-cyan-300 underline">
            ← Back to Tools
          </Link>
        </div>
      </div>
    )
  }

  const t = tool || {}

  const inputClass =
    'w-full px-4 py-3 bg-white/5 border-2 border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400 focus:bg-white/10 transition-all'
  const textareaClass =
    'w-full px-4 py-3 bg-white/5 border-2 border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400 focus:bg-white/10 transition-all resize-vertical'

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">
                      {isEdit ? `Edit ${t.name || 'Tool'}` : 'Add New AI Tool'}
          </h1>
          <p className="text-slate-300">
            Fill in all sections to create a complete tool review page
          </p>
        </div>
        <Link
          href="/admin/tools"
          className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl border border-slate-600 transition-all font-medium"
        >
          ← Back
        </Link>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="mb-6 p-4 bg-red-900/30 border-2 border-red-600 rounded-xl text-red-200">
          <strong>Error:</strong> {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* 1. HERO SECTION */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
            <span className="text-3xl">ℹ️</span>
            Hero Section
          </h2>
          <p className="text-slate-300 mb-6 text-sm">Appears at the top of the review page</p>

          <div className="space-y-6">
            {/* Tool Name */}
            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                Tool Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="name"
                defaultValue={t.name || ''}
                required
                placeholder="e.g., ChatGPT, Midjourney"
                className={inputClass}
              />
            </div>

            {/* Tool Logo Upload */}
            <ImageUpload
              currentImage={t.logo || ''}
              onImageChange={(url) => {
                const logoInput = document.querySelector(
                  'input[name="logo"]',
                ) as HTMLInputElement
                if (logoInput) logoInput.value = url || ''
              }}
              folder="logos"
              label="Tool Logo (or use emoji below)"
            />

            {/* Emoji fallback */}
            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                Logo Emoji (fallback if no image)
              </label>
              <input
                type="text"
                name="logo"
                defaultValue={t.logo || ''}
                placeholder="🤖"
                className={`${inputClass} text-2xl text-center`}
              />
            </div>

            {/* Rest of fields in grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <label className="block text-sm font-semibold text-white mb-2">Tagline</label>
                <input
                  type="text"
                  name="tagline"
                  defaultValue={t.tagline || ''}
                  placeholder="AI writing assistant that helps create content"
                  className={inputClass}
                />
              </div>

              <CategorySelect defaultValue={t.category || ''} required />

              <div className="lg:col-span-3">
                <label className="block text-sm font-semibold text-white mb-2">
                  Description <span className="text-red-400">*</span>
                </label>
                <textarea
                  name="description"
                  defaultValue={t.description || ''}
                  required
                  rows={3}
                  placeholder="Main description shown in hero section..."
                  className={textareaClass}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-white mb-2">Rating (0-5)</label>
                <input
                  type="number"
                  name="rating"
                  defaultValue={t.rating || 4.5}
                  step="0.1"
                  min="0"
                  max="5"
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-white mb-2">Review Count</label>
                <input
                  type="number"
                  name="review_count"
                  defaultValue={t.review_count || 0}
                  min="0"
                  className={inputClass}
                />
              </div>
            </div>
          </div>
        </div>

        {/* 2. LINKS */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
            <span className="text-3xl">🔗</span>
            Links & URLs
          </h2>
          <p className="text-slate-300 mb-6 text-sm">
            Website URL is the official site. Affiliate redirects are now managed in Affiliate
            Links (/admin/affiliate-links).
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-white mb-2">Website URL</label>
              <input
                type="url"
                name="website_url"
                defaultValue={t.website_url || ''}
                placeholder="https://example.com"
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                Affiliate URL (legacy, not used by CTAs)
              </label>
              <input
                type="url"
                name="affiliate_url"
                defaultValue={t.affiliate_url || ''}
                placeholder="https://affiliate-link.com"
                className={inputClass}
              />
            </div>
          </div>
        </div>

        {/* 3. REVIEW CONTENT */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
            <span className="text-3xl">📝</span>
            In-Depth Review
          </h2>
                   <p className="text-slate-300 mb-6 text-sm">Our [Tool] Review section</p>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-white mb-2">Review Intro</label>
              <textarea
                name="review_intro"
                defaultValue={t.review_intro || ''}
                rows={3}
                placeholder="Opening paragraph..."
                className={textareaClass}
              />
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Review Sections</h3>
              <ReviewSectionsRepeater toolId={toolId || null} mode={mode} />
            </div>
          </div>
        </div>

        {/* 4. PRICING */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
            <span className="text-3xl">💰</span>
            Pricing Plans
          </h2>
          <p className="text-slate-300 mb-6 text-sm">3-column pricing grid</p>

          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-white mb-2">Pricing Model</label>
                <select
                  name="pricing_model"
                  defaultValue={t.pricing_model || ''}
                  className={inputClass}
                >
                  <option value="">Select...</option>
                  <option value="Free">Free</option>
                  <option value="Freemium">Freemium</option>
                  <option value="Paid">Paid</option>
                  <option value="Subscription">Subscription</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Starting Price
                </label>
                <input
                  type="text"
                  name="starting_price"
                  defaultValue={t.starting_price || ''}
                  placeholder="$20/month"
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Pricing Plans</h3>
              <PricingRepeater toolId={toolId || null} mode={mode} />
            </div>
          </div>
        </div>

        {/* 5. PROS & CONS */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
            <span className="text-3xl">✅</span>
            Pros & Cons
          </h2>
          <p className="text-slate-300 mb-6 text-sm">Green/red side-by-side boxes</p>

          <ProsConsRepeater toolId={toolId || null} mode={mode} />
        </div>

        {/* 6. FEATURES */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
            <span className="text-3xl">⭐</span>
            Key Features
          </h2>
          <p className="text-slate-300 mb-6 text-sm">3-column feature cards</p>

          <FeatureRepeater toolId={toolId || null} mode={mode} />
        </div>

        {/* 7. FAQ */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
            <span className="text-3xl">❓</span>
            FAQ
          </h2>
          <p className="text-slate-300 mb-6 text-sm">Question & answer cards</p>

          <FAQRepeater toolId={toolId || null} mode={mode} />
        </div>

        {/* 8. TAGS */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
            <span className="text-3xl">🏷️</span>
            Tags
          </h2>
          <p className="text-slate-300 mb-6 text-sm">
            Select tags to categorize this tool for SEO and quiz filtering
          </p>

          <TagsSelect defaultValue={t.tags || []} />
        </div>

        {/* 9. WORKFLOW STEPS */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
            <span className="text-3xl">📋</span>
            Getting Started Steps
          </h2>
          <p className="text-slate-300 mb-6 text-sm">How-to workflow (optional)</p>

          <WorkflowStepsRepeater initialSteps={t.workflow_steps || []} />
        </div>

        {/* 10. COMPARISON TABLE */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
            <span className="text-3xl">📊</span>
            Comparison Table (Optional)
          </h2>
          <p className="text-slate-300 mb-6 text-sm">Compare vs alternatives</p>

          <ComparisonTableRepeater toolId={toolId || null} mode={mode} />
        </div>

        {/* 11. ALTERNATIVES */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
            <span className="text-3xl">🔍</span>
            Alternatives (Optional)
          </h2>
          <p className="text-slate-300 mb-6 text-sm">Link to other tool pages</p>

          <AlternativesRepeater toolId={toolId || null} mode={mode} />
        </div>

        {/* 12. PUBLISH DATE PICKER */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
            <span className="text-3xl">📅</span>
            Publish Schedule
          </h2>
          <p className="text-slate-300 mb-6 text-sm">Set when this tool should go live</p>

          <div>
            <label className="block text-sm font-semibold text-white mb-2">
              Publish Date & Time
            </label>
            <input
              type="datetime-local"
              name="published_date"
              defaultValue={
                t.published_date
                  ? new Date(t.published_date).toISOString().slice(0, 16)
                  : ''
              }
              className={inputClass}
            />
            <p className="text-xs text-slate-400 mt-2">
              💡 Leave empty to publish immediately. Set future date to schedule launch.
            </p>
          </div>
        </div>

        {/* 13. STATUS */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6">Status</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <label className="flex items-center gap-3 p-5 bg-white/5 rounded-xl border-2 border-slate-600 hover:border-cyan-400 transition-all cursor-pointer">
              <input
                type="checkbox"
                name="free_trial"
                defaultChecked={!!t.free_trial}
                className="w-5 h-5 text-cyan-500 rounded"
              />
              <span className="text-white font-medium">Free Trial</span>
            </label>

            <label className="flex items-center gap-3 p-5 bg-white/5 rounded-xl border-2 border-slate-600 hover:border-green-400 transition-all cursor-pointer">
              <input
                type="checkbox"
                name="published"
                defaultChecked={t.published ?? true}
                className="w-5 h-5 text-green-500 rounded"
              />
              <span className="text-white font-medium">Published</span>
            </label>

            <label className="flex items-center gap-3 p-5 bg-white/5 rounded-xl border-2 border-slate-600 hover:border-yellow-400 transition-all cursor-pointer">
              <input
                type="checkbox"
                name="featured"
                defaultChecked={!!t.featured}
                className="w-5 h-5 text-yellow-500 rounded"
              />
              <span className="text-white font-medium">Featured</span>
            </label>
          </div>
        </div>

        {/* 14. SEO */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <span className="text-3xl">🎯</span>
            SEO & Social
          </h2>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-white mb-2">Meta Title</label>
              <input
                type="text"
                name="meta_title"
                defaultValue={t.meta_title || ''}
                placeholder="Tool Name Review 2025"
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                Meta Description
              </label>
              <textarea
                name="meta_description"
                defaultValue={t.meta_description || ''}
                rows={2}
                placeholder="Complete review with features, pricing..."
                className={textareaClass}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                OG Image URL
              </label>
              <input
                type="url"
                name="og_image"
                defaultValue={t.og_image || ''}
                placeholder="https://example.com/og-image.jpg"
                className={inputClass}
              />
            </div>
          </div>
        </div>

        {/* SUBMIT */}
        <div className="flex gap-4 sticky bottom-0 bg-slate-900/95 backdrop-blur-sm border-t-2 border-slate-700 p-6 -mx-4 rounded-t-2xl">
          <button
            type="submit"
            disabled={saving}
            className="flex-1 px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-lg hover:shadow-cyan-500/25 transition-all text-lg"
          >
            {saving ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                {isEdit ? 'Saving...' : 'Creating...'}
              </span>
            ) : (
              isEdit ? '💾 Save Changes' : '✨ Create Tool'
            )}
          </button>

          <Link
            href="/admin/tools"
            className="px-8 py-4 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-xl border-2 border-slate-600 hover:border-slate-500 transition-all text-lg flex items-center justify-center"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}
/* eslint-enable @typescript-eslint/no-explicit-any */
