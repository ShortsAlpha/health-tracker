'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function NutritionSummary({ data }: { data: any[] }) {
    // Calculate averages
    const count = data.length || 1
    const avgCalories = Math.round(data.reduce((acc, curr) => acc + (curr.calories || 0), 0) / count)
    const avgProtein = Math.round(data.reduce((acc, curr) => acc + (curr.protein || 0), 0) / count)
    const avgCarbs = Math.round(data.reduce((acc, curr) => acc + (curr.carbs || 0), 0) / count)
    const avgFat = Math.round(data.reduce((acc, curr) => acc + (curr.fat || 0), 0) / count)

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Avg Calories</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{avgCalories} kcal</div>
                    <p className="text-xs text-muted-foreground w-max">Last 30 Days</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Protein</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{avgProtein}g</div>
                    <p className="text-xs text-muted-foreground">Average</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Carbs</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{avgCarbs}g</div>
                    <p className="text-xs text-muted-foreground">Average</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Fat</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{avgFat}g</div>
                    <p className="text-xs text-muted-foreground">Average</p>
                </CardContent>
            </Card>
        </div>
    )
}
