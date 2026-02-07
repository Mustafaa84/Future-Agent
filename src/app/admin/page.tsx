import Link from 'next/link'
import { createAdminClient, withRetry } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export default async function AdminDashboard() {
  const supabase = createAdminClient()

  // Calculate date filters
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

  const startOfMonth = new Date()
  startOfMonth.setDate(1)
  startOfMonth.setHours(0, 0, 0, 0)

  // Batch 1: Core counts (most important)
  const [
    toolsCountRes,
    blogCountRes,
    categoriesCountRes,
    publishedToolsRes,
    publishedPostsRes,
  ] = await Promise.all([
    withRetry(async () => await supabase.from('ai_tools').select('*', { count: 'exact', head: true })),
    withRetry(async () => await supabase.from('blog_posts').select('*', { count: 'exact', head: true })),
    withRetry(async () => await supabase.from('categories').select('*', { count: 'exact', head: true })),
    withRetry(async () => await supabase.from('ai_tools').select('*', { count: 'exact', head: true }).eq('published', true)),
    withRetry(async () => await supabase.from('blog_posts').select('*', { count: 'exact', head: true }).eq('published', true)),
  ])

  // Batch 2: Affiliate and visitor stats
  const [
    totalAffiliateClicksRes,
    clicksLast7DaysRes,
    clicksThisMonthRes,
    totalVisitorsRes,
    visitorsThisWeekRes,
  ] = await Promise.all([
    withRetry(async () => await supabase.from('affiliate_clicks').select('*', { count: 'exact', head: true })),
    withRetry(async () => await supabase.from('affiliate_clicks').select('*', { count: 'exact', head: true }).gte('created_at', sevenDaysAgo.toISOString())),
    withRetry(async () => await supabase.from('affiliate_clicks').select('*', { count: 'exact', head: true }).gte('created_at', startOfMonth.toISOString())),
    withRetry(async () => await supabase.from('page_views').select('*', { count: 'exact', head: true })),
    withRetry(async () => await supabase.from('page_views').select('*', { count: 'exact', head: true }).gte('created_at', sevenDaysAgo.toISOString())),
  ])

  // Batch 3: Recent activity (data fetches)
  const [
    recentPostsRes,
    recentToolsRes,
    recentCommentsRes,
  ] = await Promise.all([
    withRetry(async () => await supabase.from('blog_posts').select('id, title, created_at').order('created_at', { ascending: false }).limit(3)),
    withRetry(async () => await supabase.from('ai_tools').select('id, name, created_at').order('created_at', { ascending: false }).limit(3)),
    withRetry(async () => await supabase.from('tool_comments').select('id, author_name, created_at, tool_id').order('created_at', { ascending: false }).limit(3)),
  ])

  // Extract values with fallbacks
  const toolsCount = toolsCountRes.count ?? 0
  const blogCount = blogCountRes.count ?? 0
  const categoriesCount = categoriesCountRes.count ?? 0
  const publishedTools = publishedToolsRes.count ?? 0
  const publishedPosts = publishedPostsRes.count ?? 0
  const totalAffiliateClicks = totalAffiliateClicksRes.count ?? 0
  const clicksLast7Days = clicksLast7DaysRes.count ?? 0
  const clicksThisMonth = clicksThisMonthRes.count ?? 0
  const recentPosts = recentPostsRes.data
  const recentTools = recentToolsRes.data
  const recentComments = recentCommentsRes.data
  const totalVisitors = totalVisitorsRes.count ?? 0
  const visitorsThisWeek = visitorsThisWeekRes.count ?? 0

  // Combine and sort
  const activityItems = [
    ...(recentPosts || []).map((p) => ({
      id: p.id,
      type: 'post',
      text: `New post: ${p.title}`,
      created_at: p.created_at,
    })),
    ...(recentTools || []).map((t) => ({
      id: t.id,
      type: 'tool',
      text: `New tool: ${t.name}`,
      created_at: t.created_at,
    })),
    ...(recentComments || []).map((c) => ({
      id: c.id,
      type: 'comment',
      text: `Review by ${c.author_name}`,
      created_at: c.created_at,
    })),
  ]
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
    .slice(0, 5)

  function timeAgo(dateString: string) {
    const seconds = Math.floor(
      (new Date().getTime() - new Date(dateString).getTime()) / 1000
    )
    let interval = seconds / 31536000
    if (interval > 1) return Math.floor(interval) + ' years ago'
    interval = seconds / 2592000
    if (interval > 1) return Math.floor(interval) + ' months ago'
    interval = seconds / 86400
    if (interval > 1) return Math.floor(interval) + ' days ago'
    interval = seconds / 3600
    if (interval > 1) return Math.floor(interval) + ' hours ago'
    interval = seconds / 60
    if (interval > 1) return Math.floor(interval) + ' minutes ago'
    return 'Just now'
  }

  // Top Tools by Clicks (Performance)
  const { data: allClicks } = await supabase
    .from('affiliate_clicks')
    .select('tool_slug, created_at')
    .gte('created_at', startOfMonth.toISOString()) // This month only

  const clicksByTool: Record<string, number> = {}
  allClicks?.forEach((click) => {
    const slug = click.tool_slug || 'unknown'
    clicksByTool[slug] = (clicksByTool[slug] || 0) + 1
  })

  // Sort by clicks
  const topTools = Object.entries(clicksByTool)
    .map(([slug, count]) => ({ slug, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 3)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-950/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center text-2xl font-bold text-white shadow-lg">
                🛠️
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">
                  Admin Dashboard
                </h1>
                <p className="text-sm text-slate-500">
                  Manage your AI tools &amp; content
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/tools"
                className="px-6 py-2 bg-green-500/90 hover:bg-green-600 text-white font-semibold rounded-xl text-sm transition-all shadow-lg hover:shadow-green-500/25"
              >
                → View Live Site
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* Stats Grid */}
        <div className="grid gap-6 mb-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="group relative bg-gradient-to-br from-slate-900/80 to-slate-800/50 border border-slate-700/50 rounded-2xl p-6 backdrop-blur-xl hover:border-cyan-500/60 transition-all hover:shadow-2xl hover:shadow-cyan-500/20">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-blue-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative">
              <div className="text-cyan-400 text-sm font-semibold mb-2 tracking-wide uppercase">
                Total Tools
              </div>
              <div className="text-4xl font-black text-white mb-1">
                {toolsCount || 0}
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-green-400 font-semibold">
                  {publishedTools || 0} published
                </span>
              </div>
            </div>
          </div>

          <div className="group relative bg-gradient-to-br from-slate-900/80 to-slate-800/50 border border-slate-700/50 rounded-2xl p-6 backdrop-blur-xl hover:border-orange-500/60 transition-all hover:shadow-2xl hover:shadow-orange-500/20">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-amber-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative">
              <div className="text-orange-400 text-sm font-semibold mb-2 tracking-wide uppercase">
                Categories
              </div>
              <div className="text-4xl font-black text-white mb-1">
                {categoriesCount || 0}
              </div>
              <div className="text-orange-400 text-sm font-semibold">
                Core Pillars
              </div>
            </div>
          </div>

          <div className="group relative bg-gradient-to-br from-slate-900/80 to-slate-800/50 border border-slate-700/50 rounded-2xl p-6 backdrop-blur-xl hover:border-purple-500/60 transition-all hover:shadow-2xl hover:shadow-purple-500/20">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative">
              <div className="text-purple-400 text-sm font-semibold mb-2 tracking-wide uppercase">
                Blog Posts
              </div>
              <div className="text-4xl font-black text-white mb-1">
                {blogCount || 0}
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-green-400 font-semibold">
                  {publishedPosts || 0} published
                </span>
              </div>
            </div>
          </div>

          <div className="group relative bg-gradient-to-br from-slate-900/80 to-slate-800/50 border border-slate-700/50 rounded-2xl p-6 backdrop-blur-xl hover:border-emerald-500/60 transition-all hover:shadow-2xl hover:shadow-emerald-500/20">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-teal-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative">
              <div className="text-emerald-400 text-sm font-semibold mb-2 tracking-wide uppercase">
                Site Traffic
              </div>
              <div className="text-4xl font-black text-white mb-1">
                {totalVisitors?.toLocaleString() || 0}
              </div>
              <div className="text-emerald-400 text-sm font-semibold">
                {visitorsThisWeek || 0} visitors this week
              </div>
            </div>
          </div>

          <div className="group relative bg-gradient-to-br from-slate-900/80 to-slate-800/50 border border-slate-700/50 rounded-2xl p-6 backdrop-blur-xl hover:border-amber-500/60 transition-all hover:shadow-2xl hover:shadow-amber-500/20">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 to-orange-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative">
              <div className="text-amber-400 text-sm font-semibold mb-2 tracking-wide uppercase">
                Affiliate Clicks
              </div>
              <div className="text-4xl font-black text-white mb-1">
                {totalAffiliateClicks || 0}
              </div>
              <div className="text-amber-400 text-sm font-semibold">
                {clicksThisMonth || 0} this month · {clicksLast7Days || 0} last 7 days
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-r from-slate-900/80 to-slate-800/50 border border-slate-700/50 rounded-2xl p-8 backdrop-blur-xl">
              <h2 className="mb-6 text-2xl font-bold text-white flex items-center gap-3">
                <span className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
                  🚀
                </span>
                Quick Actions
              </h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <Link
                  href="/admin/tools/add"
                  className="group relative flex transform items-center gap-4 overflow-hidden rounded-xl bg-gradient-to-r from-cyan-500/10 via-blue-500/5 to-indigo-500/10 p-6 text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-cyan-500/25 hover:border-cyan-400/50 border border-cyan-400/20"
                >
                  <div className="relative flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-2xl shadow-lg group-hover:scale-110 transition-all">
                    ➕
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 font-bold text-white group-hover:text-cyan-300 transition-colors">
                      Add New Tool
                    </div>
                    <div className="text-sm text-slate-400">
                      Create tool review
                    </div>
                  </div>
                </Link>

                <Link
                  href="/admin/categories"
                  className="group relative flex transform items-center gap-4 overflow-hidden rounded-xl bg-gradient-to-r from-orange-500/10 via-amber-500/5 to-yellow-500/10 p-6 text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-orange-500/25 hover:border-orange-400/50 border border-orange-400/20"
                >
                  <div className="relative flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 text-2xl shadow-lg group-hover:scale-110 transition-all">
                    📂
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 font-bold text-white group-hover:text-orange-300 transition-colors">
                      Category Manager
                    </div>
                    <div className="text-sm text-slate-400">
                      Manage taxonomy
                    </div>
                  </div>
                </Link>

                <Link
                  href="/admin/blog/new"
                  className="group relative flex transform items-center gap-4 overflow-hidden rounded-xl bg-gradient-to-r from-purple-500/10 via-pink-500/5 to-fuchsia-500/10 p-6 text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/25 hover:border-purple-400/50 border border-purple-400/20"
                >
                  <div className="relative flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-fuchsia-600 text-2xl shadow-lg group-hover:scale-110 transition-all">
                    📝
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 font-bold text-white group-hover:text-purple-300 transition-colors">
                      Write New Post
                    </div>
                    <div className="text-sm text-slate-400">
                      Publish a blog article
                    </div>
                  </div>
                </Link>

                <Link
                  href="/admin/tools"
                  className="group relative flex transform items-center gap-4 overflow-hidden rounded-xl bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-green-500/10 p-6 text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-emerald-500/25 hover:border-emerald-400/50 border border-emerald-400/20"
                >
                  <div className="relative flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-2xl shadow-lg group-hover:scale-110 transition-all">
                    🛠️
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 font-bold text-white group-hover:text-emerald-300 transition-colors">
                      Manage Tools
                    </div>
                    <div className="text-sm text-slate-400">
                      Edit, publish, or delete tools
                    </div>
                  </div>
                </Link>

                <Link
                  href="/admin/blog"
                  className="group relative flex transform items-center gap-4 overflow-hidden rounded-xl bg-gradient-to-r from-blue-500/10 via-indigo-500/5 to-violet-500/10 p-6 text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/25 hover:border-blue-400/50 border border-blue-400/20"
                >
                  <div className="relative flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 text-2xl shadow-lg group-hover:scale-110 transition-all">
                    📚
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 font-bold text-white group-hover:text-blue-300 transition-colors">
                      Manage Blog
                    </div>
                    <div className="text-sm text-slate-400">
                      Edit, publish, or delete posts
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div>
            <div className="bg-gradient-to-r from-slate-900/80 to-slate-800/50 border border-slate-700/50 rounded-2xl p-6 backdrop-blur-xl h-full">
              <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-white">
                <span className="w-8 h-8 bg-gradient-to-r from-orange-500 to-amber-500 rounded-lg flex items-center justify-center text-sm font-bold text-slate-900">
                  🔥
                </span>
                Recent Activity
              </h3>
              <div className="space-y-3 text-sm">
                {activityItems.length === 0 ? (
                  <div className="text-slate-500 py-4 text-center">
                    No recent activity
                  </div>
                ) : (
                  activityItems.map((item) => (
                    <div
                      key={`${item.type}-${item.id}`}
                      className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg"
                    >
                      <div
                        className={`w-2 h-2 rounded-full ${item.type === 'post'
                          ? 'bg-purple-400'
                          : item.type === 'tool'
                            ? 'bg-blue-400'
                            : 'bg-green-400'
                          }`}
                      />
                      <span className="text-slate-300 truncate flex-1">
                        {item.text}
                      </span>
                      <span className="ml-auto text-xs text-slate-500 whitespace-nowrap">
                        {timeAgo(item.created_at)}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Top Tools (Performance) */}
          <div>
            <div className="bg-gradient-to-r from-slate-900/80 to-slate-800/50 border border-slate-700/50 rounded-2xl p-6 backdrop-blur-xl h-full">
              <h3 className="mb-4 text-lg font-bold text-white">
                Top Tools (This Month)
              </h3>
              <div className="space-y-4 text-sm">
                {topTools.length === 0 ? (
                  <div className="text-slate-500 py-4 text-center">
                    No clicks recorded yet
                  </div>
                ) : (
                  topTools.map((tool, index) => (
                    <div key={tool.slug} className="flex justify-between">
                      <span className="text-slate-300 font-medium capitalize truncate max-w-[60%]">
                        {tool.slug.replace(/-/g, ' ')}
                      </span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className={`h-2 rounded-full ${index === 0
                              ? 'bg-gradient-to-r from-emerald-400 to-teal-400'
                              : index === 1
                                ? 'bg-gradient-to-r from-cyan-400 to-blue-400'
                                : 'bg-gradient-to-r from-amber-400 to-orange-400'
                              }`}
                            style={{
                              width: `${Math.min(
                                (tool.count /
                                  (topTools[0]?.count || 1)) *
                                100,
                                100
                              )}%`,
                            }}
                          />
                        </div>
                        <span
                          className={`font-semibold ${index === 0
                            ? 'text-emerald-400'
                            : index === 1
                              ? 'text-cyan-400'
                              : 'text-amber-400'
                            }`}
                        >
                          {tool.count}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
