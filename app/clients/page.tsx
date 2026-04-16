'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Sidebar } from '@/components/Sidebar'
import { GlassCard } from '@/components/GlassCard'
import { Users, Search, ArrowRight, Eye, Trash2, Plus, Mail } from 'lucide-react'

export default function ClientsPage() {
  const router = useRouter()
  const [clients, setClients] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchClients()
  }, [])

  const fetchClients = async () => {
    try {
      const res = await fetch('/api/clients')
      if (res.ok) {
        const data = await res.json()
        setClients(data)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this client?')) return
    try {
      const res = await fetch(`/api/clients/${id}`, { method: 'DELETE' })
      if (res.ok) fetchClients()
    } catch (err) {
      console.error(err)
    }
  }

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.email.toLowerCase().includes(search.toLowerCase())
  )

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
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 animate-fade-in">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-white">
              Client <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">Roster</span>
            </h1>
            <p className="text-slate-400 font-medium mt-1">Manage your active clients and proposal history.</p>
          </div>
        </div>

        <GlassCard className="animate-fade-in p-6">
          <div className="flex items-center gap-4 mb-8 relative">
             <Search size={20} className="absolute left-4 text-slate-400" />
             <input 
               type="text"
               placeholder="Search clients..."
               value={search}
               onChange={(e) => setSearch(e.target.value)}
               className="w-full bg-white/5 border border-white/10 rounded-full pl-12 pr-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
             />
          </div>

          {filteredClients.length === 0 ? (
            <div className="text-center py-12 space-y-4 text-slate-400">
               <Users size={40} className="mx-auto text-slate-500" />
               <p>No clients found. Add a client while creating a proposal!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="px-4 py-4 text-xs font-bold uppercase tracking-widest text-slate-400">Client</th>
                    <th className="px-4 py-4 text-xs font-bold uppercase tracking-widest text-slate-400">Proposals</th>
                    <th className="px-4 py-4 text-xs font-bold uppercase tracking-widest text-slate-400">Last Activity</th>
                    <th className="px-4 py-4 text-xs font-bold uppercase tracking-widest text-slate-400 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredClients.map(client => (
                    <tr key={client.id} className="group hover:bg-white/5 transition-colors">
                      <td className="px-4 py-4">
                        <Link href={`/clients/${client.id}`} className="font-bold text-white hover:text-indigo-400 block transition-colors">
                          {client.name}
                        </Link>
                        <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
                          <Mail size={12} /> {client.email}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-white font-medium">
                        {client.proposal_count}
                      </td>
                      <td className="px-4 py-4 text-slate-400 text-sm">
                        {client.last_proposal_date ? new Date(client.last_proposal_date).toLocaleDateString() : 'Never'}
                      </td>
                      <td className="px-4 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Link href={`/clients/${client.id}`}>
                            <button className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-all" title="View Client">
                              <Eye size={18} />
                            </button>
                          </Link>
                          <Link href={`/proposals/new?clientId=${client.id}`}>
                            <button className="p-2 text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-all" title="New Proposal">
                              <Plus size={18} />
                            </button>
                          </Link>
                          <button onClick={() => handleDelete(client.id)} className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all" title="Delete Client">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </GlassCard>
      </main>
    </div>
  )
}
