'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

interface CategorySelectProps {
  defaultValue?: string
  required?: boolean
}

export default function CategorySelect({
  defaultValue = '',
  required = false,
}: CategorySelectProps) {
  const [categories, setCategories] = useState<{ name: string; slug: string }[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedValue, setSelectedValue] = useState(defaultValue)

  useEffect(() => {
    async function fetchCategories() {
      try {
        const { data, error: dbError } = await supabase
          .from('categories')
          .select('name, slug')
          .order('name', { ascending: true })

        if (dbError) {
          setError(dbError.message)
          return
        }

        if (data) {
          setCategories(data)
          if (defaultValue) {
            setSelectedValue(defaultValue)
          }
        }
      } catch (err) {
        const categoryError =
          err instanceof Error ? err : new Error(String(err))
        setError(categoryError.message)
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [defaultValue])

  if (error) {
    return (
      <div>
        <label className="block text-sm font-semibold text-white mb-2">
          Category <span className="text-red-400">*</span>
        </label>
        <div className="p-3 bg-red-900/20 border border-red-800 rounded-xl">
          <p className="text-red-400 text-sm">
            Error loading categories: {error}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <label className="block text-sm font-semibold text-white mb-2">
        Category <span className="text-red-400">*</span>
      </label>
      <select
        name="category"
        value={selectedValue}
        onChange={(e) => setSelectedValue(e.target.value)}
        required={required}
        className="w-full px-4 py-3 bg-white/5 border-2 border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400 focus:bg-white/10 transition-all"
        style={{
          colorScheme: 'dark',
        }}
        disabled={loading}
      >
        <option value="" className="bg-slate-900 text-white">
          {loading ? 'Loading categories...' : 'Select a category...'}
        </option>
        {categories.map((cat) => (
          <option
            key={cat.slug}
            value={cat.name}
            className="bg-slate-900 text-white"
          >
            {cat.name}
          </option>
        ))}
      </select>
      <p className="text-xs text-slate-400 mt-2">
        ℹ️ Categories are managed in Supabase. Add new ones there and
        they&apos;ll appear here automatically.
      </p>
    </div>
  )
}
