
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

async function fixComparisons() {
    console.log('--- FIXING COMPARISONS ---')

    // 1. Update Blog Posts (category column)
    const { error: error1 } = await supabase
        .from('blog_posts')
        .update({ category: 'Comparisons' })
        .eq('category', 'Comparison')

    if (error1) console.error('Error 1:', error1)
    else console.log('Updated "Comparison" -> "Comparisons" (name)')

    // 2. Update Blog Posts (slug column)
    const { error: error2 } = await supabase
        .from('blog_posts')
        .update({ category_slug: 'comparisons' })
        .eq('category_slug', 'comparison')

    if (error2) console.error('Error 2:', error2)
    else console.log('Updated "comparison" -> "comparisons" (slug)')

    // 3. Update Tools (just in case)
    const { error: error3 } = await supabase
        .from('ai_tools')
        .update({ category: 'Comparisons' })
        .eq('category', 'Comparison')

    if (error3) console.error('Error 3:', error3)
    else console.log('Updated Tools "Comparison" -> "Comparisons"')

    console.log('--- FIX COMPLETE ---')
}

fixComparisons()
