// js/supabase-config.js
// Replace these with your actual Supabase URL and Anon Key
// If these are left empty, the app will automatically fall back to localStorage for a seamless testing experience.

const SUPABASE_URL = '';
const SUPABASE_ANON_KEY = '';

if (SUPABASE_URL && SUPABASE_ANON_KEY && window.supabase) {
    window.supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    console.log("Supabase connected!");
} else {
    window.supabaseClient = null; // Will fallback to localStorage in db.js
    console.log("Using localStorage for database preview.");
}
