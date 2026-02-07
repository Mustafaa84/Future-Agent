
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

async function getColumns() {
    const { data, error } = await supabase.rpc('get_table_columns', { table_name_val: 'categories' })
    if (error) {
        // If RPC doesn't exist, try a dummy insert to trigger a descriptive error
        console.log('RPC failed, trying dummy insert...')
        const { error: insError } = await supabase.from('categories').insert({ invalid_column: 'test' } as any)
        console.log(insError?.message)
    } else {
        console.log('Columns:', data)
    }
}

getColumns()
