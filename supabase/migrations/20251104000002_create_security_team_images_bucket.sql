-- Create storage bucket for security team images
INSERT INTO storage.buckets (id, name, public)
VALUES ('security-team-images', 'security-team-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create RLS policies for security team images bucket
CREATE POLICY "Admins can upload security team images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'security-team-images' AND
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

CREATE POLICY "Admins can update security team images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'security-team-images' AND
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

CREATE POLICY "Admins can delete security team images"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'security-team-images' AND
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

CREATE POLICY "Anyone can view security team images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'security-team-images');
