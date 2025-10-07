-- Drop the old RLS policy first (it depends on is_active column)
DROP POLICY IF EXISTS "Anyone can view active drivers" ON public.drivers;

-- Now we can remove the is_active column
ALTER TABLE public.drivers DROP COLUMN is_active;

-- Create new RLS policy that checks is_available instead
CREATE POLICY "Anyone can view available drivers"
ON public.drivers
FOR SELECT
USING (is_available = true);