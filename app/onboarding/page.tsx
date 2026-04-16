'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { GlassCard } from '@/components/GlassCard'
import { Input, Select } from '@/components/ui/Input'
import { ArrowRight, CheckCircle, SkipForward, ArrowLeft } from 'lucide-react'

export default function OnboardingPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  
  const [step, setStep] = useState(1)
  
  const [niche, setNiche] = useState('Web Design')
  const [otherNiche, setOtherNiche] = useState('')
  const [experienceYears, setExperienceYears] = useState(2)
  const [country, setCountry] = useState('US')
  
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth')
        return
      }
      
      const { data: profile } = await supabase
        .from('profiles')
        .select('onboarding_completed')
        .eq('id', user.id)
        .single() as any

      if (profile?.onboarding_completed) {
        router.push('/dashboard')
      } else {
        setUser(user)
        setLoading(false)
      }
    }
    checkUser()
  }, [router])

  const handleNext = () => setStep(prev => prev + 1)
  const handlePrev = () => setStep(prev => prev - 1)

  const handleComplete = async (skip: boolean = false) => {
    if (skip) {
      const confirmed = window.confirm("Are you sure you want to skip? You can always update your profile in settings later.")
      if (!confirmed) return
    }

    setSubmitting(true)
    
    let updateData: any = {
      onboarding_completed: true
    }

    if (!skip) {
      updateData.niche = niche === 'Other' ? (otherNiche || 'Other') : niche
      updateData.experience_years = experienceYears
      updateData.country = country
    }

    const { error } = await (supabase.from('profiles') as any)
      .update(updateData)
      .eq('id', user.id)

    if (error) {
      alert(`Error updating profile: ${error.message}`)
      setSubmitting(false)
    } else {
      router.push('/dashboard')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-950 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-900/20 via-slate-950 to-slate-950">
      <GlassCard className="max-w-2xl w-full p-8 md:p-12 animate-fade-in shadow-2xl border-white/10">
        <div className="mb-10 text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-400 font-bold text-[10px] tracking-widest uppercase mb-2">
            Step {step} of 4
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">
            {step === 1 && "What's your niche?"}
            {step === 2 && "Your experience level"}
            {step === 3 && "Where are you located?"}
            {step === 4 && "Ready to forge!"}
          </h1>
          <p className="text-slate-400 font-medium">
            {step < 4 ? "Help us customize your pricing intelligence data." : "Please review your details."}
          </p>
        </div>

        <div className="min-h-[200px]">
          {step === 1 && (
            <div className="space-y-6 animate-fade-in">
              <Select label="Primary Niche" value={niche} onChange={(e: any) => setNiche(e.target.value)}>
                <option value="Web Design">Web Design</option>
                <option value="Copywriting">Copywriting</option>
                <option value="SEO">SEO</option>
                <option value="Graphic Design">Graphic Design</option>
                <option value="Video Editing">Video Editing</option>
                <option value="Other">Other</option>
              </Select>

              {niche === 'Other' && (
                <div className="animate-fade-in">
                  <Input 
                    label="Please specify" 
                    value={otherNiche} 
                    onChange={e => setOtherNiche(e.target.value)} 
                    placeholder="e.g. 3D Animation"
                  />
                </div>
              )}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-fade-in">
              <label className="block text-sm font-bold text-white mb-4">Years of Professional Experience</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: '0 – 2 years', value: 2 },
                  { label: '3 – 5 years', value: 5 },
                  { label: '6 – 10 years', value: 8 },
                  { label: '10+ years', value: 12 },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setExperienceYears(option.value)}
                    className={`p-4 rounded-xl text-left border transition-all ${
                      experienceYears === option.value 
                        ? 'bg-indigo-500/20 border-indigo-500 text-white shadow-lg shadow-indigo-500/10' 
                        : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:text-slate-200'
                    }`}
                  >
                    <span className="font-bold">{option.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-fade-in">
              <Select label="Country of Residence" value={country} onChange={(e: any) => setCountry(e.target.value)}>
                <option value="US">United States</option>
                <option value="UK">United Kingdom</option>
                <option value="CA">Canada</option>
                <option value="AU">Australia</option>
                <option value="IN">India</option>
                <option value="DE">Germany</option>
                <option value="FR">France</option>
                <option value="Other">Other</option>
              </Select>
              <p className="text-xs text-slate-500 font-medium mt-2">
                This helps our AI benchmark your prices against local market rates.
              </p>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6 animate-fade-in">
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
                <div className="flex justify-between items-center pb-4 border-b border-white/5">
                  <span className="text-sm font-bold text-slate-400">Niche</span>
                  <span className="text-sm font-black text-white">{niche === 'Other' ? otherNiche : niche}</span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-white/5">
                  <span className="text-sm font-bold text-slate-400">Experience</span>
                  <span className="text-sm font-black text-white">{experienceYears}+ years</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-slate-400">Location</span>
                  <span className="text-sm font-black text-white">{country}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-12 flex flex-col-reverse sm:flex-row items-center justify-between gap-4">
          <div className="flex gap-4 w-full sm:w-auto">
            {step > 1 && (
              <button 
                onClick={handlePrev} 
                className="flex items-center text-sm font-bold text-slate-400 hover:text-white transition-colors"
                disabled={submitting}
              >
                <ArrowLeft size={16} className="mr-2" /> Back
              </button>
            )}
            {step === 1 && (
               <button 
                 onClick={() => handleComplete(true)} 
                 className="flex items-center text-sm font-bold text-slate-500 hover:text-white transition-colors"
                 disabled={submitting}
               >
                 <SkipForward size={16} className="mr-2" /> Skip Onboarding
               </button>
            )}
          </div>

          <div className="w-full sm:w-auto flex flex-col sm:flex-row gap-4">
            {step < 4 ? (
              <button 
                onClick={handleNext}
                className="w-full sm:w-auto px-8 py-3 bg-white text-slate-950 hover:bg-slate-200 rounded-full font-extrabold transition-all hover:scale-105 flex items-center justify-center shadow-lg"
              >
                Next <ArrowRight size={18} className="ml-2" />
              </button>
            ) : (
              <button 
                onClick={() => handleComplete(false)}
                disabled={submitting}
                className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white rounded-full font-extrabold transition-all hover:scale-105 flex items-center justify-center shadow-xl shadow-indigo-500/25 disabled:opacity-50 disabled:scale-100"
              >
                {submitting ? 'Saving...' : 'Complete Onboarding'} <CheckCircle size={18} className="ml-2" />
              </button>
            )}
          </div>
        </div>
      </GlassCard>
    </div>
  )
}
