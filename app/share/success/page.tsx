'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle2, ArrowRight, PartyPopper } from 'lucide-react'

export default function PaymentSuccessPage() {
  const router = useRouter()
  
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-950 to-slate-950">
      <div className="max-w-md w-full text-center space-y-8 animate-in zoom-in-95 duration-700">
        <div className="relative inline-block">
          <div className="absolute inset-0 bg-emerald-500 blur-3xl opacity-20 animate-pulse" />
          <div className="bg-emerald-500/10 border border-emerald-500/20 p-6 rounded-full inline-block relative">
            <CheckCircle2 size={64} className="text-emerald-500" />
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl font-black text-white tracking-tight flex items-center justify-center gap-3">
            Payment Received! <PartyPopper className="text-amber-400" />
          </h1>
          <p className="text-slate-400 font-medium leading-relaxed">
            Thank you for the deposit. The project is now officially kicked off! Your receipt has been sent to your email.
          </p>
        </div>

        <div className="pt-6">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 px-8 rounded-2xl transition-all shadow-xl shadow-blue-500/20"
          >
            Back to Home <ArrowRight size={18} />
          </Link>
        </div>

        <p className="text-xs font-bold text-slate-800 uppercase tracking-[0.3em] pt-10">
          Proposal Forge • Secured by Stripe
        </p>
      </div>
    </div>
  )
}
