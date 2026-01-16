'use client'

import { useMemo, useState } from 'react'
import { AffiliateLinkForm } from './AffiliateLinkForm'

type ToolClickStats = {
  total: number
  last7: number
  thisMonth: number
}

type Row = {
  tool: {
    id: string
    name: string
    slug: string
    published: boolean
  }
  link?: {
    id: string
    tool_id: string
    slug: string
    target_url: string
  }
  defaultSlug: string
  stats: ToolClickStats
}

type AffiliateLinksTableProps = {
  rows: Row[]
}

type SortColumn = 'name' | 'total' | 'last7' | 'thisMonth'

// ✅ FIXED: SortIcon component - defined OUTSIDE to avoid recreation during render
interface SortIconProps {
  column: SortColumn
  sortColumn: SortColumn
  sortDirection: 'asc' | 'desc'
}

function SortIcon({ column, sortColumn, sortDirection }: SortIconProps) {
  if (sortColumn !== column) return <span className="text-slate-600 ml-1">↕</span>
  return <span className="text-cyan-400 ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
}

export function AffiliateLinksTable({ rows }: AffiliateLinksTableProps) {
  const [query, setQuery] = useState('')
  const [sortColumn, setSortColumn] = useState<SortColumn>('total')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')

  const filteredRows = useMemo(() => {
    const q = query.trim().toLowerCase()
    let filtered = rows

    if (q) {
      filtered = rows.filter(({ tool }) => {
        const name = tool.name.toLowerCase()
        const slug = tool.slug.toLowerCase()
        return name.includes(q) || slug.includes(q)
      })
    }

    // Sort
    const sorted = [...filtered].sort((a, b) => {
      let aVal: number | string = 0
      let bVal: number | string = 0

      if (sortColumn === 'name') {
        aVal = a.tool.name
        bVal = b.tool.name
      } else if (sortColumn === 'total') {
        aVal = a.stats.total
        bVal = b.stats.total
      } else if (sortColumn === 'last7') {
        aVal = a.stats.last7
        bVal = b.stats.last7
      } else if (sortColumn === 'thisMonth') {
        aVal = a.stats.thisMonth
        bVal = b.stats.thisMonth
      }

      if (typeof aVal === 'string') {
        return sortDirection === 'asc'
          ? aVal.localeCompare(bVal as string)
          : (bVal as string).localeCompare(aVal)
      }

      return sortDirection === 'asc' ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number)
    })

    return sorted
  }, [rows, query, sortColumn, sortDirection])

  // Find top tool
  const topToolId = filteredRows.length > 0 ? filteredRows[0].tool.id : null

  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(column)
      setSortDirection('desc')
    }
  }

  // Empty state
  if (rows.length === 0) {
    return (
      <div className="px-6 py-12 text-center">
        <div className="text-slate-400 text-sm">No tools found.</div>
      </div>
    )
  }

  if (filteredRows.length === 0) {
    return (
      <div className="px-6 py-12 text-center">
        <div className="text-slate-400 text-sm">No tools match your search.</div>
      </div>
    )
  }

  return (
    <>
      <div className="px-6 pt-4 pb-2 border-b border-slate-800">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search tools by name or slug..."
          className="w-full max-w-xs rounded-lg bg-slate-900 border border-slate-700 px-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-900/80 border-b border-slate-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide cursor-pointer hover:text-slate-300 transition-colors" onClick={() => handleSort('name')}>
                Tool <SortIcon column="name" sortColumn={sortColumn} sortDirection={sortDirection} />
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide" colSpan={2}>
                Affiliate URL &amp; Slug
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide cursor-pointer hover:text-slate-300 transition-colors" onClick={() => handleSort('total')}>
                Total clicks <SortIcon column="total" sortColumn={sortColumn} sortDirection={sortDirection} />
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide cursor-pointer hover:text-slate-300 transition-colors" onClick={() => handleSort('last7')}>
                Last 7 days <SortIcon column="last7" sortColumn={sortColumn} sortDirection={sortDirection} />
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide cursor-pointer hover:text-slate-300 transition-colors" onClick={() => handleSort('thisMonth')}>
                This month <SortIcon column="thisMonth" sortColumn={sortColumn} sortDirection={sortDirection} />
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {filteredRows.map(({ tool, link, defaultSlug, stats }) => {
              const hasClicks = stats.total > 0
              const isTopTool = tool.id === topToolId && hasClicks

              return (
                <tr
                  key={tool.id}
                  className={
                    'hover:bg-slate-900/60 transition-colors ' +
                    (isTopTool ? 'bg-slate-900/60 border-l-2 border-l-emerald-500' : hasClicks ? 'bg-slate-900/40' : '')
                  }
                >
                  <td className="px-6 py-4 align-top">
                    <div className="flex items-center gap-2">
                      {isTopTool && <span className="text-emerald-400 text-lg">⭐</span>}
                      <div>
                        <div className="font-medium text-white">
                          {tool.name}
                        </div>
                        <div className="text-xs text-slate-500">
                          {tool.published ? 'Published' : 'Draft'} · {tool.slug}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 align-top" colSpan={2}>
                    <AffiliateLinkForm
                      toolId={tool.id}
                      initialTargetUrl={link?.target_url || ''}
                      initialSlug={defaultSlug}
                      existingSlug={link?.slug}
                    />
                  </td>

                  <td className="px-6 py-4 align-top">
                    <span className={hasClicks ? 'text-emerald-400 font-semibold' : 'text-slate-100'}>
                      {stats.total}
                    </span>
                  </td>
                  <td className="px-6 py-4 align-top">
                    <span className={stats.last7 > 0 ? 'text-emerald-400 font-semibold' : 'text-slate-100'}>
                      {stats.last7}
                    </span>
                  </td>
                  <td className="px-6 py-4 align-top">
                    <span className={stats.thisMonth > 0 ? 'text-emerald-400 font-semibold' : 'text-slate-100'}>
                      {stats.thisMonth}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </>
  )
}
