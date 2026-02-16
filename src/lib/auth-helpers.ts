import { createServerClient } from '@/lib/supabase'
import { cookies } from 'next/headers'
import { NextRequest } from 'next/server'

/**
 * Verify that the request is from an authenticated admin user
 * Returns the user session if authenticated, throws error otherwise
 */
export async function verifyAdminAuth(request: NextRequest) {
    try {
        // Get cookies from the request
        const cookieStore = await cookies()

        // Create a server client with proper cookie handling
        const supabase = createServerClient()

        // Get the current session
        const {
            data: { session },
            error,
        } = await supabase.auth.getSession()

        if (error) {
            throw new Error(`Authentication error: ${error.message}`)
        }

        if (!session || !session.user) {
            throw new Error('Unauthorized: No active session')
        }

        // Return the session for further use
        return { session, user: session.user }
    } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error))
        throw new Error(`Authentication failed: ${err.message}`)
    }
}

/**
 * Alternative token-based authentication for API routes
 * Checks for Authorization header with Bearer token
 */
export async function verifyAdminToken(request: NextRequest) {
    const authHeader = request.headers.get('Authorization')
    const adminToken = process.env.ADMIN_API_TOKEN

    if (!adminToken) {
        throw new Error('Server configuration error: ADMIN_API_TOKEN not set')
    }

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new Error('Unauthorized: Missing or invalid authorization header')
    }

    const token = authHeader.substring(7) // Remove 'Bearer ' prefix

    if (token !== adminToken) {
        throw new Error('Unauthorized: Invalid token')
    }

    return true
}
