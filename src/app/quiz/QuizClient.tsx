'use client'

import { useState } from 'react'
import Link from 'next/link'

type Answers = {
  goal: string
  teamSize: string
  budget: string
  experience: string
  useCase: string
  priority: string
  email: string
}

const initialAnswers: Answers = {
  goal: '',
  teamSize: '',
  budget: '',
  experience: '',
  useCase: '',
  priority: '',
  email: '',
}

// Tool type for quiz logic
export type QuizTool = {
  id: string
  slug: string
  name: string
  category: string | null
  rating?: number | null
  review_count?: number | null
  tags?: unknown
  pricing_model?: string | null
  starting_price?: string | number | null
  has_affiliate_link?: boolean  // NEW: For revenue optimization
  commission_rate?: number | null  // NEW: Future use for optimal recommendations
}

interface QuizClientProps {
  tools: QuizTool[]
}

export default function QuizClient({ tools }: QuizClientProps) {
  const [step, setStep] = useState(1)
  const [answers, setAnswers] = useState<Answers>(initialAnswers)
  const [hasSubmittedEmail, setHasSubmittedEmail] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  // Reduced to 6 steps (removed Use Case)
  const totalSteps = 6

  const emailValid =
    answers.email.trim().length > 3 && answers.email.includes('@')

  const nextDisabled =
    (step === 1 && !answers.goal) ||
    (step === 2 && !answers.teamSize) ||
    (step === 3 && !answers.budget) ||
    (step === 4 && !answers.experience) ||
    (step === 5 && !answers.priority)

  const goNext = () => {
    if (step < totalSteps && !nextDisabled) {
      setIsAnimating(true)
      setTimeout(() => {
        setStep(step + 1)
        setIsAnimating(false)
      }, 300) // Slightly longer delay for smoother transition
    }
  }

  // Auto-advance helper
  const handleSelection = (update: Partial<Answers>) => {
    setAnswers(prev => ({ ...prev, ...update }))

    // Auto-advance logic
    if (step < totalSteps) {
      setIsAnimating(true)
      setTimeout(() => {
        setStep(prev => prev + 1)
        setIsAnimating(false)
      }, 400) // 400ms delay to let user see their selection
    }
  }

  const goBack = () => {
    if (step > 1) {
      setIsAnimating(true)
      setTimeout(() => {
        setStep(step - 1)
        setIsAnimating(false)
      }, 150)
    }
  }

  const resetQuiz = () => {
    setAnswers(initialAnswers)
    setHasSubmittedEmail(false)
    setStep(1)
  }

  // SMART MULTI-SIGNAL recommendation logic
  const getRecommendations = () => {
    const recs: {
      name: string
      slug: string
      reason: string
      match: number
    }[] = []

    // Helper: Extract tags as string array
    const getTags = (tool: typeof tools[0]): string[] => {
      if (!tool.tags) return []
      if (Array.isArray(tool.tags)) {
        return tool.tags.map(t => typeof t === 'string' ? t.toLowerCase() : '').filter(Boolean)
      }
      return []
    }

    // Helper: Calculate goal match score
    const getGoalScore = (goal: string, tool: typeof tools[0]): number => {
      const category = tool.category?.toLowerCase() || ''
      const tags = getTags(tool)
      let score = 0

      // Define matching criteria for each goal
      const goalCriteria: Record<string, { categories: string[]; tags: string[] }> = {
        'content': {
          categories: ['writing', 'content', 'seo', 'social', 'copywriting'],
          tags: ['writing', 'content', 'blog', 'copywriting', 'seo', 'article']
        },
        'coding': {
          categories: ['coding', 'developer', 'programming', 'ai coding', 'code'],
          tags: ['coding', 'development', 'programming', 'github', 'code', 'ai coding', 'copilot']
        },
        'marketing': {
          categories: ['marketing', 'sales', 'ads', 'social media', 'advertising'],
          tags: ['marketing', 'advertising', 'social', 'campaigns', 'ads', 'growth']
        },
        'automation': {
          categories: ['automation', 'workflow', 'productivity', 'integration'],
          tags: ['automation', 'workflow', 'integration', 'zapier', 'no-code']
        },
        'research': {
          categories: ['research', 'data', 'analytics', 'intelligence'],
          tags: ['research', 'data', 'analysis', 'insights', 'intelligence']
        },
        'image': {
          categories: ['media', 'design', 'image', 'visual', 'art', 'creative'],
          tags: ['image', 'design', 'art', 'visual', 'creative', 'generation', 'dalle', 'midjourney']
        }
      }

      const criteria = goalCriteria[goal]
      if (!criteria) return 0

      // Check category match (flexible partial matching)
      const categoryMatch = criteria.categories.some(keyword =>
        category.includes(keyword) || keyword.split(' ').some(part => category.includes(part))
      )
      if (categoryMatch) score += 50

      // Check tags match
      const tagMatch = tags.some(tag =>
        criteria.tags.some(keyword => tag.includes(keyword) || keyword.includes(tag))
      )
      if (tagMatch) score += 30

      return score
    }

    tools.forEach((tool) => {
      let score = 0
      const category = tool.category?.toLowerCase() || ''

      // Goal ↔ category matching
      if (answers.goal === 'content' && (category === 'writing' || category === 'seo' || category === 'social-media')) score += 50
      if (answers.goal === 'marketing' && (category === 'marketing' || category === 'sales' || category === 'ads')) score += 50
      if (answers.goal === 'automation' && (category === 'automation' || category === 'workflow' || category === 'productivity')) score += 50
      if (answers.goal === 'research' && (category === 'research' || category === 'data')) score += 50
      if (answers.goal === 'coding' && (category === 'coding' || category === 'developer-tools')) score += 50
      if (answers.goal === 'image' && (category === 'media' || category === 'design' || category === 'video')) score += 50
      if (answers.goal === 'chatbot' && (category === 'chatbot' || category === 'customer-support')) score += 50

      // Priority adjustments
      if (answers.priority === 'speed' && (category === 'automation' || category === 'writing')) score += 20
      if (answers.priority === 'seo' && (category === 'seo' || category === 'writing')) score += 30
      if (answers.priority === 'integrations' && (category === 'automation' || category === 'crm')) score += 25
      if (answers.priority === 'quality' && (category === 'writing' || category === 'image' || category === 'coding')) score += 15

      // Experience Level adjustment (subtle)
      if (answers.experience === 'beginner' && (category.includes('lite') || category.includes('basic'))) score += 10
      if (answers.experience === 'advanced' && (category.includes('pro') || category.includes('dev'))) score += 10

      // Only include tools with some positive score
      if (score > 0) {
        recs.push({
          name: tool.name,
          slug: tool.slug,
          reason: `Matches your goal for ${answers.goal} and ${answers.priority} priority.`,
          match: Math.min(98, 60 + score), // clamp to max 98
        })
      }
    })

    // Sort by match and return top 3
    return recs
      .sort((a, b) => b.match - a.match)
      .slice(0, 3)
  }

  const recommendations = hasSubmittedEmail ? getRecommendations() : []

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!emailValid) return

    try {
      await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: answers.email,
          source: 'quiz',
          quizData: answers,
        }),
      })
    } catch (error) {
      console.error('Email submission failed:', error)
    }

    setHasSubmittedEmail(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900">
      {/* Hero */}
      <section className="px-4 pt-12 pb-8 border-b border-slate-800/50 bg-slate-950/50">
        <div className="mx-auto max-w-4xl">
          <div className="flex items-center gap-2 text-sm text-slate-400 mb-6">
            <Link href="/" className="hover:text-cyan-400 transition">
              Home
            </Link>
            <span>/</span>
            <span className="text-white">Agent Matchmaker</span>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-sm font-semibold mb-5">
              <span className="flex h-2 w-2">
                <span className="absolute inline-flex h-2 w-2 animate-ping rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-400"></span>
              </span>
              AI Agent Matchmaker
            </div>

            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
              Find Your Perfect{' '}
              <span className="bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">
                Autonomous Agent
              </span>
            </h1>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto">
              Answer 5 quick questions to build your ideal autonomous workforce stack.
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mt-8">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
              <span className="font-semibold text-white">
                {step === totalSteps ? 'Generating Stack...' : `Step ${step} of ${totalSteps - 1}`}
              </span>
              <span>{Math.round(((step - 1) / (totalSteps - 1)) * 100)}% Complete</span>
            </div>
            <div className="h-2 rounded-full bg-slate-800/80 overflow-hidden shadow-inner">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500 ease-out rounded-full"
                style={{ width: `${((step - 1) / (totalSteps - 1)) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Quiz Body */}
      <section className="px-4 py-12">
        <div
          className={`mx-auto max-w-3xl transition-all duration-300 transform ${isAnimating ? 'opacity-0 translate-x-4' : 'opacity-100 translate-x-0'
            }`}
        >
          <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800/80 rounded-3xl p-8 md:p-10 shadow-2xl relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-[80px] pointer-events-none" />

            {/* Q1: Goal */}
            {step === 1 && (
              <div className="animate-fadeIn">
                <div className="mb-8">
                  <div className="text-5xl mb-4">🎯</div>
                  <h2 className="text-3xl font-bold text-white mb-3">
                    What is your primary objective?
                  </h2>
                  <p className="text-slate-400 text-lg">
                    We&apos;ll identify agents specialized in your core mission.
                  </p>
                </div>

                <div className="grid gap-4">
                  {[
                    { value: 'content', label: 'Content Production', desc: 'Blogs, social, copy' },
                    { value: 'marketing', label: 'Growth Marketing', desc: 'Ads, viral campaigns' },
                    { value: 'automation', label: 'Workflow Automation', desc: 'Connect apps, save time' },
                    { value: 'research', label: 'Deep Research', desc: 'Analysis, reports, data' },
                    { value: 'coding', label: 'Software Engineering', desc: 'Code, debug, deploy' },
                    { value: 'image', label: 'Visual Design', desc: 'Images, UI, assets' },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleSelection({ goal: option.value })}
                      className={`group relative text-left px-6 py-5 rounded-xl border-2 transition-all ${answers.goal === option.value
                        ? 'border-cyan-500 bg-cyan-500/10 shadow-lg shadow-cyan-500/20'
                        : 'border-slate-700 bg-slate-900/60 hover:border-cyan-500/50 hover:bg-slate-900'
                        }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-cyan-300 transition">
                            {option.label}
                          </h3>
                          <p className="text-sm text-slate-400">{option.desc}</p>
                        </div>
                        {answers.goal === option.value && (
                          <div className="w-6 h-6 rounded-full bg-cyan-500 flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Q2: Team Size */}
            {step === 2 && (
              <div className="animate-fadeIn">
                <div className="mb-8">
                  <div className="text-5xl mb-4">👥</div>
                  <h2 className="text-3xl font-bold text-white mb-3">
                    Who is this agent for?
                  </h2>
                </div>

                <div className="grid gap-4">
                  {[
                    { value: 'solo', label: 'Just Me (Solo Founder)', desc: 'Maximizing personal leverage' },
                    { value: 'small', label: 'Small Team (2-10)', desc: 'Collaborative workflows' },
                    { value: 'team', label: 'Growth Stage (11-50)', desc: 'Scaling operations' },
                    { value: 'enterprise', label: 'Enterprise (50+)', desc: 'Compliance & security' },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleSelection({ teamSize: option.value })}
                      className={`group relative text-left px-6 py-5 rounded-xl border-2 transition-all ${answers.teamSize === option.value
                        ? 'border-cyan-500 bg-cyan-500/10 shadow-lg shadow-cyan-500/20'
                        : 'border-slate-700 bg-slate-900/60 hover:border-cyan-500/50 hover:bg-slate-900'
                        }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-cyan-300 transition">{option.label}</h3>
                          <p className="text-sm text-slate-400">{option.desc}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Q3: Budget */}
            {step === 3 && (
              <div className="animate-fadeIn">
                <div className="mb-8">
                  <div className="text-5xl mb-4">💰</div>
                  <h2 className="text-3xl font-bold text-white mb-3">
                    What is your monthly budget?
                  </h2>
                </div>

                <div className="grid gap-4">
                  {[
                    { value: 'free', label: 'Free / Freemium', desc: 'Exploring capabilities' },
                    { value: 'low', label: 'Under $50/mo', desc: 'Essential tools' },
                    { value: 'medium', label: '$50 - $200/mo', desc: 'Pro professional stack' },
                    { value: 'high', label: '$200+/mo', desc: 'Serious scale' },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleSelection({ budget: option.value })}
                      className={`group relative text-left px-6 py-5 rounded-xl border-2 transition-all ${answers.budget === option.value
                        ? 'border-cyan-500 bg-cyan-500/10 shadow-lg shadow-cyan-500/20'
                        : 'border-slate-700 bg-slate-900/60 hover:border-cyan-500/50 hover:bg-slate-900'
                        }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-cyan-300 transition">{option.label}</h3>
                          <p className="text-sm text-slate-400">{option.desc}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Q4: Experience */}
            {step === 4 && (
              <div className="animate-fadeIn">
                <div className="mb-8">
                  <div className="text-5xl mb-4">⚡</div>
                  <h2 className="text-3xl font-bold text-white mb-3">
                    Your familiarity with AI Agents?
                  </h2>
                </div>

                <div className="grid gap-4">
                  {[
                    { value: 'beginner', label: 'Newbie', desc: 'I need simple, guided tools' },
                    { value: 'intermediate', label: 'Explorer', desc: 'I have used ChatGPT/Claude' },
                    { value: 'advanced', label: 'Architect', desc: 'I build custom workflows' },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleSelection({ experience: option.value })}
                      className={`group relative text-left px-6 py-5 rounded-xl border-2 transition-all ${answers.experience === option.value
                        ? 'border-cyan-500 bg-cyan-500/10 shadow-lg shadow-cyan-500/20'
                        : 'border-slate-700 bg-slate-900/60 hover:border-cyan-500/50 hover:bg-slate-900'
                        }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-cyan-300 transition">{option.label}</h3>
                          <p className="text-sm text-slate-400">{option.desc}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Q5: Priority (Moved from Step 6) */}
            {step === 5 && (
              <div className="animate-fadeIn">
                <div className="mb-8">
                  <div className="text-5xl mb-4">💎</div>
                  <h2 className="text-3xl font-bold text-white mb-3">
                    What matters most?
                  </h2>
                </div>

                <div className="grid gap-4">
                  {[
                    { value: 'quality', label: 'Output Quality', desc: 'Zero-hallucination, high polish' },
                    { value: 'speed', label: 'Speed & Volume', desc: 'Rapid execution involved' },
                    { value: 'integrations', label: 'Integrations', desc: 'Must connect to my stack' },
                    { value: 'collaboration', label: 'Team Features', desc: 'Multi-player mode' },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleSelection({ priority: option.value })}
                      className={`group relative text-left px-6 py-5 rounded-xl border-2 transition-all ${answers.priority === option.value
                        ? 'border-cyan-500 bg-cyan-500/10 shadow-lg shadow-cyan-500/20'
                        : 'border-slate-700 bg-slate-900/60 hover:border-cyan-500/50 hover:bg-slate-900'
                        }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-cyan-300 transition">{option.label}</h3>
                          <p className="text-sm text-slate-400">{option.desc}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 6: Email / Results */}
            {step === 6 && !hasSubmittedEmail && (
              <div className="animate-fadeIn">
                <div className="text-center mb-8">
                  <div className="text-6xl mb-6 animate-bounce">🎁</div>
                  <h2 className="text-3xl font-bold text-white mb-3">
                    Your Agent Stack is Ready
                  </h2>
                  <p className="text-slate-400 text-lg">
                    We&apos;ve curated the top 3 autonomous agents for your mission.
                    Where should we send your blueprint?
                  </p>
                </div>

                <form onSubmit={handleEmailSubmit} className="space-y-4">
                  <div>
                    <input
                      type="email"
                      placeholder="Enter your email address"
                      value={answers.email}
                      onChange={(e) =>
                        setAnswers((a) => ({ ...a, email: e.target.value }))
                      }
                      className="w-full px-6 py-4 rounded-xl bg-slate-950 border-2 border-slate-800 focus:border-cyan-500 text-white outline-none transition placeholder-slate-600"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={!emailValid}
                    className={`w-full py-5 rounded-xl font-bold text-white transition-all shadow-xl group border border-transparent ${emailValid
                      ? 'bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 shadow-cyan-500/20'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      }`}
                  >
                    <span className="flex items-center justify-center gap-2">
                      Reveal My Matches <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </span>
                  </button>
                  <p className="text-xs text-slate-500 text-center mt-4">
                    Strictly no spam. Unsubscribe anytime.
                  </p>
                </form>
              </div>
            )}

            {/* Results Page */}
            {hasSubmittedEmail && (
              <div className="animate-fadeIn">
                <div className="text-center mb-10">
                  <div className="text-5xl mb-4">✨</div>
                  <h2 className="text-3xl font-bold text-white mb-2">
                    Your Perfect AI Matches
                  </h2>
                  <p className="text-slate-400">
                    Based on your needs, these tool recommendations
                    will give you the highest ROI.
                  </p>
                </div>

                <div className="space-y-6">
                  {recommendations.length > 0 ? (
                    recommendations.map((rec, idx) => (
                      <div
                        key={rec.slug}
                        className={`relative p-6 rounded-2xl border transition-all ${idx === 0
                          ? 'bg-slate-800/40 border-cyan-500/50 ring-1 ring-cyan-500/20'
                          : 'bg-slate-900/40 border-slate-800'
                          }`}
                      >
                        {idx === 0 && (
                          <div className="absolute -top-3 left-6 px-3 py-1 rounded-full bg-cyan-500 text-[10px] font-bold text-white uppercase tracking-wider">
                            Best Match
                          </div>
                        )}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-3 mb-1">
                              <h3 className="text-xl font-bold text-white">
                                {rec.name}
                              </h3>
                              <span className="px-2 py-0.5 rounded bg-slate-800 text-cyan-400 text-xs font-mono">
                                {rec.match}% Match
                              </span>
                            </div>
                            <p className="text-slate-400 text-sm italic">
                              &quot;{rec.reason}&quot;
                            </p>
                          </div>
                          <Link
                            href={`/tools/${rec.slug}`}
                            className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold transition-all border border-slate-700"
                          >
                            Read Review
                          </Link>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12 bg-slate-900/40 rounded-2xl border border-dashed border-slate-700 text-slate-400">
                      We couldn&apos;t find an exact match in our top-tier list.
                      Stay tuned as we add new tools daily!
                    </div>
                  )}
                </div>

                <div className="mt-12 text-center pt-8 border-t border-slate-800">
                  <button
                    onClick={resetQuiz}
                    className="text-slate-400 hover:text-white transition underline underline-offset-4"
                  >
                    Retake Quiz
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Trust */}
      <section className="px-4 py-12 text-center opacity-50">
        <p className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-6">
          Independently Reviewed & Trusted
        </p>
      </section>
    </div>
  )
}
