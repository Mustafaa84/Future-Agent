// src/components/blog/CategoryNavigation.tsx
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

// Map known category slugs to icons (fallback is 📁)
const CATEGORY_ICONS: Record<string, string> = {
  'ai-tools': '🤖',
  'content-creation': '✍️',
  'automation': '⚡',
  'marketing': '📊',
  'productivity': '⏰',
  'design': '🎨',
  'coding': '💻',
  'email-marketing': '✉️',
}

export default async function CategoryNavigation() {
  // Fetch from official categories table
  const { data: categories } = await supabase
    .from('categories')
    .select('name, slug, icon')
    .order('name', { ascending: true })

  if (!categories || !categories.length) {
    return null
  }

  // Icon mapper for emojis
  const getIcon = (iconName: string | null) => {
    const icons: Record<string, string> = {
      'Megaphone': '📣',
      'Code2': '💻',
      'PenTool': '✍️',
      'Zap': '⚡',
      'Search': '🔍',
      'Video': '🎥',
      'Image': '🖼️',
      'MessageSquare': '💬'
    }
    return iconName ? (icons[iconName] || '📁') : '📁'
  }

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
      <h3 className="text-sm font-semibold text-white mb-3">Browse Categories</h3>

      <div className="space-y-2">
        {categories.map(category => {
          const icon = getIcon(category.icon)

          return (
            <Link
              key={category.slug}
              href={`/blog/category/${category.slug}`}
              className="group flex items-center gap-3 p-3 rounded-lg bg-slate-800/50 border border-slate-700/50 hover:border-cyan-500/50 hover:bg-slate-800 transition-all"
            >
              <span className="text-lg">{icon}</span>
              <span className="text-sm text-slate-300 group-hover:text-white transition-colors flex-1">
                {category.name}
              </span>
              <svg
                className="w-3 h-3 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
