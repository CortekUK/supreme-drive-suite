-- Create blocked_dates table
CREATE TABLE IF NOT EXISTS blocked_dates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL UNIQUE,
  reason TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE blocked_dates ENABLE ROW LEVEL SECURITY;

-- Policy: Allow authenticated users to read blocked dates
CREATE POLICY "Allow authenticated users to read blocked dates"
  ON blocked_dates
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy: Allow authenticated users to insert blocked dates
CREATE POLICY "Allow authenticated users to insert blocked dates"
  ON blocked_dates
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Policy: Allow authenticated users to delete blocked dates
CREATE POLICY "Allow authenticated users to delete blocked dates"
  ON blocked_dates
  FOR DELETE
  TO authenticated
  USING (true);

-- Create index on date for faster lookups
CREATE INDEX idx_blocked_dates_date ON blocked_dates(date);
