'use client'

import { useState, useEffect } from 'react'
import { getRecentWorkouts, deleteWorkout } from '@/actions/workouts'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { Skeleton } from '@/components/ui/skeleton'

export function RecentWorkouts() {
    const [workouts, setWorkouts] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    const loadWorkouts = async () => {
        setLoading(true)
        const data = await getRecentWorkouts(10)
        setWorkouts(data || [])
        setLoading(false)
    }

    useEffect(() => {
        loadWorkouts()
    }, [])

    const handleDelete = async (id: number) => {
        const result = await deleteWorkout(id)
        if (result?.error) {
            toast.error(`Error: ${result.error}`)
        } else {
            toast.success('Workout deleted')
            loadWorkouts()
        }
    }

    if (loading) {
        return <Skeleton className="h-[300px] w-full rounded-xl" />
    }

    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle>Recent Workouts</CardTitle>
                <CardDescription>Your last 10 logged workouts</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableCaption>Your workout history.</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead className="w-[40%]">Activity</TableHead>
                            <TableHead className="text-right">Duration (min)</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {workouts.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center h-24 text-muted-foreground">
                                    No workouts logged yet.
                                </TableCell>
                            </TableRow>
                        ) : (
                            workouts.map((workout) => (
                                <TableRow key={workout.id}>
                                    <TableCell className="text-muted-foreground">
                                        {workout.date}
                                    </TableCell>
                                    <TableCell className="font-medium">{workout.name}</TableCell>
                                    <TableCell className="text-right">{workout.duration}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon" onClick={() => handleDelete(workout.id)}>
                                            <Trash2 className="h-4 w-4 text-destructive" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}
