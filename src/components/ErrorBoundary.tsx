'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'

interface Props {
    children?: ReactNode
    fallback?: ReactNode
}

interface State {
    hasError: boolean
}

class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false
    }

    public static getDerivedStateFromError(_: Error): State {
        return { hasError: true }
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo)
    }

    public render() {
        if (this.state.hasError) {
            return this.props.fallback || (
                <div className="flex min-h-[400px] w-full flex-col items-center justify-center rounded-2xl border border-white/10 bg-slate-900/50 p-8 text-center backdrop-blur-xl">
                    <div className="mb-4 text-4xl">⚠️</div>
                    <h2 className="mb-2 text-xl font-bold text-white italic tracking-tight">Something went wrong</h2>
                    <p className="mb-6 text-sm text-slate-400 max-w-xs mx-auto">
                        This module encountered an unexpected error. Don't worry, the rest of the site is still working.
                    </p>
                    <button
                        onClick={() => this.setState({ hasError: false })}
                        className="px-6 py-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-black uppercase tracking-widest hover:bg-cyan-500/20 transition-all"
                    >
                        Try Refreshing Component
                    </button>
                </div>
            )
        }

        return this.props.children
    }
}

export default ErrorBoundary
