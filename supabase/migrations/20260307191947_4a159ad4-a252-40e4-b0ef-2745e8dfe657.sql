-- Create the promotions storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('promotions', 'promotions', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Drop existing storage policies for promotions bucket to avoid conflicts
DROP POLICY IF EXISTS "Admins can upload promotions" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete promotions" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view promotions files" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update promotions" ON storage.objects;

-- Allow public read access to promotions bucket
CREATE POLICY "Anyone can view promotions files"
ON storage.objects FOR SELECT
USING (bucket_id = 'promotions');

-- Allow authenticated admins to upload
CREATE POLICY "Admins can upload promotions"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'promotions'
  AND EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

-- Allow authenticated admins to delete
CREATE POLICY "Admins can delete promotions"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'promotions'
  AND EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

-- Allow authenticated admins to update
CREATE POLICY "Admins can update promotions"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'promotions'
  AND EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);