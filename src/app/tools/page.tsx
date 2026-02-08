import { fetchPublishedTools, fetchCategories } from '@/lib/data-fetching'
import ToolsClient from './ToolsClient'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Best AI Agents & Autonomous Software Directory | Future Agent',
  description: 'Browse and compare the world\'s most powerful autonomous AI agents. Expert reviews, feature comparisons, and implementation guides for agentic workflows.',
}

export default async function ToolsDirectoryPage() {
  const [tools, categories] = await Promise.all([
    fetchPublishedTools(),
    fetchCategories().then(cats => cats.filter(c => c.slug !== 'comparisons'))
  ])

  return <ToolsClient tools={tools} initialCategories={categories} />
}
