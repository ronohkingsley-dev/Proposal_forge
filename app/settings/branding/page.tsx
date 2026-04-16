'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Sidebar } from '@/components/Sidebar'
import { GlassCard } from '@/components/GlassCard'
import { supabase } from '@/lib/supabase/client'
import { Input } from '@/components/ui/Input'
import { Palette, UploadCloud, Building, EyeOff, Save } from 'lucide-react'

export default function BrandingSettingsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  
  const [branding, setBranding] = useState({
    logo_url: '',
    primary_color: '#4f46e5',
    company_name: '',
    hide_powered_by: false
  })

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth')
        return
      }
      setUserId(user.id)

      const { data: profile } = await supabase
        .from('profiles')
        .select('subscription_tier, branding')
        .eq('id', user.id)
        .single() as any

      if (profile?.subscription_tier !== 'agency') {
        router.push('/settings') // Only agency can view
        return
      }

      setBranding(prev => ({
        ...prev,
        ...(profile?.branding || {})
      }))

      setLoading(false)
    }

    fetchProfile()
  }, [router])

  const handleUpdateBranding = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ branding })
      })

      if (!res.ok) throw new Error('Failed to save branding')
      alert('Branding updated successfully!')
    } catch (err: any) {
      alert(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0 || !userId) return
    const file = e.target.files[0]
    
    // Upload to supabase storage
    const fileExt = file.name.split('.').pop()
    const fileName = `logo_${Date.now()}.${fileExt}`
    const filePath = `${userId}/${fileName}`

    try {
      setSaving(true)
      const { error: uploadError } = await supabase.storage
        .from('brand-logos')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data } = supabase.storage
        .from('brand-logos')
        .getPublicUrl(filePath)

      setBranding(prev => ({ ...prev, logo_url: data.publicUrl }))
    } catch (err: any) {
      alert(`Error uploading logo: ${err.message}`)
    } finally {
      setSaving(false)
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

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      <Sidebar />
      <main className="flex-1 p-6 lg:p-10 space-y-10 min-w-0 animate-fade-in">
        <header className="space-y-1">
          <h1 className="text-4xl font-extrabold tracking-tight text-white">
            Agency Branding
          </h1>
          <p className="text-slate-400 font-medium">Customize the client-facing proposal experience.</p>
        </header>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           <GlassCard className="space-y-8">
              <h2 className="text-xl font-bold text-white tracking-tight border-b border-white/10 pb-4">Brand Identity</h2>
              
              <div className="space-y-6">
                 <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Company Statement Name</label>
                    <div className="relative">
                       <Building size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                       <input 
                         type="text" 
                         className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white outline-none focus:border-indigo-500 transition-colors"
                         value={branding.company_name}
                         onChange={e => setBranding({...branding, company_name: e.target.value})}
                         placeholder="e.g. Matrix Design Group"
                       />
                    </div>
                 </div>

                 <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Primary Accent Color</label>
                    <div className="flex items-center gap-4">
                       <div className="relative w-12 h-12 rounded-xl border-2 border-white/10 overflow-hidden cursor-pointer shrink-0">
                          <input 
                            type="color" 
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 cursor-pointer"
                            value={branding.primary_color}
                            onChange={e => setBranding({...branding, primary_color: e.target.value})}
                          />
                       </div>
                       <input 
                         type="text" 
                         className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none font-mono focus:border-indigo-500 transition-colors"
                         value={branding.primary_color}
                         onChange={e => setBranding({...branding, primary_color: e.target.value})}
                       />
                    </div>
                 </div>

                 <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Brand Logo</label>
                    <div className="border-2 border-dashed border-white/10 hover:border-indigo-500/50 rounded-2xl p-6 text-center transition-colors cursor-pointer relative">
                       <input 
                         type="file" 
                         accept="image/*" 
                         onChange={handleFileUpload}
                         className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                         disabled={saving}
                       />
                       {branding.logo_url ? (
                          <div className="flex flex-col items-center gap-4">
                             <img src={branding.logo_url} alt="Brand Logo" className="h-16 object-contain" />
                             <span className="text-xs text-indigo-400 font-bold uppercase tracking-wider">Change Logo</span>
                          </div>
                       ) : (
                          <div className="flex flex-col items-center gap-2 text-slate-400">
                             <UploadCloud size={32} className="text-slate-500 mb-2" />
                             <p className="font-bold text-white">Click to upload logo</p>
                             <p className="text-xs">PNG, JPG, SVG up to 2MB</p>
                          </div>
                       )}
                    </div>
                 </div>

                 <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl">
                    <div>
                       <p className="font-bold text-white">White-label Experience</p>
                       <p className="text-xs text-slate-400 mt-1">Hide "Powered by ProposalForge" branding from footer.</p>
                    </div>
                    <button 
                      onClick={() => setBranding({...branding, hide_powered_by: !branding.hide_powered_by})}
                      className={`relative inline-flex h-7 w-12 flex-shrink-0 items-center rounded-full transition-colors focus:outline-none ${branding.hide_powered_by ? 'bg-emerald-500' : 'bg-slate-600'}`}
                    >
                      <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${branding.hide_powered_by ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                 </div>
              </div>

              <div className="pt-6 border-t border-white/10 flex justify-end">
                 <button 
                   onClick={handleUpdateBranding} 
                   disabled={saving}
                   className="bg-indigo-500 hover:bg-indigo-400 text-white px-8 py-3 rounded-full font-bold transition-colors flex items-center justify-center shadow-lg w-full sm:w-auto"
                 >
                   <Save size={18} className="mr-2" /> {saving ? 'Saving...' : 'Save Branding'}
                 </button>
              </div>
           </GlassCard>

           {/* Preview Card */}
           <div>
              <p className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-4 px-2">Live Preview</p>
              <GlassCard className="relative overflow-hidden p-6 sm:p-8" style={{ borderTop: `4px solid ${branding.primary_color}` }}>
                 <div className="flex items-center justify-between mb-12">
                    {branding.logo_url ? (
                       <img src={branding.logo_url} alt="Logo" className="h-6 object-contain" />
                    ) : (
                       <span className="font-bold text-white tracking-widest uppercase">{branding.company_name || 'Your Brand'}</span>
                    )}
                 </div>
                 
                 <div className="space-y-6">
                    <div className="h-4 w-32 bg-white/10 rounded-full"></div>
                    <div className="h-10 w-3/4 bg-white/5 rounded-xl"></div>
                    <div className="h-32 w-full bg-white/5 rounded-xl mt-8"></div>
                 </div>

                 <div className="mt-12 flex justify-end">
                    <div className="px-6 py-2 rounded-full font-bold text-sm text-white" style={{ backgroundColor: branding.primary_color }}>
                       Action Button
                    </div>
                 </div>

                 {!branding.hide_powered_by && (
                   <div className="mt-8 text-center border-t border-white/10 pt-4">
                      <p className="text-[8px] text-slate-500 uppercase tracking-widest">Powered by ProposalForge</p>
                   </div>
                 )}
              </GlassCard>
           </div>
        </section>
      </main>
    </div>
  )
}
