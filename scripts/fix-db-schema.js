const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
    console.error('Missing environment variables. Check .env.local for NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

async function runMigration() {
    console.log('--- Database Migration: Adding image_url to categories ---');

    // We'll use the 'query' or just attempt an update to see if it exists, 
    // but the most reliable way without RPC is to try and fetch it.

    const { data, error: fetchError } = await supabase
        .from('categories')
        .select('image_url')
        .limit(1);

    if (fetchError && fetchError.code === '42703') {
        console.log('Column "image_url" does not exist. Attempting to add it via SQL...');
        console.log('IMPORTANT: If this fails, you must run the following SQL in the Supabase SQL Editor:');
        console.log('ALTER TABLE categories ADD COLUMN IF NOT EXISTS image_url TEXT;');

        // Attempting to use a common RPC if it exists, otherwise informing the user.
        const { error: rpcError } = await supabase.rpc('exec_sql', {
            sql_query: 'ALTER TABLE categories ADD COLUMN IF NOT EXISTS image_url TEXT;'
        });

        if (rpcError) {
            console.error('Migration failed via RPC. This is common if "exec_sql" is not defined.');
            console.error('Details:', rpcError);
            console.log('\n--- ACTION REQUIRED ---');
            console.log('Please go to your Supabase Dashboard -> SQL Editor and run:');
            console.log('ALTER TABLE categories ADD COLUMN IF NOT EXISTS image_url TEXT;');
            console.log('------------------------\n');
        } else {
            console.log('Migration successful!');
        }
    } else if (fetchError) {
        console.error('Unexpected error checking schema:', fetchError);
    } else {
        console.log('Column "image_url" already exists.');
    }
}

runMigration();
