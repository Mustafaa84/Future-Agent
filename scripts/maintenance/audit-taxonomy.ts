
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

async function auditTaxonomy() {
    console.log('--- TAXONOMY AUDIT ---')

    // 1. Master Categories Table
    const { data: categories } = await supabase.from('categories').select('name, slug')
    console.log('\n[categories] Table entries:')
    console.table(categories)

    // 2. AI Tools Usage
    const { data: tools } = await supabase.from('ai_tools').select('category')
    const toolCats = [...new Set(tools?.map(t => t.category))].filter(Boolean)
    console.log('\n[ai_tools] Unique categories used:')
    console.log(toolCats)

    // 3. Blog Posts Usage
    const { data: posts } = await supabase.from('blog_posts').select('category, category_slug')
    const blogCats = posts?.reduce((acc: any[], p) => {
        if (!acc.find(item => item.name === p.category && item.slug === p.category_slug)) {
            acc.push({ name: p.category, slug: p.category_slug })
        }
        return acc
    }, [])
    console.log('\n[blog_posts] Unique category/slug pairs used:')
    console.table(blogCats)

    console.log('\n--- AUDIT END ---')
}

auditTaxonomy()
