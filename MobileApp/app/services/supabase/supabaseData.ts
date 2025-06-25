// Supabase data helpers (stub examples)
import { supabase } from "./supabaseClient"

// Insert a new habit (with all required columns)
export async function createHabit(habit: {
  user_id: string
  name: string
  reminder_start: string
  reminder_end?: string | null
  completed: number
  total: number
}) {
  return supabase.from("habits").insert([habit])
}

// Example: Fetch habits for a user
export async function fetchHabits(userId: string) {
  return supabase.from("habits").select("*").eq("user_id", userId)
}

// Update a habit (e.g., mark as done)
export async function updateHabit(
  habitId: number,
  updates: Partial<{
    name: string
    reminder_start: string
    reminder_end?: string | null
    completed: number
    total: number
  }>,
) {
  return supabase.from("habits").update(updates).eq("id", habitId)
}

// Edit a habit (update name, times, etc.)
export async function editHabit(
  habitId: number,
  updates: Partial<{
    name: string
    reminder_start: string
    reminder_end?: string | null
  }>,
) {
  return supabase.from("habits").update(updates).eq("id", habitId)
}

// Delete a habit by id
export async function deleteHabit(habitId: number) {
  return supabase.from("habits").delete().eq("id", habitId)
}

export async function fetchUserProfile(userId: string) {
  return supabase
    .from("profiles")
    .select("user_id, username, full_name, avatar_url, updated_at") // Explicitly select columns that exist
    .eq("user_id", userId)
    .single()
}

// Update user profile
export async function updateUserProfile(
  userId: string,
  updates: {
    username?: string
    full_name?: string
    avatar_url?: string
  },
) {
  return supabase
    .from("profiles")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("user_id", userId)
}

// Create user profile
export async function createUserProfile(profile: { user_id: string; username: string; full_name?: string; avatar_url?: string }) {
  return supabase.from("profiles").insert([profile])
}
