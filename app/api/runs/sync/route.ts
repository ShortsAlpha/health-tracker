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
        const data = await request.json();

        // 3. Insert into Supabase
        const { error } = await supabase
            .from('runs')
            .insert([
                {
                    date: data.date,
                    duration: data.duration,
                    distance: data.distance,
                    calories: data.calories,
                    average_heart_rate: data.averageHeartRate,
                    steps: data.totalSteps,
                    route_data: data.routeData // JSON Array of coordinates
                }
            ]);

        if (error) throw error;

        return NextResponse.json({ success: true });
    } catch (error: unknown) {
        console.error('Run Sync Error:', error)
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Internal Server Error' },
            { status: 500 }
        );
    }
}
