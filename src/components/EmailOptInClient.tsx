'use client'

import { useState } from 'react'

export default function EmailOptInClient() {
  const [status, setStatus] = useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle')

  const [email, setEmail] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.includes('@')) return

    setStatus('loading')

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'tools' }),
      })

      if (res.ok) {
        setStatus('success')
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="max-w-3xl mx-auto p-8 bg-green-400/20 border-2 border-green-400/60 rounded-2xl backdrop-blur-xl shadow-2xl">
        <div className="text-3xl mx-auto mb-3 text-green-400">✓</div>
        <h3 className="text-xl font-bold text-green-300 mb-2">
          Perfect! You&apos;re In!
        </h3>
        <p className="text-green-200 text-sm mb-5">
          Check your inbox for exclusive AI tool deals
        </p>
        <button
          onClick={() => {
            setStatus('idle')
            setEmail('')
          }}
          className="w-full py-3 px-6 bg-[#09f496] hover:bg-[#0bffaa] text-slate-900 font-bold rounded-xl transition shadow-lg"
        >
          Subscribe Another Email
        </button>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="max-w-3xl mx-auto p-8 bg-red-900/60 border-2 border-red-500/60 rounded-2xl backdrop-blur-xl shadow-2xl">
        <div className="text-4xl mx-auto mb-4 text-red-400">✗</div>
        <h3 className="text-2xl font-bold text-red-300 mb-3">
          Oops! Something Went Wrong
        </h3>
        <p className="text-red-200 text-lg mb-6">
          Please check your email and try again
        </p>
        <button
          onClick={() => setStatus('idle')}
          className="w-full py-3 px-6 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-xl transition"
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto p-8 bg-slate-900/70 border border-slate-800/50 rounded-2xl backdrop-blur-xl shadow-2xl shadow-slate-900/50">
      <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent mb-4 text-center">
        Master Agentic AI Strategy
      </h2>
      <p className="text-slate-300 text-lg mb-2 text-center font-semibold">
        Get data-backed research on autonomous agents and automated workflow blueprints
      </p>
      <p className="text-slate-400 text-sm mb-8 text-center">
        The smartest creators subscribe to stay ahead!
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          className="w-full px-5 py-3 bg-slate-950/70 border-2 border-slate-700 hover:border-slate-600 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 rounded-lg text-base placeholder-slate-500 font-medium shadow-lg transition-all text-[#cad5e2]"
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="w-full py-3 px-6 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 text-white font-bold text-base rounded-lg hover:from-cyan-400 hover:via-blue-400 hover:to-indigo-500 disabled:opacity-50 shadow-xl shadow-cyan-500/30 hover:shadow-2xl hover:shadow-cyan-400/50 transition-all duration-200"
        >
          {status === 'loading' ? 'Submitting…' : 'Get Weekly Updates FREE →'}
        </button>
      </form>

      <p className="text-slate-500 text-xs text-center mt-6 pt-4 border-t border-slate-800">
        No spam • Unsubscribe anytime • Privacy first
      </p>
    </div>
  )
}
