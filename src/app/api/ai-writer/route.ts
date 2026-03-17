import { NextRequest, NextResponse } from 'next/server'

const N8N_WEBHOOK = 'https://future-agent.app.n8n.cloud/webhook/seo-blog-writer'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const response = await fetch(N8N_WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(120000), // 2 min timeout
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: `n8n returned ${response.status}` },
        { status: 500 }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)

  } catch (err: any) {
    console.error('AI Writer proxy error:', err)
    return NextResponse.json(
      { error: err.message || 'Failed to reach n8n webhook' },
      { status: 500 }
    )
  }
}
