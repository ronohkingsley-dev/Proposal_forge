'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { 
  LayoutDashboard, 
  FileText, 
  Layers, 
  Settings, 
  LogOut,
  Hammer,
  Menu,
  X,
  Users
} from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { useState, useEffect } from 'react'

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
  }, [])

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Clients', href: '/clients', icon: Users },
    { name: 'Templates', href: '/templates', icon: Layers },
    { name: 'Create Proposal', href: '/proposals/new', icon: FileText },
    { name: 'Settings', href: '/settings', icon: Settings },
  ]

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.refresh()
    router.push('/')
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-slate-900/40 backdrop-blur-3xl border-r border-white/10 text-white w-72 p-6 transition-all">
      <div className="flex items-center gap-3 px-2 mb-10">
        <div className="p-2.5 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg shadow-indigo-500/30">
          <Hammer className="h-5 w-5 text-white" />
        </div>
        <span className="text-xl font-bold tracking-tight text-white">
          ProposalForge<span className="text-amber-500">.</span>
        </span>
      </div>

      {user && (
        <div className="mb-8 px-4 py-4 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-4">
          <div className="h-10 w-10 flex-shrink-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center font-bold shadow-sm">
            {user.email?.[0].toUpperCase()}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-semibold truncate">{user.email?.split('@')[0]}</p>
            <div className="inline-flex items-center mt-1 px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/30 text-[10px] font-bold text-amber-500 uppercase tracking-wider">
              Pro Plan
            </div>
          </div>
        </div>
      )}

      <div className="space-y-2 flex-1">
        <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-4 px-2">Navigation</p>
        {navItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon
          return (
            <Link 
              key={item.name}
              href={item.href} 
              className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all font-semibold text-sm ${
                isActive 
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25 border border-white/10' 
                : 'text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Icon size={20} className={isActive ? 'text-white' : 'text-slate-400'} /> {item.name}
            </Link>
          )
        })}
      </div>

      <div className="mt-auto space-y-2 pt-8">
        <button 
          onClick={handleSignOut}
          className="flex items-center gap-4 px-4 py-3.5 text-slate-300 hover:text-rose-400 hover:bg-rose-500/10 transition-all w-full text-left rounded-xl font-semibold text-sm"
        >
          <LogOut size={20} className="text-slate-400 group-hover:text-rose-400" /> Sign Out
        </button>
      </div>
    </div>
  )

  return (
    <>
      <div className="lg:hidden fixed top-0 w-full z-40 bg-slate-900/80 backdrop-blur-xl border-b border-white/10 p-4 flex items-center justify-between">
         <div className="flex items-center gap-2">
            <div className="p-1.5 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg shadow-sm">
               <Hammer className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight text-white">Forge.</span>
         </div>
         <button onClick={() => setIsOpen(!isOpen)} className="text-white p-2">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
         </button>
      </div>
      
      {isOpen && (
         <div className="fixed inset-0 z-50 lg:hidden flex">
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsOpen(false)}></div>
            <div className="relative w-72 max-w-sm">
               <SidebarContent />
            </div>
         </div>
      )}

      <aside className="hidden lg:block sticky top-0 h-screen z-30">
         <SidebarContent />
      </aside>
    </>
  )
}
