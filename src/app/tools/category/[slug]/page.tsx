import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'
import ToolsClient from '../../ToolsClient'
import { Metadata } from 'next'

interface ToolsCategoryPageProps {
    params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: ToolsCategoryPageProps): Promise<Metadata> {
    const { slug } = await params
    const { data: category } = await supabase
        .from('categories')
        .select('name, meta_title, meta_description')
        .eq('slug', slug)
        .single()

    if (!category) return { title: 'Category Not Found' }

    return {
        title: category.meta_title || `Best ${category.name} AI Tools - Ranked & Reviewed | Future Agent`,
        description: category.meta_description || `Discover and compare the top-rated ${category.name} AI tools. expert reviews, pricing, and honest recommendations to help you find the perfect solution.`,
    }
}

async function getTools() {
    const { data, error } = await supabase
        .from('ai_tools')
        .select('*')
        .eq('published', true)
        .lte('published_date', new Date().toISOString())
        .order('published_date', { ascending: false })
        .order('rating', { ascending: false })

    if (error) {
        console.error('Error fetching tools:', error)
        return []
    }

    return data || []
}

async function getCategories() {
    const { data, error } = await supabase
        .from('categories')
        .select('name, slug')
        .order('name', { ascending: true })

    if (error) {
        console.error('Error fetching categories:', error)
        return []
    }

    return data || []
}

export default async function ToolsCategoryPage({ params }: ToolsCategoryPageProps) {
    const { slug } = await params

    const [tools, categories] = await Promise.all([
        getTools(),
        getCategories()
    ])

    const category = categories.find(c => c.slug === slug)
    if (!category) {
        notFound()
    }

    return (
        <ToolsClient
            tools={tools}
            initialCategories={categories}
            initialCategory={category.slug}
        />
    )
}
