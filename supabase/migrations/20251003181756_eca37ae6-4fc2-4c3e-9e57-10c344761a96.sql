-- Create portfolio_images table for managing multiple images per portfolio item
CREATE TABLE IF NOT EXISTS public.portfolio_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  portfolio_id UUID NOT NULL REFERENCES public.portfolio(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  caption TEXT,
  alt_text TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_cover BOOLEAN DEFAULT false,
  is_visible BOOLEAN DEFAULT true,
  uploaded_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add new fields to portfolio table
ALTER TABLE public.portfolio
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
ADD COLUMN IF NOT EXISTS is_confidential BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS hide_price BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS show_on_chauffeur_page BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS show_on_close_protection_page BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS last_edited_by UUID REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS last_edited_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS published_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS full_description TEXT;

-- Create storage bucket for portfolio images
INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio-images', 'portfolio-images', true)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS on portfolio_images
ALTER TABLE public.portfolio_images ENABLE ROW LEVEL SECURITY;

-- RLS policies for portfolio_images
CREATE POLICY "Admins can manage portfolio images"
ON public.portfolio_images
FOR ALL
USING (is_admin(auth.uid()));

CREATE POLICY "Anyone can view visible portfolio images"
ON public.portfolio_images
FOR SELECT
USING (is_visible = true AND EXISTS (
  SELECT 1 FROM public.portfolio 
  WHERE portfolio.id = portfolio_images.portfolio_id 
  AND portfolio.is_active = true 
  AND portfolio.status = 'published'
));

-- Storage policies for portfolio-images bucket
CREATE POLICY "Admins can upload portfolio images"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'portfolio-images' AND
  is_admin(auth.uid())
);

CREATE POLICY "Admins can update portfolio images"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'portfolio-images' AND is_admin(auth.uid()));

CREATE POLICY "Admins can delete portfolio images"
ON storage.objects
FOR DELETE
USING (bucket_id = 'portfolio-images' AND is_admin(auth.uid()));

CREATE POLICY "Anyone can view portfolio images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'portfolio-images');

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_portfolio_images_portfolio_id ON public.portfolio_images(portfolio_id);
CREATE INDEX IF NOT EXISTS idx_portfolio_images_display_order ON public.portfolio_images(display_order);
CREATE INDEX IF NOT EXISTS idx_portfolio_status ON public.portfolio(status);
CREATE INDEX IF NOT EXISTS idx_portfolio_service_type ON public.portfolio(service_type);