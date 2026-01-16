import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params

  if (!slug) {
    return new NextResponse('Link not found', { status: 404 })
  }

  // Find affiliate link by slug
  const { data: link, error } = await supabase
    .from('affiliate_links')
    .select('target_url, tool_id')
    .eq('slug', slug)
    .single()

  if (error || !link) {
    console.error('Affiliate redirect error:', error)
    return new NextResponse('Link not found', { status: 404 })
  }

  // Log click (non-blocking for the redirect)
  try {
    const headers = req.headers
    const userIp =
      headers.get('x-forwarded-for') ||
      headers.get('x-real-ip') ||
      ''
    const userAgent = headers.get('user-agent') || ''
    const referrer = headers.get('referer') || ''

    const { error: clickError } = await supabase
      .from('affiliate_clicks')
      .insert({
        tool_id: link.tool_id,
        tool_slug: slug,
        user_ip: userIp,
        user_agent: userAgent,
        referrer: referrer,
      })

    if (clickError) {
      console.error('Affiliate click insert error:', clickError)
    }
  } catch (e) {
    console.error('Failed to log affiliate click', e)
  }

  return NextResponse.redirect(link.target_url, 302)
}
