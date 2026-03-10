import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { createHash } from 'crypto';
import { applyRateLimit, RateLimitPresets, addRateLimitHeaders } from '@/lib/rate-limit';

/**
 * Hash IP address for privacy compliance (GDPR)
 * Uses SHA-256 to create a consistent but non-reversible hash
 */
function hashIP(ip: string): string {
    if (!ip || ip === 'unknown') return 'unknown';
    return createHash('sha256').update(ip).digest('hex');
}

export async function POST(request: NextRequest) {
    try {
        // ✅ SECURITY: Apply rate limiting - 100 requests per minute
        const rateLimitResponse = applyRateLimit(request, RateLimitPresets.ANALYTICS);
        if (rateLimitResponse) {
            return rateLimitResponse;
        }

        const { path, referrer } = await request.json();
        const userAgent = request.headers.get('user-agent');

        // ✅ GDPR Compliant: Hash IP address instead of storing raw IP
        const rawIP = request.headers.get('x-forwarded-for') || 'unknown';
        const hashedIP = hashIP(rawIP);

        const { error } = await supabase.from('page_views').insert({
            path,
            referrer: referrer || null,
            user_agent: userAgent,
            ip_hash: hashedIP // ✅ Now stores hashed IP
        });

        if (error) throw error;

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Analytics Error:', error);
        return NextResponse.json({ error: 'Failed to record view' }, { status: 500 });
    }
}
