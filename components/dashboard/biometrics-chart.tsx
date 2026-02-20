"use client"

import { CartesianGrid, Line, Area, ComposedChart, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

interface BiometricsChartProps {
    data: { date: string, label: string, weight?: number, fat_rate?: number, muscle_rate?: number }[]
}

export function BiometricsChart({ data }: BiometricsChartProps) {
    const COLOR_WEIGHT = "#10b981" // Emerald 500 (Green)
    const COLOR_FAT = "#f97316"    // Orange
    const COLOR_MUSCLE = "#3b82f6" // Blue

    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle>Weight History & Body Composition</CardTitle>
                <CardDescription>Weight (kg) • Fat (%) • Muscle (kg)</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[300px] w-full">
                    {(!data || data.length === 0) ? (
                        <div className="flex h-full items-center justify-center text-muted-foreground">
                            No biometric data available for this period. Try switching to &apos;History&apos;.
                        </div>
                    ) : (
                        <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={COLOR_WEIGHT} stopOpacity={0.3} />
                                        <stop offset="95%" stopColor={COLOR_WEIGHT} stopOpacity={0} />
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
                                <YAxis
                                    yAxisId="left"
                                    orientation="left"
                                    domain={['auto', 'auto']}
                                    tickLine={false}
                                    axisLine={false}
                                    tick={{ fill: '#ffffff', fontSize: 12 }}
                                    width={30}
                                />
                                <YAxis
                                    yAxisId="right"
                                    orientation="right"
                                    domain={[0, 60]}
                                    tickLine={false}
                                    axisLine={false}
                                    tick={{ fill: '#ffffff', fontSize: 12 }}
                                    width={30}
                                />

                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#18181b', // Zinc 950 (Dark background)
                                        borderColor: '#27272a',    // Zinc 800 (Border)
                                        borderRadius: '8px',
                                        color: '#ffffff'
                                    }}
                                />

                                {/* Weight as Area with Gradient (GREEN) */}
                                <Area
                                    yAxisId="left"
                                    type="monotone"
                                    dataKey="weight"
                                    name="Weight"
                                    stroke={COLOR_WEIGHT}
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorWeight)"
                                />

                                {/* Fat Rate as Line */}
                                <Line
                                    yAxisId="right"
                                    type="monotone"
                                    dataKey="fat_rate"
                                    name="Fat %"
                                    stroke={COLOR_FAT}
                                    strokeWidth={2}
                                    dot={false}
                                />

                                {/* Muscle Rate as Line */}
                                <Line
                                    yAxisId="left"
                                    type="monotone"
                                    dataKey="muscle_rate"
                                    name="Muscle (kg)"
                                    stroke={COLOR_MUSCLE}
                                    strokeWidth={2}
                                    strokeDasharray="4 4"
                                    dot={false}
                                />
                            </ComposedChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
