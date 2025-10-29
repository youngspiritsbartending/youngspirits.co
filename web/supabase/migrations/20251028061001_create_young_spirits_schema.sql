/*
  # Young Spirits Mobile Bartending Database Schema

  1. New Tables
    - `service_packages`
      - `id` (uuid, primary key)
      - `name` (text) - Package name
      - `tier` (text) - Package tier (bronze, silver, gold, platinum)
      - `description` (text) - Package description
      - `price` (numeric) - Base price
      - `features` (jsonb) - Array of features included
      - `popular` (boolean) - Mark as popular package
      - `display_order` (integer) - Order to display packages
      - `active` (boolean) - Whether package is currently offered
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `addons`
      - `id` (uuid, primary key)
      - `name` (text) - Addon name
      - `description` (text) - Addon description
      - `price` (numeric) - Addon price
      - `category` (text) - Category (premium_spirits, equipment, staff, other)
      - `active` (boolean) - Whether addon is currently offered
      - `display_order` (integer) - Order to display addons
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `contact_submissions`
      - `id` (uuid, primary key)
      - `name` (text) - Contact name
      - `email` (text) - Contact email
      - `phone` (text) - Contact phone
      - `event_date` (date) - Desired event date
      - `event_type` (text) - Type of event
      - `guest_count` (integer) - Number of guests
      - `selected_package_id` (uuid) - Selected package reference
      - `selected_addons` (jsonb) - Array of selected addon IDs
      - `message` (text) - Additional message
      - `total_estimate` (numeric) - Estimated total
      - `status` (text) - Submission status (new, contacted, booked, closed)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Public read access for packages and addons (they're catalog items)
    - Public insert access for contact submissions (form submissions)
    - Only authenticated users can update contact submissions (admin access)

  3. Indexes
    - Index on active status for packages and addons for efficient queries
    - Index on contact submission status for admin filtering
*/

-- Create service_packages table
CREATE TABLE IF NOT EXISTS service_packages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  tier text NOT NULL,
  description text NOT NULL,
  price numeric NOT NULL CHECK (price >= 0),
  features jsonb DEFAULT '[]'::jsonb,
  popular boolean DEFAULT false,
  display_order integer DEFAULT 0,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create addons table
CREATE TABLE IF NOT EXISTS addons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  price numeric NOT NULL CHECK (price >= 0),
  category text NOT NULL,
  active boolean DEFAULT true,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create contact_submissions table
CREATE TABLE IF NOT EXISTS contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  event_date date,
  event_type text,
  guest_count integer,
  selected_package_id uuid REFERENCES service_packages(id),
  selected_addons jsonb DEFAULT '[]'::jsonb,
  message text,
  total_estimate numeric DEFAULT 0,
  status text DEFAULT 'new',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE service_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE addons ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for service_packages
CREATE POLICY "Anyone can view active packages"
  ON service_packages FOR SELECT
  USING (active = true);

CREATE POLICY "Authenticated users can manage packages"
  ON service_packages FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- RLS Policies for addons
CREATE POLICY "Anyone can view active addons"
  ON addons FOR SELECT
  USING (active = true);

CREATE POLICY "Authenticated users can manage addons"
  ON addons FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- RLS Policies for contact_submissions
CREATE POLICY "Anyone can submit contact form"
  ON contact_submissions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view submissions"
  ON contact_submissions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update submissions"
  ON contact_submissions FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_packages_active ON service_packages(active, display_order);
CREATE INDEX IF NOT EXISTS idx_addons_active ON addons(active, category, display_order);
CREATE INDEX IF NOT EXISTS idx_submissions_status ON contact_submissions(status, created_at DESC);

-- Insert sample service packages
INSERT INTO service_packages (name, tier, description, price, features, popular, display_order) VALUES
  ('Essential', 'bronze', 'Perfect for intimate gatherings', 499, '["Professional bartender for 4 hours", "Basic bar setup", "Standard glassware", "Ice and garnishes", "Serves up to 50 guests"]'::jsonb, false, 1),
  ('Premium', 'silver', 'Elevated experience for your celebration', 899, '["Professional bartender for 5 hours", "Premium bar setup with backdrop", "Premium glassware", "Ice, garnishes, and mixers", "Custom cocktail menu (3 signature drinks)", "Serves up to 100 guests"]'::jsonb, true, 2),
  ('Luxury', 'gold', 'Sophisticated service for discerning hosts', 1499, '["Two professional bartenders for 6 hours", "Luxury bar setup with LED lighting", "Crystal glassware", "Premium ice, garnishes, and house-made syrups", "Custom cocktail menu (5 signature drinks)", "Welcome cocktail service", "Serves up to 150 guests"]'::jsonb, false, 3),
  ('Elite', 'platinum', 'The ultimate bartending experience', 2499, '["Three professional bartenders for 8 hours", "Full luxury bar with custom branding", "Crystal and specialty glassware", "Premium everything including molecular garnishes", "Unlimited custom cocktails", "Welcome cocktail + champagne service", "Cocktail workshop for guests", "Professional beverage consultation", "Serves up to 200 guests"]'::jsonb, false, 4);

-- Insert sample addons
INSERT INTO addons (name, description, price, category, display_order) VALUES
  ('Premium Spirits Upgrade', 'Upgrade to top-shelf liquors including Grey Goose, Patron, and Macallan', 300, 'premium_spirits', 1),
  ('Champagne Service', 'Premium champagne toast service with Moët & Chandon', 250, 'premium_spirits', 2),
  ('Craft Beer Selection', 'Curated selection of 6 craft beers on tap', 400, 'premium_spirits', 3),
  ('Additional Bartender', 'Add an extra professional bartender for the duration', 350, 'staff', 4),
  ('Extended Hours', 'Add 2 additional hours of service', 200, 'staff', 5),
  ('Mobile Draft System', 'Professional draft beer system with 4 taps', 500, 'equipment', 6),
  ('LED Bar Package', 'Illuminated bar setup with customizable LED lighting', 350, 'equipment', 7),
  ('Specialty Glassware', 'Unique glassware for specialty cocktails (coupes, tiki mugs, etc.)', 150, 'equipment', 8),
  ('Molecular Mixology Kit', 'Liquid nitrogen, smoke, and molecular garnishes', 450, 'other', 9),
  ('Non-Alcoholic Bar', 'Complete mocktail menu with premium mixers and garnishes', 200, 'other', 10);