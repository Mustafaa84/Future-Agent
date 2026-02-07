import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient, withRetry } from '@/lib/supabase'
import { logAffiliateEvent, logError } from '@/lib/error-logger'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const supabase = createAdminClient()
  const { slug } = await params

  if (!slug) {
    logAffiliateEvent('redirect_failure', 'unknown', { reason: 'missing slug' })
    return new NextResponse('Link not found', { status: 404 })
  }

  // Find affiliate link by slug (with retry)
  let link: { target_url: string; tool_id: string } | null = null

  try {
    link = await withRetry(async () => {
      const { data, error } = await supabase
        .from('affiliate_links')
        .select('target_url, tool_id')
        .eq('slug', slug)
        .single()

      if (error) throw new Error(error.message)
      return data
    })
  } catch (error) {
    logAffiliateEvent('redirect_failure', slug, {
      error: error instanceof Error ? error.message : 'Unknown error'
    })
    return new NextResponse('Link not found', { status: 404 })
  }

  if (!link) {
    logAffiliateEvent('redirect_failure', slug, { reason: 'link not found' })
    return new NextResponse('Link not found', { status: 404 })
  }

  // Log click (non-blocking with retry)
  const headers = req.headers
  const userIp = headers.get('x-forwarded-for') || headers.get('x-real-ip') || ''
  const userAgent = headers.get('user-agent') || ''
  const referrer = headers.get('referer') || ''

  // Fire and forget - don't block the redirect
  withRetry(async () => {
    const { error: clickError } = await supabase
      .from('affiliate_clicks')
      .insert({
        tool_id: link!.tool_id,
        tool_slug: slug,
        user_ip: userIp,
        user_agent: userAgent,
        referrer: referrer,
      })

    if (clickError) throw new Error(clickError.message)
  }).catch(err => {
    logError(err, { page: '/go/' + slug, action: 'click_insert' })
  })

  logAffiliateEvent('redirect_success', slug)
  return NextResponse.redirect(link.target_url, 302)
}
