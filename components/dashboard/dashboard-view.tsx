'use client'

import { useState, useEffect } from 'react'
import { getCalorieStats, getBiometricStats, getStreak, Period } from '@/actions/dashboard'
import { CalorieChart } from './calorie-chart'
import { BiometricsChart } from './biometrics-chart'
import { StreakCard } from './streak-card'
import { TodaysFood } from './todays-food'
import { RecentWorkouts } from './recent-workouts'
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Skeleton } from '@/components/ui/skeleton'

export function DashboardView() {
    const [streak, setStreak] = useState<number>(0)

    // Calorie State
    const [calPeriod, setCalPeriod] = useState<Period>('weekly')
    const [calData, setCalData] = useState<any[]>([])
    const [calLoading, setCalLoading] = useState(true)

    // Bio State
    const [bioPeriod, setBioPeriod] = useState<Period>('weekly')
    const [bioData, setBioData] = useState<any[]>([])
    const [bioLoading, setBioLoading] = useState(true)



    useEffect(() => {
        setCalLoading(true)
        getCalorieStats(calPeriod).then(data => {
            setCalData(data || [])
            setCalLoading(false)
        })
    }, [calPeriod])


    // ...

    useEffect(() => {
        setBioLoading(true)
        getBiometricStats(bioPeriod).then(data => {
            setBioData(data || [])
            setBioLoading(false)
        })
    }, [bioPeriod])

    return (
        <div className="space-y-8">
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-12 items-start">
                {/* CALORIE SECTION (Left - Wider) */}

                <div className="lg:col-span-7 flex flex-col space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">Nutrition</h3>
                        <Tabs value={calPeriod} onValueChange={(v) => setCalPeriod(v as Period)}>
                            <TabsList>
                                <TabsTrigger value="weekly">Weekly</TabsTrigger>
                                <TabsTrigger value="monthly">Monthly</TabsTrigger>
                                <TabsTrigger value="3months">3M</TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>
                    {calLoading ? (
                        <Skeleton className="h-[350px] w-full rounded-xl" />
                    ) : (
                        <CalorieChart data={calData} period={calPeriod} />
                    )}

                    <TodaysFood />
                </div>

                {/* BIOMETRICS SECTION (Right - Chart Only) */}
                <div className="lg:col-span-5 flex flex-col space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">Weight History</h3>
                        <Tabs value={bioPeriod} onValueChange={(v) => setBioPeriod(v as Period)}>
                            <TabsList>
                                <TabsTrigger value="weekly">7D</TabsTrigger>
                                <TabsTrigger value="monthly">30D</TabsTrigger>
                                <TabsTrigger value="3months">History</TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>
                    {bioLoading ? (
                        <Skeleton className="h-[350px] w-full rounded-xl" />
                    ) : (
                        <BiometricsChart data={bioData} period={bioPeriod} />
                    )}

                    <RecentWorkouts />
                </div>
            </div>
        </div>
    )
}
