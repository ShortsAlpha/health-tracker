"use client"

import { Area, AreaChart, CartesianGrid, XAxis, Tooltip, ResponsiveContainer } from "recharts"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Period } from "@/actions/dashboard"

interface CalorieChartProps {
    data: { date: string, label: string, calories: number }[]
    period: Period
}

export function CalorieChart({ data, period }: CalorieChartProps) {
    // Green Theme
    const COLOR = "#10b981" // Emerald 500

    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle>Calorie Intake</CardTitle>
                <CardDescription>
                    {period === 'weekly' ? 'Last 7 Days' : period === 'monthly' ? 'Last 30 Days' : 'History'}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[300px] w-full">
                    {(!data || data.length === 0) ? (
                        <div className="flex h-full items-center justify-center text-muted-foreground">
                            No calorie data available
                        </div>
                    ) : (
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorCalories" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={COLOR} stopOpacity={0.3} />
                                        <stop offset="95%" stopColor={COLOR} stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="hsl(var(--border))" />
                                <XAxis
                                    dataKey="label"
                                    tickLine={false}
                                    axisLine={false}
                                    tickMargin={10}
                                    tick={{ fill: '#ffffff', fontSize: 12 }}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#18181b',
                                        borderColor: '#27272a',
                                        borderRadius: '8px',
                                        color: '#ffffff'
                                    }}
                                    itemStyle={{ color: COLOR }}
                                    cursor={{ stroke: 'hsl(var(--border))', strokeWidth: 1 }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="calories"
                                    stroke={COLOR}
                                    strokeWidth={2}
                                    fillOpacity={1}
                                    fill="url(#colorCalories)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
