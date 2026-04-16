'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { ArrowRight, Mail, Lock, Sparkles, Github, Hammer, ShieldCheck } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'

export default function AuthPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mode, setMode] = useState<'login' | 'signup'>('signup')
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setMessage(null)

    try {
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        })
        if (error) throw error
        setMessage('Check your email to confirm your account!')
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) throw error
        router.push('/dashboard')
        router.refresh()
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      {/* Left Side: Brand/Marketing (Now light themed) */}
      <div className="hidden lg:flex flex-col justify-between w-[45%] p-16 bg-white border-r border-slate-100 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-50/50 via-transparent to-transparent -z-10" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-600/5 blur-[100px] rounded-full" />
        
        <Link href="/" className="flex items-center gap-2.5 group relative z-10">
          <div className="p-2 bg-indigo-600 rounded-lg group-hover:rotate-12 transition-transform shadow-lg shadow-indigo-600/20">
            <Hammer className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-black tracking-tight text-slate-900 uppercase italic">
            ProposalForge<span className="text-indigo-600">.</span>
          </span>
        </Link>
        
        <div className="space-y-8 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-[10px] font-black uppercase tracking-widest">
            <ShieldCheck size={14} /> Join the professional 1%
          </div>
          <h1 className="text-6xl font-black text-slate-900 leading-[1.1] uppercase italic tracking-tighter">
            Stop Guessing. <br />
            Start <span className="text-indigo-600">Forging</span>.
          </h1>
          <p className="text-slate-500 text-xl font-medium max-w-sm leading-relaxed">
            The intelligent workspace that helps you price correctly and track every client view in real-time.
          </p>
        </div>

        <div className="flex items-center gap-8 text-slate-400 font-black uppercase tracking-[0.2em] text-[10px]">
           <div className="flex items-center gap-2"><div className="w-1 h-1 bg-indigo-600 rounded-full" /> Stripe</div>
           <div className="flex items-center gap-2"><div className="w-1 h-1 bg-indigo-600 rounded-full" /> AI Engine</div>
           <div className="flex items-center gap-2"><div className="w-1 h-1 bg-indigo-600 rounded-full" /> Real-time</div>
        </div>
      </div>

      {/* Right Side: Auth Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-slate-50 relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/5 blur-[120px]" />
        
        <Card className="w-full max-w-md shadow-2xl border-0 relative z-10 p-10 lg:p-12">
          <div className="space-y-10">
            <div className="text-center space-y-2">
               <h2 className="text-4xl font-black text-slate-900 tracking-tight uppercase italic">
                 {mode === 'signup' ? 'Access Registry' : 'Welcome Back'}
               </h2>
               <p className="text-slate-500 font-bold italic text-sm px-4">
                 {mode === 'signup' 
                   ? 'Initialize your professional workspace today.' 
                   : 'Reconnect with your deals and track your wins.'}
               </p>
            </div>

            <form onSubmit={handleAuth} className="space-y-6">
              <div className="space-y-4">
                <Input 
                  label="Registry Email" 
                  type="email" 
                  placeholder="e.g. alex@rivera.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
                <Input 
                  label="Password" 
                  type="password" 
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
              </div>

              {error && (
                <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl text-rose-600 text-xs font-bold text-center italic">
                  ERROR: {error}
                </div>
              )}

              {message && (
                <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-600 text-xs font-bold text-center italic">
                  {message}
                </div>
              )}

              <Button 
                type="submit" 
                isLoading={loading}
                className="w-full py-4 text-base group"
              >
                {mode === 'signup' ? 'Initialize Workspace' : 'Sign In to Cockpit'} 
                <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </form>

            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-100" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase font-black">
                <span className="bg-white px-4 text-slate-300 tracking-[0.3em]">External Gateway</span>
              </div>
            </div>

            <Button variant="secondary" className="w-full bg-slate-50 border-slate-200">
               <Github size={18} className="mr-2" /> Continue with GitHub
            </Button>

            <p className="text-center text-slate-500 font-bold text-sm">
              {mode === 'signup' ? 'Already registered?' : "Need a workspace?"}
              <button 
                onClick={() => setMode(mode === 'signup' ? 'login' : 'signup')}
                className="text-indigo-600 ml-2 hover:underline decoration-indigo-300 underline-offset-4"
              >
                {mode === 'signup' ? 'Sign In' : 'Register Free'}
              </button>
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}
