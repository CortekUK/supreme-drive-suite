-- Ensure RLS is enabled
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to recreate them cleanly
DROP POLICY IF EXISTS "Allow anonymous booking inserts" ON public.bookings;
DROP POLICY IF EXISTS "Admins can view all bookings" ON public.bookings;
DROP POLICY IF EXISTS "Admins can update bookings" ON public.bookings;

-- Grant table-level permissions
GRANT ALL ON TABLE public.bookings TO postgres;
GRANT INSERT, SELECT ON TABLE public.bookings TO anon;
GRANT ALL ON TABLE public.bookings TO authenticated;

-- Recreate INSERT policy for anonymous users (permissive)
CREATE POLICY "Allow anonymous booking inserts" 
ON public.bookings 
FOR INSERT 
TO anon
WITH CHECK (true);

-- Recreate admin policies
CREATE POLICY "Admins can view all bookings" 
ON public.bookings 
FOR SELECT 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

CREATE POLICY "Admins can update bookings" 
ON public.bookings 
FOR UPDATE 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);