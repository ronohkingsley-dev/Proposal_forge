import Link from 'next/link'
import { CheckCircle } from 'lucide-react'
import { GlassCard } from '@/components/GlassCard'

export default function SubscriptionSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-950">
      <GlassCard className="max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          <CheckCircle className="w-16 h-16 text-emerald-500" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Subscription Activated!</h1>
          <p className="text-slate-400 mt-2">Thank you for upgrading. Your new plan features are now available.</p>
        </div>
        <div className="pt-4">
          <Link href="/settings" className="block w-full text-center bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-bold py-3 px-6 rounded-full transition-colors shadow-lg shadow-indigo-500/25">
            Return to Settings
          </Link>
        </div>
      </GlassCard>
    </div>
  )
}
