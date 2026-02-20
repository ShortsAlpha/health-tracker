'use client'

import { useState } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { toast } from 'sonner'
import { parseWeeklyText, ParsedDailyData } from '@/lib/format-parser'
import { saveWeeklyData } from '@/actions/bulk-save'
import { CircleCheck, Loader2 } from 'lucide-react'

export function WeeklyUpdateView() {
    const todayStr = new Date().toISOString().split('T')[0]
    const defaultTemplate = `=== ${todayStr} ===\nMETRICS: \nMEALS:\n\nWORKOUTS:\n`

    const [text, setText] = useState(defaultTemplate)
    const [parsedData, setParsedData] = useState<ParsedDailyData[]>([])
    const [isSaving, setIsSaving] = useState(false)

    const handleParse = () => {
        try {
            const data = parseWeeklyText(text)
            if (data.length === 0) {
                toast.warning("Could not detect format or find data.")
                return
            }
            setParsedData(data)
            toast.success(`Successfully parsed ${data.length} days of data.`)
        } catch {
            toast.error("An error occurred during parsing.")
        }
    }

    const handleSave = async () => {
        setIsSaving(true)
        try {
            const result = await saveWeeklyData(parsedData)
            // Note: saveWeeklyData returns { success: boolean, error?: string } from server action
            // but the function signature in actions/bulk-save.ts returns void or throws?
            // Let's check bulk-save.ts again.
            // It returns { success: boolean, error: string } in catch block, or { success: true }

            if (result.success) {
                toast.success("All data saved successfully!")
                setParsedData([])
                setText('')
            } else {
                toast.error(`Error saving data: ${result.error}`)
            }
        } catch (e: unknown) {
            toast.error(`Unexpected error: ${e instanceof Error ? e.message : 'Unknown'}`)
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>Daily / Bulk Data Entry</CardTitle>
                    <CardDescription>
                        Paste or fill in your daily data in the designated format below.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Textarea
                        placeholder="=== 2025-10-24 ===..."
                        className="min-h-[300px] font-mono text-sm bg-zinc-950 text-zinc-300"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                    />
                    <div className="flex justify-end gap-4">
                        <Button variant="secondary" onClick={() => setText(defaultTemplate)}>Reset Template</Button>
                        <Button onClick={handleParse} disabled={!text}>Preview & Parse</Button>
                    </div>
                </CardContent>
            </Card>

            {parsedData.length > 0 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-semibold">Preview ({parsedData.length} Days)</h3>
                        <Button onClick={handleSave} disabled={isSaving}>
                            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CircleCheck className="mr-2 h-4 w-4" />}
                            Save Data
                        </Button>
                    </div>

                    <div className="grid gap-6">
                        {parsedData.map((day) => (
                            <Card key={day.date} className="overflow-hidden border-l-4 border-l-primary/50">
                                <CardHeader className="bg-muted/30 py-3">
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-base font-mono">{day.date}</CardTitle>
                                        <div className="text-xs text-muted-foreground space-x-2">
                                            {day.weight !== undefined && <span>Weight: {day.weight}kg</span>}
                                            {day.fat_rate !== undefined && <span>Fat: {day.fat_rate}%</span>}
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x">
                                        {/* MEALS */}
                                        <div className="p-4">
                                            <h4 className="text-sm font-semibold mb-2 text-muted-foreground uppercase tracking-wider">Meals</h4>
                                            {day.meals.length > 0 ? (
                                                <Table>
                                                    <TableHeader>
                                                        <TableRow className="hover:bg-transparent">
                                                            <TableHead className="h-8">Name</TableHead>
                                                            <TableHead className="h-8 text-right text-muted-foreground whitespace-nowrap">Protein</TableHead>
                                                            <TableHead className="h-8 text-right text-muted-foreground whitespace-nowrap">Carbs</TableHead>
                                                            <TableHead className="h-8 text-right text-muted-foreground whitespace-nowrap">Fat</TableHead>
                                                            <TableHead className="h-8 text-right text-primary whitespace-nowrap">Calories</TableHead>
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody>
                                                        {day.meals.map((m, i) => (
                                                            <TableRow key={i} className="hover:bg-transparent">
                                                                <TableCell className="py-1 font-medium">{m.name}</TableCell>
                                                                <TableCell className="py-1 text-right text-muted-foreground">{m.protein}g</TableCell>
                                                                <TableCell className="py-1 text-right text-muted-foreground">{m.carbs}g</TableCell>
                                                                <TableCell className="py-1 text-right text-muted-foreground">{m.fat}g</TableCell>
                                                                <TableCell className="py-1 text-right font-medium text-primary">{m.calories}</TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            ) : (
                                                <p className="text-sm text-muted-foreground italic">No meal data</p>
                                            )}
                                        </div>

                                        {/* WORKOUTS */}
                                        <div className="p-4">
                                            <h4 className="text-sm font-semibold mb-2 text-muted-foreground uppercase tracking-wider">Workouts</h4>
                                            {day.workouts.length > 0 ? (
                                                <Table>
                                                    <TableHeader>
                                                        <TableRow className="hover:bg-transparent">
                                                            <TableHead className="h-8">Activity</TableHead>
                                                            <TableHead className="h-8 text-right">Duration (min)</TableHead>
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody>
                                                        {day.workouts.map((w, i) => (
                                                            <TableRow key={i} className="hover:bg-transparent">
                                                                <TableCell className="py-1 font-medium">{w.name}</TableCell>
                                                                <TableCell className="py-1 text-right">{w.duration}</TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            ) : (
                                                <p className="text-sm text-muted-foreground italic">No workout data</p>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
