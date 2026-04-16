import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const metadata: Metadata = {
  title: 'ProposalForge - Privacy Policy',
  description: 'Privacy Policy for ProposalForge SaaS platform.',
}

export default function PrivacyPolicyPage() {
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
            <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight">Privacy Policy</h1>
            <p className="text-amber-400 font-bold text-sm uppercase tracking-widest">Last updated: April 16, 2025</p>
            <div className="mt-4 w-24 h-1 bg-amber-400 rounded-full"></div>
          </header>

          <div className="space-y-8 text-gray-200 leading-relaxed font-medium">
            <section>
              <h2 className="text-xl font-bold text-amber-400 mb-3 flex items-center gap-2 border-b border-white/10 pb-2">
                1. Information We Collect
              </h2>
              <div className="space-y-4">
                <p>
                  <strong className="text-white">Account Information:</strong> When you sign up, we collect your email address and any profile details you provide (name, niche, experience, country).
                </p>
                <p>
                  <strong className="text-white">Proposal Data:</strong> We store the proposals you create (title, client name, client email, scope, pricing, etc.). This data is tied to your account.
                </p>
                <p>
                  <strong className="text-white">Usage Data:</strong> We automatically collect:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>IP address, browser type, device information.</li>
                  <li>Pages visited, features used, time spent.</li>
                  <li>Tracking data from client views (e.g., when a client opens your proposal link, how long they view it).</li>
                </ul>
                <p>
                  <strong className="text-white">Payment Information:</strong> We do not store full credit card details. Payments are processed by Stripe, and we receive only a payment confirmation and the last four digits of the card.
                </p>
                <p>
                  <strong className="text-white">Pricing Intelligence Contributions:</strong> If you choose to share your project prices anonymously, we store niche, complexity, years of experience, country, and price (no personally identifiable information).
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-amber-400 mb-3 flex items-center gap-2 border-b border-white/10 pb-2">
                2. How We Use Your Information
              </h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>To provide, maintain, and improve ProposalForge.</li>
                <li>To calculate market rates (using anonymous, aggregated data).</li>
                <li>To send you service emails (proposal viewed, deposit received, reminders).</li>
                <li>To respond to support requests.</li>
                <li>To prevent fraud and ensure security.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-amber-400 mb-3 flex items-center gap-2 border-b border-white/10 pb-2">
                3. Information Sharing
              </h2>
              <p className="mb-4">
                We do <strong className="text-white">not</strong> sell your personal data. We share data only in these limited circumstances:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong className="text-white">With Stripe</strong> – to process payments and subscriptions.</li>
                <li><strong className="text-white">With Resend</strong> – to send emails (proposal links, notifications).</li>
                <li><strong className="text-white">With service providers</strong> (hosting, analytics) who are bound by confidentiality.</li>
                <li><strong className="text-white">If required by law</strong> – to comply with legal process or protect our rights.</li>
                <li><strong className="text-white">With your consent</strong> – for example, if you choose to share a proposal link with a client.</li>
              </ul>
              <p className="mt-4">
                <strong className="text-amber-400 font-bold italic">Anonymous Aggregates:</strong> We may share aggregated, non-identifiable data (e.g., "average price for web design in the US") publicly or with partners.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-amber-400 mb-3 flex items-center gap-2 border-b border-white/10 pb-2">
                4. Cross-Border Data Transfers
              </h2>
              <p>
                ProposalForge is a global platform. Your information, including personal data, may be transferred to — and maintained on — computers located outside of your state, province, country, or other governmental jurisdiction where the data protection laws may differ from those in your jurisdiction. 
              </p>
              <p className="mt-2 text-white/80">
                Specifically, your data is hosted on secure servers provided by Supabase and Vercel, and processed through Stripe and Resend, which may involve data being stored in the United States or other international locations. By using the Service, you consent to these transfers.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-amber-400 mb-3 flex items-center gap-2 border-b border-white/10 pb-2">
                5. Your Client Data
              </h2>
              <p>
                When you enter a client’s name and email into a proposal, you are responsible for complying with any privacy laws that apply to you (e.g., GDPR, CCPA). We process that data only on your behalf to deliver the proposal link and tracking. You should inform your clients that their email and viewing behavior will be tracked via ProposalForge.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-amber-400 mb-3 flex items-center gap-2 border-b border-white/10 pb-2">
                6. Data Retention
              </h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>We keep your account data for as long as your account is active.</li>
                <li>After account deletion, we delete all personal data within 30 days, except:
                  <ul className="list-disc pl-6 mt-2 space-y-1 opacity-80">
                    <li>Anonymous pricing contributions (disassociated from your identity).</li>
                    <li>Data we are required to retain by law (e.g., transaction records for tax purposes).</li>
                  </ul>
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-amber-400 mb-3 flex items-center gap-2 border-b border-white/10 pb-2">
                7. Your Rights & Kenyan ODPC
              </h2>
              <p className="mb-2">Depending on your location, you may have the right to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Access, correct, or delete your personal data.</li>
                <li>Object to or restrict certain processing.</li>
                <li>Data portability.</li>
                <li>Withdraw consent (where applicable).</li>
              </ul>
              <p className="mt-4 p-4 rounded-xl bg-amber-400/10 border border-amber-400/20 text-amber-200 shadow-lg">
                <strong className="text-white block mb-1">Notice for Users in Kenya:</strong> 
                If you are located in Kenya, you have specific rights under the <strong className="text-white">Data Protection Act, 2019</strong>, including the right to complain to the <strong className="text-white">Office of the Data Protection Commissioner (ODPC)</strong>. We process your data in accordance with the principles of this Act.
              </p>
              <p className="mt-4">
                To exercise these rights, contact us at <a href="mailto:kingsleyronoh77@gmail.com" className="text-amber-400 hover:underline">kingsleyronoh77@gmail.com</a>. We will respond within 30 days.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-amber-400 mb-3 flex items-center gap-2 border-b border-white/10 pb-2">
                8. Cookies and Tracking
              </h2>
              <p>
                We use essential cookies for authentication and analytics. You can disable cookies in your browser, but some features may not work.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-amber-400 mb-3 flex items-center gap-2 border-b border-white/10 pb-2">
                9. Children’s Privacy
              </h2>
              <p>
                ProposalForge is not intended for anyone under 18. We do not knowingly collect personal information from children.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-amber-400 mb-3 flex items-center gap-2 border-b border-white/10 pb-2">
                10. Changes to This Policy
              </h2>
              <p>
                We may update this Privacy Policy. We will notify you by email or via the Service. Continued use after changes constitutes acceptance.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-amber-400 mb-3 flex items-center gap-2 border-b border-white/10 pb-2">
                11. Contact
              </h2>
              <p>
                For privacy questions, email: <a href="mailto:kingsleyronoh77@gmail.com" className="text-amber-400 hover:underline">kingsleyronoh77@gmail.com</a>.
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
