
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

const newCategories = [
    {
        slug: 'comparison',
        name: 'Comparison',
        description: 'Head-to-head battles between leading AI tools.',
        long_description: 'Which AI tool is truly the best for your workflow? We pit the industry giants against each other in detailed, data-driven comparisons. From pricing to performance, we break down everything you need to know before you subscribe.',
        icon: '⚔️',
        meta_title: 'AI Tool Comparisons - Detailed Head-to-Head Battles | Future Agent',
        meta_description: 'Compare the world\'s best AI tools. Detailed face-offs between Jasper vs Copy.ai, ChatGPT vs Claude, and more.'
    },
    {
        slug: 'ai-tools',
        name: 'AI Tools',
        description: 'The ultimate directory of artificial intelligence software.',
        long_description: 'Explore the fast-moving world of AI. Whether you need writing assistants, image generators, or automation bots, our directory features hand-picked tools rated and reviewed by experts.',
        icon: '🤖',
        meta_title: 'Best AI Tools Directory 2026 - Ranked & Reviewed | Future Agent',
        meta_description: 'Browse the ultimate AI tools directory. Discover, compare, and master the best AI solutions for business and creativity.'
    }
]

async function seedCategories() {
    console.log('Upserting categories...')
    const { data, error } = await supabase
        .from('categories')
        .upsert(newCategories, { onConflict: 'slug' })

    if (error) {
        console.error('Error seeding categories:', error)
    } else {
        console.log('Successfully seeded categories:', newCategories.map(c => c.slug).join(', '))
    }
}

seedCategories()
