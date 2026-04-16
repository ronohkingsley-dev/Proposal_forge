-- DATABASE SCHEMA FOR PROPOSAL FORGE
-- Instructions: Paste this into the Supabase SQL Editor (app.supabase.com)

-- 1. PROFILES TABLE (Extends Auth.Users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'pro', 'agency')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. PROPOSALS TABLE
CREATE TABLE IF NOT EXISTS public.proposals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  client_name TEXT NOT NULL,
  client_email TEXT NOT NULL,
  project_title TEXT NOT NULL,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'viewed', 'signed', 'accepted', 'rejected', 'expired')),
  total_price NUMERIC(12, 2),
  currency TEXT DEFAULT 'USD',
  content JSONB DEFAULT '{}'::jsonb NOT NULL,
  share_token TEXT UNIQUE DEFAULT encode(gen_random_bytes(12), 'hex'),
  view_count INTEGER DEFAULT 0,
  last_viewed_at TIMESTAMP WITH TIME ZONE,
  deposit_paid_at TIMESTAMP WITH TIME ZONE,
  stripe_payment_intent_id TEXT,
  time_spent_seconds INTEGER DEFAULT 0,
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (timezone('utc'::text, now()) + interval '30 days'),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. PROPOSAL_VIEWS TABLE (Analytics)
CREATE TABLE IF NOT EXISTS public.proposal_views (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  proposal_id UUID REFERENCES public.proposals(id) ON DELETE CASCADE NOT NULL,
  viewer_ip TEXT,
  user_agent TEXT,
  time_spent_seconds INTEGER DEFAULT 0,
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ENABLE RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proposal_views ENABLE ROW LEVEL SECURITY;

-- POLICIES
-- Profiles
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Proposals
CREATE POLICY "Users can view their own proposals" ON public.proposals FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own proposals" ON public.proposals FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own proposals" ON public.proposals FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own proposals" ON public.proposals FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Public can view proposals via share_token" ON public.proposals FOR SELECT USING (true); -- Filtered by token in app code

-- Views
CREATE POLICY "Users can view their own proposal analytics" ON public.proposal_views FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.proposals WHERE public.proposals.id = public.proposal_views.proposal_id AND public.proposals.user_id = auth.uid())
);
CREATE POLICY "Public can log views" ON public.proposal_views FOR INSERT WITH CHECK (true);

-- 4. PRICING_DATA TABLE (Market Benchmarks)
CREATE TABLE IF NOT EXISTS public.pricing_data (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  niche TEXT NOT NULL,
  country TEXT DEFAULT 'US',
  years_experience INTEGER DEFAULT 3,
  project_complexity TEXT CHECK (project_complexity IN ('low', 'medium', 'high')),
  price_cents INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- INITIAL SEED DATA (Optional, for demo)
INSERT INTO public.pricing_data (niche, country, years_experience, project_complexity, price_cents)
VALUES 
  ('Web Design', 'US', 2, 'low', 80000),
  ('Web Design', 'US', 3, 'low', 120000),
  ('Web Design', 'US', 5, 'medium', 450000),
  ('Web Design', 'US', 8, 'high', 1200000),
  ('Copywriting', 'US', 2, 'low', 40000),
  ('Copywriting', 'US', 4, 'medium', 150000),
  ('Copywriting', 'US', 7, 'high', 500000),
  ('Graphic Design', 'UK', 3, 'medium', 250000);

-- AUTH TRIGGER
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (new.id, new.email);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- HELPER: SAFE VIEW INCREMENT
CREATE OR REPLACE FUNCTION public.increment_view_count(proposal_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.proposals
  SET view_count = view_count + 1,
      last_viewed_at = timezone('utc'::text, now())
  WHERE id = proposal_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


