'use server'

import { createClient } from '@/utils/supabase/server'

export type Period = 'weekly' | 'monthly' | '3months' // 3months is now effectively "History"

export async function getCalorieStats(period: Period) {
    const supabase = await createClient()
    const today = new Date()
    let daysToFetch = 7

    if (period === 'weekly') daysToFetch = 7
    if (period === 'monthly') daysToFetch = 30
    if (period === '3months') daysToFetch = 90

    const startDate = new Date()
    startDate.setDate(today.getDate() - daysToFetch)
    const dateStr = startDate.toISOString().split('T')[0]

    const { data: meals, error } = await supabase
        .from('meals')
        .select('date, calories')
        .gte('date', dateStr)
        .order('date', { ascending: true })

    if (error) return []

    // Aggregate by date
    const aggMap = new Map<string, number>()

    // Fill gaps
    for (let i = 0; i < daysToFetch; i++) {
        const loopDate = new Date(today)
        loopDate.setDate(today.getDate() - (daysToFetch - 1 - i))
        const dStr = loopDate.toISOString().split('T')[0]
        aggMap.set(dStr, 0)
    }

    meals?.forEach((m: any) => {
        const current = aggMap.get(m.date) || 0
        aggMap.set(m.date, current + (m.calories || 0))
    })

    return Array.from(aggMap.entries()).map(([date, calories]) => {
        const d = new Date(date)
        return {
            date,
            label: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            calories
        }
    })
}

export async function getBiometricStats(period: Period) {
    const supabase = await createClient()

    // Determine start date
    const today = new Date()
    let startDate = new Date()

    // Fix: Ensure we go back enough
    if (period === 'weekly') {
        startDate.setDate(today.getDate() - 7)
    } else if (period === 'monthly') {
        startDate.setDate(today.getDate() - 30)
    } else {
        // History / 3months -> Fetch last 365 days to show all data user imported
        startDate.setDate(today.getDate() - 365)
    }

    const dateStr = startDate.toISOString().split('T')[0]

    const { data: metrics, error } = await supabase
        .from('metrics')
        .select('date, weight, fat_rate, muscle_rate, water_rate')
        .gte('date', dateStr)
        .order('date', { ascending: true }) // Charts need ascending

    if (error) {
        console.error("Biometric Fetch Error:", error)
        return []
    }

    return metrics.map((m: any) => ({
        date: m.date,
        label: new Date(m.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        weight: m.weight,
        fat_rate: m.fat_rate,
        muscle_rate: m.muscle_rate,
        water_rate: m.water_rate
    }))
}

export async function getStreak() {
    const supabase = await createClient()
    const todayStr = new Date().toISOString().split('T')[0]

    const { data: mealDates } = await supabase.from('meals').select('date').limit(50).order('date', { ascending: false })
    const { data: metricDates } = await supabase.from('metrics').select('date').limit(50).order('date', { ascending: false })

    const activeDates = new Set<string>()
    mealDates?.forEach((d: any) => activeDates.add(d.date))
    metricDates?.forEach((d: any) => activeDates.add(d.date))

    if (activeDates.size === 0) return 0

    let streak = 0
    let checkDate = new Date()
    let dateStr = checkDate.toISOString().split('T')[0]

    // Check today
    if (!activeDates.has(dateStr)) {
        // Check yesterday
        checkDate.setDate(checkDate.getDate() - 1)
        dateStr = checkDate.toISOString().split('T')[0]
        if (!activeDates.has(dateStr)) return 0
    }

    // Count backwards
    while (activeDates.has(dateStr)) {
        streak++
        checkDate.setDate(checkDate.getDate() - 1)
        dateStr = checkDate.toISOString().split('T')[0]
    }

    return streak
}
