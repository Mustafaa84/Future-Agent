import { supabase } from './src/lib/supabase'

async function debugData() {
    const { data, error } = await supabase
        .from('blog_posts')
        .select('slug, published, published_date')

    if (error) {
        console.error('Error:', error)
        return
    }

    console.log('--- BLOG SLUGS ---')
    data?.forEach(p => {
        console.log(`Slug: ${p.slug} | Published: ${p.published} | Date: ${p.published_date}`)
    })
}

debugData()
