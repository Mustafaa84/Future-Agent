
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(__dirname, '../../.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function fixNullDates() {
    console.log('--- Repairing Null Published Dates ---')

    // 1. Fetch posts with published=true AND published_date=null
    const { data: posts, error } = await supabase
        .from('blog_posts')
        .select('id, title, created_at')
        .eq('published', true)
        .is('published_date', null)

    if (error) {
        console.error('Error fetching broken posts:', error)
        return
    }

    console.log(`Found ${posts?.length} posts to repair.`)

    // 2. Update them
    for (const post of posts || []) {
        const fallbackDate = post.created_at || new Date().toISOString()

        const { error: updateError } = await supabase
            .from('blog_posts')
            .update({ published_date: fallbackDate })
            .eq('id', post.id)

        if (updateError) {
            console.error(`Failed to update [${post.title}]:`, updateError)
        } else {
            console.log(`Fixed: [${post.title}] -> set published_date to ${fallbackDate}`)
        }
    }
}

fixNullDates()
