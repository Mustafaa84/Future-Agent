const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function check() {
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

    const { data: cats } = await supabase.from('categories').select('name, slug');
    console.log('Categories:', cats);

    const { data: posts } = await supabase.from('blog_posts').select('*').limit(1);
    if (posts && posts.length > 0) {
        console.log('Blog Columns:', Object.keys(posts[0]));
    }
}

check();
