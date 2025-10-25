-- Remove existing RLS policies on audit_logs
DROP POLICY IF EXISTS "Admins can create audit logs" ON public.audit_logs;
DROP POLICY IF EXISTS "Admins can view audit logs" ON public.audit_logs;

-- Disable RLS on audit_logs table to allow server-side inserts
ALTER TABLE public.audit_logs DISABLE ROW LEVEL SECURITY;

-- Grant necessary permissions
GRANT INSERT ON public.audit_logs TO authenticated;
GRANT SELECT ON public.audit_logs TO authenticated;
