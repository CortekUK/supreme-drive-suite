-- Create notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('booking', 'payment', 'close_protection', 'general')),
  is_read BOOLEAN DEFAULT false,
  related_booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create index for faster queries
CREATE INDEX idx_notifications_is_read ON public.notifications(is_read);
CREATE INDEX idx_notifications_created_at ON public.notifications(created_at DESC);
CREATE INDEX idx_notifications_type ON public.notifications(type);

-- Enable RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Policy: Allow authenticated users to read all notifications
CREATE POLICY "Allow authenticated users to read notifications"
  ON public.notifications
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy: Allow authenticated users to update notifications (mark as read)
CREATE POLICY "Allow authenticated users to update notifications"
  ON public.notifications
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Policy: Allow service role to insert notifications
CREATE POLICY "Allow service role to insert notifications"
  ON public.notifications
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Function to automatically update updated_at
CREATE OR REPLACE FUNCTION update_notifications_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to call the function
CREATE TRIGGER notifications_updated_at
  BEFORE UPDATE ON public.notifications
  FOR EACH ROW
  EXECUTE FUNCTION update_notifications_updated_at();

-- Function to create notification when booking is created
CREATE OR REPLACE FUNCTION create_booking_notification()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.notifications (
    title,
    message,
    type,
    related_booking_id,
    metadata
  ) VALUES (
    'New Booking Received',
    'New booking from ' || NEW.customer_name || ' on ' || NEW.pickup_date,
    'booking',
    NEW.id,
    jsonb_build_object(
      'customer_name', NEW.customer_name,
      'customer_email', NEW.customer_email,
      'pickup_location', NEW.pickup_location,
      'dropoff_location', NEW.dropoff_location,
      'pickup_date', NEW.pickup_date,
      'total_price', NEW.total_price,
      'payment_status', NEW.payment_status
    )
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to create notification on new booking
CREATE TRIGGER booking_created_notification
  AFTER INSERT ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION create_booking_notification();

-- Function to create notification when payment status changes to paid
CREATE OR REPLACE FUNCTION create_payment_notification()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.payment_status = 'paid' AND OLD.payment_status != 'paid' THEN
    INSERT INTO public.notifications (
      title,
      message,
      type,
      related_booking_id,
      metadata
    ) VALUES (
      'Payment Received',
      'Payment confirmed for booking by ' || NEW.customer_name,
      'payment',
      NEW.id,
      jsonb_build_object(
        'customer_name', NEW.customer_name,
        'total_price', NEW.total_price,
        'payment_status', NEW.payment_status
      )
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to create notification on payment
CREATE TRIGGER payment_received_notification
  AFTER UPDATE ON public.bookings
  FOR EACH ROW
  WHEN (OLD.payment_status IS DISTINCT FROM NEW.payment_status)
  EXECUTE FUNCTION create_payment_notification();
