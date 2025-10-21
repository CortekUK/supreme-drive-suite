-- Add payment_status column to bookings table
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending';

-- Add check constraint for valid payment statuses
ALTER TABLE bookings ADD CONSTRAINT payment_status_check
  CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded'));

-- Create index for faster queries on payment status
CREATE INDEX IF NOT EXISTS idx_bookings_payment_status ON bookings(payment_status);
