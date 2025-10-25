-- Drop existing restrictive UPDATE policy
DROP POLICY IF EXISTS "Admins can update site settings" ON public.site_settings;

-- Allow public access to update site settings
CREATE POLICY "Public can update site settings"
ON public.site_settings
FOR UPDATE
TO anon, authenticated
USING (true)
WITH CHECK (true);
