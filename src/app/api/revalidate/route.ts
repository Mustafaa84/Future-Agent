import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'

export async function GET(request: NextRequest) {
    const path = request.nextUrl.searchParams.get('path')
    const token = request.nextUrl.searchParams.get('token')

    // Check for secret token to prevent unauthorized revalidation
    if (token !== process.env.REVALIDATION_TOKEN) {
        return NextResponse.json({ message: 'Invalid token' }, { status: 401 })
    }

    if (path) {
        revalidatePath(path)
        return NextResponse.json({ revalidated: true, now: Date.now() })
    }

    return NextResponse.json({
        revalidated: false,
        now: Date.now(),
        message: 'Missing path to revalidate',
    })
}
