import { supabase } from '@/lib/supabase'

export interface Category {
  id?: string
  slug: string
  name: string
  description: string
  longDescription: string
  icon: string
  metaTitle: string
  metaDescription: string
}

// Fetch all categories from Supabase (server-side)
export async function getAllCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name', { ascending: true })

  if (error) {
    console.error('Error fetching categories:', error)
    return []
  }

  return data.map(row => ({
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description,
    longDescription: row.long_description,
    icon: row.icon,
    metaTitle: row.meta_title,
    metaDescription: row.meta_description,
  }))
}

// Fetch category by slug
export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error || !data) {
    console.error('Error fetching category:', error)
    return null
  }

  return {
    id: data.id,
    slug: data.slug,
    name: data.name,
    description: data.description,
    longDescription: data.long_description,
    icon: data.icon,
    metaTitle: data.meta_title,
    metaDescription: data.meta_description,
  }
}

// Map category name to slug (useful for dynamic tool categories)
export async function getCategorySlugFromName(categoryName: string): Promise<string> {
  const { data } = await supabase
    .from('categories')
    .select('slug')
    .eq('name', categoryName)
    .single()

  if (data?.slug) {
    return data.slug
  }

  // Fallback: convert name to slug if not found
  return categoryName.toLowerCase().replace(/\s+/g, '-')
}
