import { getRuns } from "@/actions/runs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { format } from "date-fns"

export const dynamic = 'force-dynamic'

export default async function RunsPage() {
    const runs = await getRuns()

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Run History (iOS Sync Test)</h2>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Recent Runs</CardTitle>
                    <CardDescription>
                        Data synchronized from the custom iOS app.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Duration</TableHead>
                                <TableHead>Distance</TableHead>
                                <TableHead>Calories</TableHead>
                                <TableHead>Avg HR</TableHead>
                                <TableHead>Steps</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {runs.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                                        No run data found. Sync from iOS app to see entries here.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                runs.map((run) => (
                                    <TableRow key={run.id}>
                                        <TableCell className="font-medium">
                                            {format(new Date(run.date), 'dd MMM yyyy, HH:mm')}
                                        </TableCell>
                                        <TableCell>{run.duration} mins</TableCell>
                                        <TableCell>{run.distance} km</TableCell>
                                        <TableCell>{run.calories || '-'} kcal</TableCell>
                                        <TableCell>{run.average_heart_rate || '-'} bpm</TableCell>
                                        <TableCell>{run.steps || '-'}</TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
