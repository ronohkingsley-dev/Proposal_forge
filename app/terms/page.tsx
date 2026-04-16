import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const metadata: Metadata = {
  title: 'ProposalForge - Terms of Service',
  description: 'Terms of Service for ProposalForge SaaS platform.',
}

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-900 selection:bg-indigo-500/30">
      <div className="max-w-4xl mx-auto py-12 px-6">
        
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-indigo-400 hover:text-indigo-300 transition-colors">
            <ArrowLeft size={16} /> Back to Home
          </Link>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-8 md:p-12 border border-white/10">
          <header className="mb-10">
            <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight">Terms of Service</h1>
            <p className="text-amber-400 font-bold text-sm uppercase tracking-widest">Last updated: April 16, 2025</p>
            <div className="mt-4 w-24 h-1 bg-amber-400 rounded-full"></div>
          </header>

          <div className="space-y-8 text-gray-200 leading-relaxed font-medium">
            <section>
              <h2 className="text-xl font-bold text-amber-400 mb-3 flex items-center gap-2 border-b border-white/10 pb-2">
                1. Introduction
              </h2>
              <p>
                Welcome to ProposalForge ("we," "our," or "us"). By accessing or using our website and application (the "Service"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree, please do not use the Service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-amber-400 mb-3 flex items-center gap-2 border-b border-white/10 pb-2">
                2. Eligibility
              </h2>
              <p>
                You must be at least 18 years old and capable of forming a binding contract to use the Service. By using ProposalForge, you represent that you meet these requirements.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-amber-400 mb-3 flex items-center gap-2 border-b border-white/10 pb-2">
                3. Account Registration
              </h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>You are responsible for maintaining the security of your account (email, magic link).</li>
                <li>You agree to provide accurate, current, and complete information.</li>
                <li>You are solely responsible for all activities that occur under your account.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-amber-400 mb-3 flex items-center gap-2 border-b border-white/10 pb-2">
                4. Subscription Plans and Payments
              </h2>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong className="text-white">Free Plan:</strong> Limited to 3 proposals per month, basic templates, no analytics.</li>
                <li><strong className="text-white">Pro Plan ($19/month):</strong> Unlimited proposals, pricing intelligence, full tracking.</li>
                <li><strong className="text-white">Agency Plan ($49/month):</strong> All Pro features, team seats (up to 3), white-label branding.</li>
                <li>All fees are in USD and are non-refundable except as required by law.</li>
                <li>We use Stripe to process payments. You agree to Stripe’s terms and provide accurate billing information.</li>
                <li>We may change pricing with 30 days’ notice.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-amber-400 mb-3 flex items-center gap-2 border-b border-white/10 pb-2">
                5. Proposal Content and Data
              </h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>You retain all ownership of the proposals you create.</li>
                <li>By using the Service, you grant us a limited license to host, display, and transmit your proposals as necessary to provide the Service.</li>
                <li>You are responsible for ensuring your proposals do not violate any laws or third-party rights (e.g., defamation, spam, intellectual property).</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-amber-400 mb-3 flex items-center gap-2 border-b border-white/10 pb-2">
                6. Acceptable Use
              </h2>
              <p className="mb-2">You may not use ProposalForge to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Send spam, fraudulent, or misleading proposals.</li>
                <li>Violate any applicable laws or regulations.</li>
                <li>Interfere with or disrupt the Service’s security or performance.</li>
                <li>Scrape or extract data without our permission.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-amber-400 mb-3 flex items-center gap-2 border-b border-white/10 pb-2">
                7. Intellectual Property
              </h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>The ProposalForge software, design, logos, and content (excluding user proposals) are owned by us and protected by copyright and other laws.</li>
                <li>You may not copy, modify, or reverse engineer any part of the Service.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-amber-400 mb-3 flex items-center gap-2 border-b border-white/10 pb-2">
                8. Termination
              </h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>You may cancel your account at any time via Settings.</li>
                <li>We may suspend or terminate your account if you violate these Terms.</li>
                <li>Upon termination, we will delete your data after 30 days, unless required to retain it by law.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-amber-400 mb-3 flex items-center gap-2 border-b border-white/10 pb-2">
                9. Disclaimers
              </h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>The Service is provided "as is" without warranties of merchantability, fitness for a particular purpose, or non-infringement.</li>
                <li>We do not guarantee that your proposals will result in contracts or that market data is accurate.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-amber-400 mb-3 flex items-center gap-2 border-b border-white/10 pb-2">
                10. Limitation of Liability
              </h2>
              <p>
                To the maximum extent permitted by law, ProposalForge shall not be liable for any indirect, incidental, or consequential damages, including lost revenue or deals. Our total liability shall not exceed the amount you paid us in the previous 12 months.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-amber-400 mb-3 flex items-center gap-2 border-b border-white/10 pb-2">
                11. Governing Law
              </h2>
              <p>
                These Terms shall be governed by the laws of the <span className="text-white font-bold">Republic of Kenya</span>. Any disputes shall be resolved in Kenyan courts.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-amber-400 mb-3 flex items-center gap-2 border-b border-white/10 pb-2">
                12. Changes to Terms
              </h2>
              <p>
                We may update these Terms from time to time. We will notify you by email or via the Service. Continued use after changes constitutes acceptance.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-amber-400 mb-3 flex items-center gap-2 border-b border-white/10 pb-2">
                13. Contact
              </h2>
              <p>
                For questions, email: <a href="mailto:kingsleyronoh77@gmail.com" className="text-amber-400 hover:underline">kingsleyronoh77@gmail.com</a>.
              </p>
            </section>
          </div>
        </div>

        <div className="mt-12 text-center">
          <Link href="/" className="text-slate-400 hover:text-white transition-colors font-bold text-sm uppercase tracking-widest flex items-center justify-center gap-2">
            <ArrowLeft size={16} /> Back to Home
          </Link>
        </div>

      </div>
    </div>
  )
}
