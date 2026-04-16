import { createBrowserClient } from '@supabase/ssr'
import { Database } from './types' // Assuming types are generated

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

/**
 * Creates a singleton-like browser client for Supabase in Next.js.
 */
export const supabase = createBrowserClient<Database>(
  supabaseUrl,
  supabaseAnonKey
)

export function createClient() {
  return createBrowserClient<Database>(
    supabaseUrl,
    supabaseAnonKey
  )
}
