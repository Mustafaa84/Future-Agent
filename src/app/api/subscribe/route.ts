import { createAdminClient } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'
import { applyRateLimit, RateLimitPresets, addRateLimitHeaders } from '@/lib/rate-limit'

export async function POST(request: NextRequest) {
    try {
        // ✅ SECURITY: Apply rate limiting - 5 requests per hour
        const rateLimitResponse = applyRateLimit(request, RateLimitPresets.SUBSCRIBE);
        if (rateLimitResponse) {
            return rateLimitResponse; // Return 429 if rate limited
        }

        const { email, source, quizData } = await request.json()

        // ✅ Strengthened email validation with comprehensive regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!email || typeof email !== 'string') {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 })
        }

        if (!emailRegex.test(email)) {
            return NextResponse.json({ error: 'Invalid email address format' }, { status: 400 })
        }

        // Use Admin Client to bypass RLS for public subscriptions
        const supabase = createAdminClient()

        // 1. Database Subscription (Primary System of Record)
        const { data: existing } = await supabase
            .from('newsletter_subscribers')
            .select('id')
            .eq('email', email)
            .single()

        if (!existing) {
            const { error } = await supabase
                .from('newsletter_subscribers')
                .insert({
                    email,
                    source: source || 'website',
                    meta: quizData || {},
                    created_at: new Date().toISOString(),
                })

            if (error) {
                console.error('Database Subscription Error:', error)
                // Proceed to MailerLite even if DB fails, but log it.
            }
        }

        // 2. MailerLite Integration
        const MAILERLITE_API_KEY = process.env.MAILERLITE_API_KEY
        const MAILERLITE_GROUP_ID = process.env.MAILERLITE_GROUP_ID

        if (MAILERLITE_API_KEY) {
            try {
                const mlResponse = await fetch('https://connect.mailerlite.com/api/subscribers', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${MAILERLITE_API_KEY}`,
                        'Accept': 'application/json',
                    },
                    body: JSON.stringify({
                        email,
                        groups: MAILERLITE_GROUP_ID ? [MAILERLITE_GROUP_ID] : [],
                        fields: {
                            source: source || 'website',
                        }
                    })
                })

                if (!mlResponse.ok) {
                    const errorText = await mlResponse.text()
                    console.error('MailerLite Error:', errorText)
                }
            } catch (mlError) {
                console.error('MailerLite Exception:', mlError)
            }
        }

        // ✅ Add rate limit headers to response
        const response = NextResponse.json({ success: true });
        return addRateLimitHeaders(response, request, RateLimitPresets.SUBSCRIBE);

    } catch (e) {
        console.error('API Error:', e)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
