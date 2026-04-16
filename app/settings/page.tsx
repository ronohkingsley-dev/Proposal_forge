'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  ShieldAlert,
  PlusCircle
} from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { Sidebar } from '@/components/Sidebar'
import { GlassCard } from '@/components/GlassCard'
import { Input, Select } from '@/components/ui/Input'

interface Profile {
  id: string
  full_name: string | null
  subscription_tier: 'free' | 'pro' | 'agency'
  [key: string]: any
}

export default function SettingsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null)
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [fullName, setFullName] = useState('')
  const [notificationSettings, setNotificationSettings] = useState({
    proposal_viewed: true,
    deposit_received: true,
    expiration_warning: true
  })
  
  // Modal states
  const [isContributionModalOpen, setIsContributionModalOpen] = useState(false)
  const [contributionData, setContributionData] = useState({
    niche: 'Web Design',
    country: '',
    years_experience: 0,
    project_complexity: 'medium',
    price: 0
  })

  useEffect(() => {
    const fetchUserAndProfile = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser()
      if (!authUser) {
        router.push('/auth')
        return
      }
      setUser(authUser)

      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single()

      if (error) {
        console.error('Error fetching profile:', error)
      } else {
        const profile = profileData as Profile | null
        setProfile(profile)
        setFullName(profile?.full_name || '')
        if (profile?.notification_settings) {
          setNotificationSettings(profile.notification_settings)
        }
      }
      setLoading(false)
    }

    fetchUserAndProfile()
  }, [router])

  const handleUpgrade = async (plan: 'pro' | 'agency') => {
    setCheckoutLoading(plan)
    try {
      const priceId = plan === 'pro' 
        ? process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID 
        : process.env.NEXT_PUBLIC_STRIPE_AGENCY_PRICE_ID
      
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceId,
          successUrl: `${window.location.origin}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
          cancelUrl: `${window.location.origin}/settings`
        })
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        throw new Error(data.error || 'Failed to create session')
      }
    } catch (err: any) {
      alert(`Error: ${err.message}`)
      setCheckoutLoading(null)
    }
  }

  const handleManageSubscription = async () => {
    setCheckoutLoading('manage')
    try {
      const res = await fetch('/api/create-portal-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          returnUrl: `${window.location.origin}/settings`
        })
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        throw new Error(data.error || 'Failed to open portal')
      }
    } catch (err: any) {
      alert(`Error: ${err.message}`)
      setCheckoutLoading(null)
    }
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ full_name: fullName })
      })

      if (res.ok) {
        setProfile(prev => prev ? { ...prev, full_name: fullName } : null)
        alert('Profile saved.')
      } else {
        const err = await res.json()
        throw new Error(err.error || 'Failed to update profile')
      }
    } catch (err: any) {
      alert(`Error: ${err.message}`)
    } finally {
      setSaving(false)
    }
  }

  const handleUpdateNotifications = async (key: string, value: boolean) => {
    const newSettings = { ...notificationSettings, [key]: value }
    setNotificationSettings(newSettings)
    try {
      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notification_settings: newSettings })
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Failed to update notifications')
      }
    } catch (err: any) {
      alert(`Error updating settings: ${err.message}`)
      setNotificationSettings(notificationSettings) // revert on error
    }
  }

  const handleContribute = (e: React.FormEvent) => {
    e.preventDefault()
    alert("Thanks for contributing!")
    setIsContributionModalOpen(false)
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

  const currentPlan = profile?.subscription_tier || 'free'

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      <Sidebar />
      
      <main className="flex-1 p-6 lg:p-10 space-y-10 min-w-0 animate-fade-in">
        <header className="space-y-1">
          <h1 className="text-4xl font-extrabold tracking-tight text-white">
            Workspace Settings
          </h1>
          <p className="text-slate-400 font-medium">Manage your profile, billing, and community data.</p>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2 space-y-8">
            {/* Account Info */}
            <GlassCard>
              <div className="mb-6">
                <h2 className="text-xl font-bold text-white tracking-tight">Account Information</h2>
                <p className="text-slate-400 text-sm">Your public identity and contact details.</p>
              </div>
              <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <Input label="Email Address" value={user?.email || ''} disabled readOnly helperText="Email cannot be changed." />
                  <Input label="Full Name" value={fullName} onChange={e => setFullName(e.target.value)} placeholder="e.g. Alex Rivera" />
                </div>
                <div className="flex justify-end pt-4">
                  <button type="submit" disabled={saving} className="bg-white text-slate-900 px-6 py-2.5 rounded-full font-bold hover:bg-slate-200 transition-colors">
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </GlassCard>

            {/* Plan & Billing */}
            <GlassCard>
              <div className="mb-6">
                <h2 className="text-xl font-bold text-white tracking-tight">Plan & Billing</h2>
                <p className="text-slate-400 text-sm">Manage your subscription and usage limits.</p>
              </div>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 pt-2">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                      {currentPlan} Plan
                    </span>
                  </div>
                  <p className="text-sm text-slate-400 font-medium leading-relaxed max-w-sm">
                    {currentPlan === 'free' 
                      ? 'You are currently on the limited free tier. Upgrade for unlimited proposals and AI intelligence.' 
                      : 'You have full access to all professional features including smart pricing and analytics.'}
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  {currentPlan === 'free' ? (
                    <>
                      <button 
                        onClick={() => handleUpgrade('pro')}
                        disabled={checkoutLoading !== null}
                        className="whitespace-nowrap px-6 py-3 rounded-full font-bold shadow-lg transition-transform hover:scale-105 bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-amber-500/25 disabled:opacity-50 disabled:scale-100 flex items-center justify-center min-w-[200px]"
                      >
                        {checkoutLoading === 'pro' ? 'Loading...' : 'Upgrade to Pro ($19/mo)'}
                      </button>
                      <button 
                        onClick={() => handleUpgrade('agency')}
                        disabled={checkoutLoading !== null}
                        className="whitespace-nowrap px-6 py-3 rounded-full font-bold shadow-lg transition-transform hover:scale-105 bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-indigo-500/25 disabled:opacity-50 disabled:scale-100 flex items-center justify-center min-w-[200px]"
                      >
                        {checkoutLoading === 'agency' ? 'Loading...' : 'Upgrade to Agency ($49/mo)'}
                      </button>
                    </>
                  ) : (
                    <button 
                      onClick={handleManageSubscription}
                      disabled={checkoutLoading !== null}
                      className="whitespace-nowrap px-6 py-3 rounded-full font-bold transition-transform hover:scale-105 bg-white/10 text-white border border-white/20 hover:bg-white/20 shadow-none disabled:opacity-50 disabled:scale-100 flex items-center justify-center min-w-[200px]"
                    >
                      {checkoutLoading === 'manage' ? 'Loading...' : 'Manage Subscription'}
                    </button>
                  )}
                </div>
              </div>
            </GlassCard>

            {/* Custom Branding (Agency Only) */}
            {currentPlan === 'agency' && (
              <GlassCard className="border-emerald-500/30 bg-emerald-500/5 shadow-emerald-500/5">
                 <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                       <h2 className="text-xl font-bold text-emerald-400 tracking-tight">Agency Branding</h2>
                       <p className="text-slate-400 text-sm mt-1">Upload your logo, set custom colors, and white-label your proposals.</p>
                    </div>
                    <button 
                      onClick={() => router.push('/settings/branding')}
                      className="whitespace-nowrap px-6 py-2.5 rounded-full font-bold transition-transform hover:scale-105 bg-emerald-500 text-white shadow-lg shadow-emerald-500/25 flex items-center justify-center"
                    >
                      Configure Branding
                    </button>
                 </div>
              </GlassCard>
            )}

            {/* Community Contribution */}
            <GlassCard className="border-indigo-500/30 bg-indigo-500/10 shadow-indigo-500/10">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-white tracking-tight">Community Insights</h2>
                <p className="text-indigo-200/70 text-sm">Anonymous pricing data to help the ecosystem.</p>
              </div>
              <div className="space-y-6">
                <p className="text-sm text-slate-300 font-medium leading-relaxed max-w-2xl">
                  By contributing your anonymous project data, you help solidify fair market pricing for the entire community. 
                  Your identity is never linked to this data.
                </p>
                <button onClick={() => setIsContributionModalOpen(true)} className="text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-2">
                  <PlusCircle size={20} /> Contribute Entry
                </button>
              </div>
            </GlassCard>

            {/* Notification Settings */}
            <GlassCard>
               <div className="mb-6">
                 <h2 className="text-xl font-bold text-white tracking-tight">Email Notifications</h2>
                 <p className="text-slate-400 text-sm">Stay updated on your proposal activity.</p>
               </div>
               <div className="space-y-6">
                 {[
                   { id: 'proposal_viewed', label: 'Proposal Viewed', desc: 'Get notified when a client opens your proposal for the first time.' },
                   { id: 'deposit_received', label: 'Deposit Received', desc: 'Get notified when a client signs and pays the deposit.' },
                   { id: 'expiration_warning', label: 'Expiration Warning', desc: 'Get notified 24 hours before a proposal expires.' }
                 ].map((setting) => (
                   <div key={setting.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
                      <div>
                         <p className="font-bold text-white">{setting.label}</p>
                         <p className="text-xs text-slate-400 mt-1">{setting.desc}</p>
                      </div>
                      <button 
                        onClick={() => handleUpdateNotifications(setting.id, !(notificationSettings as any)[setting.id])}
                        className={`relative inline-flex h-7 w-12 flex-shrink-0 items-center rounded-full transition-colors focus:outline-none ${
                          (notificationSettings as any)[setting.id] ? 'bg-indigo-500' : 'bg-slate-600'
                        }`}
                      >
                        <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                          (notificationSettings as any)[setting.id] ? 'translate-x-6' : 'translate-x-1'
                        }`} />
                      </button>
                   </div>
                 ))}
               </div>
            </GlassCard>
          </div>

          {/* Danger Zone / Secondary Actions */}
          <div className="space-y-8">
            <GlassCard className="border-rose-500/30 bg-rose-500/10">
              <div className="mb-6">
                 <h2 className="text-lg font-bold text-rose-400">Danger Zone</h2>
              </div>
              <div className="space-y-6">
                <p className="text-sm font-medium text-rose-300/80 leading-relaxed">
                  Deleting your account is permanent. All proposals, client data, and billing history will be wiped.
                </p>
                <button onClick={() => alert("Deleting account...")} className="w-full bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/30 text-rose-400 px-6 py-3 rounded-full font-bold transition-colors flex items-center justify-center">
                  <ShieldAlert size={18} className="mr-2" /> Delete Account
                </button>
              </div>
            </GlassCard>

            <div className="p-6 text-center space-y-2">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">ProposalForge v2.0.0</p>
              <p className="text-xs font-semibold text-slate-400">Built for the next generation.</p>
            </div>
          </div>
        </div>
      </main>

      {/* Modal */}
      {isContributionModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <GlassCard className="w-full max-w-md relative animate-fade-in shadow-2xl">
            <div className="space-y-8">
              <header className="text-center space-y-3">
                <span className="bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  New Submission
                </span>
                <h3 className="text-2xl font-bold text-white tracking-tight">Market Intelligence</h3>
              </header>
              <form onSubmit={handleContribute} className="space-y-5">
                <Select label="Project Niche" value={contributionData.niche} onChange={(e:any) => setContributionData({...contributionData, niche: e.target.value})}>
                  <option>Web Design</option>
                  <option>Copywriting</option>
                  <option>SEO</option>
                </Select>
                <Input label="Project Price (USD)" type="number" placeholder="e.g. 5000" />
                <div className="pt-6 flex gap-4">
                  <button type="button" className="flex-1 bg-white/5 hover:bg-white/10 text-white font-bold py-3 rounded-full transition-colors border border-white/10" onClick={() => setIsContributionModalOpen(false)}>Cancel</button>
                  <button type="submit" className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-bold py-3 rounded-full shadow-lg transition-colors">Submit Data</button>
                </div>
              </form>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  )
}
