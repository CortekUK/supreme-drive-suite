-- Add INSERT policy for audit_logs so admins can create audit entries
CREATE POLICY "Admins can create audit logs"
ON public.audit_logs
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = auth.uid()
      AND role = 'admin'
  )
);