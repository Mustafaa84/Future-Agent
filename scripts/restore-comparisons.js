const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function restoreComparisons() {
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

    console.log('Checking for Comparisons category...');
    const { data: existingCat, error: fetchError } = await supabase
        .from('categories')
        .select('*')
        .eq('slug', 'comparisons')
        .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('Error fetching category:', fetchError);
        return;
    }

    if (!existingCat) {
        console.log('Creating Comparisons category...');
        const { error: insertError } = await supabase
            .from('categories')
            .insert([
                {
                    name: 'Comparisons',
                    slug: 'comparisons',
                    description: 'Top Face-Offs: Tool 1 vs Tool 2. Deep side-by-side analysis and expert recommendations.',
                    long_description: 'Our intensive AI tool comparisons break down the leading platforms in every category. We go beyond the feature lists to analyze real-world performance, ROI, and user experience, helping you choose the perfect autonomous agent for your specific workflow requirements.',
                    icon: 'Swap',
                    meta_title: 'AI Tool Comparisons | Side-by-Side Analysis | Future Agent',
                    meta_description: 'Compare the top AI tools and autonomous agents. Detailed side-by-side analysis, pros, cons, and performance benchmarks.',
                    image_url: 'https://nativeorange.ai/wp-content/uploads/2024/01/ai-vs-ai.png'
                }
            ]);

        if (insertError) {
            console.error('Error creating category:', insertError);
            return;
        }
    } else {
        console.log('Comparisons category already exists.');
    }

    console.log('Identifying comparison blog posts...');
    const { data: posts, error: postsError } = await supabase
        .from('blog_posts')
        .select('id, title, category_slug, category_name, category, slug');

    if (postsError) {
        console.error('Error fetching blog posts:', postsError);
        return;
    }

    const comparisonPosts = posts.filter(post =>
        post.title.toLowerCase().includes(' vs ') ||
        post.title.toLowerCase().includes('vs.') ||
        post.title.toLowerCase().includes('comparison') ||
        post.slug.toLowerCase().includes('vs') ||
        post.slug.toLowerCase().includes('comparison') ||
        post.category_slug === 'comparisons'
    );

    console.log(`Found ${comparisonPosts.length} comparison posts.`);

    for (const post of comparisonPosts) {
        console.log(`Updating post: ${post.title}...`);
        const { error: updateError } = await supabase
            .from('blog_posts')
            .update({
                category_slug: 'comparisons',
                category_name: 'Comparisons',
                category: 'comparisons'
            })
            .eq('id', post.id);

        if (updateError) {
            console.error(`Error updating post ${post.title}:`, updateError);
        }
    }

    console.log('Done!');
}

restoreComparisons();
