'use client'

import { FormEvent, useState } from 'react'

export default function EmailOptInSidebar() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!email.includes('@')) return
    // Later: send to API / email service here
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="bg-slate-900/80 border border-emerald-600/60 rounded-2xl p-5 md:p-6">
        <h2 className="text-lg font-semibold text-white mb-2">You’re in ✅</h2>
        <p className="text-sm text-slate-300">
          Thanks for subscribing. Watch your inbox for new AI workflows and tool breakdowns.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 md:p-6">
      <h2 className="text-lg font-semibold text-white mb-2">Get more AI playbooks</h2>
      <p className="text-sm text-slate-400 mb-4">
        Join the Future Agent newsletter and get practical AI workflows, tool breakdowns, and
        templates directly in your inbox.
      </p>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          required
        />
        <button
          type="submit"
          className="w-full px-4 py-2.5 rounded-lg text-sm font-semibold bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-500/40 transition"
        >
          Get weekly insights
        </button>
        <p className="text-[11px] text-slate-500">No spam. Unsubscribe anytime.</p>
      </form>
    </div>
  )
}
