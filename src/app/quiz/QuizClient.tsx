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
}

interface QuizClientProps {
  tools: QuizTool[]
}

export default function QuizClient({ tools }: QuizClientProps) {
  const [step, setStep] = useState(1)
  const [answers, setAnswers] = useState<Answers>(initialAnswers)
  const [hasSubmittedEmail, setHasSubmittedEmail] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  const totalSteps = 7
  const emailValid =
    answers.email.trim().length > 3 && answers.email.includes('@')

  const nextDisabled =
    (step === 1 && !answers.goal) ||
    (step === 2 && !answers.teamSize) ||
    (step === 3 && !answers.budget) ||
    (step === 4 && !answers.experience) ||
    (step === 5 && !answers.useCase) ||
    (step === 6 && !answers.priority)

  const goNext = () => {
    if (step < totalSteps && !nextDisabled) {
      setIsAnimating(true)
      setTimeout(() => {
        setStep(step + 1)
        setIsAnimating(false)
      }, 150)
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

  // PURE DYNAMIC recommendation logic based on tools[] from DB
  const getRecommendations = () => {
    const recs: {
      name: string
      slug: string
      reason: string
      match: number
    }[] = []

    tools.forEach((tool) => {
      let score = 0
      const category = tool.category?.toLowerCase() || ''

      // Goal ↔ category
      if (answers.goal === 'content' && category.includes('writing'))
        score += 30
      if (answers.goal === 'marketing' && category.includes('marketing'))
        score += 30
      if (answers.goal === 'automation' && category.includes('automation'))
        score += 30
      if (answers.goal === 'research' && category.includes('research'))
        score += 30
      if (answers.goal === 'image' && category.includes('image')) score += 30
      if (answers.goal === 'chatbot' && category.includes('chat')) score += 30
      if (answers.goal === 'coding' && category.includes('code')) score += 30

      // Use case ↔ category
      if (answers.useCase === 'seo' && category.includes('seo')) score += 30
      if (answers.useCase === 'blog' && category.includes('writing'))
        score += 20
      if (
        answers.useCase === 'social' &&
        (category.includes('writing') || category.includes('image'))
      )
        score += 20
      if (answers.useCase === 'email' && category.includes('writing'))
        score += 15
      if (
        answers.useCase === 'ads' &&
        (category.includes('writing') || category.includes('marketing'))
      )
        score += 20
      if (answers.useCase === 'all') score += 10

      // Experience – small bias
      if (
        answers.experience === 'advanced' &&
        tool.review_count &&
        tool.review_count > 3000
      ) {
        score += 10
      }
      if (
        answers.experience === 'beginner' &&
        tool.review_count &&
        tool.review_count < 1000
      ) {
        score += 5
      }

      // Priority – quality: higher rating
      if (answers.priority === 'quality' && typeof tool.rating === 'number') {
        if (tool.rating >= 4.7) score += 15
        else if (tool.rating >= 4.5) score += 10
      }

      // Priority – SEO: prefer SEO tools
      if (answers.priority === 'seo' && category.includes('seo')) {
        score += 20
      }

      // Priority – speed: writing / automation tools get a small boost
      if (
        answers.priority === 'speed' &&
        (category.includes('writing') || category.includes('automation'))
      ) {
        score += 10
      }

      // Only include tools with some positive score
      if (score > 0) {
        recs.push({
          name: tool.name,
          slug: tool.slug,
          reason: `Good fit based on your answers and this tool's category (${tool.category}).`,
          match: Math.min(95, 50 + score), // clamp to max 95
        })
      }
    })

    // Remove duplicates and sort by match
    const uniqueRecs = Array.from(
      new Map(recs.map((item) => [item.slug, item])).values()
    ).sort((a, b) => b.match - a.match)

    return uniqueRecs.slice(0, 3)
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
            <span className="text-white">AI Tool Finder</span>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-sm font-semibold mb-5">
              <span className="flex h-2 w-2">
                <span className="absolute inline-flex h-2 w-2 animate-ping rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-400"></span>
              </span>
              Personalized in 60 seconds
            </div>

            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
              Find Your Perfect{' '}
              <span className="bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">
                AI Tool Match
              </span>
            </h1>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto">
              Answer 6 quick questions and get expert recommendations tailored
              to your goals, budget, and experience level.
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mt-8">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
              <span className="font-semibold text-white">
                {step === totalSteps ? 'Get Results' : `Question ${step} of 6`}
              </span>
              <span>{Math.round((step / totalSteps) * 100)}% Complete</span>
            </div>
            <div className="h-2 rounded-full bg-slate-800/80 overflow-hidden shadow-inner">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500 ease-out rounded-full"
                style={{ width: `${(step / totalSteps) * 100}%` }}
              />
            </div>

            <div className="flex justify-between mt-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full transition-all ${
                    i + 1 <= step ? 'bg-cyan-500 scale-110' : 'bg-slate-700'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Quiz Body */}
      <section className="px-4 py-12">
        <div
          className={`mx-auto max-w-3xl transition-opacity duration-150 ${
            isAnimating ? 'opacity-50' : 'opacity-100'
          }`}
        >
          <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800/80 rounded-3xl p-8 md:p-10 shadow-2xl">
            {/* Q1: Goal */}
            {step === 1 && (
              <div className="animate-fadeIn">
                <div className="mb-8">
                  <div className="text-5xl mb-4">🎯</div>
                  <h2 className="text-3xl font-bold text-white mb-3">
                    What&apos;s your primary goal?
                  </h2>
                  <p className="text-slate-400 text-lg">
                    This helps us recommend tools built for your specific use
                    case.
                  </p>
                </div>

                <div className="grid gap-4">
                  {[
                    {
                      value: 'content',
                      label: 'Create Content',
                      desc: 'Blogs, articles, landing pages, emails',
                    },
                    {
                      value: 'marketing',
                      label: 'Marketing & Ads',
                      desc: 'Social posts, ad copy, product descriptions',
                    },
                    {
                      value: 'automation',
                      label: 'Workflow Automation',
                      desc: 'Streamline tasks and boost productivity',
                    },
                    {
                      value: 'research',
                      label: 'Research & Analysis',
                      desc: 'Data insights, summaries, and reports',
                    },
                    {
                      value: 'image',
                      label: 'Images & Design',
                      desc: 'Create images, thumbnails, and visuals',
                    },
                    {
                      value: 'chatbot',
                      label: 'Chatbots & Assistants',
                      desc: 'Answer questions, support, and research',
                    },
                    {
                      value: 'coding',
                      label: 'AI Coding Help',
                      desc: 'Code generation, refactoring, debugging',
                    },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() =>
                        setAnswers((a) => ({ ...a, goal: option.value }))
                      }
                      className={`group relative text-left px-6 py-5 rounded-xl border-2 transition-all ${
                        answers.goal === option.value
                          ? 'border-cyan-500 bg-cyan-500/10 shadow-lg shadow-cyan-500/20'
                          : 'border-slate-700 bg-slate-900/60 hover:border-cyan-500/50 hover:bg-slate-900'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-cyan-300 transition">
                            {option.label}
                          </h3>
                          <p className="text-sm text-slate-400">
                            {option.desc}
                          </p>
                        </div>
                        <div
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-1 transition ${
                            answers.goal === option.value
                              ? 'border-cyan-500 bg-cyan-500'
                              : 'border-slate-600'
                          }`}
                        >
                          {answers.goal === option.value && (
                            <svg
                              className="w-4 h-4 text-white"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={3}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          )}
                        </div>
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
                    Who will use this tool?
                  </h2>
                  <p className="text-slate-400 text-lg">
                    Team features and collaboration needs vary by size.
                  </p>
                </div>

                <div className="grid gap-4">
                  {[
                    {
                      value: 'solo',
                      label: 'Just Me',
                      desc: 'Individual creator or freelancer',
                    },
                    {
                      value: 'small',
                      label: 'Small Team',
                      desc: '2-5 people collaborating',
                    },
                    {
                      value: 'team',
                      label: 'Growing Team',
                      desc: '6-20 people with shared workflows',
                    },
                    {
                      value: 'enterprise',
                      label: 'Enterprise',
                      desc: '20+ users, advanced admin needs',
                    },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() =>
                        setAnswers((a) => ({ ...a, teamSize: option.value }))
                      }
                      className={`group relative text-left px-6 py-5 rounded-xl border-2 transition-all ${
                        answers.teamSize === option.value
                          ? 'border-cyan-500 bg-cyan-500/10 shadow-lg shadow-cyan-500/20'
                          : 'border-slate-700 bg-slate-900/60 hover:border-cyan-500/50 hover:bg-slate-900'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-cyan-300 transition">
                            {option.label}
                          </h3>
                          <p className="text-sm text-slate-400">
                            {option.desc}
                          </p>
                        </div>
                        <div
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-1 transition ${
                            answers.teamSize === option.value
                              ? 'border-cyan-500 bg-cyan-500'
                              : 'border-slate-600'
                          }`}
                        >
                          {answers.teamSize === option.value && (
                            <svg
                              className="w-4 h-4 text-white"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={3}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          )}
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
                    What&apos;s your monthly budget?
                  </h2>
                  <p className="text-slate-400 text-lg">
                    We&apos;ll recommend tools that fit your price range.
                  </p>
                </div>

                <div className="grid gap-4">
                  {[
                    {
                      value: 'free',
                      label: 'Free / Freemium',
                      desc: 'Limited features, no cost',
                    },
                    {
                      value: 'low',
                      label: 'Under $50/month',
                      desc: 'Budget-friendly starter plans',
                    },
                    {
                      value: 'medium',
                      label: '$50-$150/month',
                      desc: 'Professional tier features',
                    },
                    {
                      value: 'high',
                      label: '$150+/month',
                      desc: 'Premium tools, enterprise features',
                    },
                    {
                      value: 'flexible',
                      label: 'ROI Matters Most',
                      desc: 'Budget is flexible for the right tool',
                    },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() =>
                        setAnswers((a) => ({ ...a, budget: option.value }))
                      }
                      className={`group relative text-left px-6 py-5 rounded-xl border-2 transition-all ${
                        answers.budget === option.value
                          ? 'border-cyan-500 bg-cyan-500/10 shadow-lg shadow-cyan-500/20'
                          : 'border-slate-700 bg-slate-900/60 hover:border-cyan-500/50 hover:bg-slate-900'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-cyan-300 transition">
                            {option.label}
                          </h3>
                          <p className="text-sm text-slate-400">
                            {option.desc}
                          </p>
                        </div>
                        <div
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-1 transition ${
                            answers.budget === option.value
                              ? 'border-cyan-500 bg-cyan-500'
                              : 'border-slate-600'
                          }`}
                        >
                          {answers.budget === option.value && (
                            <svg
                              className="w-4 h-4 text-white"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={3}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          )}
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
                    Your AI experience level?
                  </h2>
                  <p className="text-slate-400 text-lg">
                    We&apos;ll match you with tools that fit your comfort zone.
                  </p>
                </div>

                <div className="grid gap-4">
                  {[
                    {
                      value: 'beginner',
                      label: 'Just Starting Out',
                      desc: 'New to AI tools, need simple interfaces',
                    },
                    {
                      value: 'intermediate',
                      label: 'Some Experience',
                      desc: 'Used a few AI tools, comfortable learning',
                    },
                    {
                      value: 'advanced',
                      label: 'Power User',
                      desc: 'Daily AI user, want advanced features',
                    },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() =>
                        setAnswers((a) => ({
                          ...a,
                          experience: option.value,
                        }))
                      }
                      className={`group relative text-left px-6 py-5 rounded-xl border-2 transition-all ${
                        answers.experience === option.value
                          ? 'border-cyan-500 bg-cyan-500/10 shadow-lg shadow-cyan-500/20'
                          : 'border-slate-700 bg-slate-900/60 hover:border-cyan-500/50 hover:bg-slate-900'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-cyan-300 transition">
                            {option.label}
                          </h3>
                          <p className="text-sm text-slate-400">
                            {option.desc}
                          </p>
                        </div>
                        <div
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-1 transition ${
                            answers.experience === option.value
                              ? 'border-cyan-500 bg-cyan-500'
                              : 'border-slate-600'
                          }`}
                        >
                          {answers.experience === option.value && (
                            <svg
                              className="w-4 h-4 text-white"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={3}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Q5: Use Case */}
            {step === 5 && (
              <div className="animate-fadeIn">
                <div className="mb-8">
                  <div className="text-5xl mb-4">🚀</div>
                  <h2 className="text-3xl font-bold text-white mb-3">
                    Most important use case?
                  </h2>
                  <p className="text-slate-400 text-lg">
                    What will you use this tool for most often?
                  </p>
                </div>

                <div className="grid gap-4">
                  {[
                    {
                      value: 'blog',
                      label: 'Blog Writing',
                      desc: 'Long-form articles and SEO content',
                    },
                    {
                      value: 'social',
                      label: 'Social Media',
                      desc: 'Posts, captions, engagement content',
                    },
                    {
                      value: 'seo',
                      label: 'SEO Optimization',
                      desc: 'Keyword research and rankings',
                    },
                    {
                      value: 'ads',
                      label: 'Ad Copy',
                      desc: 'PPC campaigns, landing pages, CTAs',
                    },
                    {
                      value: 'email',
                      label: 'Email Marketing',
                      desc: 'Newsletters, sequences, campaigns',
                    },
                    {
                      value: 'all',
                      label: 'All of the Above',
                      desc: 'Need a versatile all-in-one solution',
                    },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() =>
                        setAnswers((a) => ({ ...a, useCase: option.value }))
                      }
                      className={`group relative text-left px-6 py-5 rounded-xl border-2 transition-all ${
                        answers.useCase === option.value
                          ? 'border-cyan-500 bg-cyan-500/10 shadow-lg shadow-cyan-500/20'
                          : 'border-slate-700 bg-slate-900/60 hover:border-cyan-500/50 hover:bg-slate-900'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-cyan-300 transition">
                            {option.label}
                          </h3>
                          <p className="text-sm text-slate-400">
                            {option.desc}
                          </p>
                        </div>
                        <div
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-1 transition ${
                            answers.useCase === option.value
                              ? 'border-cyan-500 bg-cyan-500'
                              : 'border-slate-600'
                          }`}
                        >
                          {answers.useCase === option.value && (
                            <svg
                              className="w-4 h-4 text-white"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={3}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Q6: Priority */}
            {step === 6 && (
              <div className="animate-fadeIn">
                <div className="mb-8">
                  <div className="text-5xl mb-4">🎯</div>
                  <h2 className="text-3xl font-bold text-white mb-3">
                    Top priority feature?
                  </h2>
                  <p className="text-slate-400 text-lg">
                    What matters most in your ideal AI tool?
                  </p>
                </div>

                <div className="grid gap-4">
                  {[
                    {
                      value: 'quality',
                      label: 'Output Quality',
                      desc: 'Best writing, minimal editing needed',
                    },
                    {
                      value: 'speed',
                      label: 'Speed & Volume',
                      desc: 'Generate content fast at scale',
                    },
                    {
                      value: 'seo',
                      label: 'SEO Features',
                      desc: 'Built-in optimization and rankings',
                    },
                    {
                      value: 'collaboration',
                      label: 'Team Collaboration',
                      desc: 'Shared workspaces and workflows',
                    },
                    {
                      value: 'integrations',
                      label: 'Integrations',
                      desc: 'Connect with my existing tools',
                    },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() =>
                        setAnswers((a) => ({ ...a, priority: option.value }))
                      }
                      className={`group relative text-left px-6 py-5 rounded-xl border-2 transition-all ${
                        answers.priority === option.value
                          ? 'border-cyan-500 bg-cyan-500/10 shadow-lg shadow-cyan-500/20'
                          : 'border-slate-700 bg-slate-900/60 hover:border-cyan-500/50 hover:bg-slate-900'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-cyan-300 transition">
                            {option.label}
                          </h3>
                          <p className="text-sm text-slate-400">
                            {option.desc}
                          </p>
                        </div>
                        <div
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-1 transition ${
                            answers.priority === option.value
                              ? 'border-cyan-500 bg-cyan-500'
                              : 'border-slate-600'
                          }`}
                        >
                          {answers.priority === option.value && (
                            <svg
                              className="w-4 h-4 text-white"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={3}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 7: Email & Results */}
            {step === 7 && (
              <div className="animate-fadeIn">
                {!hasSubmittedEmail ? (
                  <>
                    <div className="text-center mb-8">
                      <div className="text-6xl mb-6">🎉</div>
                      <h2 className="text-3xl font-bold text-white mb-3">
                        Your Perfect Match Awaits!
                      </h2>
                      <p className="text-lg text-slate-300 max-w-xl mx-auto">
                        Enter your email to unlock your personalized AI tool
                        recommendations and get exclusive deals.
                      </p>
                    </div>

                    <form
                      onSubmit={handleEmailSubmit}
                      className="max-w-md mx-auto space-y-5"
                    >
                      <div>
                        <input
                          type="email"
                          value={answers.email}
                          onChange={(e) =>
                            setAnswers((a) => ({
                              ...a,
                              email: e.target.value,
                            }))
                          }
                          placeholder="your@email.com"
                          className="w-full px-6 py-4 rounded-xl bg-slate-950/70 border-2 border-slate-700 text-white text-lg placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/20 transition"
                          required
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={!emailValid}
                        className={`w-full px-8 py-4 rounded-xl text-lg font-bold transition-all ${
                          emailValid
                            ? 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white shadow-2xl shadow-cyan-500/50 hover:scale-105'
                            : 'bg-slate-700 text-slate-500 cursor-not-allowed'
                        }`}
                      >
                        Show My Recommendations →
                      </button>

                      <p className="text-sm text-slate-500 text-center">
                        🔒 No spam. Unsubscribe anytime. Your data is safe with
                        us.
                      </p>
                    </form>
                  </>
                ) : (
                  <>
                    <div className="text-center mb-10">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 border-2 border-green-500 mb-4">
                        <svg
                          className="w-8 h-8 text-green-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                      <h2 className="text-3xl font-bold text-white mb-3">
                        Your Perfect Matches
                      </h2>
                      <p className="text-lg text-slate-300 max-w-2xl mx-auto">
                        Based on your answers, here are the AI tools that best
                        fit your needs. Check your inbox for the full report!
                      </p>
                    </div>

                    <div className="space-y-5 mb-8">
                      {recommendations.map((rec, index) => (
                        <div
                          key={rec.slug}
                          className="group relative bg-gradient-to-br from-slate-900 to-slate-900/50 border border-slate-700 hover:border-cyan-500/60 rounded-2xl p-6 transition-all hover:scale-[1.02] hover:shadow-2xl hover:shadow-cyan-500/20"
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white font-bold text-xl">
                                #{index + 1}
                              </div>
                              <div>
                                <h3 className="text-2xl font-bold text-white group-hover:text-cyan-400 transition">
                                  {rec.name}
                                </h3>
                                <div className="flex items-center gap-2 mt-1">
                                  <div className="flex items-center gap-1">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                      <svg
                                        key={i}
                                        className="w-4 h-4 text-yellow-400"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                      >
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                      </svg>
                                    ))}
                                  </div>
                                  <span className="px-2 py-0.5 rounded-full bg-green-500/20 text-green-300 text-xs font-bold border border-green-500/30">
                                    {rec.match}% Match
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <p className="text-slate-300 text-base leading-relaxed mb-4">
                            {rec.reason}
                          </p>

                          <Link
                            href={`/tools/${rec.slug}`}
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-semibold hover:bg-cyan-500/20 hover:border-cyan-400 transition group/btn"
                          >
                            <span>View Full Review</span>
                            <span className="group-hover/btn:translate-x-1 transition-transform">
                              →
                            </span>
                          </Link>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Link
                        href="/tools"
                        className="px-8 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white font-semibold hover:bg-slate-700 hover:border-slate-600 transition text-center"
                      >
                        Browse All Tools
                      </Link>
                      <button
                        onClick={resetQuiz}
                        className="px-8 py-3 rounded-xl border-2 border-slate-700 text-slate-300 font-semibold hover:border-cyan-500/50 hover:text-white transition"
                      >
                        Retake Quiz
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Navigation */}
            {step < 7 && (
              <div className="mt-10 pt-8 border-t border-slate-800 flex items-center justify-between">
                <button
                  onClick={goBack}
                  disabled={step === 1}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl text-base font-semibold transition ${
                    step === 1
                      ? 'text-slate-600 cursor-not-allowed'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700 hover:border-slate-600'
                  }`}
                >
                  <span>←</span>
                  <span>Back</span>
                </button>

                <button
                  onClick={goNext}
                  disabled={nextDisabled}
                  className={`flex items-center gap-2 px-8 py-3 rounded-xl text-base font-bold transition-all ${
                    nextDisabled
                      ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white shadow-xl shadow-cyan-500/40 hover:scale-105'
                  }`}
                >
                  <span>Continue</span>
                  <span>→</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
