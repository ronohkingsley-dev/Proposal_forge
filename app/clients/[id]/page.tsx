'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { Sidebar } from '@/components/Sidebar'
import { GlassCard } from '@/components/GlassCard'
import { Users, Plus, ArrowLeft, Mail, Phone, Building, Calendar, FileText } from 'lucide-react'

export default function ClientDetailPage() {
  const router = useRouter()
  const params = useParams()
  const [client, setClient] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchClient()
  }, [])

  const fetchClient = async () => {
    try {
      const res = await fetch(`/api/clients/${params.id}`)
      if (res.ok) {
        const data = await res.json()
        setClient(data)
      } else {
        router.push('/clients')
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
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

  if (!client) return null

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      <Sidebar />
      <main className="flex-1 p-6 lg:p-10 space-y-10 min-w-0">
        <header className="space-y-4 animate-fade-in">
          <Link href="/clients" className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white uppercase tracking-widest transition-colors w-fit">
             <ArrowLeft size={16} /> Back to Clients
          </Link>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="flex items-center gap-6">
               <div className="w-20 h-20 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 text-3xl font-black shadow-lg">
                  {client.name.charAt(0).toUpperCase()}
               </div>
               <div>
                  <h1 className="text-4xl font-extrabold tracking-tight text-white mb-2">{client.name}</h1>
                  <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-slate-400">
                     <span className="flex items-center gap-2"><Mail size={16} /> {client.email}</span>
                     {client.company && <span className="flex items-center gap-2"><Building size={16} /> {client.company}</span>}
                     {client.phone && <span className="flex items-center gap-2"><Phone size={16} /> {client.phone}</span>}
                  </div>
               </div>
            </div>
            
            <Link href={`/proposals/new?clientId=${client.id}`}>
               <button className="flex items-center bg-gradient-to-r from-indigo-500 to-purple-600 hover:scale-105 transition-transform text-white px-6 py-3 rounded-full font-bold shadow-lg shadow-indigo-500/25">
                  <Plus size={18} className="mr-2" /> New Proposal
               </button>
            </Link>
          </div>
        </header>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
          <div className="lg:col-span-1 space-y-8">
             <GlassCard>
                <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-6">Client Details</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Created</label>
                    <div className="flex items-center gap-2 text-slate-300 font-medium"><Calendar size={16} className="text-indigo-400"/> {new Date(client.created_at).toLocaleDateString()}</div>
                  </div>
                  {client.notes && (
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">Internal Notes</label>
                      <p className="text-sm text-slate-300 bg-white/5 p-4 rounded-xl border border-white/10 italic">
                        {client.notes}
                      </p>
                    </div>
                  )}
                </div>
             </GlassCard>
          </div>

          <div className="lg:col-span-2 space-y-6">
             <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-4">Proposal History</h3>
             <GlassCard noPadding>
                {client.proposals && client.proposals.length > 0 ? (
                   <div className="overflow-x-auto">
                     <table className="w-full text-left">
                       <thead>
                         <tr className="border-b border-white/10">
                           <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-400">Project</th>
                           <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-400">Date</th>
                           <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-400">Value</th>
                           <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-400 text-right">Status</th>
                         </tr>
                       </thead>
                       <tbody className="divide-y divide-white/5">
                         {client.proposals.map((p: any) => (
                           <tr key={p.id} className="hover:bg-white/5 transition-colors">
                              <td className="px-6 py-4">
                                <Link href={`/proposals/${p.id}/edit`} className="font-bold text-white hover:text-indigo-400 inline-flex items-center gap-2">
                                  <FileText size={16} className="text-slate-500"/> {p.project_title}
                                </Link>
                              </td>
                              <td className="px-6 py-4 text-sm text-slate-400 font-medium">{new Date(p.created_at).toLocaleDateString()}</td>
                              <td className="px-6 py-4 text-white font-black">${p.total_price}</td>
                              <td className="px-6 py-4 text-right">
                                <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${
                                   ['signed', 'accepted'].includes(p.status) ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                                   p.status === 'viewed' ? 'bg-purple-500/20 text-purple-400 border-purple-500/30' :
                                   'bg-slate-500/20 text-slate-400 border-slate-500/30'
                                }`}>
                                  {p.status}
                                </span>
                              </td>
                           </tr>
                         ))}
                       </tbody>
                     </table>
                   </div>
                ) : (
                  <div className="p-12 text-center text-slate-400">
                     <p>No proposals sent yet.</p>
                  </div>
                )}
             </GlassCard>
          </div>
        </section>
      </main>
    </div>
  )
}
