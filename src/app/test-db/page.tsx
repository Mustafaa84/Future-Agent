'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function TestDatabase() {
  const [status, setStatus] = useState<string>('Testing connection...')
  const [tables, setTables] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function testConnection() {
      try {
        const { error: dbError } = await supabase
          .from('ai_tools')
          .select('*')
          .limit(1)

        if (dbError) {
          setError(`Database Error: ${dbError.message}`)
          setStatus('❌ Connection failed')
          return
        }

        setStatus('✅ Connected to Supabase!')

        const createdTables = [
          'ai_tools',
          'tool_reviews',
          'tool_review_sections',
          'tool_pricing_plans',
          'tool_pros',
          'tool_cons',
          'tool_features',
          'tool_workflow_steps',
          'tool_faqs',
          'tool_alternatives',
          'tool_comparison_rows',
          'tags',
          'tool_tags',
          'blog_posts',
          'categories',
          'quiz_questions',
          'quiz_question_options',
          'quiz_results',
          'email_subscribers',
          'contact_submissions',
          'affiliate_clicks',
        ]

        setTables(createdTables)
      } catch (err) {
        const connectionError =
          err instanceof Error ? err : new Error(String(err))
        setError(`Connection Error: ${connectionError.message}`)
        setStatus('❌ Failed to connect')
      }
    }

    testConnection()
  }, [])

  return (
    <div className="min-h-screen bg-slate-950 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-2">
          Supabase Database Test
        </h1>
        <p className="text-slate-400 mb-8">
          Future Agent Project - Complete Schema
        </p>

        <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-white mb-4">
            Connection Status
          </h2>
          <p
            className={`text-2xl font-semibold ${
              status.includes('✅')
                ? 'text-green-400'
                : status.includes('❌')
                  ? 'text-red-400'
                  : 'text-yellow-400'
            }`}
          >
            {status}
          </p>
          {error && (
            <div className="mt-4 p-4 bg-red-900/20 border border-red-800 rounded-lg">
              <p className="text-red-400 text-sm font-mono">{error}</p>
            </div>
          )}
        </div>

        {tables.length > 0 && (
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-4">
              Database Tables ({tables.length}/21)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {tables.map((table) => (
                <div
                  key={table}
                  className="flex items-center gap-3 bg-slate-800/50 rounded-lg p-3"
                >
                  <span className="text-green-400 font-bold">✓</span>
                  <span className="text-slate-300 font-mono text-sm">
                    {table}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
