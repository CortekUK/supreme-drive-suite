-- Drop the existing restrictive policy that's blocking submissions
DROP POLICY IF EXISTS "Anyone can create bookings" ON bookings;

-- Create a new permissive policy that allows public booking creation
CREATE POLICY "Allow public booking creation"
ON bookings
FOR INSERT
WITH CHECK (true);