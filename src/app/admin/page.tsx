import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default async function AdminDashboard() {
  // Get counts
  const { count: toolsCount } = await supabase
    .from('ai_tools')
    .select('*', { count: 'exact', head: true })

  const { count: blogCount } = await supabase
    .from('blog_posts')
    .select('*', { count: 'exact', head: true })

  const { count: publishedTools } = await supabase
    .from('ai_tools')
    .select('*', { count: 'exact', head: true })
    .eq('published', true)

  const { count: publishedPosts } = await supabase
    .from('blog_posts')
    .select('*', { count: 'exact', head: true })
    .eq('published', true)

  // Affiliate clicks stats
  const { count: totalAffiliateClicks } = await supabase
    .from('affiliate_clicks')
    .select('*', { count: 'exact', head: true })

  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

  const { count: clicksLast7Days } = await supabase
    .from('affiliate_clicks')
    .select('*', { count: 'exact', head: true })
    .gte('clicked_at', sevenDaysAgo.toISOString())

  const startOfMonth = new Date()
  startOfMonth.setDate(1)
  startOfMonth.setHours(0, 0, 0, 0)

  const { count: clicksThisMonth } = await supabase
    .from('affiliate_clicks')
    .select('*', { count: 'exact', head: true })
    .gte('clicked_at', startOfMonth.toISOString())

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
                Live Traffic
              </div>
              <div className="text-4xl font-black text-white mb-1">
                1,247
              </div>
              <div className="text-emerald-400 text-sm font-semibold">
                Visitors this week
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
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
                      Create a complete AI tool review
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
                      Publish a new blog article
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
            <div className="bg-gradient-to-r from-slate-900/80 to-slate-800/50 border border-slate-700/50 rounded-2xl p-6 backdrop-blur-xl">
              <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-white">
                <span className="w-8 h-8 bg-gradient-to-r from-orange-500 to-amber-500 rounded-lg flex items-center justify-center text-sm font-bold text-slate-900">
                  🔥
                </span>
                Recent Activity
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-slate-300">
                    Lovable review published
                  </span>
                  <span className="ml-auto text-xs text-slate-500">
                    2 min ago
                  </span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-400 rounded-full" />
                  <span className="text-slate-300">3 tools updated</span>
                  <span className="ml-auto text-xs text-slate-500">
                    1 hour ago
                  </span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg">
                  <div className="w-2 h-2 bg-purple-400 rounded-full" />
                  <span className="text-slate-300">
                    Blog post draft saved
                  </span>
                  <span className="ml-auto text-xs text-slate-500">
                    Yesterday
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Performance Overview */}
          <div>
            <div className="bg-gradient-to-r from-slate-900/80 to-slate-800/50 border border-slate-700/50 rounded-2xl p-6 backdrop-blur-xl">
              <h3 className="mb-4 text-lg font-bold text-white">
                Performance
              </h3>
              <div className="space-y-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Page Speed</span>
                  <div className="flex items-center gap-1">
                    <div className="w-20 h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-2 bg-gradient-to-r from-emerald-400 to-teal-400 w-4/5 rounded-full" />
                    </div>
                    <span className="text-emerald-400 font-semibold">95</span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">SEO Score</span>
                  <div className="flex items-center gap-1">
                    <div className="w-20 h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-2 bg-gradient-to-r from-cyan-400 to-blue-400 w-4/5 rounded-full" />
                    </div>
                    <span className="text-cyan-400 font-semibold">92</span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Conversion</span>
                  <div className="flex items-center gap-1">
                    <div className="w-20 h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-2 bg-gradient-to-r from-amber-400 to-orange-400 w-3/5 rounded-full" />
                    </div>
                    <span className="text-amber-400 font-semibold">2.1%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
