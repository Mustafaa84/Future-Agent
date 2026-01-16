'use client'

import { useState, useTransition } from 'react'
import { supabase } from '@/lib/supabase'

type AffiliateLinkFormProps = {
  toolId: string
  initialTargetUrl: string
  initialSlug: string
  existingSlug?: string | null
}

export function AffiliateLinkForm({
  toolId,
  initialTargetUrl,
  initialSlug,
  existingSlug,
}: AffiliateLinkFormProps) {
  const [targetUrl, setTargetUrl] = useState(initialTargetUrl)
  const [slug, setSlug] = useState(initialSlug)
  const [saving, startTransition] = useTransition()
  const [message, setMessage] = useState<string | null>(null)

  const handleSave = () => {
    setMessage(null)
    startTransition(async () => {
      if (!targetUrl || !slug) {
        setMessage('Please fill both URL and slug.')
        return
      }

      // Check if a link exists for this tool
      const { data: existing, error: existingError } = await supabase
        .from('affiliate_links')
        .select('id')
        .eq('tool_id', toolId)
        .maybeSingle()

      if (existingError && existingError.code !== 'PGRST116') {
        console.error(existingError)
        setMessage('Error loading existing link.')
        return
      }

      if (existing) {
        const { error: updateError } = await supabase
          .from('affiliate_links')
          .update({ target_url: targetUrl, slug })
          .eq('id', existing.id)

        if (updateError) {
          console.error(updateError)
          setMessage('Failed to update link.')
          return
        }
      } else {
        const { error: insertError } = await supabase
          .from('affiliate_links')
          .insert({
            tool_id: toolId,
            target_url: targetUrl,
            slug,
          })

        if (insertError) {
          console.error(insertError)
          setMessage('Failed to create link.')
          return
        }
      }

      setMessage('Saved.')
    })
  }

  return (
    <div className="space-y-2">
      <input
        type="url"
        value={targetUrl}
        onChange={(e) => setTargetUrl(e.target.value)}
        placeholder="https://your-affiliate-network.com/..."
        className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500"
      />
      <input
        type="text"
        value={slug}
        onChange={(e) => setSlug(e.target.value)}
        className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500"
      />
      {existingSlug && (
        <p className="text-xs text-slate-500">
          Current URL: <code className="text-cyan-400">/go/{existingSlug}</code>
        </p>
      )}
      <button
        type="button"
        onClick={handleSave}
        disabled={saving}
        className="inline-flex items-center rounded-lg bg-cyan-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-cyan-500 transition-colors disabled:opacity-60"
      >
        {saving ? 'Saving...' : 'Save'}
      </button>
      {message && (
        <p className="text-xs text-slate-400">
          {message}
        </p>
      )}
    </div>
  )
}
