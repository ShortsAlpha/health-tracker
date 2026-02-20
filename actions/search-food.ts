'use server'

import { createClient } from '@/utils/supabase/server'

export async function searchFoodItems(query: string) {
    if (!query || query.length < 2) return []

    const supabase = await createClient()

    const { data, error } = await supabase
        .from('food_items')
        .select('*')
        .ilike('name', `%${query}%`)
        .limit(10)

    if (error) {
        console.error('Search Food Error:', error)
        return []
    }

    return data
}
