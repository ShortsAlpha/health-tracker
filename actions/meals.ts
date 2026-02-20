'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function addMeal(formData: FormData) {
    const supabase = await createClient()

    const date = formData.get('date') as string
    const name = formData.get('name') as string // Now we capture the name

    // Parse numbers, default to 0 if NaN/null
    const calories = parseInt(formData.get('calories') as string) || 0
    const protein = parseInt(formData.get('protein') as string) || 0
    const carbs = parseInt(formData.get('carbs') as string) || 0
    const fat = parseInt(formData.get('fat') as string) || 0

    if (!date) return { error: 'Date is required' }
    if (!name) return { error: 'Food name is required' }

    const { error } = await supabase.from('meals').insert({
        date,
        name,
        calories,
        protein,
        carbs,
        fat,
    })

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/nutrition')
    return { success: true }
}

export async function getMeals(date: string) {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('meals')
        .select('*')
        .eq('date', date)
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Fetch Meals Error:', error)
        return []
    }

    return data
}

export async function deleteMeal(id: number) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('meals')
        .delete()
        .eq('id', id)

    if (error) return { error: error.message }

    revalidatePath('/nutrition')
    return { success: true }
}
