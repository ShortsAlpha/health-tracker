'use client'

import { addMetrics } from '@/actions/metrics'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { useState } from 'react'

export function MetricsForm() {
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (formData: FormData) => {
        setLoading(true)
        const result = await addMetrics(formData)
        setLoading(false)

        if (result?.error) {
            toast.error(result.error)
        } else {
            toast.success('Metrics saved successfully!')
            // Optional: Reset form or keep date
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Body Metrics</CardTitle>
                <CardDescription>Daily weight and composition tracking</CardDescription>
            </CardHeader>
            <CardContent>
                <form action={handleSubmit} className="grid gap-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="date">Date</Label>
                            <Input type="date" id="date" name="date" required defaultValue={new Date().toISOString().split('T')[0]} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="weight">Weight (kg)</Label>
                            <Input type="number" step="0.1" id="weight" name="weight" placeholder="0.0" />
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="fat_rate">Fat %</Label>
                            <Input type="number" step="0.1" id="fat_rate" name="fat_rate" placeholder="%" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="muscle_rate">Muscle (kg)</Label>
                            <Input type="number" step="0.1" id="muscle_rate" name="muscle_rate" placeholder="kg" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="water_rate">Water %</Label>
                            <Input type="number" step="0.1" id="water_rate" name="water_rate" placeholder="%" />
                        </div>
                    </div>



                    <Button type="submit" disabled={loading}>
                        {loading ? 'Saving...' : 'Save Metrics'}
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}
