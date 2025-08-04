import { createClient } from "@supabase/supabase-js"
import type { Database } from "./supabase-types"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// Check if we're in demo mode
const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true'

// Only throw error if not in demo mode and missing credentials
if (!isDemoMode && (!supabaseUrl || !supabaseAnonKey || !serviceRoleKey)) {
  console.warn("Missing Supabase credentials. Running in demo mode with mock data.")
}

// Client-side Supabase client (singleton pattern)
let supabaseClient: ReturnType<typeof createClient<Database>> | null = null

export function getSupabaseClient() {
  if (!supabaseClient) {
    supabaseClient = createClient<Database>(supabaseUrl, supabaseAnonKey)
  }
  return supabaseClient
}

// Server-side Supabase client (can be created per request if needed, or a singleton for server actions)
// For server actions, it's often better to create a new client per action to avoid state issues.
export function createServerSupabaseClient() {
  return createClient<Database>(supabaseUrl, serviceRoleKey)
}

// Singleton pattern for the browser-side Supabase client
let supabaseBrowserClient: ReturnType<typeof createClient> | null = null

export function getSupabaseBrowserClient() {
  if (!supabaseBrowserClient) {
    supabaseBrowserClient = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    )
  }
  return supabaseBrowserClient
}

// Mock client for demo mode (if needed, otherwise remove)
const mockSupabaseClient = {
  auth: {
    signInWithPassword: async () => {
      return { data: { user: null }, error: null }
    },
    signOut: async () => {
      return { error: null }
    },
    getUser: async () => {
      return { data: { user: { id: "mock-user", email: "mock@example.com" } as any }, error: null }
    },
    onAuthStateChange: (callback: any) => {
      // Simulate initial state
      callback("INITIAL_SESSION", { user: { id: "mock-user", email: "mock@example.com" } as any })
      return {
        data: {
          subscription: {
            unsubscribe: () => {},
          },
        },
      }
    },
  },
  from: () => ({
    select: () => ({
      eq: () => ({
        single: () => ({ data: null, error: null }),
        limit: () => ({ data: [], error: null }),
      }),
      order: () => ({
        limit: () => ({ data: [], error: null }),
      }),
    }),
    insert: () => ({
      select: () => ({
        single: () => ({ data: null, error: null }),
      }),
    }),
    update: () => ({
      eq: () => ({
        select: () => ({
          single: () => ({ data: null, error: null }),
        }),
      }),
    }),
    delete: () => ({
      eq: () => ({
        select: () => ({
          single: () => ({ data: null, error: null }),
        }),
      }),
    }),
  }),
} as any

// Create a single supabase client for interacting with your database
export const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
)

export const publicSupabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
)
