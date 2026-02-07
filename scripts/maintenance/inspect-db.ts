// Quick diagnostic script to check categories and tools
import { supabase } from './src/lib/supabase'

async function inspectDatabase() {
    console.log('=== CATEGORIES ===')
    const { data: categories } = await supabase
        .from('categories')
        .select('slug, name')
        .order('name')

    if (categories) {
        categories.forEach(cat => {
            console.log(`${cat.slug} → ${cat.name}`)
        })
    }

    console.log('\n=== TOOLS BY CATEGORY ===')
    const { data: tools } = await supabase
        .from('ai_tools')
        .select('name, category, slug, tags')
        .eq('published', true)
        .order('category')

    if (tools) {
        const byCategory: Record<string, string[]> = {}
        tools.forEach(tool => {
            const cat = tool.category || 'No Category'
            if (!byCategory[cat]) byCategory[cat] = []
            byCategory[cat].push(tool.name)
        })

        Object.entries(byCategory).forEach(([cat, toolNames]) => {
            console.log(`\n${cat} (${toolNames.length} tools):`)
            toolNames.forEach(name => console.log(`  - ${name}`))
        })
    }

    console.log('\n=== SAMPLE TOOL DATA ===')
    const { data: sampleTools } = await supabase
        .from('ai_tools')
        .select('name, category, tags')
        .eq('published', true)
        .limit(10)

    if (sampleTools) {
        sampleTools.forEach(tool => {
            console.log(`${tool.name}: category="${tool.category}", tags=${JSON.stringify(tool.tags)}`)
        })
    }

    process.exit(0)
}

inspectDatabase()
