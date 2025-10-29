/*
  # Create Reviews System

  1. New Tables
    - `reviews`
      - `id` (uuid, primary key) - Unique identifier for each review
      - `reviewer_name` (text) - Name of the person giving the review
      - `review_text` (text) - The actual review content
      - `rating` (integer) - Rating out of 5 stars
      - `event_date` (date, optional) - When their event took place
      - `event_type` (text, optional) - Type of event (wedding, corporate, etc.)
      - `photo_urls` (jsonb, array) - Optional array of photo URLs from their event
      - `approved` (boolean) - Whether the review is approved to show on website
      - `submission_date` (timestamptz) - When the review was submitted
      - `created_at` (timestamptz) - Record creation timestamp
      - `updated_at` (timestamptz) - Record update timestamp

  2. Security
    - Enable RLS on `reviews` table
    - Add policy for public read access to only approved reviews
    - No public insert/update/delete access (reviews are managed by admin)

  3. Important Notes
    - Reviews are submitted via email and manually added by admin
    - Only approved reviews are visible on the public website
    - Rating must be between 1 and 5
    - Photo URLs stored as JSONB array for flexibility
*/

CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reviewer_name text NOT NULL,
  review_text text NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  event_date date,
  event_type text,
  photo_urls jsonb DEFAULT '[]'::jsonb,
  approved boolean DEFAULT false,
  submission_date timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view approved reviews"
  ON reviews
  FOR SELECT
  USING (approved = true);
