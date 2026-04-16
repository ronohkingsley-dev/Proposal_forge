-- Part 2: Proposal Expiration and Custom Branding Updates

-- Add default_expiration_days to profiles
ALTER TABLE profiles ADD COLUMN default_expiration_days INTEGER DEFAULT 30;

-- Add branding column to profiles
ALTER TABLE profiles ADD COLUMN branding JSONB DEFAULT '{"logo_url": "", "primary_color": "#4f46e5", "company_name": "", "hide_powered_by": false}';

-- Setup Storage for brand logos
insert into storage.buckets (id, name, public) values ('brand-logos', 'brand-logos', true);

-- Storage Policy to allow users to upload their logos
CREATE POLICY "Users can upload their own brand logos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'brand-logos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Anyone can view brand logos"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'brand-logos');

CREATE POLICY "Users can update their own logos"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'brand-logos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own logos"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'brand-logos' AND auth.uid()::text = (storage.foldername(name))[1]);
