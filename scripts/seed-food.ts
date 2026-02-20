
import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

// Hardcoded for script execution since dotenv failed to load in this environment context
const supabaseUrl = "https://ebgzzugjmmffscpqtjor.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImViZ3p6dWdqbW1mZnNjcHF0am9yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkwMzkwNzQsImV4cCI6MjA4NDYxNTA3NH0.ju7zHDjGsIfEf51Vx4a2JjDvl0mu2RiJoZhAUNyiOr8";

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
    const filePath = path.join(process.cwd(), 'FoodItemsFromMe');

    if (!fs.existsSync(filePath)) {
        console.error("File not found: FoodItemsFromMe");
        return;
    }

    let raw = fs.readFileSync(filePath, 'utf-8');

    // Clean up JSON
    raw = raw.replace(/\r?\n|\r/g, '');
    raw = raw.replace(/\]\s*\[/g, ',');

    try {
        const data = JSON.parse(raw);
        console.log(`Parsed ${data.length} items. Uploading...`);

        // Upload in chunks
        const chunkSize = 50;
        for (let i = 0; i < data.length; i += chunkSize) {
            const chunk = data.slice(i, i + chunkSize);
            const cleanChunk = chunk.map((item: any) => {
                const { id, ...rest } = item;
                return rest;
            });

            const { error } = await supabase.from('food_items').insert(cleanChunk);
            if (error) {
                console.error("Error inserting chunk:", error);
                // If error is RLS related, we might need service role key or user auth.
                // But we set RLS to true for anon, so should be fine.
            }
            else console.log(`Inserted ${i} to ${i + cleanChunk.length}`);
        }

        console.log("Done!");

    } catch (e) {
        console.error("JSON Parse Error:", e);
    }
}

seed();
