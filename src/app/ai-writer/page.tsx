'use client'

import { useState } from 'react'

const N8N_WEBHOOK = '/api/ai-writer'

export default function AIWriterPage() {
  const [keyword, setKeyword] = useState('')
  const [audience, setAudience] = useState('business owners and marketers')
  const [tone, setTone] = useState('professional and engaging')
  const [wordCount, setWordCount] = useState('1500')
  const [loading, setLoading] = useState(false)
  const [stage, setStage] = useState('')
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState<'preview' | 'html' | 'seo'>('preview')

  const stages = [
    '🔍 Researching your keyword...',
    '📋 Building SEO outline...',
    '✍️ Writing the full article...',
    '🏷️ Generating SEO metadata...',
    '📦 Packaging your content...',
  ]

  async function generate() {
    if (!keyword.trim()) return
    setLoading(true)
    setResult(null)
    setError('')
    setActiveTab('preview')

    // Cycle through stages for UX
    let i = 0
    setStage(stages[0])
    const interval = setInterval(() => {
      i++
      if (i < stages.length) setStage(stages[i])
    }, 12000)

    try {
      const res = await fetch(N8N_WEBHOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          keyword: keyword.trim(),
          tone,
          target_audience: audience,
          word_count: parseInt(wordCount),
        }),
      })

      clearInterval(interval)

      if (!res.ok) throw new Error(`Webhook returned ${res.status}`)
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setStage('✅ Done!')
      setResult(data)
    } catch (err: any) {
      clearInterval(interval)
      setError(`Error: ${err.message || 'Unknown error — check that the n8n workflow is published'}`)
    } finally {
      setLoading(false)
    }
  }

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">

      {/* Hero Header */}
      <div className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center text-lg">
              ✍️
            </div>
            <div>
              <h1 className="text-white font-bold text-lg leading-none">AI SEO Writer</h1>
              <p className="text-slate-400 text-xs mt-0.5">Powered by Gemini · Built by FutureAgent</p>
            </div>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            BETA
          </span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">

        {/* Intro */}
        <div className="text-center space-y-3">
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Generate a Full SEO Article{' '}
            <span className="bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">
              in 60 Seconds
            </span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Enter a keyword and our AI agent researches, outlines, writes, and
            optimises a complete blog post — with meta title, description, slug and tags included.
          </p>
        </div>

        {/* Input Card */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-5">

          {/* Keyword — Primary input */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-300">
              Target Keyword <span className="text-cyan-400">*</span>
            </label>
            <input
              type="text"
              value={keyword}
              onChange={e => setKeyword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !loading && generate()}
              placeholder="e.g. best AI automation tools for small business 2026"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition text-base"
            />
          </div>

          {/* Options row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-300">Target Audience</label>
              <input
                type="text"
                value={audience}
                onChange={e => setAudience(e.target.value)}
                placeholder="e.g. small business owners"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-300">Writing Tone</label>
              <select
                value={tone}
                onChange={e => setTone(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-cyan-500 transition text-sm"
              >
                <option value="professional and engaging">Professional & Engaging</option>
                <option value="casual and friendly">Casual & Friendly</option>
                <option value="authoritative and expert">Authoritative & Expert</option>
                <option value="conversational and simple">Conversational & Simple</option>
                <option value="persuasive and direct">Persuasive & Direct</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-300">Word Count</label>
              <select
                value={wordCount}
                onChange={e => setWordCount(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-cyan-500 transition text-sm"
              >
                <option value="800">Short (~800 words)</option>
                <option value="1200">Medium (~1,200 words)</option>
                <option value="1500">Long (~1,500 words)</option>
                <option value="2000">Very Long (~2,000 words)</option>
              </select>
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={generate}
            disabled={loading || !keyword.trim()}
            className="w-full py-4 rounded-xl font-bold text-base uppercase tracking-wide transition-all
              bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500
              text-white shadow-lg shadow-cyan-500/20 hover:shadow-xl hover:shadow-cyan-500/30
              disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-cyan-600 disabled:hover:to-indigo-600
              hover:-translate-y-0.5 active:translate-y-0"
          >
            {loading ? '⚡ Generating...' : '⚡ Generate SEO Article'}
          </button>
        </div>

        {/* Loading Stage */}
        {loading && (
          <div className="bg-slate-900/60 border border-cyan-500/30 rounded-2xl p-8 text-center space-y-5">
            <div className="flex justify-center">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-indigo-500/20 border border-cyan-500/30 flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
              </div>
            </div>
            <div>
              <p className="text-cyan-400 font-semibold text-lg">{stage}</p>
              <p className="text-slate-500 text-sm mt-1">This takes 30–60 seconds — the AI is writing your full article</p>
            </div>
            {/* Progress dots */}
            <div className="flex justify-center gap-3">
              {stages.map((s, i) => (
                <div
                  key={i}
                  className={`h-2 rounded-full transition-all duration-500 ${
                    stage === s
                      ? 'w-8 bg-cyan-400'
                      : stages.indexOf(stage) > i
                      ? 'w-2 bg-cyan-700'
                      : 'w-2 bg-slate-700'
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6 text-center">
            <p className="text-red-400 font-semibold">⚠️ {error}</p>
          </div>
        )}

        {/* Result */}
        {result && !loading && (
          <div className="space-y-6">

            {/* Stats bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: 'Word Count', value: result.word_count?.toLocaleString() || '—' },
                { label: 'Reading Time', value: `${result.reading_time} min` },
                { label: 'H2 Sections', value: result.sections_count || '—' },
                { label: 'Status', value: '✅ Ready' },
              ].map(stat => (
                <div key={stat.label} className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-slate-400 text-xs mt-1">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Tab Navigation */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden">
              <div className="flex border-b border-slate-800">
                {(['preview', 'html', 'seo'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 py-4 text-sm font-semibold uppercase tracking-wide transition-colors ${
                      activeTab === tab
                        ? 'text-cyan-400 border-b-2 border-cyan-400 bg-cyan-500/5'
                        : 'text-slate-400 hover:text-slate-300'
                    }`}
                  >
                    {tab === 'preview' ? '👁️ Preview' : tab === 'html' ? '💻 HTML Code' : '🏷️ SEO Data'}
                  </button>
                ))}
              </div>

              {/* Preview Tab */}
              {activeTab === 'preview' && (
                <div className="p-6 md:p-8">
                  <div
                    className="prose prose-invert prose-lg max-w-none
                      [&>h1]:text-3xl [&>h1]:font-bold [&>h1]:text-white [&>h1]:mb-6 [&>h1]:leading-tight
                      [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:text-white [&>h2]:mt-8 [&>h2]:mb-4
                      [&>h3]:text-xl [&>h3]:font-semibold [&>h3]:text-white [&>h3]:mt-6 [&>h3]:mb-3
                      [&>p]:text-slate-300 [&>p]:leading-relaxed [&>p]:mb-5 [&>p]:text-base
                      [&>ul]:list-disc [&>ul]:list-inside [&>ul]:mb-5 [&>ul]:space-y-2
                      [&>ol]:list-decimal [&>ol]:list-inside [&>ol]:mb-5 [&>ol]:space-y-2
                      [&>li]:text-slate-300 [&>li]:text-base
                      [&>strong]:text-white [&>strong]:font-bold
                      [&>blockquote]:border-l-4 [&>blockquote]:border-cyan-500 [&>blockquote]:pl-4 [&>blockquote]:text-slate-300 [&>blockquote]:italic [&>blockquote]:my-6"
                    dangerouslySetInnerHTML={{ __html: result.content || '' }}
                  />
                </div>
              )}

              {/* HTML Tab */}
              {activeTab === 'html' && (
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-slate-400 text-sm">Clean HTML — ready to paste into WordPress, Webflow, or any CMS</p>
                    <button
                      onClick={() => copyToClipboard(result.content || '')}
                      className="px-4 py-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-sm font-semibold hover:bg-cyan-500/20 transition"
                    >
                      {copied ? '✅ Copied!' : '📋 Copy HTML'}
                    </button>
                  </div>
                  <pre className="bg-slate-950 border border-slate-800 rounded-xl p-4 overflow-auto max-h-96 text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">
                    {result.content}
                  </pre>
                </div>
              )}

              {/* SEO Tab */}
              {activeTab === 'seo' && result.seo && (
                <div className="p-6 space-y-4">
                  <div className="flex justify-end">
                    <button
                      onClick={() => copyToClipboard(JSON.stringify(result.seo, null, 2))}
                      className="px-4 py-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-sm font-semibold hover:bg-cyan-500/20 transition"
                    >
                      {copied ? '✅ Copied!' : '📋 Copy All SEO Data'}
                    </button>
                  </div>
                  <div className="space-y-4">
                    {[
                      { label: '📌 Meta Title', value: result.seo.meta_title, hint: `${result.seo.meta_title?.length || 0} chars (ideal: 50–60)` },
                      { label: '📝 Meta Description', value: result.seo.meta_description, hint: `${result.seo.meta_description?.length || 0} chars (ideal: 150–160)` },
                      { label: '🔗 URL Slug', value: result.seo.slug, hint: 'Use this as your permalink' },
                      { label: '🎯 Focus Keyword', value: result.seo.focus_keyword, hint: '' },
                      { label: '📖 Excerpt', value: result.seo.excerpt, hint: 'For blog listing pages' },
                    ].map(item => (
                      <div key={item.label} className="bg-slate-800/50 rounded-xl p-4 space-y-1">
                        <div className="flex items-center justify-between">
                          <p className="text-slate-400 text-xs font-semibold uppercase tracking-wide">{item.label}</p>
                          {item.hint && <p className="text-slate-500 text-xs">{item.hint}</p>}
                        </div>
                        <p className="text-white text-sm leading-relaxed">{item.value}</p>
                      </div>
                    ))}
                    {/* Tags */}
                    <div className="bg-slate-800/50 rounded-xl p-4 space-y-2">
                      <p className="text-slate-400 text-xs font-semibold uppercase tracking-wide">🏷️ Tags</p>
                      <div className="flex flex-wrap gap-2">
                        {result.seo.tags?.map((tag: string) => (
                          <span key={tag} className="px-3 py-1 rounded-lg bg-slate-700 text-slate-300 text-sm">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    {/* Secondary keywords */}
                    {result.seo.secondary_keywords?.length > 0 && (
                      <div className="bg-slate-800/50 rounded-xl p-4 space-y-2">
                        <p className="text-slate-400 text-xs font-semibold uppercase tracking-wide">🔍 Secondary Keywords</p>
                        <div className="flex flex-wrap gap-2">
                          {result.seo.secondary_keywords.map((kw: string) => (
                            <span key={kw} className="px-3 py-1 rounded-lg bg-indigo-900/40 border border-indigo-500/30 text-indigo-300 text-sm">
                              {kw}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => copyToClipboard(result.content || '')}
                className="flex-1 py-3 rounded-xl font-semibold text-sm bg-cyan-600 hover:bg-cyan-500 text-white transition"
              >
                {copied ? '✅ Copied!' : '📋 Copy HTML Article'}
              </button>
              <button
                onClick={() => { setResult(null); setKeyword(''); setStage('') }}
                className="flex-1 py-3 rounded-xl font-semibold text-sm bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition"
              >
                ✨ Write Another Article
              </button>
            </div>

            {/* Disclaimer */}
            <p className="text-center text-xs text-slate-600">
              AI-generated content — review and personalise before publishing. Add your own examples, links, and expertise.
            </p>
          </div>
        )}

        {/* How it works — shown only before first generation */}
        {!result && !loading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: '🔍', title: 'Research', desc: 'Analyses your keyword and builds a structured SEO outline with the right sections' },
              { icon: '✍️', title: 'Write', desc: 'Generates a full HTML article with proper H2s, paragraphs, and natural keyword usage' },
              { icon: '🏷️', title: 'Optimise', desc: 'Produces meta title, description, URL slug, tags and secondary keywords automatically' },
            ].map(step => (
              <div key={step.title} className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 space-y-3">
                <div className="text-3xl">{step.icon}</div>
                <h3 className="text-white font-bold">{step.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
