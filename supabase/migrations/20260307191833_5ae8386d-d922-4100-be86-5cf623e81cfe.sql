DROP POLICY IF EXISTS "Admins can manage promotions" ON public.promotions;

CREATE POLICY "Admins can manage promotions"
ON public.promotions
FOR ALL
USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
)
WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);