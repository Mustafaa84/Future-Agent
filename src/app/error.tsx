'use client'

import { useEffect } from 'react'

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error('Global error:', error)
    }, [error])

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-4 text-center">
            <div className="relative mb-8">
                <div className="absolute -inset-4 bg-cyan-500/20 rounded-full blur-2xl animate-pulse" />
                <div className="relative text-6xl">🚀</div>
            </div>

            <h1 className="mb-4 text-4xl md:text-5xl font-black text-white italic tracking-tight">
                Turbulence Detected
            </h1>
            <p className="mb-10 max-w-lg text-lg text-slate-400 leading-relaxed">
                Our automated systems encountered an unexpected error while navigating this route.
                Don't worry, your data is safe.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
                <button
                    onClick={() => reset()}
                    className="px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-600 to-cyan-400 text-white font-black uppercase tracking-wider transition-all hover:scale-105 active:scale-95 shadow-xl shadow-cyan-500/20"
                >
                    Retry Blueprint
                </button>
                <button
                    onClick={() => window.location.href = '/'}
                    className="px-8 py-4 rounded-xl border border-white/10 bg-white/5 text-white font-bold transition-all hover:bg-white/10"
                >
                    Return to Hub
                </button>
            </div>

            <div className="mt-16 text-[10px] font-black uppercase tracking-[0.4em] text-slate-700">
                Error Log ID: {error.digest || 'SYSTEM_FAILURE_0x1'}
            </div>
        </div>
    )
}
