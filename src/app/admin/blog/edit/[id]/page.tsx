import BlogPostForm from '../../BlogPostForm'
import { createAdminClient } from '@/lib/supabase'


export default async function EditBlogPostPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = createAdminClient()

  const { data: post } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('id', id)
    .single()


  if (!post) {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <p className="text-red-400">Post not found</p>
      </div>
    )
  }


  return <BlogPostForm initialData={{
    id: post.id,
    title: post.title || '',
    slug: post.slug || '',
    content: post.content || '',
    excerpt: post.excerpt || '',
    author: post.author || '',
    category: post.category || 'AI Tools',
    tags: post.tags || [],
    featured_image: post.featured_image || '',
    // Check if post is effectively scheduled (published=true BUT date is in future)
    status: (post.published && post.published_date && new Date(post.published_date) > new Date())
      ? 'scheduled'
      : (post.published ? 'published' : 'draft'),
    meta_title: post.meta_title || '',
    meta_description: post.meta_description || '',
    reading_time: post.reading_time || 5
  }} />
}
