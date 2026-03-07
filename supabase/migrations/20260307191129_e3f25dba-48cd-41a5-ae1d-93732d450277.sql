CREATE TABLE public.promotions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text,
  image_url text NOT NULL,
  is_active boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.promotions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view promotions"
  ON public.promotions FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage promotions"
  ON public.promotions FOR ALL
  USING (EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  ));

CREATE OR REPLACE FUNCTION public.update_promotions_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER promotions_updated_at
  BEFORE UPDATE ON public.promotions
  FOR EACH ROW EXECUTE FUNCTION public.update_promotions_updated_at();

INSERT INTO storage.buckets (id, name, public)
VALUES ('promotions', 'promotions', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Anyone can view promotion images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'promotions');

CREATE POLICY "Admins can upload promotion images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'promotions');

CREATE POLICY "Admins can delete promotion images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'promotions');