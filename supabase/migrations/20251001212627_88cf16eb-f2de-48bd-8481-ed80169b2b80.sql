-- Create demo admin user
-- This will set the role to 'admin' for the demo account

-- First, let's create a function to easily promote users to admin
CREATE OR REPLACE FUNCTION promote_user_to_admin(user_email TEXT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.profiles
  SET role = 'admin'
  WHERE email = user_email;
  
  IF NOT FOUND THEN
    RAISE NOTICE 'User with email % not found. Please sign up first.', user_email;
  END IF;
END;
$$;

-- Promote the demo admin user (if they exist)
-- Note: The user must sign up first through the auth page
DO $$
BEGIN
  -- Try to promote demo@admin.com to admin
  UPDATE public.profiles
  SET role = 'admin'
  WHERE email = 'demo@admin.com';
  
  IF FOUND THEN
    RAISE NOTICE 'Demo admin account promoted successfully';
  ELSE
    RAISE NOTICE 'Demo admin account not found. Please sign up with demo@admin.com first';
  END IF;
END $$;