-- Grant full permissions to postgres (owner)
GRANT ALL ON TABLE public.bookings TO postgres;

-- Grant INSERT permission to anon and authenticated roles
GRANT INSERT ON TABLE public.bookings TO anon, authenticated;

-- Grant SELECT permission to anon and authenticated roles (needed for .select().single())
GRANT SELECT ON TABLE public.bookings TO anon, authenticated;