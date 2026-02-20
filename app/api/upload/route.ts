
import { NextRequest, NextResponse } from 'next/server'
import { extractTextFromPDF } from '@/lib/pdf-loader'
import { analyzeBloodTest } from '@/lib/gemini'
import { createClient } from '@/utils/supabase/server'

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData()
        const file = formData.get('file') as File

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 })
        }

        // 1. Convert File to Buffer
        const arrayBuffer = await file.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)

        // 2. Extract Text
        const text = await extractTextFromPDF(buffer)

        // 3. Analyze with Gemini
        const analysis = await analyzeBloodTest(text)

        // 4. Save to Database
        const supabase = await createClient()

        // 4a. Create Main Test Record
        const { data: testData, error: testError } = await supabase
            .from('blood_tests')
            .insert({
                date: analysis.date,
                hospital_name: analysis.hospital_name
            })
            .select()
            .single()

        if (testError) throw new Error('Failed to save test record: ' + testError.message)

        // 4b. Create Markers
        const markersToInsert = analysis.markers.map((marker: any) => ({
            test_id: testData.id,
            marker_name: marker.marker_name,
            value: marker.value,
            unit: marker.unit,
            reference_range: marker.reference_range
        }))

        const { error: markersError } = await supabase
            .from('blood_markers')
            .insert(markersToInsert)

        if (markersError) throw new Error('Failed to save markers: ' + markersError.message)

        return NextResponse.json({ success: true, id: testData.id })

    } catch (error: any) {
        console.error('Upload error:', error)
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 })
    }
}
