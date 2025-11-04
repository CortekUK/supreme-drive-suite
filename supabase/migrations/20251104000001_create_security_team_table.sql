-- Create security_team table
CREATE TABLE IF NOT EXISTS public.security_team (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  specializations TEXT[],
  bio TEXT,
  profile_image_url TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  certifications TEXT[],
  experience_years INTEGER CHECK (experience_years >= 1 OR experience_years IS NULL),
  is_featured BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 1 CHECK (display_order >= 1),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_security_team_is_active ON public.security_team(is_active);
CREATE INDEX IF NOT EXISTS idx_security_team_is_featured ON public.security_team(is_featured);
CREATE INDEX IF NOT EXISTS idx_security_team_display_order ON public.security_team(display_order);

-- Enable Row Level Security
ALTER TABLE public.security_team ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Anyone can view active security team members
CREATE POLICY "Anyone can view active security team members"
ON public.security_team
FOR SELECT
USING (is_active = true);

-- Admins can manage security team members
CREATE POLICY "Admins can manage security team members"
ON public.security_team
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_security_team_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_security_team_updated_at_trigger
  BEFORE UPDATE ON public.security_team
  FOR EACH ROW
  EXECUTE FUNCTION public.update_security_team_updated_at();

-- Grant permissions
GRANT SELECT ON public.security_team TO anon, authenticated;
GRANT ALL ON public.security_team TO authenticated;

-- Insert sample data (optional - remove if not needed)
INSERT INTO public.security_team (name, title, bio, profile_image_url, specializations, certifications, experience_years, is_featured, display_order)
VALUES
  (
    'John Smith',
    'Head of Close Protection',
    'Former Special Forces operator with over 15 years of experience in executive protection and threat assessment.',
    'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop',
    ARRAY['close_protection', 'vip_security', 'threat_assessment'],
    ARRAY['SIA License', 'Counter-Terrorism', 'Advanced Driving'],
    15,
    true,
    1
  ),
  (
    'Sarah Johnson',
    'Senior Protection Officer',
    'Specialized in VIP and celebrity protection with extensive international experience.',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop',
    ARRAY['close_protection', 'event_security', 'vip_security'],
    ARRAY['SIA License', 'First Aid', 'Surveillance Detection'],
    10,
    true,
    2
  )
ON CONFLICT DO NOTHING;
