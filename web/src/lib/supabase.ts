import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface ServicePackage {
  id: string;
  name: string;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  description: string;
  price: number;
  features: string[];
  popular: boolean;
  display_order: number;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Addon {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface ContactSubmission {
  name: string;
  email: string;
  phone?: string;
  event_date?: string;
  event_type?: string;
  guest_count?: string;
  start_time?: string;
  end_time?: string;
  selected_package_id?: string;
  selected_addons?: string[];
  message?: string;
  total_estimate?: number;
}
