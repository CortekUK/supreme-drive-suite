-- Create portfolio/case studies table
CREATE TABLE public.portfolio (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  summary TEXT NOT NULL,
  cover_image_url TEXT NOT NULL,
  service_type TEXT NOT NULL CHECK (service_type IN ('chauffeur', 'close_protection')),
  vehicle_used TEXT,
  location TEXT NOT NULL,
  event_date DATE NOT NULL,
  duration TEXT,
  special_requirements TEXT,
  testimonial_quote TEXT,
  testimonial_author TEXT,
  price_range TEXT,
  gallery_images JSONB DEFAULT '[]'::jsonb,
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.portfolio ENABLE ROW LEVEL SECURITY;

-- Public can view active portfolio items
CREATE POLICY "Anyone can view active portfolio items"
  ON public.portfolio
  FOR SELECT
  USING (is_active = true);

-- Admins can manage portfolio
CREATE POLICY "Admins can manage portfolio"
  ON public.portfolio
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create index for better performance
CREATE INDEX idx_portfolio_slug ON public.portfolio(slug);
CREATE INDEX idx_portfolio_service_type ON public.portfolio(service_type);
CREATE INDEX idx_portfolio_featured ON public.portfolio(is_featured) WHERE is_featured = true;
CREATE INDEX idx_portfolio_active ON public.portfolio(is_active) WHERE is_active = true;