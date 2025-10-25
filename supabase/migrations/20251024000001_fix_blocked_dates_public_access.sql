-- Drop the existing authenticated-only read policy
DROP POLICY IF EXISTS "Allow authenticated users to read blocked dates" ON blocked_dates;

-- Create new policy: Allow everyone (including anonymous users) to read blocked dates
CREATE POLICY "Allow public to read blocked dates"
  ON blocked_dates
  FOR SELECT
  TO anon, authenticated
  USING (true);
