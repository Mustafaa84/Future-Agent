
import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase env vars')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function fixExcerpt() {
    const slug = 'surfer-seo-vs-writesonic-which-ai-tool-is-better-in-2026'
    const newExcerpt = 'Surfer SEO vs Writesonic: A detailed head-to-head comparison of features, pricing, and performance to help you choose the right AI SEO tool for 2026.'

    console.log(`Fixing excerpt for: ${slug}`)

    const { error } = await supabase
        .from('blog_posts')
        .update({ excerpt: newExcerpt })
        .eq('slug', slug)

    if (error) {
        console.error('Error updating excerpt:', error)
    } else {
        console.log('Successfully updated excerpt.')
    }
}

fixExcerpt()
