'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { 
  CheckCircle2, 
  MapPin, 
  Hammer, 
  ShieldCheck, 
  Printer,
  ChevronRight,
  Clock
} from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { GlassCard } from '@/components/GlassCard'

export default function ProposalViewPage() {
  const params = useParams()
  const [proposal, setProposal] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [signing, setSigning] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    const fetchProposal = async () => {
      const { data, error } = await supabase
        .from('proposals')
        .select('*, profiles(branding, full_name)')
        .eq('share_token', params.token)
        .single() as any
      
      if (data) {
        setProposal(data)
        if (data.status === 'sent') {
          fetch('/api/track/view', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token: params.token })
          }).catch(console.error)
        }
      }
      setLoading(false)
    }
    if (params.token) fetchProposal()
  }, [params.token])

  const handleSign = async () => {
    setSigning(true)
    try {
      const res = await fetch(`/api/proposals/${proposal.id}/mark-signed`, { method: 'POST' })
      if (res.ok) {
        setSuccess(true)
        setProposal({ ...proposal, status: 'signed' })
      }
    } catch (err) {
      console.error(err)
    } finally {
      setSigning(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950 font-sans">
        <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!proposal) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950 font-sans p-6 text-center">
        <GlassCard className="max-w-md w-full">
           <h1 className="text-2xl font-bold text-white mb-2">Proposal Not Found</h1>
           <p className="text-slate-400">This link might be expired or incorrect. Please contact the sender.</p>
        </GlassCard>
      </div>
    )
  }

  const branding = proposal.profiles?.branding || {}
  const primaryColor = branding.primary_color || '#f59e0b'
  const isExpired = proposal.expires_at && new Date(proposal.expires_at) < new Date() && proposal.status !== 'signed'

  return (
    <div className="min-h-screen bg-slate-950 font-sans py-16 px-6">
      <div className="max-w-3xl mx-auto space-y-8 pb-20">
        
        {/* Floating Header Actions */}
        <div className="flex items-center justify-between animate-fade-in">
           <div className="flex items-center gap-3">
              {branding.logo_url ? (
                 <img src={branding.logo_url} alt="Logo" className="h-8 object-contain" />
              ) : (
                 <>
                   <div className="p-2.5 rounded-xl shadow-lg" style={{ backgroundColor: primaryColor }}>
                     <Hammer className="h-5 w-5 text-white" />
                   </div>
                   <span className="text-sm font-bold text-white tracking-widest uppercase">{branding.company_name || 'ProposalForge'}</span>
                 </>
              )}
           </div>
           <button onClick={() => window.print()} className="p-2.5 bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl transition-colors text-slate-300">
              <Printer size={20} />
           </button>
        </div>

        {/* Status Alert */}
        {proposal.status === 'signed' && (
          <GlassCard className="border-emerald-500/50 bg-emerald-500/10 shadow-emerald-500/10 animate-fade-in p-6">
             <div className="flex items-center justify-between">
               <div className="flex items-center gap-4 text-emerald-400">
                  <CheckCircle2 size={28} />
                  <div>
                     <p className="text-base font-bold tracking-tight">Contract Execution Complete</p>
                     <p className="text-xs text-emerald-500/80 mt-1 uppercase tracking-wider font-semibold">This proposal has been signed and is active.</p>
                  </div>
               </div>
               <span className="bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest hidden sm:block">Verified</span>
             </div>
          </GlassCard>
        )}

        {/* Main Document */}
        <GlassCard className="relative p-10 sm:p-14 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          {/* Accent border */}
          <div className="absolute top-0 left-0 right-0 h-1" style={{ backgroundColor: primaryColor }}></div>

          <div className="flex flex-col md:flex-row justify-between gap-12 border-b border-white/10 pb-12 mb-12">
             <div className="space-y-6 flex-1">
               <p className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: primaryColor }}>Proposal ID: PF-{proposal.id.slice(0,6).toUpperCase()}</p>
               <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
                  {proposal.project_title}
               </h1>
               <div className="flex flex-wrap gap-3 pt-2">
                  <span className="bg-white/5 border border-white/10 text-slate-300 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">{proposal.content.niche}</span>
                  <span className="bg-white/5 border border-white/10 text-slate-300 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider flex items-center gap-2"><Clock size={14} className="text-amber-400" /> Est. {proposal.content.timeline} Days</span>
               </div>
             </div>
             <div className="space-y-6 md:text-right md:min-w-[200px]">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-1">Prepared For</p>
                  <p className="text-lg font-bold text-white">{proposal.client_name}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-1">Preparation Date</p>
                  <p className="text-sm font-semibold text-slate-300">{new Date(proposal.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                </div>
             </div>
          </div>

          <div className="space-y-12">
             <section className="space-y-6">
                <div className="flex items-center gap-3">
                   <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/20">
                      <MapPin size={18} />
                   </div>
                   <h3 className="text-sm font-bold uppercase tracking-[0.1em] text-white">Professional Scope</h3>
                </div>
                <p className="text-slate-300 text-base leading-relaxed whitespace-pre-wrap pl-11">
                  {proposal.content.scope}
                </p>
             </section>

             <section className="bg-white/5 border border-white/10 rounded-3xl p-8 sm:p-10 text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-[80px]" />
                
                <h3 className="text-sm font-bold uppercase tracking-[0.1em] text-slate-400 mb-8 relative z-10">Investment Summary</h3>
                
                <div className="relative z-10 mb-10">
                   <p className="text-6xl sm:text-7xl font-black text-white tracking-tighter mb-2">${proposal.total_price.toLocaleString()}</p>
                   <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-500">Total Project value (USD)</p>
                </div>

                <div className="grid sm:grid-cols-3 gap-6 pt-8 border-t border-white/10 relative z-10">
                   <div className="space-y-1">
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Commitment</p>
                      <p className="text-sm font-bold text-white">50% required</p>
                   </div>
                   <div className="space-y-1">
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Timeline</p>
                      <p className="text-sm font-bold text-white">{proposal.content.timeline} Working Days</p>
                   </div>
                   <div className="space-y-1">
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Revisions</p>
                      <p className="text-sm font-bold text-white">2 Included</p>
                   </div>
                </div>
             </section>
          </div>

          <div className="mt-16 pt-10 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-8">
             <div className="text-center md:text-left shadow-none">
                <p className="text-sm font-bold uppercase tracking-wider text-white mb-2">Signatory Commitment</p>
                <p className="text-xs font-medium text-slate-400 max-w-[280px]">
                   By authorizing, you agree to the terms outlined and authorize the commencement of project execution.
                </p>
             </div>
             
             {proposal.status === 'signed' ? (
               <div className="flex items-center justify-center gap-3 py-4 px-10 bg-emerald-500/10 rounded-full border border-emerald-500/30 text-emerald-400 shadow-inner w-full md:w-auto">
                  <ShieldCheck size={24} />
                  <span className="text-base font-bold uppercase tracking-widest">Secured</span>
               </div>
             ) : isExpired ? (
               <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-sm font-bold text-center">
                 This proposal expired on {new Date(proposal.expires_at).toLocaleDateString()}. <br/>Please contact the freelancer for a new proposal.
               </div>
             ) : (
               <button 
                 onClick={handleSign} 
                 disabled={signing}
                 style={{ backgroundColor: primaryColor }}
                 className="w-full md:w-auto px-10 py-4 text-white rounded-full font-bold shadow-lg flex items-center justify-center transition-transform hover:scale-105"
               >
                 {signing ? 'Processing...' : 'Authorize & Secure'} <ChevronRight size={20} className="ml-2" />
               </button>
             )}
          </div>
        </GlassCard>

        {/* Minimal Footer */}
        {!branding.hide_powered_by && (
          <div className="text-center pt-8">
             <p className="text-[10px] font-bold text-slate-500 tracking-widest uppercase">
                Powered by <span className="text-amber-500">ProposalForge</span>
             </p>
          </div>
        )}
      </div>
    </div>
  )
}
