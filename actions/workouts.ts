'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getRecentWorkouts(limit: number = 10) {
    const supabase = await createClient()

    const { data: workouts, error } = await supabase
        .from('workouts')
        .select('*')
        .order('date', { ascending: false })
        .limit(limit)

    if (error) {
        console.error("Fetch Workouts Error:", error.message)
        return []
    }

    return workouts
}

export async function deleteWorkout(id: number) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('workouts')
        .delete()
        .eq('id', id)

    if (error) {
        console.error("Delete Workout Error:", error.message)
        return { error: error.message }
    }

    revalidatePath('/')
    return { success: true }
}
