'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
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
  Save,
  Users,
  FolderArchive
} from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { GlassCard } from '@/components/GlassCard'
import { Input, Select } from '@/components/ui/Input'

type Complexity = 'low' | 'medium' | 'high'
type Niche = 'Web Design' | 'Copywriting' | 'SEO' | 'Graphic Design' | 'Video Editing' | 'Other'

interface FormData {
  title: string
  clientId: string
  clientName: string
  clientEmail: string
  scope: string
  complexity: Complexity
  niche: Niche
  timeline: number
  price: number
  requireDeposit: boolean
}

export default function NewProposalPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const prefillClientId = searchParams.get('clientId')

  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [clients, setClients] = useState<any[]>([])
  
  // Template States
  const [isSavingTemplate, setIsSavingTemplate] = useState(false)
  const [templateName, setTemplateName] = useState('')
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false)
  const [templates, setTemplates] = useState<any[]>([])

  const [formData, setFormData] = useState<FormData>({
    title: '',
    clientId: 'new',
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
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth')
      } else {
        setUser(user)
        fetchClients()
        fetchTemplates()
      }
    }
    init()

    const loadedTpl = localStorage.getItem('pf_loaded_template')
    if (loadedTpl) {
      const parsed = JSON.parse(loadedTpl)
      setFormData(prev => ({ ...prev, ...parsed }))
      localStorage.removeItem('pf_loaded_template')
    }
  }, [router])

  useEffect(() => {
    if (prefillClientId && clients.length > 0) {
      const client = clients.find(c => c.id === prefillClientId)
      if (client) {
        setFormData(prev => ({
          ...prev, 
          clientId: client.id, 
          clientName: client.name, 
          clientEmail: client.email
        }))
      }
    }
  }, [prefillClientId, clients])

  const fetchClients = async () => {
    const res = await fetch('/api/clients')
    if (res.ok) {
      const data = await res.json()
      setClients(data)
    }
  }

  const fetchTemplates = async () => {
    const res = await fetch('/api/templates')
    if (res.ok) {
      const data = await res.json()
      setTemplates(data)
    }
  }

  const handleClientSelect = (id: string) => {
    if (id === 'new') {
      setFormData(prev => ({ ...prev, clientId: 'new', clientName: '', clientEmail: '' }))
    } else {
      const client = clients.find(c => c.id === id)
      if (client) {
        setFormData(prev => ({ ...prev, clientId: client.id, clientName: client.name, clientEmail: client.email }))
      }
    }
  }

  const handleNext = () => setStep(prev => Math.min(prev + 1, 4))
  const handleBack = () => setStep(prev => Math.max(prev - 1, 1))

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/proposals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project_title: formData.title,
          client_id: formData.clientId,
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

      if (!res.ok) throw new Error('Failed to create proposal')

      router.push('/dashboard')
    } catch (err: any) {
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveTemplate = async () => {
    if (!templateName) return alert('Please enter a template name')
    
    setIsSavingTemplate(true)
    try {
      const res = await fetch('/api/templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: templateName,
          data: formData
        })
      })
      if (!res.ok) throw new Error('Failed to save template')
      alert('Template saved!')
      setTemplateName('')
      fetchTemplates()
    } catch (err: any) {
      alert(err.message)
    } finally {
      setIsSavingTemplate(false)
      setIsTemplateModalOpen(false)
    }
  }

  const handleLoadTemplate = (data: any) => {
    setFormData(prev => ({ ...prev, ...data }))
    setIsTemplateModalOpen(false)
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
            Forge <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">Proposal</span>
          </h1>
        </div>

        {/* Step Indicators */}
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

      <div className="mb-6 flex justify-end">
         <button onClick={() => setIsTemplateModalOpen(true)} className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-indigo-400 hover:text-indigo-300 transition-colors">
            <FolderArchive size={16} /> Load Template
         </button>
      </div>

      <GlassCard className="animate-fade-in relative z-10 p-8 sm:p-12">
        {step === 1 && (
          <div className="space-y-8 animate-fade-in transition-all">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-white tracking-tight">Core Objectives</h2>
              <p className="text-slate-400 font-medium">Define who you are forging this for and why.</p>
            </div>
            <div className="space-y-6">
              <Input 
                label="Project Title" 
                placeholder="e.g. Modern E-commerce Platform Redesign"
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
              />
              <div className="space-y-4">
                 <Select label="Select Client" value={formData.clientId} onChange={(e:any) => handleClientSelect(e.target.value)}>
                    <option value="new">+ Add New Client Inline</option>
                    {clients.map(c => (
                       <option key={c.id} value={c.id}>{c.name} ({c.email})</option>
                    ))}
                 </Select>

                 {formData.clientId === 'new' && (
                    <div className="grid md:grid-cols-2 gap-6 p-4 bg-white/5 border border-white/10 rounded-2xl animate-fade-in">
                      <Input 
                        label="Client Name" 
                        placeholder="e.g. Sarah Jenkins"
                        value={formData.clientName}
                        onChange={e => setFormData({...formData, clientName: e.target.value})}
                      />
                      <Input 
                        label="Client Email" 
                        placeholder="sarah@corp.com"
                        value={formData.clientEmail}
                        onChange={e => setFormData({...formData, clientEmail: e.target.value})}
                      />
                    </div>
                 )}
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
               <h2 className="text-2xl font-bold text-white tracking-tight">Execution Strategy</h2>
               <p className="text-slate-400 font-medium">How will you deliver value to the client?</p>
            </div>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-400 block">Scope of Work</label>
                <textarea 
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white h-32 outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all font-medium placeholder:text-slate-500 shadow-inner"
                  placeholder="Describe the deliverables..."
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
                   <option value="Video Editing">Video Editing</option>
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
                Price Intelligence <ArrowRight size={18} className="ml-2" />
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-8 animate-fade-in transition-all">
            <div className="space-y-2">
               <h2 className="text-2xl font-bold text-white tracking-tight">Pricing Intelligence</h2>
               <p className="text-slate-400 font-medium">Set your terms based on value and market data.</p>
            </div>
            
            <div className="p-8 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-600/20 border border-indigo-500/30">
               <div className="space-y-8">
                 <div className="flex items-center justify-between">
                    <p className="text-xs font-bold uppercase tracking-widest text-indigo-300">Estimated Project Value</p>
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
            <div className="flex items-center justify-between">
               <div>
                  <h2 className="text-2xl font-bold text-white tracking-tight">Final Details</h2>
                  <p className="text-slate-400 font-medium">Timeline and deposit settings.</p>
               </div>
               <button onClick={() => setIsTemplateModalOpen(true)} className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-indigo-400 border border-indigo-400/50 bg-indigo-500/10 hover:bg-indigo-500/20 rounded-lg px-4 py-2 transition-colors">
                  <Save size={14} /> Save as Template
               </button>
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
                {loading ? 'Forging...' : 'Complete Proposal'} <ShieldCheck size={18} className="ml-2" />
              </button>
            </div>
          </div>
        )}
      </GlassCard>

      {/* Template Modal */}
      {isTemplateModalOpen && (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
            <GlassCard className="w-full max-w-lg relative shadow-2xl space-y-8">
               <h3 className="text-2xl font-bold text-white">Save or Load Template</h3>
               
               {step === 4 && (
                 <div className="p-6 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 space-y-4">
                    <h4 className="text-sm font-bold uppercase tracking-widest text-indigo-400 mb-2">Save Current Data</h4>
                    <Input 
                      label="Template Name" 
                      placeholder="e.g. Standard E-commerce Template"
                      value={templateName}
                      onChange={e => setTemplateName(e.target.value)}
                    />
                    <button 
                      onClick={handleSaveTemplate}
                      disabled={isSavingTemplate}
                      className="w-full bg-indigo-500 hover:bg-indigo-400 text-white font-bold py-3 rounded-full transition-colors flex justify-center items-center gap-2"
                    >
                      <Save size={18} /> {isSavingTemplate ? 'Saving...' : 'Save Template'}
                    </button>
                 </div>
               )}

               <div className="space-y-4">
                  <h4 className="text-sm font-bold uppercase tracking-widest text-slate-400">Load Existing Template</h4>
                  {templates.length === 0 ? (
                     <p className="text-slate-500 text-sm">No templates saved yet.</p>
                  ) : (
                     <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                        {templates.map(t => (
                           <button 
                             key={t.id}
                             onClick={() => handleLoadTemplate(t.data)}
                             className="w-full text-left p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
                           >
                              <p className="font-bold text-white truncate">{t.name}</p>
                              <p className="text-xs text-slate-400 mt-1 truncate">{t.data.scope}</p>
                           </button>
                        ))}
                     </div>
                  )}
               </div>

               <button onClick={() => setIsTemplateModalOpen(false)} className="w-full bg-white/5 hover:bg-white/10 text-white font-bold py-3 rounded-full transition-colors border border-white/10">
                 Cancel
               </button>
            </GlassCard>
         </div>
      )}
    </div>
  )
}
