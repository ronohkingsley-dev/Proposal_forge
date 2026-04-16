'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Sidebar } from '@/components/Sidebar'
import { GlassCard } from '@/components/GlassCard'
import { Layers, Trash2, ArrowRight } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'

export default function TemplatesPage() {
  const router = useRouter()
  const [templates, setTemplates] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTemplates()
  }, [])

  const fetchTemplates = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth')
        return
      }

      const res = await fetch('/api/templates')
      if (res.ok) {
        const data = await res.json()
        setTemplates(data)
      }
    } catch (err) {
      console.error('Failed to fetch templates', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this template?')) return
    try {
      const res = await fetch(`/api/templates/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setTemplates(prev => prev.filter(t => t.id !== id))
      }
    } catch (err) {
      console.error('Failed to delete template', err)
    }
  }

  const handleUseTemplate = (templateData: any) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('pf_loaded_template', JSON.stringify(templateData))
    }
    router.push('/proposals/new')
  }

  if (loading) {
    return (
      <div className="flex flex-col lg:flex-row min-h-screen">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      <Sidebar />
      <main className="flex-1 p-6 lg:p-10 space-y-10 min-w-0">
        <header className="space-y-1 animate-fade-in">
          <h1 className="text-4xl font-extrabold tracking-tight text-white">
            Proposal Templates
          </h1>
          <p className="text-slate-400 font-medium">Save time by reusing your best proposal formulas.</p>
        </header>

        <section className="animate-fade-in">
          {templates.length === 0 ? (
            <GlassCard noPadding className="p-20 text-center space-y-6">
              <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto text-slate-500 border border-white/10">
                <Layers size={40} />
              </div>
              <div className="space-y-2">
                <p className="text-xl font-bold text-white tracking-tight">No Templates Yet</p>
                <p className="text-slate-400 text-sm max-w-sm mx-auto">Create a proposal and save it as a template to see it here.</p>
              </div>
              <Link href="/proposals/new">
                <button className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:scale-105 transition-transform text-white px-6 py-3 rounded-full font-bold shadow-lg shadow-indigo-500/25 inline-flex items-center">
                  Create Proposal <ArrowRight size={16} className="ml-2" />
                </button>
              </Link>
            </GlassCard>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {templates.map(template => (
                <GlassCard key={template.id} className="flex flex-col h-full hover:-translate-y-1 transition-transform">
                  <div className="flex items-start justify-between mb-6">
                    <div className="p-3 bg-indigo-500/20 text-indigo-400 rounded-xl border border-indigo-500/20">
                      <Layers size={24} />
                    </div>
                    <button onClick={() => handleDelete(template.id)} className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </div>
                  <div className="flex-1 mb-8">
                    <h2 className="text-xl font-bold text-white mb-2">{template.name}</h2>
                    <p className="text-sm font-medium text-slate-400 line-clamp-2">{template.data.scope}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-white/5 px-2 py-1 rounded text-slate-300">{template.data.niche}</span>
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-white/5 px-2 py-1 rounded text-slate-300">${template.data.price}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleUseTemplate(template.data)}
                    className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-full font-bold transition-colors"
                  >
                    Use Template
                  </button>
                </GlassCard>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
