'use client'

import {
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
    CartesianGrid
} from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export function WeightChart({ data }: { data: any[] }) {
    // Format data for chart
    const validData = data.filter(item => item.weight).map(item => ({
        ...item,
        date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    })).reverse()

    return (
        <Card className="col-span-4">
            <CardHeader>
                <CardTitle>Weight Trend</CardTitle>
                <CardDescription>Weight changes over time</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={350}>
                    <LineChart data={validData}>
                        <XAxis
                            dataKey="date"
                            stroke="#888888"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            stroke="#888888"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            domain={['dataMin - 1', 'dataMax + 1']}
                        />
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }}
                            itemStyle={{ color: '#fff' }}
                        />
                        <Line
                            type="monotone"
                            dataKey="weight"
                            stroke="#adfa1d"
                            strokeWidth={2}
                            activeDot={{ r: 8 }}
                        />
                        <Line
                            type="monotone"
                            dataKey="muscle_rate"
                            stroke="#2563eb"
                            strokeWidth={2}
                            hide={true} // Hidden by default, just example
                        />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}
