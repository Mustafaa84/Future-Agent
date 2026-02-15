
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase environment variables')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function fixComparisonImages() {
    console.log('Fetching comparison posts without featured images...')

    // Fetch posts that look like comparisons (slug contains -vs-) or category is Comparisons
    const { data: posts, error } = await supabase
        .from('blog_posts')
        .select('id, title, slug, featured_image')
        .ilike('slug', '%-vs-%')
    // .is('featured_image', null) // Force update all comparisons

    if (error) {
        console.error('Error fetching posts:', error)
        return
    }

    if (!posts || posts.length === 0) {
        console.log('No comparison posts found needing updates.')
        return
    }

    console.log(`Found ${posts.length} comparison posts to update.`)

    for (const post of posts) {
        // Attempt to extract tool names from title "ToolA vs ToolB..."
        // or just use slug parts
        let toolA = 'Tool A'
        let toolB = 'Tool B'

        // Try regex on title first: "Jasper vs Copy.ai: ..."
        const titleMatch = post.title.match(/(.*?) vs (.*?)(:| \-|$)/i)
        if (titleMatch) {
            toolA = titleMatch[1].trim()
            toolB = titleMatch[2].trim()
        } else {
            // Fallback to slug parsing
            const parts = post.slug.split('-vs-')
            if (parts.length >= 2) {
                toolA = parts[0].replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
                // Take first part after vs
                const secondPart = parts[1].split('-')[0] // simplistic
                // This fallback might be weak, but title regex should cover most
                toolB = parts[1].split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
            }
        }

        // Use the deployed URL or a hardcoded one if running locally against prod DB
        // Since this runs locally, we might not have a reliable "origin", but we can assume the production URL
        // OR use the local dev URL if testing locally. For safety, let's use the production domain if available, otherwise relative?
        // Actually, Supabase needs a full URL. Let's assume production for now or hardcode localhost if testing.
        // Use relative path so it works on both localhost and production
        // Next.js Image component handles this automatically
        const imageUrl = `/api/og?a=${encodeURIComponent(toolA)}&b=${encodeURIComponent(toolB)}`

        console.log(`Updating "${post.title}" with image: ${imageUrl}`)

        const { error: updateError } = await supabase
            .from('blog_posts')
            .update({ featured_image: imageUrl })
            .eq('id', post.id)

        if (updateError) {
            console.error(`Failed to update post ${post.id}:`, updateError)
        } else {
            console.log(`Successfully updated post ${post.id}`)
        }
    }
}

fixComparisonImages()
