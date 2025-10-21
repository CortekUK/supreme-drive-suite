-- Create service_inclusions table for managing "What's Included" section
CREATE TABLE IF NOT EXISTS service_inclusions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  icon_name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('standard', 'premium')),
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE service_inclusions ENABLE ROW LEVEL SECURITY;

-- Anyone can view active service inclusions
CREATE POLICY "Anyone can view active service inclusions"
ON service_inclusions FOR SELECT
USING (is_active = true);

-- Admins can manage service inclusions
CREATE POLICY "Admins can manage service inclusions"
ON service_inclusions FOR ALL
USING (EXISTS (
  SELECT 1 FROM profiles
  WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
));

-- Insert default service inclusions based on current pricing page
INSERT INTO service_inclusions (title, icon_name, category, display_order) VALUES
  ('Professional chauffeur', 'User', 'standard', 1),
  ('Fuel and insurance', 'Fuel', 'standard', 2),
  ('Complimentary water and refreshments', 'Droplets', 'standard', 3),
  ('WiFi and device charging', 'Wifi', 'standard', 4),
  ('Flight tracking (airport transfers)', 'Plane', 'standard', 5),
  ('Close protection officer: from £500/day', 'Shield', 'premium', 1),
  ('Extended waiting time: £50/hour', 'Clock', 'premium', 2),
  ('Last-minute bookings: +25%', 'Phone', 'premium', 3),
  ('Champagne service: £75', 'GlassWater', 'premium', 4),
  ('Multiple stops: POA', 'Sparkles', 'premium', 5)
ON CONFLICT DO NOTHING;

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_service_inclusions_updated_at BEFORE UPDATE
ON service_inclusions FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
