'use client'

import { useState, useEffect } from 'react'
import { X, Mail, CheckCircle, AlertCircle } from 'lucide-react'

export default function ExitIntentPopup() {
    const [isVisible, setIsVisible] = useState(false)
    const [hasSeen, setHasSeen] = useState(true) // Default true to prevent flash on load
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
    const [email, setEmail] = useState('')

    useEffect(() => {
        // Check localStorage (7 days) AND sessionStorage (current session)
        const lastSeen = localStorage.getItem('future_agent_exit_popup_seen')
        const sessionSeen = sessionStorage.getItem('future_agent_exit_popup_session_seen')
        const now = Date.now()
        const sevenDays = 7 * 24 * 60 * 60 * 1000

        // If seen in this session, don't show.
        if (sessionSeen) return

        // If seen in last 7 days, don't show.
        if (lastSeen && !isNaN(parseInt(lastSeen)) && (now - parseInt(lastSeen) < sevenDays)) {
            return
        }

        setHasSeen(false)

        // Desktop: Mouse leave
        const handleMouseLeave = (e: MouseEvent) => {
            if (e.clientY <= 0) {
                showPopup()
            }
        }

        // Mobile/All: Timer fallback (60s - increased from 20s)
        const timer = setTimeout(() => {
            showPopup()
        }, 60000)

        document.addEventListener('mouseleave', handleMouseLeave)

        return () => {
            document.removeEventListener('mouseleave', handleMouseLeave)
            clearTimeout(timer)
        }
    }, [])

    const showPopup = () => {
        setIsVisible(true)
        sessionStorage.setItem('future_agent_exit_popup_session_seen', 'true')
    }

    const closePopup = () => {
        setIsVisible(false)
        // Set cool-down
        localStorage.setItem('future_agent_exit_popup_seen', Date.now().toString())
        sessionStorage.setItem('future_agent_exit_popup_session_seen', 'true')
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!email.includes('@')) return

        setStatus('loading')

        try {
            const res = await fetch('/api/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, source: 'exit_intent' }),
            })

            if (res.ok) {
                setStatus('success')
                // Auto close after success? Maybe keep it open to show success message
                setTimeout(() => {
                    // Optional: Close after 3s
                    // closePopup()
                }, 3000)
                // Mark as seen immediately on success so they don't get pestered
                localStorage.setItem('future_agent_exit_popup_seen', Date.now().toString())
            } else {
                setStatus('error')
            }
        } catch {
            setStatus('error')
        }
    }

    if (hasSeen && !isVisible) return null

    return (
        <div
            className={`fixed inset-0 z-[100] flex items-center justify-center px-4 transition-opacity duration-300 ${isVisible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        >
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
                onClick={closePopup}
            />

            {/* Modal */}
            <div className={`relative w-full max-w-lg transform overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 p-8 shadow-2xl transition-all duration-300 ${isVisible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}`}>

                {/* Close Button */}
                <button
                    onClick={closePopup}
                    className="absolute right-4 top-4 rounded-full p-1 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                {status === 'success' ? (
                    <div className="text-center py-8">
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10">
                            <CheckCircle className="h-8 w-8 text-green-500" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">You're on the list!</h3>
                        <p className="text-slate-400">Keep an eye on your inbox for the best AI tools.</p>
                        <button
                            onClick={closePopup}
                            className="mt-6 px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors font-medium"
                        >
                            Close
                        </button>
                    </div>
                ) : (
                    <div>
                        <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/20">
                            <Mail className="h-6 w-6 text-white" />
                        </div>

                        <h2 className="mb-2 text-center text-2xl font-bold text-white">
                            Wait! Don't Miss Out
                        </h2>
                        <p className="mb-8 text-center text-slate-400">
                            Get our weekly <strong>"Top 5 AI Agents"</strong> report delivered to your inbox. Join 10,000+ smart workflow builders.
                        </p>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="name@company.com"
                                    required
                                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={status === 'loading'}
                                className="w-full rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-3 font-bold text-white shadow-lg shadow-cyan-500/25 transition-all hover:scale-[1.02] hover:shadow-cyan-500/40 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {status === 'loading' ? 'Joining...' : 'Get the Free Report'}
                            </button>

                            {status === 'error' && (
                                <div className="flex items-center gap-2 text-sm text-red-400 justify-center">
                                    <AlertCircle className="w-4 h-4" />
                                    <span>Something went wrong. Please try again.</span>
                                </div>
                            )}
                        </form>

                        <p className="mt-6 text-center text-xs text-slate-500">
                            No spam. Unsubscribe at any time.
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}
