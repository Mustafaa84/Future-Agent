'use client'

import { generateBreadcrumbSchema } from '@/lib/seo/schemas'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface BreadcrumbItem {
    name: string
    url: string
}

interface BreadcrumbsProps {
    items: BreadcrumbItem[]
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
    const jsonLd = generateBreadcrumbSchema(items)

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <nav aria-label="Breadcrumb" className="mb-8 overflow-x-auto whitespace-nowrap pb-2">
                <ol className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                    <li>
                        <Link href="/" className="transition hover:text-cyan-400">
                            Home
                        </Link>
                    </li>
                    {items.map((item, index) => (
                        <li key={item.url} className="flex items-center gap-2">
                            <span className="opacity-30">/</span>
                            {index === items.length - 1 ? (
                                <span className="text-slate-400" aria-current="page">
                                    {item.name}
                                </span>
                            ) : (
                                <Link href={item.url} className="transition hover:text-cyan-400">
                                    {item.name}
                                </Link>
                            )}
                        </li>
                    ))}
                </ol>
            </nav>
        </>
    )
}
