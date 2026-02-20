'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function addNutrition(formData: FormData) {
    const supabase = await createClient()

    const date = formData.get('date') as string
    const calories = formData.get('calories') ? parseInt(formData.get('calories') as string) : null
    const protein = formData.get('protein') ? parseInt(formData.get('protein') as string) : null
    const carbs = formData.get('carbs') ? parseInt(formData.get('carbs') as string) : null
    const fat = formData.get('fat') ? parseInt(formData.get('fat') as string) : null

    if (!date) {
        return { error: 'Date is required' }
    }

    const { error } = await supabase.from('nutrition').upsert({
        date,
        calories,
        protein,
        carbs,
        fat,
    })

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/')
    return { success: true }
}
