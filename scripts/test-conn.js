const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function test() {
    console.log('Testing connection...');
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
    const { data, error } = await supabase.from('categories').select('count', { count: 'exact' });
    if (error) {
        console.error('Connection failed:', error);
    } else {
        console.log('Connection successful, category count:', data);
    }
}

test();
