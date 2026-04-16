'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { CheckCircle2, Package, Mail, ArrowLeft, Loader2 } from 'lucide-react'

function SuccessContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const proposalId = searchParams.get('proposal_id')
  
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [proposalData, setProposalData] = useState<any>(null)

  useEffect(() => {
    if (!proposalId) {
      setError('Payment confirmation missing. Please contact the freelancer.')
      setLoading(false)
      return
    }

    const confirmPayment = async () => {
      try {
        setLoading(true)
        
        // Real API call to mark as signed
        const res = await fetch(`/api/proposals/${proposalId}/mark-signed`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        })
        
        if (!res.ok) throw new Error('Failed to confirm status')
        
        const data = await res.json()
        
        // Fetch basic proposal info for the summary
        setProposalData({
          title: data.project_title || 'Project Proposal',
          deposit: '50% Upfront'
        })
        
        setLoading(false)
      } catch (err: any) {
        setError('Failed to update proposal status. Please notify the freelancer.')
        setLoading(false)
      }
    }

    confirmPayment()
  }, [proposalId])

  if (loading) {
    return (
      <div className="flex flex-col items-center gap-4 py-20">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
        <p className="text-slate-400 font-medium animate-pulse">Confirming your project deposit...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 p-8 rounded-[2rem] text-center max-w-sm mx-auto space-y-4">
        <div className="w-12 h-12 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 size={24} className="rotate-45" />
        </div>
        <p className="text-red-400 font-bold">{error}</p>
        <button onClick={() => window.location.reload()} className="text-sm text-slate-500 hover:text-white underline font-bold">Try again</button>
      </div>
    )
  }

  return (
    <div className="max-w-md w-full mx-auto space-y-10 animate-in zoom-in-95 duration-700">
      <div className="text-center space-y-6">
        <div className="relative inline-block">
          <div className="absolute inset-0 bg-emerald-500 blur-3xl opacity-20 animate-pulse" />
          <div className="bg-emerald-500/10 border border-emerald-500/20 p-6 rounded-full inline-block relative">
            <CheckCircle2 size={64} className="text-emerald-500" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-black text-white tracking-tight">✓ Deposit Paid!</h1>
          <p className="text-slate-400 font-medium tracking-tight">Your project is now officially confirmed.</p>
        </div>
      </div>

      <div className="bg-slate-900/40 border border-slate-900 rounded-[2.5rem] p-8 space-y-6">
        <div className="space-y-4">
          <div className="flex items-center gap-4 text-slate-300">
            <Package size={20} className="text-blue-500" />
            <div className="flex-1">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Project</p>
              <p className="font-bold">{proposalData?.title || 'Loading...'}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-slate-300">
            <Mail size={20} className="text-blue-500" />
            <div className="flex-1">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Next Steps</p>
              <p className="font-medium text-sm leading-relaxed">The freelancer has been notified. You'll receive updates here.</p>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800">
           <button 
             onClick={() => router.push('/')}
             className="w-full bg-slate-950 hover:bg-slate-900 text-white font-bold py-4 px-6 rounded-2xl border border-slate-800 transition-all flex items-center justify-center gap-2"
           >
             <ArrowLeft size={18} /> Close Window
           </button>
        </div>
      </div>

      <p className="text-center text-[10px] font-black text-slate-800 uppercase tracking-[0.3em]">
        Proposal Forge • Secured by Stripe
      </p>
    </div>
  )
}

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-950 to-slate-950">
      <Suspense fallback={
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
        </div>
      }>
        <SuccessContent />
      </Suspense>
    </div>
  )
}
