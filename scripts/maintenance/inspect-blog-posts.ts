
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(__dirname, '../../.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function inspectBlogPosts() {
    console.log('--- Inspecting Blog Posts ---')
    console.log('Current Server Time (ISO):', new Date().toISOString())

    const { data: posts, error } = await supabase
        .from('blog_posts')
        .select('id, title, published, published_date')
        .order('published_date', { ascending: false })

    if (error) {
        console.error('Error fetching posts:', error)
        return
    }

    console.log(`Found ${posts?.length} total posts.`)

    posts?.forEach(post => {
        const isPublished = post.published
        const pubDate = post.published_date ? new Date(post.published_date) : null
        const now = new Date()

        let status = 'UNKNOWN'
        if (!isPublished) {
            status = 'DRAFT (published=false)'
        } else if (!pubDate) {
            status = 'INVALID (no date)'
        } else if (pubDate > now) {
            status = `SCHEDULED (Future: ${pubDate.toISOString()})`
        } else {
            status = 'VISIBLE (Published & Past)'
        }

        console.log(`[${status}] ${post.title}`)
        console.log(`\tpublished: ${post.published}, date: ${post.published_date}`)
    })

    const visibleCount = posts?.filter(p => p.published && p.published_date && new Date(p.published_date) <= new Date()).length
    const futureCount = posts?.filter(p => p.published && p.published_date && new Date(p.published_date) > new Date()).length
    const draftCount = posts?.filter(p => !p.published).length
    const noDateCount = posts?.filter(p => p.published && !p.published_date).length

    console.log('\n--- SUMMARY ---')
    console.log(`Total in DB: ${posts?.length}`)
    console.log(`Visible (Published & Past): ${visibleCount}`)
    console.log(`Future (Scheduled): ${futureCount}`)
    console.log(`Drafts: ${draftCount}`)
    console.log(`Broken (Published but No Date): ${noDateCount}`)
}

inspectBlogPosts()
