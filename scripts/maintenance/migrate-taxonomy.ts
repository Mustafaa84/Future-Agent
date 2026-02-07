
import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase env vars')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

const PILLARS = [
    {
        name: 'Marketing',
        slug: 'marketing',
        icon: '📊',
        description: 'Strategies, ads, and tools to grow your brand and reach more customers.',
        long_description: 'Leverage the power of AI to transform your marketing strategy. From automated email campaigns and social media management to data-driven ad targeting, explore the tools that help you reach your audience more effectively and at scale. Our expert reviews cover pricing, performance, and key features to ensure you pick the right marketing stack.',
        meta_title: 'Best AI Marketing Tools 2026 | Grow Your Business',
        meta_description: 'Discover the top-rated AI marketing tools for advertising, email, and social media. Expert reviews and comparisons.'
    },
    {
        name: 'Writing',
        slug: 'writing',
        icon: '✍️',
        description: 'AI-powered writing, copywriting, and content creation assistants.',
        long_description: 'Whether you are drafting blog posts, crafting high-converting ad copy, or polishing professional emails, AI writing tools are your new indispensable partners. This category explores the most advanced Large Language Model based assistants that help you overcome writers block, improve clarity, and scale your content production without losing quality.',
        meta_title: 'Top AI Writing & Copywriting Tools | Content Creation',
        meta_description: 'Transform your writing workflow with these advanced AI content tools. From blogs to ad copy, find the best assistant.'
    },
    {
        name: 'Coding',
        slug: 'coding',
        icon: '💻',
        description: 'Advanced tools for programming, app development, and technical automation.',
        long_description: 'Accelerate your development cycle with AI-powered coding tools. This pillar covers everything from intelligent IDE autocompletion and code refactoring assistants to fully autonomous agents capable of writing unit tests and debugging complex logic. Perfect for software engineers looking to stay at the cutting edge of technical efficiency.',
        meta_title: 'AI Coding Assistants & Developer Tools | Future Agent',
        meta_description: 'Boost your development speed with AI-powered IDEs, code generators, and programming assistants.'
    },
    {
        name: 'Automation',
        slug: 'automation',
        icon: '⚡',
        description: 'Streamline workflows with AI agents, autonomous systems, and process automation.',
        long_description: 'Step into the world of Agentic AI where software doesn’t just assist, it acts. This category focuses on autonomous workflow automation and cognitive agents that can manage multi-step tasks across different apps. Discover the platforms that help you build "hands-off" businesses and automated systems for maximum leverage.',
        meta_title: 'AI Automation & Agentic AI Tools | Productivity Boost',
        meta_description: 'Explore the future of work with agentic AI and autonomous workflow automation systems.'
    },
    {
        name: 'Research',
        slug: 'research',
        icon: '🔍',
        description: 'Deep analysis, data extraction, and AI-powered educational research tools.',
        long_description: 'Turn months of data analysis into minutes with AI research assistants. This pillar includes tools for academic synthesis, market intelligence, and deep web data extraction. Perfect for analysts and researchers who need to verify facts, summarize thousands of documents, and uncover hidden trends in large datasets.',
        meta_title: 'AI Research & Data Analysis Tools | Expert Insights',
        meta_description: 'The best AI tools for academic research, market analysis, and deep data extraction.'
    },
    {
        name: 'Productivity',
        slug: 'productivity',
        icon: '⏰',
        description: 'Boost your daily output with smart scheduling, note-taking, and business efficiency.',
        long_description: 'Master your day with AI-driven productivity software. We review the best AI calendars, note-taking systems, and meeting recorders that handle the administrative busywork so you can focus on high-leverage tasks. Improve your focus and organizational flow with tools designed for the modern AI-powered professional.',
        meta_title: 'Top AI Productivity Tools | Master Your Workflow',
        meta_description: 'Optimize your daily tasks with AI-powered organizers, note-takers, and business productivity software.'
    },
    {
        name: 'Chatbots',
        slug: 'chatbots',
        icon: '💬',
        description: 'Intelligent AI assistants for customer support and personalized communication.',
        long_description: 'Scale your communication with advanced AI chatbots and virtual assistants. This category highlights the smartest solutions for 24/7 customer support, personalized lead generation, and interactive user experiences. Learn how to implement intelligent chat that sounds human and solves problems instantly.',
        meta_title: 'Best AI Chatbots & Virtual Assistants | 24/7 Support',
        meta_description: 'Compare the smartest AI chatbots for customer service and personal assistance.'
    },
    {
        name: 'LLMs',
        slug: 'llms',
        icon: '🧠',
        description: 'Large Language Models, Open Source foundations, and cutting-edge AI research.',
        long_description: 'Deep dive into the foundations of the AI revolution. This pillar tracks the evolution of Large Language Models (LLMs) and the growing Open Source ecosystem. From Llama and Mistral to the latest proprietary breakthroughs, understand the core technologies that power every other AI application in our directory.',
        meta_title: 'LLMs & Open Source AI Models | Future-Proof Research',
        meta_description: 'Explore the core models driving the AI revolution. Deep dives into LLMs and open-source foundations.'
    },
    {
        name: 'Comparisons',
        slug: 'comparisons',
        icon: '⚖️',
        description: 'Detailed side-by-side head-to-head reviews of top AI software.',
        long_description: 'Can’t decide which AI tool is right for you? Our head-to-head comparisons tear down the worlds leading platforms side-by-side. We look at pricing, specific features, ease of use, and overall value to declare definitive winners in every AI software battle.',
        meta_title: 'AI Tool Comparisons & Head-to-Head Reviews',
        meta_description: 'Unbiased side-by-side comparisons of the worlds leading AI tools to help you choose the winner.'
    },
];

