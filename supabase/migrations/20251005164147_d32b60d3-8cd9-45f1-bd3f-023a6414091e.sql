-- Add display_order column to testimonials table
ALTER TABLE public.testimonials
ADD COLUMN display_order integer DEFAULT 0;

-- Backfill existing records with sequential order based on created_at
WITH ordered_testimonials AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at ASC) - 1 AS order_num
  FROM public.testimonials
)
UPDATE public.testimonials
SET display_order = ordered_testimonials.order_num
FROM ordered_testimonials
WHERE public.testimonials.id = ordered_testimonials.id;

-- Add index for performance on display_order queries
CREATE INDEX idx_testimonials_display_order ON public.testimonials(display_order);

-- Add index for featured + display_order queries (used on public site)
CREATE INDEX idx_testimonials_featured_order ON public.testimonials(is_featured DESC, display_order ASC);