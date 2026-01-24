'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import type { User } from '@supabase/supabase-js'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session && pathname !== '/admin/login') {
        router.push('/admin/login')
      } else {
        setUser(session?.user ?? null)
      }
      setLoading(false)
    }

    void checkAuth()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (!session && pathname !== '/admin/login') {
        router.push('/admin/login')
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [pathname, router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  // Don't show header/nav on login page
  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Admin Header */}
      <header className="bg-slate-900 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <Link href="/admin" className="text-xl font-bold text-white">
                Admin Panel
              </Link>
              <nav className="flex items-center gap-4">
                <Link
                  href="/admin/tools"
                  className="text-slate-300 hover:text-white transition-colors"
                >
                  Tools
                </Link>
                <Link
                  href="/admin/blog"
                  className="text-slate-300 hover:text-white transition-colors"
                >
                  Blog Posts
                </Link>
                <Link
                  href="/admin/comments"
                  className="text-slate-300 hover:text-white transition-colors"
                >
                  Comments
                </Link>
                <Link
                  href="/admin/affiliate-links"
                  className="text-slate-300 hover:text-white transition-colors"
                >
                  Affiliate Links
                </Link>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              {user && (
                <span className="text-sm text-slate-400">{user.email}</span>
              )}
              <button
                onClick={handleLogout}
                className="text-sm px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                Logout
              </button>
              <Link
                href="/"
                className="text-sm text-slate-400 hover:text-cyan-400 transition-colors"
              >
                ← Back to Site
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">{children}</main>
    </div>
  )
}
