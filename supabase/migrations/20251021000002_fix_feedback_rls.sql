-- Allow anyone to insert feedback submissions
CREATE POLICY "Allow public feedback submissions"
ON feedback_submissions
FOR INSERT
TO authenticated, anon
WITH CHECK (true);
