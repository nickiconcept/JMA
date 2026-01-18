
import { createClient } from '@supabase/supabase-js';

// Access the global constants injected by Vite's define plugin
// We cast to string to satisfy TS if the declare in d.ts isn't picked up immediately
const supabaseUrl = (typeof __SUPABASE_URL__ !== 'undefined' ? __SUPABASE_URL__ : '') as string;
const supabaseAnonKey = (typeof __SUPABASE_ANON_KEY__ !== 'undefined' ? __SUPABASE_ANON_KEY__ : '') as string;

// Fallback for development/build safety
if (!supabaseUrl || !supabaseAnonKey || supabaseUrl === 'undefined') {
    console.warn("Supabase credentials missing. Ensure SUPABASE_URL and SUPABASE_ANON_KEY are set in your environment.");
}

export const supabase = createClient(
    (supabaseUrl && supabaseUrl !== 'undefined') ? supabaseUrl : 'https://placeholder.supabase.co', 
    (supabaseAnonKey && supabaseAnonKey !== 'undefined') ? supabaseAnonKey : 'placeholder'
);
