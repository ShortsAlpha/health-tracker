import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
    try {
        // Initialize Supabase inside the handler to prevent build-time errors on Vercel
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        // 1. Basic Security Check
        const apiKey = request.headers.get('x-api-key');
        if (apiKey !== process.env.RUNAI_SYNC_SECRET) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // 2. Parse Body
        const body = await request.json();
        
        // Ensure it's an array for batch insertion
        const runs = Array.isArray(body) ? body : [body];

        // 3. Map to Supabase format and cast types safely
        const insertData = runs.map((data: Record<string, unknown> | null) => {
            if (!data) return null;
            return {
                date: data.date as string,
                duration: Number(data.duration) || 0,
                distance: Number(data.distance) || 0,
                calories: data.calories ? Math.round(Number(data.calories)) : null,
                average_heart_rate: data.averageHeartRate ? Math.round(Number(data.averageHeartRate)) : null,
                steps: data.totalSteps ? Math.round(Number(data.totalSteps)) : null,
                route_data: data.routeData || [] // JSON Array of coordinates
            };
        }).filter(Boolean);

        // 4. Insert into Supabase
        const { error } = await supabase
            .from('runs')
            .insert(insertData);

        if (error) {
            console.error('Supabase Insert Error:', error);
            return NextResponse.json({ error: error.message, details: error }, { status: 500 });
        }

        return NextResponse.json({ success: true, inserted: insertData.length });
    } catch (error: unknown) {
        console.error('Run Sync Error:', error)
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Internal Server Error', fullError: error },
            { status: 500 }
        );
    }
}
