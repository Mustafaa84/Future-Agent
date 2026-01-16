import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export const revalidate = 3600 // Cache for 1 hour

export async function GET() {
  try {
    const { data: tags, error } = await supabase
      .from('tags')
      .select('id, slug, name, icon, color')
      .order('name', { ascending: true })

    if (error) throw error

    return NextResponse.json(tags)
  } catch (error) {
    console.error('Error fetching tags:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tags' },
      { status: 500 }
    )
  }
}
