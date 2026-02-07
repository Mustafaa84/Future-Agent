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
import IntegrationsRepeater from '@/components/admin/repeaters/IntegrationsRepeater'
import AlternativesRepeater from '@/components/admin/repeaters/AlternativesRepeater'
import CategorySelect from '@/components/admin/CategorySelect'
import TagsSelect from '@/components/admin/TagsSelect'
import ImageUpload from '@/components/ImageUpload'
import { revalidateTool } from '@/app/actions/revalidate'
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

        // Integrations
        const integrationsData = (window as any).__integrationsData
        if (integrationsData && integrationsData.length > 0) {
          const integrations = integrationsData.map((d: any, index: number) => ({
            tool_id: newToolId,
            integration_name: d.integration_name,
            integration_logo: d.integration_logo,
            description: d.description,
            sort_order: index,
          }))
          await supabase.from('tool_integrations').insert(integrations)
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

      // Trigger On-Demand Revalidation (simplified - just revalidate the tool page and homepage)
      await revalidateTool(payload.slug || '')

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
    'w-full px-4 py-3 bg-white/5 border-2 border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:bg-white/10 transition-all font-medium'
  const textareaClass =
    'w-full px-4 py-3 bg-white/5 border-2 border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:bg-white/10 transition-all resize-vertical font-medium'

  const sectionHeaderClass = "text-2xl font-black text-white italic mb-2 tracking-tight flex items-center gap-3"
  const sectionDescClass = "text-slate-400 mb-8 text-sm font-medium"
  const sectionCardClass = "bg-slate-900 border border-slate-800 rounded-[2rem] p-10 relative overflow-hidden group shadow-2xl"

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-5xl font-black text-white italic tracking-tighter mb-2">
            {isEdit ? `Edit ${t.name || 'Tool'}` : 'Construct New Asset'}
          </h1>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">
            Future Agent Authority Report Builder
          </p>
        </div>
        <Link
          href="/admin/tools"
          className="px-8 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl border border-slate-700 transition-all font-black uppercase tracking-widest text-xs italic"
        >
          ← Return to Assets
        </Link>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="mb-8 p-6 bg-red-900/10 border-2 border-red-500/50 rounded-2xl text-red-200 backdrop-blur-xl">
          <strong className="font-black italic block mb-1">DEPLOYMENT_ERROR:</strong>
          <span className="font-medium">{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-12">
        {/* 1. HERO SECTION */}
        <div className={sectionCardClass}>
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>

          <div className="relative">
            <h2 className={sectionHeaderClass}>
              <span className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center text-lg not-italic">ℹ️</span>
              Hero Configuration
            </h2>
            <p className={sectionDescClass}>Primary brand elements and above-the-fold content</p>

            <div className="space-y-8">
              {/* Tool Name */}
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-3 ml-1">
                  Tool Identity <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  defaultValue={t.name || ''}
                  required
                  placeholder="e.g., PERPLEXITY, MIDJOURNEY"
                  className={inputClass}
                />
              </div>

              {/* Tool Logo Upload */}
              <div className="grid md:grid-cols-2 gap-8">
                <ImageUpload
                  currentImage={t.logo || ''}
                  onImageChange={(url) => {
                    const logoInput = document.querySelector(
                      'input[name="logo"]',
                    ) as HTMLInputElement
                    if (logoInput) logoInput.value = url || ''
                  }}
                  folder="logos"
                  label="Visual Logo (Recommended)"
                />

                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-3 ml-1">
                    Logo Fallback (Emoji)
                  </label>
                  <input
                    type="text"
                    name="logo"
                    defaultValue={t.logo || ''}
                    placeholder="🤖"
                    className={`${inputClass} text-3xl text-center py-6 bg-white/5`}
                  />
                </div>
              </div>

              {/* Rest of fields in grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 pt-4">
                <div className="lg:col-span-2">
                  <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-3 ml-1">Premium Tagline</label>
                  <input
                    type="text"
                    name="tagline"
                    defaultValue={t.tagline || ''}
                    placeholder="The authority in AI search and navigation..."
                    className={inputClass}
                  />
                </div>

                <CategorySelect defaultValue={t.category || ''} required />

                <div className="lg:col-span-3">
                  <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-3 ml-1">
                    Executive Summary <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="description"
                    defaultValue={t.description || ''}
                    required
                    rows={4}
                    placeholder="Main description shown in hero section..."
                    className={textareaClass}
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-3 ml-1">Expert Rating</label>
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
                  <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-3 ml-1">User Base Count</label>
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
        </div>

        {/* 2. LINKS */}
        <div className={sectionCardClass}>
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
          <div className="relative">
            <h2 className={sectionHeaderClass}>
              <span className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-lg not-italic">🔗</span>
              Connection Hub
            </h2>
            <p className={sectionDescClass}>External destinations and affiliate routing</p>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-3 ml-1">Official Website</label>
                <input
                  type="url"
                  name="website_url"
                  defaultValue={t.website_url || ''}
                  placeholder="https://official-domain.com"
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-3 ml-1">
                  Legacy Affiliate Link
                </label>
                <input
                  type="url"
                  name="affiliate_url"
                  defaultValue={t.affiliate_url || ''}
                  placeholder="https://redirect.link"
                  className={inputClass}
                />
              </div>
            </div>
          </div>
        </div>

        {/* 3. REVIEW CONTENT */}
        <div className={sectionCardClass}>
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
          <div className="relative">
            <h2 className={sectionHeaderClass}>
              <span className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-lg not-italic">📝</span>
              In-Depth Analysis
            </h2>
            <p className={sectionDescClass}>The core narrative of the Authority Report</p>

            <div className="space-y-8">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-3 ml-1">Report Intro</label>
                <textarea
                  name="review_intro"
                  defaultValue={t.review_intro || ''}
                  rows={4}
                  placeholder="Set the stage for the analysis..."
                  className={textareaClass}
                />
              </div>

              <div>
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white mb-6 bg-slate-800/50 py-2 px-4 rounded-lg inline-block italic">Analysis Modules</h3>
                <ReviewSectionsRepeater toolId={toolId || null} mode={mode} />
              </div>
            </div>
          </div>
        </div>

        {/* 4. PRICING */}
        <div className={sectionCardClass}>
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
          <div className="relative">
            <h2 className={sectionHeaderClass}>
              <span className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center text-lg not-italic">💰</span>
              Monetization Model
            </h2>
            <p className={sectionDescClass}>Structuring the tiers of investment</p>

            <div className="space-y-10">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-3 ml-1">Access Strategy</label>
                  <select
                    name="pricing_model"
                    defaultValue={t.pricing_model || ''}
                    className={inputClass}
                  >
                    <option value="">Select Structure...</option>
                    <option value="Free">Complimentary Access</option>
                    <option value="Freemium">Freemium Model</option>
                    <option value="Paid">Premium Exclusive</option>
                    <option value="Subscription">Recurrency-Based</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-3 ml-1">Entry Investment</label>
                  <input
                    type="text"
                    name="starting_price"
                    defaultValue={t.starting_price || ''}
                    placeholder="e.g. $20/MO or UPON REQUEST"
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white mb-6 bg-slate-800/50 py-2 px-4 rounded-lg inline-block italic">Tiered Structures</h3>
                <PricingRepeater toolId={toolId || null} mode={mode} />
              </div>
            </div>
          </div>
        </div>

        {/* 5. PROS & CONS */}
        <div className={sectionCardClass}>
          <div className="relative">
            <h2 className={sectionHeaderClass}>
              <span className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-lg not-italic">⚖️</span>
              Critical Evaluation
            </h2>
            <p className={sectionDescClass}>Balance of strengths and tactical limitations</p>

            <ProsConsRepeater toolId={toolId || null} mode={mode} />
          </div>
        </div>

        {/* 6. FEATURES */}
        <div className={sectionCardClass}>
          <div className="relative">
            <h2 className={sectionHeaderClass}>
              <span className="w-8 h-8 rounded-lg bg-yellow-500/10 flex items-center justify-center text-lg not-italic">✨</span>
              Unique Capabilities
            </h2>
            <p className={sectionDescClass}>Technical highlights and standard-defining features</p>

            <FeatureRepeater toolId={toolId || null} mode={mode} />
          </div>
        </div>

        {/* 7. FAQ */}
        <div className={sectionCardClass}>
          <div className="relative">
            <h2 className={sectionHeaderClass}>
              <span className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-lg not-italic">❓</span>
              Knowledge Base
            </h2>
            <p className={sectionDescClass}>Clarifying common inquiries and edge cases</p>

            <FAQRepeater toolId={toolId || null} mode={mode} />
          </div>
        </div>

        {/* 8. TAGS */}
        <div className={sectionCardClass}>
          <div className="relative">
            <h2 className={sectionHeaderClass}>
              <span className="w-8 h-8 rounded-lg bg-slate-500/10 flex items-center justify-center text-lg not-italic">🏷️</span>
              Taxonomy Settings
            </h2>
            <p className={sectionDescClass}>Categorization for engine optimization and filtering</p>

            <TagsSelect defaultValue={t.tags || []} />
          </div>
        </div>

        {/* 9. WORKFLOW STEPS */}
        <div className={sectionCardClass}>
          <div className="relative">
            <h2 className={sectionHeaderClass}>
              <span className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center text-lg not-italic">📋</span>
              Operational Journey
            </h2>
            <p className={sectionDescClass}>Sequential steps for rapid execution and deployment</p>

            <WorkflowStepsRepeater initialSteps={t.workflow_steps || []} />
          </div>
        </div>

        {/* 10. INTEGRATIONS */}
        <div className={sectionCardClass}>
          <div className="relative">
            <h2 className={sectionHeaderClass}>
              <span className="w-8 h-8 rounded-lg bg-pink-500/10 flex items-center justify-center text-lg not-italic">🔌</span>
              Ecosystem Integrations
            </h2>
            <p className={sectionDescClass}>Connected apps and third-party extensions</p>

            <IntegrationsRepeater toolId={toolId || null} mode={mode} />
          </div>
        </div>

        {/* 11. COMPARISON TABLE */}
        <div className={sectionCardClass}>
          <div className="relative">
            <h2 className={sectionHeaderClass}>
              <span className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-lg not-italic">📊</span>
              Market Positioning
            </h2>
            <p className={sectionDescClass}>Comparative analysis vs lateral market competitors</p>

            <ComparisonTableRepeater toolId={toolId || null} mode={mode} />
          </div>
        </div>

        {/* 11. ALTERNATIVES */}
        <div className={sectionCardClass}>
          <div className="relative">
            <h2 className={sectionHeaderClass}>
              <span className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center text-lg not-italic">🔍</span>
              Strategic Alternatives
            </h2>
            <p className={sectionDescClass}>Diversification options for varied institutional needs</p>

            <AlternativesRepeater toolId={toolId || null} mode={mode} />
          </div>
        </div>

        {/* 12. PUBLISH SCHEDULE */}
        <div className={sectionCardClass}>
          <div className="relative">
            <h2 className={sectionHeaderClass}>
              <span className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center text-lg not-italic">📅</span>
              Deployment Schedule
            </h2>
            <p className={sectionDescClass}>Set the timeline for public manifestation</p>

            <div className="max-w-md">
              <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-3 ml-1">
                Manifestation Timestamp
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
              <p className="text-[10px] font-bold text-slate-500 mt-4 uppercase tracking-[0.1em] italic">
                💡 Empty = Instant Deployment. Future Date = Scheduled manifestation.
              </p>
            </div>
          </div>
        </div>

        {/* 13. STATUS */}
        <div className={sectionCardClass}>
          <div className="relative">
            <h2 className={sectionHeaderClass}>
              <span className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center text-lg not-italic">🚀</span>
              Final Authorization
            </h2>
            <p className={sectionDescClass}>Activation and visibility toggles</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <label className="flex items-center gap-4 p-6 bg-slate-950 border border-slate-700 rounded-2xl hover:border-cyan-500/50 transition-all cursor-pointer group/status">
                <input
                  type="checkbox"
                  name="free_trial"
                  defaultChecked={!!t.free_trial}
                  className="w-5 h-5 text-cyan-500 rounded-lg bg-slate-800 border-slate-600 focus:ring-cyan-500/20"
                />
                <span className="text-white font-black italic uppercase tracking-widest text-xs group-hover/status:text-cyan-400 transition-colors">Trial Available</span>
              </label>

              <label className="flex items-center gap-4 p-6 bg-slate-950 border border-slate-700 rounded-2xl hover:border-green-500/50 transition-all cursor-pointer group/status">
                <input
                  type="checkbox"
                  name="published"
                  defaultChecked={t.published ?? true}
                  className="w-5 h-5 text-green-500 rounded-lg bg-slate-800 border-slate-600 focus:ring-green-500/20"
                />
                <span className="text-white font-black italic uppercase tracking-widest text-xs group-hover/status:text-green-400 transition-colors">Asset Active</span>
              </label>

              <label className="flex items-center gap-4 p-6 bg-slate-950 border border-slate-700 rounded-2xl hover:border-yellow-500/50 transition-all cursor-pointer group/status">
                <input
                  type="checkbox"
                  name="featured"
                  defaultChecked={!!t.featured}
                  className="w-5 h-5 text-yellow-500 rounded-lg bg-slate-800 border-slate-600 focus:ring-yellow-500/20"
                />
                <span className="text-white font-black italic uppercase tracking-widest text-xs group-hover/status:text-yellow-400 transition-colors">Featured Status</span>
              </label>
            </div>
          </div>
        </div>

        {/* 14. SEO */}
        <div className={sectionCardClass}>
          <div className="relative">
            <h2 className={sectionHeaderClass}>
              <span className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-lg not-italic">🎯</span>
              Engine Calibration
            </h2>
            <p className={sectionDescClass}>Meta mapping and discovery optimization</p>

            <div className="space-y-8">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-3 ml-1">Meta Identity Title</label>
                <input
                  type="text"
                  name="meta_title"
                  defaultValue={t.meta_title || ''}
                  placeholder="The Ultimate Review 2025"
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-3 ml-1">
                  Engine Manifest Description
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
                <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-3 ml-1">
                  Social Manifest Image
                </label>
                <input
                  type="url"
                  name="og_image"
                  defaultValue={t.og_image || ''}
                  placeholder="https://manifest-image.jpg"
                  className={inputClass}
                />
              </div>
            </div>
          </div>
        </div>

        {/* SUBMIT */}
        <div className="flex gap-4 sticky bottom-6 z-[100] bg-slate-950/80 backdrop-blur-2xl border-2 border-slate-800 p-6 rounded-[2.5rem] shadow-2xl shadow-cyan-500/10">
          <button
            type="submit"
            disabled={saving}
            className="flex-1 px-10 py-5 bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-700 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed text-white font-black rounded-2xl shadow-2xl hover:shadow-cyan-500/40 transition-all text-sm uppercase tracking-[0.2em] italic"
          >
            {saving ? (
              <span className="flex items-center justify-center gap-3">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Deploying Asset...
              </span>
            ) : (
              isEdit ? '💾 Synchronize Changes' : '✨ Manifest New Asset'
            )}
          </button>

          <Link
            href="/admin/tools"
            className="px-10 py-5 bg-slate-900 hover:bg-slate-800 text-white font-black rounded-2xl border-2 border-slate-800 hover:border-slate-700 transition-all text-xs uppercase tracking-widest flex items-center justify-center italic"
          >
            Abort
          </Link>
        </div>
      </form >
    </div >
  )
}
/* eslint-enable @typescript-eslint/no-explicit-any */
