// Supabase data helpers (stub examples)
import { supabase } from "./supabaseClient"

// Example: Fetch user profile
export async function fetchUserProfile(userId: string) {
  return supabase.from("profiles").select("*").eq("id", userId).single()
}

// Example: Insert a new habit
export async function insertHabit(habit: { name: string; user_id: string }) {
  return supabase.from("habits").insert([habit])
}

// Example: Fetch habits for a user
export async function fetchHabits(userId: string) {
  return supabase.from("habits").select("*").eq("user_id", userId)
}
