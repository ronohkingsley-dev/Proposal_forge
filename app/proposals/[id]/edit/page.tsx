'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  Sparkles, 
  ShieldCheck, 
  Clock, 
  Briefcase,
  Zap,
  DollarSign,
  AlertTriangle
} from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { GlassCard } from '@/components/GlassCard'
import { Input, Select } from '@/components/ui/Input'

type Complexity = 'low' | 'medium' | 'high'
type Niche = 'Web Design' | 'Copywriting' | 'SEO' | 'Graphic Design' | 'Video Editing' | 'Other'

interface FormData {
  title: string
  clientName: string
  clientEmail: string
  scope: string
  complexity: Complexity
  niche: Niche
  timeline: number
  price: number
  requireDeposit: boolean
}

export default function EditProposalPage() {
  const router = useRouter()
  const params = useParams()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const [formData, setFormData] = useState<FormData>({
    title: '',
    clientName: '',
    clientEmail: '',
    scope: '',
    complexity: 'medium',
    niche: 'Web Design',
    timeline: 14,
    price: 1500,
    requireDeposit: true
  })

  useEffect(() => {
    const fetchProposal = async () => {
      try {
        const res = await fetch(`/api/proposals/${params.id}`)
        if (!res.ok) {
          if (res.status === 404) throw new Error('Proposal not found')
          throw new Error('You do not have permission to edit this proposal')
        }
        
        const data = await res.json()
        
        if (data.status === 'signed') {
          setError('This proposal is already signed and cannot be edited.')
          setFetching(false)
          return
        }

        setFormData({
          title: data.project_title,
          clientName: data.client_name,
          clientEmail: data.client_email,
          scope: data.content.scope,
          complexity: data.content.complexity,
          niche: data.content.niche,
          timeline: data.content.timeline,
          price: data.total_price,
          requireDeposit: data.content.requireDeposit
        })
      } catch (err: any) {
        setError(err.message)
      } finally {
        setFetching(false)
      }
    }

    if (params.id) fetchProposal()
  }, [params.id])

  const handleNext = () => setStep(prev => Math.min(prev + 1, 4))
  const handleBack = () => setStep(prev => Math.max(prev - 1, 1))

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/proposals/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project_title: formData.title,
          client_name: formData.clientName,
          client_email: formData.clientEmail,
          total_price: formData.price,
          content: {
            scope: formData.scope,
            complexity: formData.complexity,
            niche: formData.niche,
            timeline: formData.timeline,
            requireDeposit: formData.requireDeposit
          }
        })
      })

      if (!res.ok) throw new Error('Failed to update proposal')
      router.push('/dashboard')
    } catch (err: any) {
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto py-20 px-6 text-center space-y-6">
        <GlassCard>
          <div className="p-4 bg-rose-500/10 text-rose-500 rounded-2xl border border-rose-500/20 flex justify-center w-fit mx-auto mb-6">
             <AlertTriangle size={32} />
          </div>
          <div className="space-y-3 mb-8">
            <h1 className="text-2xl font-bold text-white tracking-tight">Access Restricted</h1>
            <p className="text-slate-400 font-medium">{error}</p>
          </div>
          <button onClick={() => router.push('/dashboard')} className="w-full bg-white text-slate-900 px-6 py-3 rounded-full font-bold">
             Return to Dashboard
          </button>
        </GlassCard>
      </div>
    )
  }

  const steps = [
    { num: 1, label: 'Objective', icon: <Briefcase size={16} /> },
    { num: 2, label: 'Execution', icon: <Zap size={16} /> },
    { num: 3, label: 'Intelligence', icon: <Sparkles size={16} /> },
    { num: 4, label: 'Finalize', icon: <ShieldCheck size={16} /> }
  ]

  return (
    <div className="max-w-3xl mx-auto py-12 px-6 min-h-screen font-sans animate-fade-in">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div className="space-y-1">
          <button 
            onClick={() => router.push('/dashboard')}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition-colors uppercase tracking-widest mb-2"
          >
            <ArrowLeft size={14} /> Back to Dashboard
          </button>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Refine <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">Forge</span>
          </h1>
        </div>

        <div className="flex items-center gap-3">
          {steps.map((s) => (
            <div key={s.num} className="flex items-center">
               <div className={`flex items-center justify-center h-10 w-10 text-white rounded-full border-2 transition-all duration-300 ${
                 step >= s.num ? 'bg-gradient-to-r from-indigo-500 to-purple-600 border-transparent shadow-lg shadow-indigo-500/30' : 'border-white/20 text-slate-400'
               }`}>
                 {step > s.num ? <Check size={18} /> : s.icon}
               </div>
               {s.num !== 4 && <div className={`w-6 h-0.5 mx-2 rounded-full ${step > s.num ? 'bg-indigo-500' : 'bg-white/10'}`} />}
            </div>
          ))}
        </div>
      </header>

      <GlassCard className="animate-fade-in relative z-10 p-8 sm:p-12">
        {step === 1 && (
          <div className="space-y-8 animate-fade-in transition-all">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-white tracking-tight">Update Objectives</h2>
              <p className="text-slate-400 font-medium">Modify the core project details.</p>
            </div>
            <div className="space-y-6">
              <Input 
                label="Project Title" 
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
              />
              <div className="grid md:grid-cols-2 gap-6">
                <Input label="Client Name" value={formData.clientName} onChange={e => setFormData({...formData, clientName: e.target.value})} />
                <Input label="Client Email" value={formData.clientEmail} onChange={e => setFormData({...formData, clientEmail: e.target.value})} />
              </div>
            </div>
            <div className="flex justify-end pt-6 border-t border-white/10 mt-8">
              <button onClick={handleNext} className="bg-white text-slate-900 hover:bg-slate-200 px-8 py-3 rounded-full font-bold transition-all flex items-center">
                Continue <ArrowRight size={18} className="ml-2" />
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-8 animate-fade-in transition-all">
            <div className="space-y-2">
               <h2 className="text-2xl font-bold text-white tracking-tight">Strategy Refinement</h2>
               <p className="text-slate-400 font-medium">Update the scope and market parameters.</p>
            </div>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-400 block">Scope of Work</label>
                <textarea 
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white h-32 outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all font-medium placeholder:text-slate-500 shadow-inner"
                  value={formData.scope}
                  onChange={e => setFormData({...formData, scope: e.target.value})}
                />
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <Select label="Market Niche" value={formData.niche} onChange={(e:any) => setFormData({...formData, niche: e.target.value as Niche})}>
                   <option value="Web Design">Web Design</option>
                   <option value="Copywriting">Copywriting</option>
                   <option value="SEO">SEO</option>
                   <option value="Graphic Design">Graphic Design</option>
                   <option value="Other">Other</option>
                </Select>
                <Select label="Technical Complexity" value={formData.complexity} onChange={(e:any) => setFormData({...formData, complexity: e.target.value as Complexity})}>
                   <option value="low">Low (Standard)</option>
                   <option value="medium">Medium (Advanced)</option>
                   <option value="high">High (Expert)</option>
                </Select>
              </div>
            </div>
            <div className="flex justify-between pt-6 border-t border-white/10 mt-8">
              <button onClick={handleBack} className="text-slate-400 hover:text-white px-6 py-3 font-bold transition-colors">Back</button>
              <button onClick={handleNext} className="bg-white text-slate-900 hover:bg-slate-200 px-8 py-3 rounded-full font-bold transition-all flex items-center">
                Adjust Pricing <ArrowRight size={18} className="ml-2" />
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-8 animate-fade-in transition-all">
            <div className="space-y-2">
               <h2 className="text-2xl font-bold text-white tracking-tight">Pricing Intelligence</h2>
               <p className="text-slate-400 font-medium">Re-confirm your terms and pricing.</p>
            </div>
            
            <div className="p-8 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-600/20 border border-indigo-500/30">
               <div className="space-y-8">
                 <div className="flex items-center justify-between">
                    <p className="text-xs font-bold uppercase tracking-widest text-indigo-300">Project Value</p>
                    <div className="h-10 w-10 bg-indigo-500/30 rounded-xl flex items-center justify-center border border-indigo-400/30">
                       <DollarSign size={20} className="text-indigo-200" />
                    </div>
                 </div>
                 <div className="flex items-baseline gap-2">
                    <span className="text-6xl font-black text-white tracking-tight">${formData.price.toLocaleString()}</span>
                    <span className="text-indigo-300 font-bold uppercase tracking-widest">USD</span>
                 </div>
                 <input 
                    type="range"
                    min="500"
                    max="20000"
                    step="500"
                    value={formData.price}
                    onChange={e => setFormData({...formData, price: parseInt(e.target.value)})}
                  />
                  <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-slate-400 pt-2">
                     <span>Floor ($500)</span>
                     <span>Ceiling ($20k)</span>
                  </div>
               </div>
            </div>

            <div className="flex justify-between pt-6 border-t border-white/10 mt-8">
              <button onClick={handleBack} className="text-slate-400 hover:text-white px-6 py-3 font-bold transition-colors">Back</button>
              <button onClick={handleNext} className="bg-white text-slate-900 hover:bg-slate-200 px-8 py-3 rounded-full font-bold transition-all flex items-center">
                Finalize Terms <ArrowRight size={18} className="ml-2" />
              </button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-8 animate-fade-in transition-all">
            <div className="space-y-2">
               <h2 className="text-2xl font-bold text-white tracking-tight">Final Details</h2>
               <p className="text-slate-400 font-medium">Timeline and deposit settings.</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
               <div className="flex items-center gap-4 px-6 py-6 bg-white/5 rounded-2xl border border-white/10">
                  <div className="p-3 bg-white/10 rounded-xl text-amber-400 border border-white/5">
                     <Clock size={24} />
                  </div>
                  <div className="flex-1">
                     <Input type="number" label="Timeline (Days)" value={formData.timeline} onChange={e => setFormData({...formData, timeline: parseInt(e.target.value)})} />
                  </div>
               </div>
               
               <div className="flex items-center justify-between px-6 py-6 bg-white/5 rounded-2xl border border-white/10">
                  <div className="space-y-1">
                    <p className="font-bold text-white tracking-tight">Require Deposit</p>
                    <p className="text-xs text-slate-400">Secure 50% upfront payment via Stripe.</p>
                  </div>
                  <button 
                    onClick={() => setFormData({...formData, requireDeposit: !formData.requireDeposit})}
                    className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none ${formData.requireDeposit ? 'bg-emerald-500' : 'bg-slate-600'}`}
                  >
                    <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${formData.requireDeposit ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
               </div>
            </div>

            <div className="flex justify-between pt-6 border-t border-white/10 mt-8">
              <button onClick={handleBack} className="text-slate-400 hover:text-white px-6 py-3 font-bold transition-colors">Back</button>
              <button 
                onClick={handleSubmit} 
                disabled={loading}
                className="bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-white px-8 py-3 rounded-full font-bold transition-all shadow-lg shadow-amber-500/25 flex items-center"
              >
                {loading ? 'Forging...' : 'Update Proposal'} <ShieldCheck size={18} className="ml-2" />
              </button>
            </div>
          </div>
        )}
      </GlassCard>
    </div>
  )
}
