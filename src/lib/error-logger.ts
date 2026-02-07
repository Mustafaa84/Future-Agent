/**
 * Centralized Error Logging Utility
 * Ready for Sentry/LogRocket integration
 */

type LogLevel = 'info' | 'warn' | 'error'

interface LogContext {
    page?: string
    action?: string
    userId?: string
    metadata?: Record<string, unknown>
}

interface ErrorLog {
    level: LogLevel
    message: string
    context: LogContext
    timestamp: string
    stack?: string
}

function formatLog(log: ErrorLog): string {
    const prefix = `[${log.level.toUpperCase()}] [${log.timestamp}]`
    const contextStr = log.context.page ? ` [${log.context.page}]` : ''
    return `${prefix}${contextStr} ${log.message}`
}

export function logError(
    error: Error | string,
    context: LogContext = {}
): void {
    const message = error instanceof Error ? error.message : error
    const stack = error instanceof Error ? error.stack : undefined

    const log: ErrorLog = {
        level: 'error',
        message,
        context,
        timestamp: new Date().toISOString(),
        stack,
    }

    if (process.env.NODE_ENV === 'development') {
        console.error(formatLog(log))
        if (stack) console.error(stack)
    } else {
        // Production: structured JSON for log aggregation
        console.error(JSON.stringify(log))
    }

    // TODO: Add Sentry/LogRocket integration here
    // Sentry.captureException(error, { extra: context })
}

export function logWarning(
    message: string,
    context: LogContext = {}
): void {
    const log: ErrorLog = {
        level: 'warn',
        message,
        context,
        timestamp: new Date().toISOString(),
    }

    if (process.env.NODE_ENV === 'development') {
        console.warn(formatLog(log))
    } else {
        console.warn(JSON.stringify(log))
    }
}

export function logInfo(
    message: string,
    context: LogContext = {}
): void {
    const log: ErrorLog = {
        level: 'info',
        message,
        context,
        timestamp: new Date().toISOString(),
    }

    if (process.env.NODE_ENV === 'development') {
        console.log(formatLog(log))
    }
    // In production, only log info if explicitly needed
}

// Affiliate-specific logging for revenue tracking
export function logAffiliateEvent(
    eventType: 'click' | 'redirect_success' | 'redirect_failure',
    toolSlug: string,
    metadata?: Record<string, unknown>
): void {
    const context: LogContext = {
        page: '/go/' + toolSlug,
        action: eventType,
        metadata,
    }

    if (eventType === 'redirect_failure') {
        logError(`Affiliate redirect failed for ${toolSlug}`, context)
    } else {
        logInfo(`Affiliate ${eventType}: ${toolSlug}`, context)
    }
}
