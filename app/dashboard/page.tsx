'use client'

import { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Sidebar } from '@/components/Sidebar'
import { GlassCard } from '@/components/GlassCard'
import { 
  Plus, 
  Copy, 
  CheckCircle2, 
  Eye, 
  FileText,
  Mail,
  TrendingUp,
  BarChart3,
  Zap,
  ArrowRight,
  Bell
} from 'lucide-react'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts'
import { supabase } from '@/lib/supabase/client'

// --- Types ---
interface Proposal {
  id: string
  title: string
  client_id?: string
  client_name?: string
  client_email: string
  price: number
  status: 'draft' | 'sent' | 'viewed' | 'signed' | 'accepted' | 'rejected' | 'expired'
  created_at: string
  expires_at?: string
  share_token: string
  deposit_paid_at: string | null
}

const STATUS_COLORS = {
  signed: '#10b981',
  accepted: '#10b981',
  viewed: '#8b5cf6',
  sent: '#f59e0b',
  draft: '#64748b',
  rejected: '#e11d48',
  expired: '#94a3b8'
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [proposals, setProposals] = useState<Proposal[]>([])
  const [loading, setLoading] = useState(true)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [sendingId, setSendingId] = useState<string | null>(null)

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          router.push('/auth')
          return
        }

        // Fetch profile and proposals directly in parallel
        const [profileRes, proposalsRes] = await Promise.all([
          supabase.from('profiles').select('onboarding_completed').eq('id', user.id).single(),
          supabase.from('proposals').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
        ])

        const { data: profile, error: profileError } = profileRes as any
        if (profile && profile.onboarding_completed === false) {
          router.push('/onboarding')
          return
        }

        setUser(user)

        if (proposalsRes.data) {
          const mappedProposals: Proposal[] = proposalsRes.data.map((item: any) => ({
            id: item.id,
            title: item.project_title,
            client_id: item.client_id,
            client_name: item.client_name,
            client_email: item.client_email,
            price: item.total_price,
            status: item.status,
            created_at: item.created_at,
            expires_at: item.expires_at,
            share_token: item.share_token,
            deposit_paid_at: item.deposit_paid_at
          }))
          setProposals(mappedProposals)
        }
      } catch (err) {
        console.error('Dashboard Fetch Error:', err)
      } finally {
        setLoading(false)
      }
    }
    
    loadDashboardData()
  }, [router])

  const stats = useMemo(() => {
    if (proposals.length === 0) return null
    const total = proposals.length
    const sent = proposals.filter(p => p.status !== 'draft').length
    const viewedOrSigned = proposals.filter(p => ['viewed', 'signed', 'accepted'].includes(p.status)).length
    const signedCount = proposals.filter(p => ['signed', 'accepted'].includes(p.status)).length
    
    const winRate = sent > 0 ? Math.round((signedCount / sent) * 100) : 0
    const openRate = sent > 0 ? Math.round((viewedOrSigned / sent) * 100) : 0
    
    const signedProposals = proposals.filter(p => ['signed', 'accepted'].includes(p.status))
    const avgDealValue = signedProposals.length > 0 
      ? Math.round(signedProposals.reduce((sum, p) => sum + p.price, 0) / signedProposals.length)
      : 0

    const statusMap = proposals.reduce((acc, p) => {
      acc[p.status] = (acc[p.status] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const statusData = Object.entries(statusMap).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value,
      color: (STATUS_COLORS as any)[name] || '#ccc'
    }))

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const last6Months = []
    const now = new Date()
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      last6Months.push(months[d.getMonth()])
    }

    const monthlyCounts = proposals.reduce((acc, p) => {
      const date = new Date(p.created_at)
      const month = months[date.getMonth()]
      acc[month] = (acc[month] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const monthlyData = last6Months.map(month => ({
      name: month,
      count: monthlyCounts[month] || 0
    }))

    return { total, winRate, openRate, avgDealValue, statusData, monthlyData }
  }, [proposals])

  const copyToClipboard = async (token: string, id: string) => {
    const url = `${window.location.origin}/share/${token}`
    await navigator.clipboard.writeText(url)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const sendEmail = async (id: string, clientEmail: string, isReminder: boolean = false) => {
    try {
      setSendingId(id)
      const res = await fetch(`/api/proposals/${id}/send`, { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ isReminder })
      })
      if (!res.ok) throw new Error('Failed to send email. Is client email set?')
      alert(isReminder ? `Reminder sent to ${clientEmail}` : `Email sent successfully to ${clientEmail}`)
      if (!isReminder) {
        setProposals(prev => prev.map(p => p.id === id ? { ...p, status: 'sent' } : p))
      }
    } catch (err: any) {
      alert(err.message)
    } finally {
      setSendingId(null)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric'
    })
  }

  const renderBadge = (status: string) => {
    const colors: Record<string, string> = {
      signed: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      accepted: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      viewed: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      sent: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
      rejected: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
      draft: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
    }
    const style = colors[status] || colors.draft
    return <span className={`px-2.5 py-1 rounded-full text-xs font-bold border uppercase tracking-wider ${style}`}>{status}</span>
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
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 animate-fade-in">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-white">
              Command <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">Center</span>
            </h1>
            <p className="text-slate-400 font-medium mt-1">Welcome back, {user?.email?.split('@')[0]}. Here is your business pulse.</p>
          </div>
          
          <Link href="/proposals/new">
            <button className="hidden md:flex items-center bg-gradient-to-r from-indigo-500 to-purple-600 hover:scale-105 transition-transform text-white px-6 py-3 rounded-full font-bold shadow-lg shadow-indigo-500/25">
               <Plus size={18} className="mr-2" /> New Proposal
            </button>
          </Link>
        </div>

        {/* Analytics Section */}
        {stats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            {[
              { label: 'Pipeline', value: stats.total, icon: <FileText size={20} />, color: 'from-indigo-500 to-purple-600' },
              { label: 'Win Rate', value: `${stats.winRate}%`, icon: <CheckCircle2 size={20} />, color: 'from-emerald-400 to-teal-500' },
              { label: 'Open Rate', value: `${stats.openRate}%`, icon: <Eye size={20} />, color: 'from-blue-400 to-indigo-500' },
              { label: 'Avg Deal', value: `$${stats.avgDealValue.toLocaleString()}`, icon: <TrendingUp size={20} />, color: 'from-amber-400 to-orange-500' },
            ].map((stat, i) => (
              <GlassCard key={i} className="hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} shadow-lg text-white`}>
                    {stat.icon}
                  </div>
                </div>
                <div className="mt-5">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
                  <p className="text-3xl font-black text-white mt-1">{stat.value}</p>
                </div>
              </GlassCard>
            ))}
          </div>
        )}

        {/* Charts Row */}
        {stats && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <GlassCard className="lg:col-span-2">
              <div className="mb-6">
                 <h3 className="text-lg font-bold text-white">Growth Activity</h3>
                 <p className="text-sm text-slate-400">Proposal volume trends over the last 6 months</p>
              </div>
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff15" vertical={false} />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', color: '#fff' }}
                      cursor={{ fill: '#ffffff05' }}
                    />
                    <Bar dataKey="count" radius={[6, 6, 0, 0]} barSize={40}>
                      {stats.monthlyData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill="url(#colorUv)" />
                      ))}
                    </Bar>
                    <defs>
                      <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={1}/>
                        <stop offset="95%" stopColor="#a855f7" stopOpacity={1}/>
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>

            <GlassCard className="flex flex-col">
              <div className="mb-6">
                 <h3 className="text-lg font-bold text-white">Status</h3>
                 <p className="text-sm text-slate-400">Where deals sit</p>
              </div>
              <div className="h-[250px] w-full flex-1">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats.statusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={65}
                      outerRadius={85}
                      paddingAngle={8}
                      dataKey="value"
                      stroke="none"
                    >
                      {stats.statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', color: '#fff' }}
                    />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', fontWeight: 'bold', color: '#94a3b8' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>
          </div>
        )}

        {/* Proposals List */}
        <section className="space-y-6 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400">Active Proposals</h2>
          </div>

          <GlassCard noPadding>
            {proposals.length === 0 ? (
              <div className="p-20 text-center space-y-6">
                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto text-slate-500 border border-white/10">
                  <FileText size={40} />
                </div>
                <div className="space-y-2">
                  <p className="text-xl font-bold text-white tracking-tight">No Proposals Yet</p>
                  <p className="text-slate-400 text-sm max-w-sm mx-auto">Start forging your first professional proposal to see it here.</p>
                </div>
                <Link href="/proposals/new">
                  <button className="bg-gradient-to-r from-amber-400 to-orange-500 hover:scale-105 transition-transform text-white px-6 py-3 rounded-full font-bold shadow-lg shadow-amber-500/25 inline-flex items-center">
                    Create First Proposal <ArrowRight size={16} className="ml-2" />
                  </button>
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest text-slate-400">Project</th>
                      <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest text-slate-400">Value</th>
                      <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest text-slate-400">Status</th>
                      <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest text-slate-400">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {proposals.map((item) => (
                      <tr key={item.id} className="group hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <div className="p-3 bg-white/5 border border-white/10 rounded-xl text-indigo-400 shadow-sm group-hover:scale-110 transition-transform">
                              <FileText size={20} />
                            </div>
                            <div>
                              <p className="font-bold text-white group-hover:text-indigo-300 transition-colors">{item.title}</p>
                              {item.client_id ? (
                                <Link href={`/clients/${item.client_id}`} className="text-xs font-medium text-slate-400 mt-0.5 hover:text-indigo-400 hover:underline">
                                  {item.client_name || item.client_email}
                                </Link>
                              ) : (
                                <p className="text-xs font-medium text-slate-400 mt-0.5">{item.client_name || item.client_email}</p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-black text-white">${item.price.toLocaleString()}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{formatDate(item.created_at)}</p>
                        </td>
                        <td className="px-6 py-4">
                          {renderBadge(item.status)}
                          {item.deposit_paid_at && (
                             <p className="text-[10px] text-emerald-400 font-bold mt-2 flex items-center gap-1">
                                <CheckCircle2 size={12}/> Deposit Paid
                             </p>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                              onClick={() => sendEmail(item.id, item.client_email)}
                              className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                              title="Send Email"
                            >
                              <Mail size={18} />
                            </button>
                            <button 
                              onClick={() => copyToClipboard(item.share_token, item.id)}
                              className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                              title="Copy Link"
                            >
                              {copiedId === item.id ? <CheckCircle2 size={18} className="text-emerald-400" /> : <Copy size={18} />}
                            </button>
                            {(item.status === 'sent' || item.status === 'viewed') && (!item.expires_at || new Date(item.expires_at) > new Date()) && (
                              <button 
                                onClick={() => sendEmail(item.id, item.client_email, true)}
                                className="p-2 text-slate-400 hover:text-amber-400 hover:bg-amber-400/10 rounded-lg transition-all"
                                title="Send Reminder"
                              >
                                <Bell size={18} />
                              </button>
                            )}
                            <Link href={`/proposals/${item.id}/edit`}>
                              <button className="p-2 text-slate-400 hover:text-amber-400 hover:bg-amber-400/10 rounded-lg transition-all">
                                <Zap size={18} />
                              </button>
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </GlassCard>
        </section>
      </main>
    </div>
  )
}
