import { supabase } from '@/lib/supabase'
import ToolsClient from './ToolsClient'

export const metadata = {
  title: 'AI Tools Directory - Compare the Best AI Software | Future Agent',
  description: 'Browse and compare the best AI tools for content creation, marketing, SEO, and automation. Expert reviews, pricing comparisons, and honest recommendations.',
}

// Fetch all published tools from Supabase
async function getAllTools() {
  const { data, error } = await supabase
    .from('ai_tools')
    .select('*')
    .eq('published', true)
    .lte('published_date', new Date().toISOString())  // Only show tools with date <= now
    .order('published_date', { ascending: false })    // Sort by publish date
    .order('rating', { ascending: false })            // Then by rating

  if (error) {
    console.error('Error fetching tools:', error)
    return []
  }

  return data || []
}


export default async function ToolsDirectoryPage() {
  const tools = await getAllTools()

  return <ToolsClient tools={tools} />
}
