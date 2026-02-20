'use client'

import { useState, useEffect } from 'react'
import { getMeals, deleteMeal } from '@/actions/meals'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from '@/components/ui/button'
import { Trash2, ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react'
import { toast } from 'sonner'
import { Skeleton } from '@/components/ui/skeleton'
import { format, subDays, addDays, isSameDay } from 'date-fns'

export function TodaysFood() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [meals, setMeals] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedDate, setSelectedDate] = useState<Date>(new Date())

    const dateStr = format(selectedDate, 'yyyy-MM-dd')

    const loadMeals = async () => {
        setLoading(true)
        const data = await getMeals(dateStr)
        setMeals(data || [])
        setLoading(false)
    }

    useEffect(() => {
        loadMeals()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dateStr])

    const handleDelete = async (id: number) => {
        const result = await deleteMeal(id)
        if (result?.error) {
            toast.error(result.error)
        } else {
            toast.success('Meal deleted')
            loadMeals()
        }
    }

    const handlePrevDay = () => setSelectedDate(subDays(selectedDate, 1))
    const handleNextDay = () => setSelectedDate(addDays(selectedDate, 1))
    const isToday = isSameDay(selectedDate, new Date())

    // Calculations
    const totalCalories = meals.reduce((acc, curr) => acc + (curr.calories || 0), 0)
    const totalProtein = meals.reduce((acc, curr) => acc + (curr.protein || 0), 0)
    const totalCarbs = meals.reduce((acc, curr) => acc + (curr.carbs || 0), 0)
    const totalFat = meals.reduce((acc, curr) => acc + (curr.fat || 0), 0)

    if (loading) {
        return <Skeleton className="h-[300px] w-full rounded-xl" />
    }

    return (
        <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="space-y-1">
                    <CardTitle>Günlük Beslenme</CardTitle>
                    <CardDescription>{isToday ? 'Bugün' : format(selectedDate, 'dd.MM.yyyy')} için kaydedilen öğünler</CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                    <Button variant="outline" size="icon" onClick={handlePrevDay}>
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <div className="flex items-center text-sm font-medium w-32 justify-center">
                        <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                        {dateStr}
                    </div>
                    <Button variant="outline" size="icon" onClick={handleNextDay} disabled={isToday}>
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableCaption>A list of your daily meals.</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[40%]">Name</TableHead>
                            <TableHead>Kcal</TableHead>
                            <TableHead>Prot</TableHead>
                            <TableHead>Carb</TableHead>
                            <TableHead>Fat</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {meals.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                                    {isToday ? 'Bugün' : format(selectedDate, 'dd.MM.yyyy')} için öğün kaydedilmedi.
                                </TableCell>
                            </TableRow>
                        ) : (
                            meals.map((meal) => (
                                <TableRow key={meal.id}>
                                    <TableCell className="font-medium">{meal.name}</TableCell>
                                    <TableCell>{meal.calories}</TableCell>
                                    <TableCell>{meal.protein}g</TableCell>
                                    <TableCell>{meal.carbs}g</TableCell>
                                    <TableCell>{meal.fat}g</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon" onClick={() => handleDelete(meal.id)}>
                                            <Trash2 className="h-4 w-4 text-destructive" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TableCell>Total</TableCell>
                            <TableCell>{totalCalories}</TableCell>
                            <TableCell>{totalProtein}g</TableCell>
                            <TableCell>{totalCarbs}g</TableCell>
                            <TableCell>{totalFat}g</TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    </TableFooter>
                </Table>
            </CardContent>
        </Card>
    )
}
