'use server'

import { createClient } from '@/utils/supabase/server'
import { ParsedDailyData } from '@/lib/format-parser'

export async function saveWeeklyData(days: ParsedDailyData[]) {
    const supabase = await createClient()

    try {
        for (const day of days) {
            // 1. Upsert Metrics
            if (day.weight || day.fat_rate || day.muscle_rate || day.water_rate) {
                const { error: mError } = await supabase.from('metrics').upsert({
                    date: day.date,
                    weight: day.weight,
                    fat_rate: day.fat_rate,
                    muscle_rate: day.muscle_rate,
                    water_rate: day.water_rate
                }, { onConflict: 'date' })

                if (mError) throw new Error(`Metrics Error (${day.date}): ${mError.message}`)
            }

            // 2. Insert Meals (Delete existing for that day first to avoid dups if re-running?)
            // Strategy: Verify if user wants to overwrite. For now, we append or maybe we should clear.
            // Let's clear meals for that day to be safe/clean if it's an "update".
            if (day.meals.length > 0) {
                await supabase.from('meals').delete().eq('date', day.date) // Clear old meals

                const mealsToInsert = day.meals.map(m => ({
                    date: day.date,
                    name: m.name,
                    calories: m.calories,
                    protein: m.protein,
                    carbs: m.carbs,
                    fat: m.fat
                }))

                const { error: mealError } = await supabase.from('meals').insert(mealsToInsert)
                if (mealError) throw new Error(`Meals Error (${day.date}): ${mealError.message}`)
            }

            // 3. Insert Workouts
            if (day.workouts.length > 0) {
                // Similarly, clear old workouts
                await supabase.from('workouts').delete().eq('date', day.date)

                const workoutsToInsert = day.workouts.map(w => ({
                    date: day.date,
                    name: w.name,
                    duration: w.duration
                }))

                const { error: wError } = await supabase.from('workouts').insert(workoutsToInsert)
                if (wError) throw new Error(`Workouts Error (${day.date}): ${wError.message}`)
            }
        }

        return { success: true }
    } catch (error: any) {
        console.error("Bulk Save Error:", error)
        return { success: false, error: error.message }
    }
}
