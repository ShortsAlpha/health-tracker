"use server"

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"

export async function getRuns() {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from("runs")
        .select("*")
        .order("date", { ascending: false })

    if (error) {
        console.error("Error fetching runs:", error)
        return []
    }

    return data
}

export async function deleteRun(id: number) {
    const supabase = await createClient()
    const { error } = await supabase
        .from('runs')
        .delete()
        .eq('id', id)

    if (error) {
        console.error('Error deleting run:', error)
        throw new Error('Failed to delete run')
    }

    revalidatePath('/runs')
}
