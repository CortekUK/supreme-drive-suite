ALTER TABLE public.vehicles ADD COLUMN IF NOT EXISTS display_order integer;

WITH ordered AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY name) AS rn
  FROM public.vehicles
)
UPDATE public.vehicles v
SET display_order = ordered.rn
FROM ordered
WHERE v.id = ordered.id AND v.display_order IS NULL;

CREATE INDEX IF NOT EXISTS idx_vehicles_display_order ON public.vehicles(display_order);