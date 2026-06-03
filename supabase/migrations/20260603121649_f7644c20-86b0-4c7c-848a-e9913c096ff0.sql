ALTER TABLE public.bookings DROP CONSTRAINT IF EXISTS payment_status_check;
ALTER TABLE public.bookings ADD CONSTRAINT payment_status_check CHECK (payment_status = ANY (ARRAY['pending'::text, 'completed'::text, 'failed'::text, 'refunded'::text, 'enquiry'::text]));

ALTER TABLE public.bookings DROP CONSTRAINT IF EXISTS bookings_service_type_check;
ALTER TABLE public.bookings ADD CONSTRAINT bookings_service_type_check CHECK (service_type = ANY (ARRAY['chauffeur'::text, 'close_protection'::text, 'corporate'::text]));