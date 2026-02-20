"use client";

import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/line-chart";
import { Badge } from "@/components/ui/badge";
import { TrendingUp } from "lucide-react";

const chartConfig = {
    calories: {
        label: "Calories",
        color: "hsl(var(--chart-1))",
    },
} satisfies ChartConfig;

interface DashboardChartProps {
    data: {
        date: string;
        label: string;
        calories: number;
    }[]
}

export function DashboardChart({ data }: DashboardChartProps) {
    // Calculate trend (vs yesterday or avg?) - simple placeholder logic
    const todayVal = data[data.length - 1]?.calories || 0;
    const yesterdayVal = data[data.length - 2]?.calories || 0;
    const growth = yesterdayVal > 0
        ? ((todayVal - yesterdayVal) / yesterdayVal) * 100
        : 0;

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    Weekly Calorie Intake
                    {growth !== 0 && (
                        <Badge
                            variant="outline"
                            className={`ml-2 border-none ${growth > 0 ? 'text-green-500 bg-green-500/10' : 'text-red-500 bg-red-500/10'}`}
                        >
                            <TrendingUp className={`h-4 w-4 mr-1 ${growth < 0 ? 'rotate-180' : ''}`} />
                            <span>{Math.abs(growth).toFixed(1)}%</span>
                        </Badge>
                    )}
                </CardTitle>
                <CardDescription>Last 7 Days Activity</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[250px] w-full">
                    <ChartContainer config={chartConfig} className="h-full w-full">
                        <LineChart
                            accessibilityLayer
                            data={data}
                            margin={{
                                left: 12,
                                right: 12,
                                top: 10,
                                bottom: 10
                            }}
                        >
                            <CartesianGrid vertical={false} strokeDasharray="3 3" />
                            <XAxis
                                dataKey="label"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                            />
                            <ChartTooltip
                                cursor={false}
                                content={<ChartTooltipContent hideLabel />}
                            />
                            <Line
                                dataKey="calories"
                                type="monotone" // Smoother line
                                stroke="var(--color-calories)"
                                strokeWidth={2}
                                dot={<CustomizedDot />}
                                activeDot={{ r: 6 }}
                            />
                        </LineChart>
                    </ChartContainer>
                </div>
            </CardContent>
        </Card>
    );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomizedDot = (props: any) => {
    const { cx, cy, stroke, payload } = props;

    // Only animate the last dot (today)
    // We can't easily know if it's the last one without index/length in props usually.
    // But often payload is passed.
    // Let's just animate all for "live" feel or try to detect active.
    // Actually, the prompt example animated all dots or specific ones.
    // Let's animate all dots that have value > 0 for cool effect.

    if (!payload.calories) return <circle cx={cx} cy={cy} r={3} fill={stroke} />

    return (
        <g>
            <circle cx={cx} cy={cy} r={3} fill={stroke} />
            <circle
                cx={cx}
                cy={cy}
                r={3}
                stroke={stroke}
                fill="none"
                strokeWidth="1"
                opacity="0.8"
            >
                <animate
                    attributeName="r"
                    values="3;8"
                    dur="1.5s"
                    repeatCount="indefinite"
                />
                <animate
                    attributeName="opacity"
                    values="0.8;0"
                    dur="1.5s"
                    repeatCount="indefinite"
                />
            </circle>
        </g>
    );
};
