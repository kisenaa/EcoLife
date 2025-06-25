// Supabase client singleton setup
import { mmkvAsyncStorage } from "@/utils/storage"
import { createClient } from "@supabase/supabase-js"

// Use environment variables for secrets (see .env.example)
const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || ""
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || ""

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn("Supabase URL or Anon Key is missing. Set them in your .env file.")
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true, // Enable session persistence
    autoRefreshToken: true, // Automatically refresh tokens
    detectSessionInUrl: false, // Disable session detection in URL
    storage: mmkvAsyncStorage,
  },
})
