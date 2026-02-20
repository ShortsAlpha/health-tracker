'use client'

import { useState, useEffect } from 'react'
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getBiometricStats, Period } from '@/actions/dashboard'
import { Skeleton } from '@/components/ui/skeleton'

export function WeightChartsGrid() {
    const [period, setPeriod] = useState<Period>('monthly')
    const [data, setData] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setLoading(true)
        getBiometricStats(period).then(res => {
            setData(res || [])
            setLoading(false)
        })
    }, [period])

    const ChartCard = ({ title, dataKey, color, unit }: { title: string, dataKey: string, color: string, unit: string }) => (
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                    {title}
                </CardTitle>
                <div className="text-2xl font-bold">
                    {data.length > 0 ? (data[data.length - 1][dataKey] ?? '-') : '-'}
                    <span className="text-sm font-normal text-muted-foreground ml-1">{unit}</span>
                </div>
            </CardHeader>
            <CardContent>
                <div className="h-[200px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                            <defs>
                                <linearGradient id={`color-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                                    <stop offset="95%" stopColor={color} stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="hsl(var(--border))" />
                            <XAxis
                                dataKey="label"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={10}
                                tick={{ fill: '#ffffff', fontSize: 10 }}
                                interval="preserveStartEnd"
                            />
                            <YAxis
                                tickLine={false}
                                axisLine={false}
                                tick={{ fill: '#ffffff', fontSize: 10 }}
                                domain={['auto', 'auto']}
                                width={30}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#18181b', // Zinc 950
                                    borderColor: '#27272a',    // Zinc 800
                                    borderRadius: '8px',
                                    color: '#ffffff'
                                }}
                                itemStyle={{ color: '#ffffff' }}
                                labelStyle={{ color: '#a1a1aa' }}
                            />
                            <Area
                                type="monotone"
                                dataKey={dataKey}
                                name={title}
                                stroke={color}
                                strokeWidth={2}
                                fillOpacity={1}
                                fill={`url(#color-${dataKey})`}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    )

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Trends</h2>
                <Tabs value={period} onValueChange={(v) => setPeriod(v as Period)}>
                    <TabsList>
                        <TabsTrigger value="weekly">7D</TabsTrigger>
                        <TabsTrigger value="monthly">30D</TabsTrigger>
                        <TabsTrigger value="3months">History</TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>

            {loading ? (
                <div className="grid gap-4 md:grid-cols-2">
                    {[1, 2, 3, 4].map(i => (
                        <Skeleton key={i} className="h-[300px] w-full rounded-xl" />
                    ))}
                </div>
            ) : (data.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                    No data found for this period.
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2">
                    <ChartCard
                        title="Weight"
                        dataKey="weight"
                        color="#10b981" // Emerald
                        unit="kg"
                    />
                    <ChartCard
                        title="Muscle Mass"
                        dataKey="muscle_rate"
                        color="#3b82f6" // Blue
                        unit="kg"
                    />
                    <ChartCard
                        title="Body Fat"
                        dataKey="fat_rate"
                        color="#f97316" // Orange
                        unit="%"
                    />
                    <ChartCard
                        title="Water Rate"
                        dataKey="water_rate"
                        color="#06b6d4" // Cyan
                        unit="%"
                    />
                </div>
            ))}
        </div>
    )
}
