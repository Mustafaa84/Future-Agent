const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function checkDb() {
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

    console.log('--- Categories ---');
    const { data: cats } = await supabase.from('categories').select('*');
    console.log(JSON.stringify(cats, null, 2));

    console.log('\n--- Blog Posts ---');
    const { data: posts } = await supabase.from('blog_posts').select('title, category, slug');
    console.log(JSON.stringify(posts, null, 2));
}

checkDb();
