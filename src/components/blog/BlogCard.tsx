
import Link from 'next/link'
import Image from 'next/image'

interface BlogPost {
    id: string
    slug: string
    title: string
    excerpt: string | null
    featured_image: string | null
    category: string | null
    category_slug: string | null
    published_date: string | null
    reading_time: number | null
    tags: string[]
}

interface BlogCardProps {
    post: BlogPost
    className?: string
}

export default function BlogCard({ post, className = '' }: BlogCardProps) {
    return (
        <Link
            href={`/blog/${post.slug}`}
            className={`group bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-cyan-500 transition-all flex flex-col h-full ${className}`}
        >
            {/* Image Section */}
            <div className="aspect-video overflow-hidden bg-slate-800 relative">
                {post.featured_image ? (
                    <Image
                        src={post.featured_image}
                        alt={post.title}
                        width={500}
                        height={280}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                ) : post.slug.includes('-vs-') ? (
                    /* Comparison Box Fallback - UNIFIED VISUAL */
                    <div className="w-full h-full bg-slate-950 flex flex-col items-center justify-center p-6 relative overflow-hidden">
                        {/* Decorative Background Elements */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl -mr-16 -mt-16" />
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-fuchsia-500/10 rounded-full blur-2xl -ml-16 -mb-16" />

                        <div className="flex items-center gap-4 z-10">
                            {/* Tool A */}
                            <div className="text-center">
                                <div className="w-12 h-12 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center mb-2 mx-auto">
                                    <span className="text-xl font-bold text-white">
                                        {post.slug.split('-vs-')[0]?.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                    {post.slug.split('-vs-')[0]?.replace(/-/g, ' ')}
                                </p>
                            </div>

                            {/* VS Divider */}
                            <div className="flex flex-col items-center">
                                <div className="h-4 w-px bg-gradient-to-b from-transparent via-slate-700 to-transparent mb-1" />
                                <span className="text-sm font-black text-cyan-500 italic">VS</span>
                                <div className="h-4 w-px bg-gradient-to-b from-transparent via-slate-700 to-transparent mt-1" />
                            </div>

                            {/* Tool B */}
                            <div className="text-center">
                                <div className="w-12 h-12 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center mb-2 mx-auto">
                                    <span className="text-xl font-bold text-white">
                                        {post.slug.split('-vs-')[1]?.split('-')[0]?.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                    {post.slug.split('-vs-')[1]?.split('-')[0]?.replace(/-/g, ' ')}
                                </p>
                            </div>
                        </div>

                        {/* Comparison Badge */}
                        <div className="absolute top-3 right-3 px-2 py-0.5 bg-cyan-500/10 border border-cyan-500/20 rounded text-[8px] font-black tracking-tighter text-cyan-400 flex items-center gap-1">
                            FACE-OFF
                        </div>
                    </div>
                ) : (
                    /* Default Fallback */
                    <div className="w-full h-full bg-slate-900 flex items-center justify-center">
                        <span className="text-slate-800 font-black text-4xl opacity-20">F.A</span>
                    </div>
                )}
            </div>

            <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center gap-2 mb-3">
                    {post.category && (
                        <span className="px-2 py-1 bg-cyan-900/30 border border-cyan-700 text-cyan-400 text-xs rounded hover:bg-cyan-900/50 transition-colors">
                            {post.category}
                        </span>
                    )}
                    <span className="text-xs text-slate-500">
                        {post.published_date
                            ? new Date(post.published_date).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                            })
                            : ''}
                        {post.reading_time && (
                            <> • {post.reading_time} min read</>
                        )}
                    </span>
                </div>

                <h3 className="text-xl font-bold text-slate-100 group-hover:text-cyan-400 transition-colors mb-2">
                    {post.title}
                </h3>

                <p className="text-slate-400 text-sm line-clamp-2 mb-4">
                    {post.excerpt}
                </p>

                {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-auto">
                        {post.tags.slice(0, 3).map((tag) => (
                            <span
                                key={tag}
                                className="px-2 py-0.5 bg-slate-800 text-slate-400 text-xs rounded"
                            >
                                #{tag}
                            </span>
                        ))}
                    </div>
                )}
            </div>
        </Link>
    )
}
