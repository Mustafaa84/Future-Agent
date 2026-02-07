import { createClient as createSupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

// ✅ Browser client (keep for client components)
export const supabase = createSupabaseClient(supabaseUrl, supabaseAnonKey)

// ✅ Server client function (for server actions)
export function createServerClient() {
  return createSupabaseClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
    },
  })
}

// ✅ Admin client (bypasses RLS)
export function createAdminClient() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!serviceRoleKey) {
    throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY')
  }

  return createSupabaseClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  })
}

// ✅ Retry Logic with Exponential Backoff
interface RetryOptions {
  maxRetries?: number
  baseDelayMs?: number
  onRetry?: (attempt: number, error: Error) => void
}

export async function withRetry<T>(
  operation: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const { maxRetries = 3, baseDelayMs = 500, onRetry } = options

  let lastError: Error | null = null

  for (let attempt = 1; attempt <= maxRetries + 1; attempt++) {
    try {
      return await operation()
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error))

      if (attempt <= maxRetries) {
        const delay = baseDelayMs * Math.pow(2, attempt - 1) // 500, 1000, 2000ms

        if (process.env.NODE_ENV === 'development') {
          console.warn(`[Retry ${attempt}/${maxRetries}] ${lastError.message} - waiting ${delay}ms`)
        }

        onRetry?.(attempt, lastError)
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }
  }

  throw lastError
}

// ✅ Helper for Supabase queries with retry
export async function fetchWithRetry<T>(
  queryFn: () => Promise<{ data: T | null; error: { message: string } | null }>,
  fallback: T
): Promise<T> {
  try {
    const result = await withRetry(async () => {
      const { data, error } = await queryFn()
      if (error) throw new Error(error.message)
      return data
    })
    return result ?? fallback
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[fetchWithRetry] All retries failed:', error)
    }
    return fallback
  }
}
