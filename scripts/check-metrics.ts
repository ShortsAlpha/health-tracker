
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.log("No env vars");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
    console.log("Checking metrics table...");
    const { data, error, count } = await supabase
        .from('metrics')
        .select('*', { count: 'exact' })
        .order('date', { ascending: false })
        .limit(10);

    if (error) {
        console.error("Error fetching metrics:", error);
    } else {
        console.log(`Total count: ${count}`);
        console.log("Latest 10 entries:");
        console.table(data);
    }
}

check();
