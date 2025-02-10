import { createClient } from '@supabase/supabase-js';

// Ensure you have these variables set correctly in your environment
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;  // Ensure this is set in your .env.local file
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;  // Ensure this is set too

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default supabase;
