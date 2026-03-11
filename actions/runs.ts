"use server"

import { createClient } from "@/utils/supabase/server"

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
