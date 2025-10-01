-- Create vehicles table
CREATE TABLE public.vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  capacity INTEGER NOT NULL,
  luggage_capacity INTEGER NOT NULL,
  base_price_per_mile DECIMAL(10,2) NOT NULL,
  overnight_surcharge DECIMAL(10,2) DEFAULT 0,
  image_url TEXT,
  features TEXT[],
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create bookings table
CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id UUID REFERENCES public.vehicles(id),
  pickup_location TEXT NOT NULL,
  dropoff_location TEXT NOT NULL,
  pickup_date DATE NOT NULL,
  pickup_time TIME NOT NULL,
  passengers INTEGER NOT NULL,
  luggage INTEGER NOT NULL,
  additional_requirements TEXT,
  is_long_drive BOOLEAN DEFAULT false,
  has_overnight_stop BOOLEAN DEFAULT false,
  estimated_miles DECIMAL(10,2),
  total_price DECIMAL(10,2),
  customer_name TEXT,
  customer_email TEXT,
  customer_phone TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create testimonials table
CREATE TABLE public.testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name TEXT NOT NULL,
  customer_title TEXT,
  content TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create pricing_rules table
CREATE TABLE public.pricing_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rule_name TEXT NOT NULL,
  rule_type TEXT NOT NULL,
  multiplier DECIMAL(10,4) DEFAULT 1.0,
  fixed_amount DECIMAL(10,2) DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create profiles table for admin users
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  role TEXT DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pricing_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Vehicles policies (public read, admin write)
CREATE POLICY "Anyone can view active vehicles"
  ON public.vehicles FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage vehicles"
  ON public.vehicles FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Bookings policies (anyone can create, admins can view all)
CREATE POLICY "Anyone can create bookings"
  ON public.bookings FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can view all bookings"
  ON public.bookings FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can update bookings"
  ON public.bookings FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Testimonials policies (public read active, admin write)
CREATE POLICY "Anyone can view active testimonials"
  ON public.testimonials FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage testimonials"
  ON public.testimonials FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Pricing rules policies (admin only)
CREATE POLICY "Admins can manage pricing rules"
  ON public.pricing_rules FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Profiles policies
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger for new user
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert sample vehicles
INSERT INTO public.vehicles (name, category, description, capacity, luggage_capacity, base_price_per_mile, overnight_surcharge, features) VALUES
('Mercedes S-Class', 'Executive', 'Ultimate comfort and sophistication', 3, 2, 3.50, 150.00, ARRAY['Leather seats', 'Climate control', 'WiFi', 'Champagne bar']),
('Rolls-Royce Phantom', 'Ultra Luxury', 'The pinnacle of automotive excellence', 4, 3, 8.00, 300.00, ARRAY['Starlight headliner', 'Champagne cooler', 'Rear entertainment', 'Bespoke audio']),
('Range Rover Autobiography', 'SUV Executive', 'Commanding presence with supreme comfort', 4, 4, 4.50, 200.00, ARRAY['All-terrain capability', 'Panoramic roof', 'Premium sound', 'Massage seats']),
('Mercedes V-Class', 'Group Travel', 'Spacious luxury for larger parties', 7, 6, 3.00, 180.00, ARRAY['Conference seating', 'WiFi', 'Privacy glass', 'USB charging']);

-- Insert sample testimonials
INSERT INTO public.testimonials (customer_name, customer_title, content, rating, is_featured) VALUES
('James Morrison', 'CEO, Morrison Enterprises', 'Absolutely impeccable service. The attention to detail and professionalism exceeded all expectations. Our clients were thoroughly impressed.', 5, true),
('Sarah Williams', 'Event Director', 'We''ve used Supreme Drive for multiple high-profile events. Their close protection team is outstanding and their chauffeurs are the epitome of discretion.', 5, true),
('David Chen', 'Private Client', 'The Rolls-Royce Phantom experience was unforgettable. From booking to drop-off, everything was seamless and luxurious.', 5, true);