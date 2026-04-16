-- Proposal Forge - Schema Updates for Templates, CRM, and Notifications

-- 1. Create Templates Table
CREATE TABLE templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for templates
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own templates" ON templates
  FOR ALL USING (auth.uid() = user_id);

-- 2. Create Clients Table
CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  phone TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for clients
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own clients" ON clients
  FOR ALL USING (auth.uid() = user_id);

-- 3. Update proposals table with client_id constraint
ALTER TABLE proposals ADD COLUMN client_id UUID REFERENCES clients(id) ON DELETE SET NULL;

-- 4. Update profiles table with notification settings
ALTER TABLE profiles ADD COLUMN notification_settings JSONB DEFAULT '{"proposal_viewed": true, "deposit_received": true, "expiration_warning": true}';
