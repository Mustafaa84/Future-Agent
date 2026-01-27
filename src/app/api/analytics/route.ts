import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
    try {
        const { path, referrer } = await request.json();
        const userAgent = request.headers.get('user-agent');

        // Simple hash for IP to respect privacy but allow unique counting if needed later
        // In a real prod environment, you might use a library for this
        const ip = request.headers.get('x-forwarded-for') || 'unknown';

        const { error } = await supabase.from('page_views').insert({
            path,
            referrer: referrer || null,
            user_agent: userAgent,
            ip_hash: ip // Storing raw IP for now (simple), can hash if required
        });

        if (error) throw error;

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Analytics Error:', error);
        return NextResponse.json({ error: 'Failed to record view' }, { status: 500 });
    }
}
