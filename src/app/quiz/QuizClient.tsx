'use client'

import { useState } from 'react'
import Link from 'next/link'

export type QuizTool = {
  id: string
  slug: string
  name: string
  logo?: string | null
  tagline?: string | null
  category: string | null
  rating?: number | null
  pricing_model?: string | null
  starting_price?: string | number | null
  free_trial?: boolean | null
}

interface QuizClientProps {
  tools: QuizTool[]
}

type Answers = {
  goal: string
  budget: string
  experience: string
  priority: string
}

const TOTAL_STEPS = 4

function scoreTools(tools: QuizTool[], answers: Answers) {
  return tools
    .map((tool) => {
      const cat = (tool.category || '').toLowerCase()
      const pricing = (tool.pricing_model || '').toLowerCase()
      const startPrice = String(tool.starting_price || '').toLowerCase()
      const hasFree = tool.free_trial || pricing.includes('free') || startPrice.includes('free') || startPrice === '0'
      const rating = Number(tool.rating || 0)
      let score = 0
      const reasons: string[] = []

      // 1. GOAL → CATEGORY match (50 pts max)
      const catScores: Record<string, Record<string, number>> = {
        research:    { 'research agents': 50, 'automation agents': 10, 'code agents': 5 },
        content:     { 'research agents': 50, 'automation agents': 10, 'code agents': 5 },
        coding:      { 'code agents': 50, 'research agents': 20, 'automation agents': 5 },
        automation:  { 'automation agents': 50, 'research agents': 10, 'code agents': 10 },
        marketing:   { 'research agents': 40, 'automation agents': 30, 'code agents': 10 },
        productivity:{ 'automation agents': 50, 'research agents': 30, 'code agents': 10 },
      }

      const catScore = (catScores[answers.goal] || {})[cat] || 0
      score += catScore

      if (catScore >= 50) {
        const labels: Record<string, string> = {
          research: 'deep research', content: 'writing and content',
          coding: 'software development', automation: 'workflow automation',
          marketing: 'marketing', productivity: 'productivity',
        }
        reasons.push(`Top pick for ${labels[answers.goal] || answers.goal}`)
      } else if (catScore >= 20) {
        reasons.push('Strong support for your use case')
      }

      // 2. BUDGET match (25 pts max)
      const priceNum = parseFloat(startPrice.replace(/[^0-9.]/g, '')) || 0
      if (answers.budget === 'free') {
        if (hasFree) { score += 25; reasons.push('Free plan available — no credit card needed') }
        else score -= 15
      } else if (answers.budget === 'low') {
        if (hasFree || priceNum <= 30) { score += 25; reasons.push('Fits your budget comfortably') }
        else if (priceNum <= 60) score += 10
      } else if (answers.budget === 'medium') {
        score += 20
      } else if (answers.budget === 'high') {
        score += 15
        if (cat.includes('automation') || cat.includes('code')) { score += 10; reasons.push('Scales well at higher budget tiers') }
      }

      // 3. EXPERIENCE match (15 pts max)
      const easyTools = ['chatgpt', 'claude-ai', 'google-gemini', 'meta-ai', 'perplexity-ai', 'zapier', 'make-com']
      const advancedTools = ['n8n', 'cursor', 'github-copilot', 'lovable', 'open-claw']
      if (answers.experience === 'beginner') {
        if (easyTools.includes(tool.slug)) { score += 15; reasons.push('Beginner-friendly, no technical setup required') }
        else if (advancedTools.includes(tool.slug)) score -= 5
      } else if (answers.experience === 'intermediate') {
        score += 10
      } else if (answers.experience === 'advanced') {
        if (advancedTools.includes(tool.slug)) { score += 15; reasons.push('Built for technical users who want full control') }
        else score += 5
      }

      // 4. PRIORITY boost (10 pts max)
      const priorityMap: Record<string, Record<string, number>> = {
        ease:         { chatgpt: 10, 'claude-ai': 10, 'google-gemini': 8, 'meta-ai': 8, 'perplexity-ai': 8, zapier: 10, 'make-com': 8 },
        power:        { n8n: 10, cursor: 10, 'claude-ai': 8, 'github-copilot': 8, 'open-claw': 8, lovable: 7 },
        free:         { chatgpt: 8, 'claude-ai': 8, 'google-gemini': 10, 'meta-ai': 10, 'perplexity-ai': 8, 'make-com': 8, cursor: 8, n8n: 10, 'open-claw': 10 },
        integrations: { zapier: 10, 'make-com': 10, n8n: 9, chatgpt: 5, 'claude-ai': 5 },
      }
      const priorityBoost = (priorityMap[answers.priority] || {})[tool.slug] || 0
      score += priorityBoost
      if (priorityBoost >= 9) {
        const pLabels: Record<string, string> = { ease: 'ease of use', power: 'power and flexibility', free: 'free access', integrations: 'app integrations' }
        reasons.push(`One of the best for ${pLabels[answers.priority] || answers.priority}`)
      }

      // 5. Rating bonus (up to 10 pts)
      score += Math.max(0, Math.min(10, Math.round((rating - 4.0) * 20)))

      const matchPct = score <= 0 ? 0 : Math.max(55, Math.min(98, 40 + score))
      return { tool, score, matchPct, reasons: reasons.slice(0, 2) }
    })
    .filter(r => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
}

export default function QuizClient({ tools }: QuizClientProps) {
  const [step, setStep] = useState(1)
  const [answers, setAnswers] = useState<Answers>({ goal: '', budget: '', experience: '', priority: '' })
  const [isAnimating, setIsAnimating] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [email, setEmail] = useState('')
  const [emailSent, setEmailSent] = useState(false)

  const handleSelect = (key: keyof Answers, value: string) => {
    const updated = { ...answers, [key]: value }
    setAnswers(updated)
    setIsAnimating(true)
    if (step < TOTAL_STEPS) {
      setTimeout(() => { setStep(s => s + 1); setIsAnimating(false) }, 350)
    } else {
      setTimeout(() => { setShowResults(true); setIsAnimating(false) }, 350)
    }
  }

  const goBack = () => {
    if (showResults) { setShowResults(false); return }
    if (step > 1) {
      setIsAnimating(true)
      setTimeout(() => { setStep(s => s - 1); setIsAnimating(false) }, 150)
    }
  }

  const reset = () => {
    setAnswers({ goal: '', budget: '', experience: '', priority: '' })
    setStep(1); setShowResults(false); setEmail(''); setEmailSent(false); setIsAnimating(false)
  }

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await fetch('/api/subscribe', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, source: 'quiz', quizData: answers }) })
    } catch { /* silent */ }
    setEmailSent(true)
  }

  const recommendations = showResults ? scoreTools(tools, answers) : []

  const questions = [
    {
      key: 'goal' as keyof Answers, icon: '🎯',
      title: 'What do you mainly want AI to help with?',
      subtitle: "We'll match you to tools built specifically for this.",
      options: [
        { value: 'research',    label: 'Research & Analysis',   desc: 'Find info, summarise, answer questions' },
        { value: 'content',     label: 'Writing & Content',     desc: 'Blog posts, copy, emails, social' },
        { value: 'coding',      label: 'Software Development',  desc: 'Write, debug, and review code' },
        { value: 'automation',  label: 'Workflow Automation',   desc: 'Connect apps, automate tasks' },
        { value: 'marketing',   label: 'Marketing & Growth',    desc: 'Campaigns, ads, strategy' },
        { value: 'productivity',label: 'General Productivity',  desc: 'Save time across all work' },
      ],
    },
    {
      key: 'budget' as keyof Answers, icon: '💰',
      title: 'What is your monthly budget?',
      subtitle: "We'll only recommend tools you can actually afford.",
      options: [
        { value: 'free',   label: 'Free only',       desc: 'No credit card, no subscription' },
        { value: 'low',    label: 'Under $30/mo',    desc: 'Affordable entry-level tools' },
        { value: 'medium', label: '$30 – $100/mo',   desc: 'Professional tier features' },
        { value: 'high',   label: '$100+/mo',        desc: 'Serious scale and full power' },
      ],
    },
    {
      key: 'experience' as keyof Answers, icon: '⚡',
      title: 'How technical are you?',
      subtitle: "We'll match tools to your comfort level.",
      options: [
        { value: 'beginner',     label: 'Beginner',      desc: 'I need simple, no-setup tools' },
        { value: 'intermediate', label: 'Intermediate',  desc: "I've used ChatGPT or Claude" },
        { value: 'advanced',     label: 'Advanced',      desc: 'I build workflows and use APIs' },
      ],
    },
    {
      key: 'priority' as keyof Answers, icon: '💎',
      title: 'What matters most to you?',
      subtitle: 'This fine-tunes your top recommendations.',
      options: [
        { value: 'ease',         label: 'Ease of Use',      desc: 'Simple UI, no learning curve' },
        { value: 'power',        label: 'Power & Flexibility', desc: 'Full control, advanced features' },
        { value: 'free',         label: 'Free / Open Source', desc: 'No ongoing cost' },
        { value: 'integrations', label: 'App Integrations',  desc: 'Connects to my existing tools' },
      ],
    },
  ]

  const currentQ = questions[step - 1]
  const progressPct = showResults ? 100 : ((step - 1) / TOTAL_STEPS) * 100

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900">
      {/* Header */}
      <section className="px-4 pt-12 pb-8 border-b border-slate-800/50 bg-slate-950/50">
        <div className="mx-auto max-w-4xl">
          <div className="flex items-center gap-2 text-sm text-slate-400 mb-6">
            <Link href="/" className="hover:text-cyan-400 transition">Home</Link>
            <span>/</span>
            <span className="text-white">AI Tool Finder</span>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-sm font-semibold mb-5">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-400" />
              </span>
              AI Agent Matchmaker
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
              Find Your Perfect{' '}
              <span className="bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">AI Tool</span>
            </h1>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto">
              4 quick questions → personalised recommendations from our reviewed tools.
            </p>
          </div>
          <div className="mt-8">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
              <span className="font-semibold text-white">{showResults ? 'Your Results' : `Question ${step} of ${TOTAL_STEPS}`}</span>
              <span>{Math.round(progressPct)}% Complete</span>
            </div>
            <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 transition-all duration-500 ease-out rounded-full" style={{ width: `${progressPct}%` }} />
            </div>
          </div>
        </div>
      </section>

      {/* Body */}
      <section className="px-4 py-12">
        <div className={`mx-auto max-w-3xl transition-all duration-300 ${isAnimating ? 'opacity-0 translate-x-4' : 'opacity-100 translate-x-0'}`}>
          <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-3xl p-8 md:p-10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-[80px] pointer-events-none" />

            {/* QUESTION */}
            {!showResults && currentQ && (
              <div>
                <div className="mb-8">
                  <div className="text-5xl mb-4">{currentQ.icon}</div>
                  <h2 className="text-3xl font-bold text-white mb-2">{currentQ.title}</h2>
                  <p className="text-slate-400 text-lg">{currentQ.subtitle}</p>
                </div>
                <div className="grid gap-3">
                  {currentQ.options.map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => handleSelect(currentQ.key, opt.value)}
                      className={`group text-left px-6 py-5 rounded-xl border-2 transition-all ${
                        answers[currentQ.key] === opt.value
                          ? 'border-cyan-500 bg-cyan-500/10 shadow-lg shadow-cyan-500/20'
                          : 'border-slate-700 bg-slate-900/60 hover:border-cyan-500/50 hover:bg-slate-900'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-cyan-300 transition">{opt.label}</h3>
                          <p className="text-sm text-slate-400">{opt.desc}</p>
                        </div>
                        {answers[currentQ.key] === opt.value && (
                          <div className="w-6 h-6 rounded-full bg-cyan-500 flex items-center justify-center flex-shrink-0 ml-4">
                            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
                {step > 1 && (
                  <button onClick={goBack} className="mt-6 text-slate-400 hover:text-white text-sm transition flex items-center gap-1">← Back</button>
                )}
              </div>
            )}

            {/* RESULTS */}
            {showResults && (
              <div>
                <div className="text-center mb-10">
                  <div className="text-5xl mb-4">✨</div>
                  <h2 className="text-3xl font-bold text-white mb-2">Your Best Matches</h2>
                  <p className="text-slate-400">Based on your answers, here are the best tools from our reviewed directory.</p>
                </div>

                {recommendations.length > 0 ? (
                  <div className="space-y-5">
                    {recommendations.map((rec, idx) => (
                      <div
                        key={rec.tool.slug}
                        className={`relative p-6 rounded-2xl border transition-all ${
                          idx === 0 ? 'bg-slate-800/40 border-cyan-500/60 ring-1 ring-cyan-500/20' : 'bg-slate-900/40 border-slate-800'
                        }`}
                      >
                        {idx === 0 && (
                          <div className="absolute -top-3 left-6 px-3 py-1 rounded-full bg-gradient-to-r from-cyan-500 to-indigo-500 text-[10px] font-bold text-white uppercase tracking-wider">
                            Best Match
                          </div>
                        )}
                        <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                          <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-2xl flex-shrink-0">
                            {rec.tool.logo || rec.tool.name.charAt(0)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                              <h3 className="text-xl font-bold text-white">{rec.tool.name}</h3>
                              <span className="px-2 py-0.5 rounded-md bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold">{rec.matchPct}% Match</span>
                              {rec.tool.rating && <span className="text-yellow-400 text-xs font-semibold">★ {Number(rec.tool.rating).toFixed(1)}</span>}
                            </div>
                            {rec.tool.tagline && <p className="text-slate-300 text-sm mb-2 line-clamp-1">{rec.tool.tagline}</p>}
                            <div className="flex flex-wrap gap-2 mb-3">
                              {rec.tool.category && <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 text-xs">{rec.tool.category}</span>}
                              {rec.tool.starting_price && <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 text-xs">From {rec.tool.starting_price}</span>}
                            </div>
                            {rec.reasons.length > 0 && (
                              <ul className="space-y-1">
                                {rec.reasons.map((r, i) => (
                                  <li key={i} className="flex items-start gap-1.5 text-sm text-slate-400">
                                    <span className="text-cyan-500 mt-0.5">✓</span>{r}
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                          <Link
                            href={`/tools/${rec.tool.slug}`}
                            className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-cyan-500 hover:border-cyan-500 text-white text-sm font-bold transition-all border border-slate-700 flex-shrink-0"
                          >
                            Read Review →
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-slate-900/40 rounded-2xl border border-dashed border-slate-700">
                    <p className="text-slate-400 mb-2">No exact matches found. We are adding new tools regularly!</p>
                    <button onClick={reset} className="text-cyan-400 hover:text-cyan-300 text-sm underline transition">Try different answers</button>
                  </div>
                )}

                {/* Optional email — shown AFTER results */}
                {recommendations.length > 0 && !emailSent && (
                  <div className="mt-8 p-6 rounded-2xl bg-slate-800/40 border border-slate-700">
                    <h3 className="text-white font-semibold mb-1">📬 Get your results by email</h3>
                    <p className="text-slate-400 text-sm mb-4">We will also notify you as we add new tools that match your profile. No spam, unsubscribe anytime.</p>
                    <form onSubmit={handleEmailSubmit} className="flex gap-3">
                      <input type="email" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)}
                        className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 focus:border-cyan-500 text-white outline-none transition text-sm placeholder-slate-600" required />
                      <button type="submit" className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-bold transition">Send</button>
                    </form>
                  </div>
                )}

                {emailSent && (
                  <div className="mt-8 p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-center">
                    <p className="text-cyan-300 font-semibold">✅ Done! Check your inbox.</p>
                  </div>
                )}

                <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-800">
                  <button onClick={goBack} className="text-slate-400 hover:text-white text-sm transition flex items-center gap-1">← Change my answers</button>
                  <button onClick={reset} className="text-slate-400 hover:text-white text-sm transition underline underline-offset-4">Start over</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
