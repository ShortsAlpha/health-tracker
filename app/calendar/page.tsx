'use client'

import * as React from "react"
import { CalendarTwin } from "@/components/calendar-twin"
import { getDailySummary, getActiveDates } from "@/actions/calendar"
import { format, isSameDay } from "date-fns"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
    TableFooter
} from "@/components/ui/table"

export default function CalendarPage() {
    const [date, setDate] = React.useState<Date>()
    const [isOpen, setIsOpen] = React.useState(false)
    const [loading, setLoading] = React.useState(false)
    const [summary, setSummary] = React.useState<any>(null)
    const [activeDates, setActiveDates] = React.useState<string[]>([])

    // Ensure we don't open the sheet immediately on mount if date is technically undefined then set to today by default
    const [initialLoad, setInitialLoad] = React.useState(true)

    React.useEffect(() => {
        setInitialLoad(false)
        const loadActiveDates = async () => {
            const dates = await getActiveDates()
            setActiveDates(dates)
        }
        loadActiveDates()
    }, [])

    const handleDateSelect = async (newDate: Date | undefined) => {
        setDate(newDate)
        if (!newDate) return

        setIsOpen(true)
        setLoading(true)
        setSummary(null)

        const dateStr = format(newDate, 'yyyy-MM-dd')
        const data = await getDailySummary(dateStr)
        setSummary(data)
        setLoading(false)
    }

    return (
        <div className="container max-w-5xl mx-auto py-12">
            <div className="flex flex-col items-center justify-center py-6">
                <div>
                    <CalendarTwin
                        value={date}
                        onChange={handleDateSelect}
                        activeDates={activeDates}
                        className="rounded-md"
                    />
                </div>
            </div>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="max-w-[1200px] w-[95vw] max-h-[85vh] overflow-y-auto">
                    <DialogHeader className="mb-6">
                        <DialogTitle className="text-2xl">
                            {date ? format(date, 'dd.MM.yyyy') : ''}
                        </DialogTitle>
                        <DialogDescription>
                            Günlük Özet (Daily Summary)
                        </DialogDescription>
                    </DialogHeader>

                    {loading ? (
                        <div className="space-y-4">
                            <Skeleton className="h-[120px] w-full rounded-xl" />
                            <Skeleton className="h-[200px] w-full rounded-xl" />
                        </div>
                    ) : summary ? (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* METRICS */}
                            <Card className="h-fit">
                                <CardHeader className="py-3 bg-muted/30">
                                    <CardTitle className="text-sm font-medium">Vücut Verileri (Metrics)</CardTitle>
                                </CardHeader>
                                <CardContent className="pt-4">
                                    {summary.metrics ? (
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <p className="text-muted-foreground">Kilo</p>
                                                <p className="font-medium text-lg">{summary.metrics.weight} kg</p>
                                            </div>
                                            <div>
                                                <p className="text-muted-foreground">Yağ Oranı</p>
                                                <p className="font-medium text-lg">{summary.metrics.fat_rate !== null ? `${summary.metrics.fat_rate}%` : '-'}</p>
                                            </div>
                                            <div>
                                                <p className="text-muted-foreground">Kas Kütlesi</p>
                                                <p className="font-medium text-lg">{summary.metrics.muscle_rate !== null ? `${summary.metrics.muscle_rate}%` : '-'}</p>
                                            </div>
                                            <div>
                                                <p className="text-muted-foreground">Su Oranı</p>
                                                <p className="font-medium text-lg">{summary.metrics.water_rate !== null ? `${summary.metrics.water_rate}%` : '-'}</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="text-sm text-muted-foreground italic">Tartı verisi bulunamadı.</p>
                                    )}
                                </CardContent>
                            </Card>

                            {/* MEALS */}
                            <Card className="h-fit lg:col-span-1">
                                <CardHeader className="py-3 bg-muted/30">
                                    <CardTitle className="text-sm font-medium">Beslenme (Meals)</CardTitle>
                                </CardHeader>
                                <CardContent className="p-0">
                                    {summary.meals.length > 0 ? (
                                        <Table>
                                            <TableHeader>
                                                <TableRow className="hover:bg-transparent">
                                                    <TableHead className="h-8">İsim</TableHead>
                                                    <TableHead className="h-8 text-right text-muted-foreground text-xs">Prot.</TableHead>
                                                    <TableHead className="h-8 text-right text-muted-foreground text-xs">Karb.</TableHead>
                                                    <TableHead className="h-8 text-right text-muted-foreground text-xs">Yağ</TableHead>
                                                    <TableHead className="h-8 text-right text-primary">Kalori</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {summary.meals.map((m: any, i: number) => (
                                                    <TableRow key={i} className="hover:bg-transparent">
                                                        <TableCell className="py-2 text-sm font-medium">{m.name}</TableCell>
                                                        <TableCell className="py-2 text-right text-xs text-muted-foreground">{m.protein}g</TableCell>
                                                        <TableCell className="py-2 text-right text-xs text-muted-foreground">{m.carbs}g</TableCell>
                                                        <TableCell className="py-2 text-right text-xs text-muted-foreground">{m.fat}g</TableCell>
                                                        <TableCell className="py-2 text-right font-medium text-primary">{m.calories}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                            <TableFooter>
                                                <TableRow>
                                                    <TableCell className="font-semibold">Toplam</TableCell>
                                                    <TableCell className="text-right text-xs">{summary.totals.protein}g</TableCell>
                                                    <TableCell className="text-right text-xs">{summary.totals.carbs}g</TableCell>
                                                    <TableCell className="text-right text-xs">{summary.totals.fat}g</TableCell>
                                                    <TableCell className="text-right text-primary font-bold">{summary.totals.calories}</TableCell>
                                                </TableRow>
                                            </TableFooter>
                                        </Table>
                                    ) : (
                                        <div className="p-4">
                                            <p className="text-sm text-muted-foreground italic">Beslenme verisi bulunamadı.</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* WORKOUTS */}
                            <Card className="h-fit">
                                <CardHeader className="py-3 bg-muted/30">
                                    <CardTitle className="text-sm font-medium">Antrenman (Workouts)</CardTitle>
                                </CardHeader>
                                <CardContent className="p-0">
                                    {summary.workouts.length > 0 ? (
                                        <Table>
                                            <TableHeader>
                                                <TableRow className="hover:bg-transparent">
                                                    <TableHead className="h-8">Aktivite</TableHead>
                                                    <TableHead className="h-8 text-right">Süre (dk)</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {summary.workouts.map((w: any, i: number) => (
                                                    <TableRow key={i} className="hover:bg-transparent">
                                                        <TableCell className="py-2 text-sm font-medium">{w.name}</TableCell>
                                                        <TableCell className="py-2 text-right">{w.duration}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    ) : (
                                        <div className="p-4">
                                            <p className="text-sm text-muted-foreground italic">Antrenman verisi bulunamadı.</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    ) : null}
                </DialogContent>
            </Dialog>
        </div>
    )
}
