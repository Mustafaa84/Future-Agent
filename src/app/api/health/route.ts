import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

interface HealthStatus {
    status: 'healthy' | 'degraded' | 'unhealthy'
    timestamp: string
    checks: {
        database: {
            status: 'ok' | 'error'
            responseTimeMs: number
            error?: string
        }
    }
    version: string
}

export async function GET() {
    const startTime = Date.now()
    const supabase = createAdminClient()

    let dbStatus: 'ok' | 'error' = 'error'
    let dbError: string | undefined
    let dbResponseTime = 0

    try {
        const dbStart = Date.now()
        const { error } = await supabase
            .from('categories')
            .select('*', { count: 'exact', head: true })

        dbResponseTime = Date.now() - dbStart

        if (error) {
            dbError = error.message
        } else {
            dbStatus = 'ok'
        }
    } catch (err) {
        dbError = err instanceof Error ? err.message : 'Unknown database error'
        dbResponseTime = Date.now() - startTime
    }

    const overallStatus: 'healthy' | 'degraded' | 'unhealthy' =
        dbStatus === 'ok' ? 'healthy' : 'unhealthy'

    const health: HealthStatus = {
        status: overallStatus,
        timestamp: new Date().toISOString(),
        checks: {
            database: {
                status: dbStatus,
                responseTimeMs: dbResponseTime,
                ...(dbError && { error: dbError }),
            },
        },
        version: process.env.npm_package_version || '1.0.0',
    }

    return NextResponse.json(health, {
        status: overallStatus === 'healthy' ? 200 : 503,
        headers: {
            'Cache-Control': 'no-store, no-cache, must-revalidate',
        },
    })
}
