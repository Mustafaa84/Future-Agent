
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

// Helper to generate slug from name
function generateSlug(name: string): string {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()
}

async function syncAllCategories() {
    console.log('--- Category Sync Start ---')

    // 1. Get current categories in DB
    const { data: dbCategories } = await supabase.from('categories').select('slug, name')
    const dbSlugSet = new Set(dbCategories?.map(c => c.slug) || [])

    // 2. Get all categories used in Blog Posts
    const { data: blogPosts } = await supabase.from('blog_posts').select('category, category_slug')
    const blogCats = new Map<string, string>()
    blogPosts?.forEach(p => {
        if (p.category && p.category_slug) blogCats.set(p.category_slug, p.category)
        else if (p.category) blogCats.set(generateSlug(p.category), p.category)
    })

    // 3. Get all categories used in Tools
    const { data: tools } = await supabase.from('ai_tools').select('category')
    const toolCats = new Map<string, string>()
    tools?.forEach(t => {
        if (t.category) {
            const slug = generateSlug(t.category);
            if (!blogCats.has(slug)) {
                toolCats.set(slug, t.category)
            }
        }
    })

    // 4. Combine and check for missing
    const allNeeded = new Map([...blogCats, ...toolCats])
    const toAdd = []

    for (const [slug, name] of allNeeded.entries()) {
        if (!dbSlugSet.has(slug)) {
            console.log(`Found missing category: ${name} (${slug})`)
            toAdd.push({
                slug,
                name,
                description: `${name} AI tools and resources.`,
                long_description: `Master the world of ${name} with our expert guides and hand-picked AI tools. We explore the latest innovations in ${name} to help you find the perfect solutions for your business or creative projects. Join our community as we dive deep into the best ${name} technologies currently available.`,
                icon: '📁',
                meta_title: `Best ${name} AI Tools - Updated 2026 | Future Agent`,
                meta_description: `Explore the top-rated ${name} AI tools. Read expert reviews and find the best solutions for your workflow.`
            })
        }
    }

    if (toAdd.length > 0) {
        console.log(`Upserting ${toAdd.length} categories...`)
        const { error } = await supabase.from('categories').upsert(toAdd, { onConflict: 'slug' })
        if (error) console.error('Error upserting:', error)
        else console.log('Successfully synced categories:', toAdd.map(c => c.slug).join(', '))
    } else {
        console.log('All categories are correctly synced!')
    }

    console.log('--- Category Sync End ---')
}

syncAllCategories()
