'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { Hammer } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'

export function Navbar() {
  const [user, setUser] = useState<any>(null)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
    }
    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  const isPublicView = pathname.startsWith('/share/')
  const isDashboardRoute = pathname.startsWith('/dashboard') || pathname.startsWith('/settings') || pathname.startsWith('/proposals')

  if (isPublicView || isDashboardRoute) return null

  return (
    <header className="sticky top-0 z-50 bg-indigo-950/40 backdrop-blur-md border-b border-white/10">
      <nav className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="p-2.5 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl group-hover:scale-105 transition-transform shadow-lg shadow-indigo-500/30">
            <Hammer className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">
            ProposalForge<span className="text-amber-500">.</span>
          </span>
        </Link>

        <div className="flex items-center gap-6">
          {user ? (
            <div className="flex items-center gap-6">
              <Link href="/dashboard" className="text-sm font-semibold text-slate-300 hover:text-white transition-colors">
                Dashboard
              </Link>
              <div className="h-5 w-px bg-white/20 hidden md:block" />
              <div className="flex items-center gap-3 bg-white/5 border border-white/10 p-1.5 pr-4 rounded-full hover:bg-white/10 transition-all cursor-pointer group">
                <div className="h-8 w-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold shadow-sm">
                  {user.email?.[0].toUpperCase()}
                </div>
                <span className="text-sm font-semibold text-white hidden md:block">
                  {user.email?.split('@')[0]}
                </span>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link href="/auth" className="text-sm font-semibold text-slate-300 hover:text-white transition-colors">
                Login
              </Link>
              <Link href="/auth" className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white text-sm font-bold py-2.5 px-6 rounded-full transition-transform hover:scale-105 shadow-lg shadow-amber-500/20">
                Get Started
              </Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  )
}
