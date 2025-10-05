-- Add summary field to audit_logs for better list view
ALTER TABLE public.audit_logs
ADD COLUMN IF NOT EXISTS summary text;

-- Add index for better performance on common queries
CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON public.audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity_type ON public.audit_logs(affected_entity_type);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON public.audit_logs(user_id);

-- Create a view to join audit logs with admin emails
CREATE OR REPLACE VIEW public.audit_logs_with_admin AS
SELECT 
  al.*,
  p.email as admin_email,
  p.full_name as admin_name
FROM public.audit_logs al
LEFT JOIN public.profiles p ON al.user_id = p.id;

-- Grant select on view to authenticated users (admins only via RLS)
GRANT SELECT ON public.audit_logs_with_admin TO authenticated;