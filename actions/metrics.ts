'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function addMetrics(formData: FormData) {
    const supabase = await createClient()

    const date = formData.get('date') as string
    const weight = formData.get('weight') ? parseFloat(formData.get('weight') as string) : null
    const fat_rate = formData.get('fat_rate') ? parseFloat(formData.get('fat_rate') as string) : null
    const muscle_rate = formData.get('muscle_rate') ? parseFloat(formData.get('muscle_rate') as string) : null
    const water_rate = formData.get('water_rate') ? parseFloat(formData.get('water_rate') as string) : null

    // Notes removed

    if (!date) {
        return { error: 'Date is required' }
    }

    const { error } = await supabase.from('metrics').upsert({
        date,
        weight,
        fat_rate,
        muscle_rate,
        water_rate,
    })

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/')
    return { success: true }
}
