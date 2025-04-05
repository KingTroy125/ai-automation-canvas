import { createClient } from '@supabase/supabase-js'

// Log the environment values to debug (these logs appear in your browser console)
console.log("Supabase URL env var exists:", !!import.meta.env.VITE_SUPABASE_URL);
console.log("Supabase ANON KEY env var exists:", !!import.meta.env.VITE_SUPABASE_ANON_KEY);

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase credentials - check your environment variables');
}

// Add these lines to debug the actual values
console.log("Using Supabase URL:", supabaseUrl?.substring(0, 10) + "...");
console.log("Using Supabase key length:", supabaseAnonKey?.length || 0);

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
})