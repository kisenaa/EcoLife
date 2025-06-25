// Supabase authentication helpers
import { supabase } from "./supabaseClient"

export async function signInWithEmail(email: string, password: string) {
  return supabase.auth.signInWithPassword({ email, password })
}

export async function signUpWithEmail(email: string, password: string) {
  return supabase.auth.signUp({ email, password })
}

export async function signOut() {
  return supabase.auth.signOut()
}

export function getCurrentUser() {
  return supabase.auth.getUser()
}

// Add this to your supabaseAuth.ts file
export async function updatePassword(newPassword: string) {
  return supabase.auth.updateUser({
    password: newPassword,
  })
}
