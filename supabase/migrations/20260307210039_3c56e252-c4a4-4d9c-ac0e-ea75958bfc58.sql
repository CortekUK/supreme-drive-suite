CREATE TABLE public.vehicle_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vehicle_id UUID NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_cover BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.vehicle_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Vehicle images are publicly readable"
  ON public.vehicle_images FOR SELECT USING (true);

CREATE POLICY "Admins can manage vehicle images"
  ON public.vehicle_images FOR ALL
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

CREATE INDEX idx_vehicle_images_vehicle_id ON public.vehicle_images(vehicle_id);
CREATE INDEX idx_vehicle_images_display_order ON public.vehicle_images(vehicle_id, display_order);