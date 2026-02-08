
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(__dirname, '../../.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function inspectAiTools() {
    console.log('--- Inspecting AI Tools ---')
    console.log('Current Server Time (ISO):', new Date().toISOString())

    const { data: tools, error } = await supabase
        .from('ai_tools')
        .select('id, name, published, published_date')
        .order('published_date', { ascending: false })

    if (error) {
        console.error('Error fetching tools:', error)
        return
    }

    console.log(`Found ${tools?.length} total tools.`)

    tools?.forEach(tool => {
        const isPublished = tool.published
        const pubDate = tool.published_date ? new Date(tool.published_date) : null
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

        console.log(`[${status}] ${tool.name}`)
        console.log(`\tpublished: ${tool.published}, date: ${tool.published_date}`)
    })

    const visibleCount = tools?.filter(t => t.published && t.published_date && new Date(t.published_date) <= new Date()).length
    const futureCount = tools?.filter(t => t.published && t.published_date && new Date(t.published_date) > new Date()).length
    const draftCount = tools?.filter(t => !t.published).length
    const noDateCount = tools?.filter(t => t.published && !t.published_date).length

    console.log('\n--- SUMMARY ---')
    console.log(`Total in DB: ${tools?.length}`)
    console.log(`Visible (Published & Past): ${visibleCount}`)
    console.log(`Future (Scheduled): ${futureCount}`)
    console.log(`Drafts: ${draftCount}`)
    console.log(`Broken (Published but No Date): ${noDateCount}`)
}

inspectAiTools()