const MAPPING: Record<string, string[]> = {
    marketing: ['Marketing & Ads', 'Email Marketing', 'Social Media', 'marketing', 'Marketing'],
    writing: ['AI Writing', 'Copywriting', 'Content Creation', 'AI Writing Tools', 'writing', 'Writing'],
    coding: ['AI Coding', 'Coding Tools', 'Programming', 'Coding', 'coding', 'AI Coding Tools'],
    automation: ['Workflow Automation', 'Agentic AI', 'Autogpt', 'automation', 'Automation', 'Workflow Automation'],
    research: ['Research & Analysis', 'Data', 'Search', 'research', 'Research'],
    productivity: ['Productivity', 'Business Tools', 'General', 'general', 'productivity', 'Productivity & Workflow'],
    chatbots: ['Chatbots & Assistants', 'Customer Service', 'chatbots', 'Chatbots'],
    llms: ['AI Tools', 'LLMs', 'Open Source', 'Foundation Models', 'llms', 'AI Tools'],
    comparisons: ['Comparison', 'Tool Face-Offs', 'Versus', 'comparisons', 'Comparison']
};

async function migrate() {
    console.log('--- STARTING UNIFIED TAXONOMY MIGRATION ---')

    // 1. Wipe and Re-seed Categories table
    console.log('Cleaning categories table...')
    const { error: delError } = await supabase.from('categories').delete().neq('slug', 'keep-at-least-one')
    if (delError) console.error('Delete error (might be expected if table empty):', delError)

    console.log('Seeding new Pillars...')
    const { error: insError } = await supabase.from('categories').insert(PILLARS.map(p => ({
        ...p,
        created_at: new Date().toISOString()
    })))
    if (insError) {
        console.error('Insert error:', insError)
        process.exit(1)
    }

    // 2. Migrate AI Tools
    console.log('Migrating AI Tools...')
    const { data: tools } = await supabase.from('ai_tools').select('id, category, tags')

    for (const tool of (tools || [])) {
        let targetSlug = 'productivity' // default
        for (const [slug, legacyNames] of Object.entries(MAPPING)) {
            if (legacyNames.includes(tool.category)) {
                targetSlug = slug
                break
            }
        }

        const targetName = PILLARS.find(p => p.slug === targetSlug)?.name || 'Productivity'

        // Add legacy category as tag if not present
        let newTags = Array.isArray(tool.tags) ? [...tool.tags] : []
        if (tool.category && tool.category !== targetName && !newTags.includes(tool.category)) {
            newTags.push(tool.category)
        }

        await supabase.from('ai_tools')
            .update({ category: targetName, tags: newTags })
            .eq('id', tool.id)
    }

    // 3. Migrate Blog Posts
    console.log('Migrating Blog Posts...')
    const { data: posts } = await supabase.from('blog_posts').select('id, category, category_slug, tags')

    for (const post of (posts || [])) {
        let targetSlug = 'productivity' // default
        for (const [slug, legacyNames] of Object.entries(MAPPING)) {
            if (legacyNames.includes(post.category) || (post.category_slug && legacyNames.includes(post.category_slug))) {
                targetSlug = slug
                break
            }
        }

        const targetName = PILLARS.find(p => p.slug === targetSlug)?.name || 'Productivity'

        // Add legacy category as tag if not present
        let newTags = Array.isArray(post.tags) ? [...post.tags] : []
        if (post.category && post.category !== targetName && !newTags.includes(post.category)) {
            newTags.push(post.category)
        }

        await supabase.from('blog_posts')
            .update({
                category: targetName,
                category_slug: targetSlug,
                tags: newTags
            })
            .eq('id', post.id)
    }

    console.log('--- MIGRATION COMPLETE ---')
}

migrate()
