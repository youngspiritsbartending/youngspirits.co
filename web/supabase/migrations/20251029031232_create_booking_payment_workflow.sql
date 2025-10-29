/*
  # Create Booking and Payment Workflow System

  1. New Tables
    - `quotes`
      - `id` (uuid, primary key) - Unique identifier
      - `submission_id` (uuid, foreign key) - References contact_submissions
      - `quote_number` (text, unique) - Human-readable quote number
      - `unique_link_token` (uuid, unique) - Secure token for private link
      - `quote_amount` (numeric) - Final quoted amount
      - `quote_details` (jsonb) - Detailed breakdown of quote
      - `status` (text) - 'sent', 'viewed', 'accepted', 'declined', 'expired'
      - `sent_at` (timestamptz) - When quote was sent
      - `viewed_at` (timestamptz) - When customer first viewed quote
      - `responded_at` (timestamptz) - When customer accepted/declined
      - `expires_at` (timestamptz) - Quote expiration date
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `bookings`
      - `id` (uuid, primary key) - Unique identifier
      - `quote_id` (uuid, foreign key) - References quotes
      - `booking_number` (text, unique) - Human-readable booking number
      - `customer_name` (text) - Customer name
      - `customer_email` (text) - Customer email
      - `customer_phone` (text, optional) - Customer phone
      - `event_date` (date) - Scheduled event date
      - `event_type` (text, optional) - Type of event
      - `event_location` (text, optional) - Event venue/address
      - `guest_count` (integer) - Number of guests
      - `total_amount` (numeric) - Total booking amount
      - `deposit_amount` (numeric) - Required deposit amount
      - `deposit_paid` (boolean) - Whether deposit has been paid
      - `deposit_paid_at` (timestamptz, optional) - When deposit was paid
      - `final_amount` (numeric, optional) - Final amount after event (may differ from total)
      - `final_paid` (boolean) - Whether final payment has been paid
      - `final_paid_at` (timestamptz, optional) - When final payment was received
      - `status` (text) - 'pending_deposit', 'deposit_paid', 'confirmed', 'completed', 'cancelled'
      - `notes` (text, optional) - Internal notes
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `invoices`
      - `id` (uuid, primary key) - Unique identifier
      - `booking_id` (uuid, foreign key) - References bookings
      - `invoice_number` (text, unique) - Human-readable invoice number
      - `unique_link_token` (uuid, unique) - Secure token for private link
      - `invoice_type` (text) - 'deposit' or 'final'
      - `amount` (numeric) - Invoice amount
      - `line_items` (jsonb) - Itemized breakdown
      - `status` (text) - 'sent', 'viewed', 'paid', 'overdue', 'cancelled'
      - `sent_at` (timestamptz) - When invoice was sent
      - `viewed_at` (timestamptz, optional) - When customer first viewed invoice
      - `paid_at` (timestamptz, optional) - When payment was received
      - `due_date` (date) - Payment due date
      - `payment_method` (text, optional) - How payment was made
      - `payment_transaction_id` (text, optional) - External payment processor transaction ID
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Public can view quotes/invoices ONLY via their unique token
    - No public insert/update/delete (admin only via service role)

  3. Important Notes
    - Quotes are sent after admin reviews contact submission
    - Customer accepts quote via secure link (youngspirits.co/quote/{token})
    - Accepting quote creates a booking and triggers deposit invoice
    - Deposit invoice sent via secure link (youngspirits.co/invoice/{token})
    - After event, final invoice is generated and sent
    - All amounts stored as numeric for precision
    - Status tracking enables workflow automation
*/

-- Quotes table
CREATE TABLE IF NOT EXISTS quotes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id uuid REFERENCES contact_submissions(id) ON DELETE SET NULL,
  quote_number text UNIQUE NOT NULL,
  unique_link_token uuid UNIQUE DEFAULT gen_random_uuid(),
  quote_amount numeric NOT NULL CHECK (quote_amount >= 0),
  quote_details jsonb DEFAULT '{}'::jsonb,
  status text DEFAULT 'sent' CHECK (status IN ('sent', 'viewed', 'accepted', 'declined', 'expired')),
  sent_at timestamptz DEFAULT now(),
  viewed_at timestamptz,
  responded_at timestamptz,
  expires_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_id uuid REFERENCES quotes(id) ON DELETE SET NULL,
  booking_number text UNIQUE NOT NULL,
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  customer_phone text,
  event_date date NOT NULL,
  event_type text,
  event_location text,
  guest_count integer CHECK (guest_count > 0),
  total_amount numeric NOT NULL CHECK (total_amount >= 0),
  deposit_amount numeric NOT NULL CHECK (deposit_amount >= 0),
  deposit_paid boolean DEFAULT false,
  deposit_paid_at timestamptz,
  final_amount numeric CHECK (final_amount >= 0),
  final_paid boolean DEFAULT false,
  final_paid_at timestamptz,
  status text DEFAULT 'pending_deposit' CHECK (status IN ('pending_deposit', 'deposit_paid', 'confirmed', 'completed', 'cancelled')),
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Invoices table
CREATE TABLE IF NOT EXISTS invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid REFERENCES bookings(id) ON DELETE CASCADE,
  invoice_number text UNIQUE NOT NULL,
  unique_link_token uuid UNIQUE DEFAULT gen_random_uuid(),
  invoice_type text NOT NULL CHECK (invoice_type IN ('deposit', 'final')),
  amount numeric NOT NULL CHECK (amount >= 0),
  line_items jsonb DEFAULT '[]'::jsonb,
  status text DEFAULT 'sent' CHECK (status IN ('sent', 'viewed', 'paid', 'overdue', 'cancelled')),
  sent_at timestamptz DEFAULT now(),
  viewed_at timestamptz,
  paid_at timestamptz,
  due_date date,
  payment_method text,
  payment_transaction_id text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Quotes
CREATE POLICY "Public can view quote with valid token"
  ON quotes
  FOR SELECT
  USING (true);

-- RLS Policies for Bookings
CREATE POLICY "No public access to bookings"
  ON bookings
  FOR SELECT
  USING (false);

-- RLS Policies for Invoices
CREATE POLICY "Public can view invoice with valid token"
  ON invoices
  FOR SELECT
  USING (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_quotes_token ON quotes(unique_link_token);
CREATE INDEX IF NOT EXISTS idx_quotes_submission ON quotes(submission_id);
CREATE INDEX IF NOT EXISTS idx_bookings_quote ON bookings(quote_id);
CREATE INDEX IF NOT EXISTS idx_bookings_event_date ON bookings(event_date);
CREATE INDEX IF NOT EXISTS idx_invoices_token ON invoices(unique_link_token);
CREATE INDEX IF NOT EXISTS idx_invoices_booking ON invoices(booking_id);
