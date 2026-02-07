import { createAdminClient } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    try {
        const { email, source, quizData } = await request.json()

        if (!email || !email.includes('@')) {
            return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
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

        return NextResponse.json({ success: true })

    } catch (e) {
        console.error('API Error:', e)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
