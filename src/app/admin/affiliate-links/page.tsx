import { supabase } from '@/lib/supabase'
import { AffiliateLinksTable } from './AffiliateLinksTable'

function generateSlugFromName(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 40)
}

export const dynamic = 'force-dynamic'

type ToolClickStats = {
  total: number
  last7: number
  thisMonth: number
}

type AffiliateLinksPageProps = {
  searchParams: { [key: string]: string | string[] | undefined }
}

export default async function AffiliateLinksPage({ searchParams }: AffiliateLinksPageProps) {
  const params = await searchParams
  const range = (params?.range as string) ?? 'all'

  // 1. Fetch tools
  const { data: tools, error: toolsError } = await supabase
    .from('ai_tools')
    .select('id, name, slug, published')
    .order('name')

  if (toolsError) {
    console.error('Error loading tools:', toolsError)
    return (
      <div className="text-red-400">
        Failed to load tools.
      </div>
    )
  }

  // 2. Fetch existing affiliate links
  const { data: links, error: linksError } = await supabase
    .from('affiliate_links')
    .select('id, tool_id, slug, target_url')

  if (linksError) {
    console.error('Error loading affiliate links:', linksError)
  }

  const linksByToolId = new Map(
    (links || []).map((link) => [link.tool_id, link])
  )

  // 3. Fetch affiliate clicks (for stats)
  const { data: clickRows, error: clickStatsError } = await supabase
    .from('affiliate_clicks')
    .select('tool_id, created_at')

  if (clickStatsError) {
    console.error('Error loading affiliate clicks stats:', clickStatsError)
  }

  // 4. Aggregate stats in memory by tool_id (respecting range preset)
  const statsByToolId = new Map<string, ToolClickStats>()

  const now = new Date()
  const sevenDaysAgo = new Date(now)
  sevenDaysAgo.setDate(now.getDate() - 7)

  const thirtyDaysAgo = new Date(now)
  thirtyDaysAgo.setDate(now.getDate() - 30)

  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  for (const row of clickRows || []) {
    const toolId = row.tool_id as string
    const createdAt = new Date(row.created_at as string)

    let inRange = true
    if (range === '7d') {
      inRange = createdAt >= sevenDaysAgo
    } else if (range === '30d') {
      inRange = createdAt >= thirtyDaysAgo
    } else if (range === 'month') {
      inRange = createdAt >= startOfMonth
    }

    if (!inRange) continue

    let stats = statsByToolId.get(toolId)
    if (!stats) {
      stats = { total: 0, last7: 0, thisMonth: 0 }
      statsByToolId.set(toolId, stats)
    }

    stats.total += 1

    if (createdAt >= sevenDaysAgo) {
      stats.last7 += 1
    }

    if (createdAt >= startOfMonth) {
      stats.thisMonth += 1
    }
  }

  const rows = (tools || []).map((tool) => {
    const link = linksByToolId.get(tool.id)
    const defaultSlug = link?.slug || generateSlugFromName(tool.name)
    const stats = statsByToolId.get(tool.id) || {
      total: 0,
      last7: 0,
      thisMonth: 0,
    }

    return {
      tool,
      link,
      defaultSlug,
      stats,
    }
  })

  // Calculate summary stats
  const totalClicks = Array.from(statsByToolId.values()).reduce((sum, s) => sum + s.total, 0)
  const toolsWithClicks = Array.from(statsByToolId.entries()).filter(([, s]) => s.total > 0).length
  const topToolEntry = Array.from(statsByToolId.entries()).sort((a, b) => b[1].total - a[1].total)[0]
  const topToolName = topToolEntry ? (tools || []).find((t) => t.id === topToolEntry[0])?.name : null
  const topToolClicks = topToolEntry ? topToolEntry[1].total : 0
  const avgClicks = toolsWithClicks > 0 ? (totalClicks / toolsWithClicks).toFixed(1) : '0'

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">
          Affiliate Links
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Save one main affiliate URL and SEO-friendly slug for each tool. All CTAs and tracking now use these links via{' '}
          <code className="text-cyan-400">/go/slug</code>.
        </p>
            </div>

      {/* Summary Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-lg border border-slate-800 bg-slate-900/50 px-6 py-4">
          <div className="text-xs text-slate-400 uppercase tracking-wide font-semibold">Total Clicks</div>
          <div className="text-3xl font-bold text-emerald-400 mt-2">{totalClicks}</div>
          <div className="text-xs text-slate-500 mt-1">{toolsWithClicks} tools active</div>
        </div>

        <div className="rounded-lg border border-slate-800 bg-slate-900/50 px-6 py-4">
          <div className="text-xs text-slate-400 uppercase tracking-wide font-semibold">Top Tool</div>
          <div className="text-lg font-bold text-white mt-2">{topToolName || '—'}</div>
          <div className="text-xs text-emerald-400 mt-1">{topToolClicks > 0 ? `${topToolClicks} clicks` : 'No data'}</div>
        </div>

        <div className="rounded-lg border border-slate-800 bg-slate-900/50 px-6 py-4">
          <div className="text-xs text-slate-400 uppercase tracking-wide font-semibold">Avg per Tool</div>
          <div className="text-3xl font-bold text-cyan-400 mt-2">{avgClicks}</div>
          <div className="text-xs text-slate-500 mt-1">Among active tools</div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 backdrop-blur">

        <div className="px-6 py-4 border-b border-slate-800 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wide">
              Tools &amp; Affiliate Links
            </h2>
            <p className="text-xs text-slate-500">
              Slugs will be used for URLs like <code className="text-cyan-400">/go/jasper-ai</code>.
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <form
              className="flex items-center gap-2"
              action="/admin/affiliate-links"
            >
              <label className="text-xs text-slate-400">
                Range:
              </label>
              <select
                name="range"
                defaultValue={range}
                className="rounded-lg border border-slate-700 bg-slate-900 px-2 py-1 text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500"
              >
                <option value="all">All time</option>
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="month">This month</option>
              </select>
              <button
                type="submit"
                className="hidden sm:inline-flex items-center rounded-lg bg-slate-800 px-2 py-1 text-xs text-slate-100 hover:bg-slate-700 transition-colors"
              >
                Apply
              </button>
            </form>
          </div>
        </div>
        <AffiliateLinksTable rows={rows} />
      </div>
    </div>
  )
}
