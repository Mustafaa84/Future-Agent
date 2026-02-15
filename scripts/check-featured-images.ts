
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

async function checkFeaturedImages() {
  console.log('Fetching latest 3 published blog posts...')
  const { data: posts, error } = await supabase
    .from('blog_posts')
    .select('id, title, slug, featured_image, published_date')
    .eq('published', true)
    .lte('published_date', new Date().toISOString())
    .order('created_at', { ascending: false })
    .limit(3)

  if (error) {
    console.error('Error fetching posts:', error)
    return
  }

  if (!posts || posts.length === 0) {
    console.log('No published posts found.')
    return
  }

  console.log(`Found ${posts.length} posts:`)
  posts.forEach(post => {
    console.log(`- Title: ${post.title}`)
    console.log(`  Slug: ${post.slug}`)
    console.log(`  Featured Image: ${post.featured_image ? post.featured_image : 'MISSING (null/empty)'}`)
  })
}

checkFeaturedImages()
