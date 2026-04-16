# ⚡ ProposalForge

ProposalForge is a premium, specialized SaaS platform designed for freelancers and agencies to architect, price, and securely track highly professional business proposals. Say goodbye to messy PDFs and chaotic email threads—ProposalForge brings analytics, AI-backed scoping, and seamless payment collection into one elegant workspace.

## 🚀 Key Features

* **Intelligent Proposal Builder:** Quickly select project scopes, complexity, and timelines to construct a comprehensive proposal matrix.
* **Integrated Deposit Collection:** Native Stripe Checkout integration allowing your clients to sign and pay a 50% working deposit directly on the document.
* **Analytics Command Center:** Monitor real-time pipeline metrics including "Win Rates", "Average Deal Size", and Monthly Growth trends.
* **Tracking & Expirations:** Send proposals securely via unique short-links. Receive instant email notifications when a client views your proposal or completes a deposit. Proposals cleanly expire out of the pipeline after an allotted timeframe.
* **Lightweight CRM & Template Library:** Save successful project scopes as reusable templates and automatically log client interactions so no deal falls out of memory.
* **Agency White-Labeling:** Need a deeply customized touch? The "Agency" subscription tier unlocks powerful white-label features allowing companies to inject their logos, exact branding colors, and strip away platform watermarks.

---

## 🛠 Tech Stack

* **Framework:** Next.js 14 (App router)
* **Backend, Auth & Database:** Supabase (PostgreSQL, Row-Level Security, Storage Buckets)
* **Design System & Styling:** Tailwind CSS, Framer Motion, and Glassmorphism aesthetics
* **Revenue & Webhooks:** Stripe (Subscriptions & One-off Payment intents)
* **Transactional Mail:** Resend API
* **Charting Integration:** Recharts

---

## 💻 Local Development Setup

### 1. Repository Setup

Clone the repository and install dependencies:

```bash
git clone https://github.com/your-username/proposal-forge.git
cd proposal-forge
npm install
```

### 2. Environment Variables

Create a `.env.local` file in your root directory and ensure the following keys are populated:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role

# Stripe Billing Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Subscription Tier Identifiers
NEXT_PUBLIC_STRIPE_PRO_PRICE_ID=price_...
NEXT_PUBLIC_STRIPE_AGENCY_PRICE_ID=price_...

# Resend Mail
RESEND_API_KEY=re_...

# Local Dev Settings
NEXT_PUBLIC_APP_URL=http://localhost:3000
CRON_SECRET=my_secure_cron_string
```

### 3. Database Initialization

Navigate to your Supabase SQL Editor and execute the schema initialization files in chronological order:

1. Copy and run the core structure: `migrations.sql`
2. Copy and run the part 2 integrations (branding and templates): `migrations_part2.sql`

*Ensure that your Resend domain is verified and Stripe webhooks are actively pointing towards `[YOUR_URL]/api/webhooks/stripe`.*

### 4. Engage the Forge

Run the development instance locally!

```bash
npm run dev
```

Navigate to `http://localhost:3000` to interact with the platform.

---

## 📜 Deployment Checks

Before deploying to Vercel or your hosting provider of choice, consult the detailed `deployment_checklist.md` document for exhaustive test criteria and webhook syncing operations. 

In production, ensure you attach a CRON trigger logic (like Vercel Cron jobs linking to `/api/cron/daily`) to maintain automated pipeline analytics for deal expirations.
