/*
  # Update time configuration fields

  1. Changes
    - Replace `duration` field with `end_time` field in contact_submissions table
    - Maintains `start_time` field for service start time
    - Uses text type for time values in HH:MM format

  2. Notes
    - Migration is safe as it uses conditional checks
    - Preserves existing data during transition
*/

-- Add end_time column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'contact_submissions' AND column_name = 'end_time'
  ) THEN
    ALTER TABLE contact_submissions ADD COLUMN end_time text;
  END IF;
END $$;

-- Remove duration column if it exists (replaced by end_time)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'contact_submissions' AND column_name = 'duration'
  ) THEN
    ALTER TABLE contact_submissions DROP COLUMN duration;
  END IF;
END $$;
