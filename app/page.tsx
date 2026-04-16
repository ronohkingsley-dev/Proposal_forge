import Link from 'next/link'
import { ArrowRight, TrendingUp, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react'
import { GlassCard } from '@/components/GlassCard'

export default function LandingPage() {
  return (
    <div className="space-y-32 text-center pb-20">
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 max-w-5xl mx-auto px-6 animate-fade-in">
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 backdrop-blur-sm mb-8">
          <span className="flex h-2 w-2 rounded-full bg-amber-500 animate-pulse"></span>
          <span className="text-xs font-bold text-indigo-200 tracking-wider uppercase">ProposalForge 2.0 is Live</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1] text-white">
          Forge Proposals <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">
            That Close Deals.
          </span>
        </h1>
        
        <p className="mt-8 text-xl text-slate-300 leading-relaxed max-w-2xl mx-auto font-medium">
          The high-end workspace for professional freelancers and agencies. Stop guessing your rates and start winning with data-driven confidence.
        </p>

        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6">
          <Link href="/auth">
            <button className="w-full sm:w-auto px-10 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white rounded-full font-bold shadow-lg shadow-indigo-500/25 transition-transform hover:scale-105 flex items-center justify-center gap-3">
              Build First Proposal <ArrowRight size={20} />
            </button>
          </Link>
          <p className="text-sm text-slate-400 font-medium">No credit card required.</p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: <TrendingUp size={28} className="text-indigo-400" />, title: "Market Intelligence", desc: "Real-time pricing benchmarks based on project complexity and niche, backed by AI." },
            { icon: <ShieldCheck size={28} className="text-emerald-400" />, title: "Secured Deposits", desc: "Automate your commitment requests via Stripe and stop getting ghosted after work starts." },
            { icon: <Sparkles size={28} className="text-amber-400" />, title: "Premium Aesthetics", desc: "Generate pixel-perfect, glassmorphic proposals that WOW your clients instantly." }
          ].map((item, i) => (
            <GlassCard key={i} className="text-left animate-fade-in" style={{ animationDelay: `${i * 0.15}s` }}>
              <div className="p-3 bg-white/5 rounded-2xl w-fit mb-6 border border-white/10 shadow-inner">
                 {item.icon}
              </div>
              <h3 className="text-xl font-bold text-white tracking-tight">{item.title}</h3>
              <p className="text-slate-400 mt-3 leading-relaxed">{item.desc}</p>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-4xl font-extrabold text-white mb-16">Simple, Transparent Pricing</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Free Tier */}
          <GlassCard className="text-left">
             <h3 className="text-xl font-bold text-slate-300">Free</h3>
             <div className="mt-4 mb-6 flex items-baseline gap-1">
                <span className="text-5xl font-black text-white">$0</span>
                <span className="text-slate-400">/mo</span>
             </div>
             <p className="text-slate-400 mb-8 border-b border-white/10 pb-8">Perfect for freelancers just starting out.</p>
             <ul className="space-y-4 mb-8">
                {['Up to 3 active proposals', 'Standard templates', 'Basic analytics', 'Community support'].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-300">
                    <CheckCircle2 size={18} className="text-indigo-400" /> {feature}
                  </li>
                ))}
             </ul>
             <button className="w-full py-4 rounded-full bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-colors">Current Plan</button>
          </GlassCard>

          {/* Pro Tier */}
          <GlassCard className="text-left border-indigo-500/50 shadow-2xl shadow-indigo-500/20 relative" style={{ transform: 'scale(1.05)' }}>
             <div className="absolute top-0 right-8 transform -translate-y-1/2">
                <span className="bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Most Popular</span>
             </div>
             <h3 className="text-xl font-bold text-indigo-300">Pro</h3>
             <div className="mt-4 mb-6 flex items-baseline gap-1">
                <span className="text-5xl font-black text-white">$19</span>
                <span className="text-slate-400">/mo</span>
             </div>
             <p className="text-slate-400 mb-8 border-b border-white/10 pb-8">For serious professionals closing deals.</p>
             <ul className="space-y-4 mb-8">
                {['Unlimited proposals', 'Stripe deposits integration', 'Pricing intelligence engine', 'Premium support'].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-300">
                    <CheckCircle2 size={18} className="text-indigo-400" /> {feature}
                  </li>
                ))}
             </ul>
             <button className="w-full py-4 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold hover:scale-105 transition-transform shadow-lg shadow-indigo-500/25">Upgrade to Pro</button>
          </GlassCard>

          {/* Agency Tier */}
          <GlassCard className="text-left">
             <h3 className="text-xl font-bold text-slate-300">Agency</h3>
             <div className="mt-4 mb-6 flex items-baseline gap-1">
                <span className="text-5xl font-black text-white">$49</span>
                <span className="text-slate-400">/mo</span>
             </div>
             <p className="text-slate-400 mb-8 border-b border-white/10 pb-8">For teams scaling their client acquisition.</p>
             <ul className="space-y-4 mb-8">
                {['Everything in Pro', 'Custom branding', 'Up to 5 team members', 'API Access', 'Dedicated account manager'].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-300">
                    <CheckCircle2 size={18} className="text-indigo-400" /> {feature}
                  </li>
                ))}
             </ul>
             <button className="w-full py-4 rounded-full bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-colors">Contact Sales</button>
          </GlassCard>
        </div>
      </section>

      {/* Testimonial Carousel */}
      <section className="max-w-4xl mx-auto px-6 py-12">
         <GlassCard className="text-center p-12">
            <div className="flex justify-center mb-6">
               {[1,2,3,4,5].map(i => <Sparkles key={i} size={20} className="text-amber-400 mx-1" />)}
            </div>
            <p className="text-2xl font-medium text-white italic leading-relaxed">
              "Since switching to ProposalForge, our agency's close rate jumped by 40%. The pricing intelligence alone paid for the yearly subscription in our first sent proposal. The UI looks incredibly premium to our clients."
            </p>
            <div className="mt-8 flex items-center justify-center gap-4">
               <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500"></div>
               <div className="text-left">
                  <p className="font-bold text-white">Alex Rivera</p>
                  <p className="text-sm text-slate-400">Founder, DesignMatrix</p>
               </div>
            </div>
         </GlassCard>
      </section>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-6 pt-20 border-t border-white/10 mt-20 flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="text-slate-400 font-medium">© {new Date().getFullYear()} ProposalForge. All rights reserved.</p>
        <div className="flex gap-8 font-semibold text-slate-400">
          <Link href="/privacy" className="hover:text-white transition-colors underline-offset-4 hover:underline">Privacy</Link>
          <Link href="/terms" className="hover:text-white transition-colors underline-offset-4 hover:underline">Terms</Link>
          <Link href="#" className="hover:text-white transition-colors">Twitter</Link>
        </div>
      </footer>
    </div>
  )
}
