'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { 
  LayoutDashboard, 
  FileText, 
  Layers, 
  CreditCard, 
  Settings, 
  LogOut,
  Hammer
} from 'lucide-react'
import { supabase } from '@/lib/supabase/client'

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Proposals', href: '/dashboard', icon: FileText },
    { name: 'Templates', href: '#', icon: Layers },
    { name: 'Pricing', href: '#', icon: CreditCard },
  ]

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.refresh()
    router.push('/')
  }

  return (
    <aside className="hidden lg:flex flex-col w-72 gap-10 p-10 bg-white border-r border-slate-100 min-h-screen">
      {/* Brand logic redundant here but good for consistency */}
      <div className="flex items-center gap-2.5 px-2">
        <div className="p-2 bg-indigo-600 rounded-lg shadow-lg shadow-indigo-600/20">
          <Hammer className="h-4 w-4 text-white" />
        </div>
        <span className="text-lg font-black tracking-tight text-slate-900 uppercase italic">
          Forge<span className="text-indigo-600">.</span>
        </span>
      </div>

      <div className="space-y-1.5">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 mb-4 px-2">Main Registry</p>
        {navItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon
          return (
            <Link 
              key={item.name}
              href={item.href} 
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm ${
                isActive 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
                : 'text-slate-400 hover:bg-slate-50 hover:text-indigo-600'
              }`}
            >
              <Icon size={18} /> {item.name}
            </Link>
          )
        })}
      </div>

      <div className="mt-auto space-y-1.5 pt-10 border-t border-slate-50">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 mb-4 px-2">Configuration</p>
        <Link 
          href="/settings" 
          className={`flex items-center gap-3 px-4 py-3 transition-all rounded-xl font-bold text-sm ${
            pathname === '/settings' 
            ? 'bg-slate-100 text-slate-900' 
            : 'text-slate-400 hover:bg-slate-50 hover:text-indigo-600'
          }`}
        >
          <Settings size={18} /> Settings
        </Link>
        <button 
          onClick={handleSignOut}
          className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all w-full text-left rounded-xl font-bold text-sm"
        >
          <LogOut size={18} /> Sign Out
        </button>
      </div>
    </aside>
  )
}
