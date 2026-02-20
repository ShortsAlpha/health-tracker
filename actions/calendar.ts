'use server'

import { createClient } from '@/utils/supabase/server'

export async function getDailySummary(dateStr: string) {
    const supabase = await createClient()

    // Fetch Metrics
    const { data: metricsData, error: metricsError } = await supabase
        .from('metrics')
        .select('weight, fat_rate, muscle_rate, water_rate')
        .eq('date', dateStr)
        .maybeSingle()

    // Fetch Meals
    const { data: mealsData, error: mealsError } = await supabase
        .from('meals')
        .select('name, calories, protein, carbs, fat')
        .eq('date', dateStr)

    // Fetch Workouts
    const { data: workoutsData, error: workoutsError } = await supabase
        .from('workouts')
        .select('name, duration, calories_burned')
        .eq('date', dateStr)

    // Calculate totals for meals
    let totalCalories = 0
    let totalProtein = 0
    let totalCarbs = 0
    let totalFat = 0

    if (mealsData) {
        mealsData.forEach(meal => {
            totalCalories += meal.calories || 0
            totalProtein += meal.protein || 0
            totalCarbs += meal.carbs || 0
            totalFat += meal.fat || 0
        })
    }

    return {
        metrics: metricsData || null,
        meals: mealsData || [],
        totals: {
            calories: totalCalories,
            protein: totalProtein,
            carbs: totalCarbs,
            fat: totalFat
        },
        workouts: workoutsData || []
    }
}

export async function getActiveDates() {
    const supabase = await createClient()

    // Fetch dates from meals
    const { data: mealDates } = await supabase.from('meals').select('date')

    // Fetch dates from metrics
    const { data: metricDates } = await supabase.from('metrics').select('date')

    // Fetch dates from workouts
    const { data: workoutDates } = await supabase.from('workouts').select('date')

    const activeDates = new Set<string>()

    if (mealDates) mealDates.forEach(d => activeDates.add(d.date))
    if (metricDates) metricDates.forEach(d => activeDates.add(d.date))
    if (workoutDates) workoutDates.forEach(d => activeDates.add(d.date))

    return Array.from(activeDates)
}
