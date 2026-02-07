import Link from 'next/link'
import JsonLd from '@/components/SEO/JsonLd'
import { Metadata } from 'next'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'
import { getCategoryImage } from '@/lib/category-assets'

export const metadata: Metadata = {
    title: 'About Future Agent | Navigating the Agentic Era',
    description: 'We help you navigate the complex world of AI agents and autonomous workflows. Discover our methodology and the 5 Power Pillars of the agentic revolution.',
}

async function getCategories() {
    const { data } = await supabase
        .from('categories')
        .select('*')
        .order('name', { ascending: true })
    return data || []
}

export default async function AboutPage() {
    const categories = (await getCategories()).filter(c => c.slug !== 'comparisons')
    const aboutSchema = {
        '@context': 'https://schema.org',
        '@type': 'AboutPage',
        name: 'About Future Agent',
        description: 'Future Agent is the definitive professional directory and research hub for autonomous AI agents, multi-step workflows, and task execution tools.',
        publisher: {
            '@type': 'Organization',
            name: 'Future Agent',
            logo: {
                '@type': 'ImageObject',
                url: 'https://futureagent.com/logo.png'
            }
        }
    }


    const faqSchema = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
            {
                '@type': 'Question',
                name: 'What is Future Agent?',
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Future Agent is a specialized research hub and directory focused on the "Agentic Era" of AI—where software moves from providing suggestions to executing tasks autonomously.'
                }
            },
            {
                '@type': 'Question',
                name: 'How do you evaluate AI tools?',
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Every tool undergoes a 48-hour stress-test by our analysts to verify its autonomous capabilities, API stability, and real-world business ROI.'
                }
            },
            {
                '@type': 'Question',
                name: 'What are the 5 Power Pillars?',
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'We focus on five cornerstone disciplines being re-architected by AI: Marketing, Coding, Content, Workflows, and Intelligence.'
                }
            }
        ]
    }

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200">
            <JsonLd data={aboutSchema} />
            <JsonLd data={faqSchema} />

            {/* HERO SECTION */}
            <section className="relative pt-32 pb-24 px-4 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-cyan-500/10 via-blue-500/5 to-transparent blur-3xl" />

                <div className="relative mx-auto max-w-5xl text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold uppercase tracking-widest mb-8">
                        Our Mission
                    </div>
                    <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-8 tracking-tight">
                        Navigating the <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent italic pr-2">Agentic Era</span>.
                    </h1>
                    <p className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
                        The world is moving from tools that assist to agents that execute.
                        We provide the map to this new territory.
                    </p>
                </div>
            </section>

            {/* MISSION GRID */}
            <section className="py-24 px-4 bg-slate-900/30">
                <div className="mx-auto max-w-6xl grid md:grid-cols-2 gap-16 items-center">
                    <div className="space-y-6">
                        <h2 className="text-3xl md:text-4xl font-bold text-white">Filtering the noise. <br /><span className="text-slate-500">Focusing on ROI.</span></h2>
                        <p className="text-lg text-slate-400 leading-relaxed">
                            Thousands of AI tools are launched every month. Most are wrappers; few are foundational. Our research team spends hundreds of hours testing autonomous capabilities, API reliability, and actual business utility.
                        </p>
                        <p className="text-lg text-slate-400 leading-relaxed">
                            We don't just list tools. We curate **Power Pillars** — the five essential disciplines that will be entirely redefined by agentic workflows in the next 24 months.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                        <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700/50 shadow-xl">
                            <h3 className="text-white font-bold text-lg mb-2">Data-Backed Research</h3>
                            <p className="text-slate-400 text-sm">Every tool in our directory undergoes a 12-point evaluation before being published.</p>
                        </div>
                        <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700/50 shadow-xl">
                            <h3 className="text-white font-bold text-lg mb-2">Market Intelligence</h3>
                            <p className="text-slate-400 text-sm">We provide the latest insights on how autonomous agents are shifting competitive landscapes.</p>
                        </div>
                        <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700/50 shadow-xl">
                            <h3 className="text-white font-bold text-lg mb-2">Practical Implementation</h3>
                            <p className="text-slate-400 text-sm">Move beyond theory with exact guides on how to build and scale with AI agents.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* THE PILLARS */}
            <section className="py-24 px-4 relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none" />
                <div className="mx-auto max-w-6xl relative">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">The {categories.length} Power Pillars</h2>
                        <p className="text-slate-400">Our strategic framework for the future of work.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6 pb-12">
                        {categories.map((pillar, idx) => (
                            <Link
                                key={pillar.slug}
                                href={`/tools/category/${pillar.slug}`}
                                className={`group relative h-[380px] md:h-[420px] rounded-[2rem] overflow-hidden border border-slate-800/50 hover:border-cyan-500/50 transition-all duration-700 shadow-2xl ${idx % 2 === 1 ? 'lg:translate-y-10' : ''
                                    }`}
                            >
                                {/* Background Image */}
                                <Image
                                    src={getCategoryImage(pillar.slug, (pillar as any).image_url)}
                                    alt={pillar.name}
                                    fill
                                    className="object-cover opacity-40 group-hover:opacity-60 group-hover:scale-110 transition-all duration-1000"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent transition-opacity group-hover:opacity-70" />

                                {/* Content Overlay */}
                                <div className="absolute inset-0 p-6 flex flex-col justify-end">
                                    <h3 className="text-white font-black text-xl md:text-2xl tracking-tight mb-3 transform group-hover:-translate-y-1 transition-transform duration-500">
                                        {pillar.name}
                                    </h3>
                                    <p className="text-slate-400 text-[10px] md:text-xs leading-relaxed group-hover:text-slate-100 transition-colors duration-500 line-clamp-2">
                                        {pillar.description || `Specialized research reporting and tool analysis for ${pillar.name.toLowerCase()} vertically.`}
                                    </p>
                                    <div className="mt-6 flex items-center gap-2 text-cyan-400 text-[9px] font-black uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-500 delay-100">
                                        Deep Dive <span>→</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* CLOSING CTA */}
            <section className="py-24 px-4 relative">
                <div className="mx-auto max-w-4xl bg-gradient-to-br from-cyan-600 to-blue-700 rounded-3xl p-12 text-center text-white shadow-2xl overflow-hidden relative group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl transition-transform group-hover:scale-110" />
                    <h2 className="text-2xl md:text-4xl font-black mb-6 relative">Ready to optimize your workflow?</h2>
                    <p className="text-lg text-white/80 mb-10 max-w-2xl mx-auto relative">
                        Stop guessing. Use our proprietary tool-finder engine to identify the exact agent stack your team needs.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4 relative">
                        <Link href="/quiz" className="px-10 py-4 bg-white text-slate-900 rounded-xl font-black text-lg hover:bg-slate-100 transition shadow-xl hover:shadow-cyan-500/25">
                            Start the Quiz
                        </Link>
                        <Link href="/tools" className="px-10 py-4 bg-slate-900 text-white rounded-xl font-black text-lg hover:bg-slate-800 transition shadow-xl border border-white/10">
                            Explore Tools
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    )
}
