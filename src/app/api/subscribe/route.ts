import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { email, source } = await request.json()

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
    }

    const apiKey = process.env.MAILERLITE_API_KEY
    const groupId = process.env.MAILERLITE_GROUP_ID

    if (!apiKey || !groupId) {
      return NextResponse.json({ error: 'Server not configured' }, { status: 500 })
    }

    const res = await fetch('https://connect.mailerlite.com/api/subscribers', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        groups: [groupId],
        fields: {
          signup_source: source || 'unknown',
        },
      }),
    })

    if (!res.ok) {
      const text = await res.text()
      console.error('MailerLite error:', text)
      return NextResponse.json({ error: 'Failed to subscribe' }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('subscribe error', err)
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 })
  }
}
