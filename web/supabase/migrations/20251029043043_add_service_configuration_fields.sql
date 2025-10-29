/*
  # Add Service Configuration Fields to Contact Submissions

  1. Changes
    - Add `start_time` field to store bar service start time
    - Add `duration` field to store service duration in hours
    - Modify `guest_count` column type from integer to text to support range values

  2. Notes
    - These fields support the new dynamic pricing feature
    - Guest count now stores range strings like "51-75" instead of numeric values
    - All new fields are optional to maintain backward compatibility
    - Existing submissions remain valid with null values for new fields
*/

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'contact_submissions' AND column_name = 'guest_count' AND data_type = 'integer'
  ) THEN
    ALTER TABLE contact_submissions ALTER COLUMN guest_count TYPE text USING guest_count::text;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'contact_submissions' AND column_name = 'start_time'
  ) THEN
    ALTER TABLE contact_submissions ADD COLUMN start_time text;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'contact_submissions' AND column_name = 'duration'
  ) THEN
    ALTER TABLE contact_submissions ADD COLUMN duration text;
  END IF;
END $$;
