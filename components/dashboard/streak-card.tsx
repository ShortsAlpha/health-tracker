
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Flame } from "lucide-react"

export function StreakCard({ streak }: { streak: number }) {
    return (
        <Card className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border-orange-200 dark:border-orange-900">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-orange-600 dark:text-orange-400 uppercase tracking-wider flex items-center gap-2">
                    <Flame className="h-4 w-4 fill-orange-500 text-orange-500 animate-pulse" />
                    Current Streak
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-4xl font-bold text-foreground">
                    {streak} <span className="text-muted-foreground text-sm font-normal">days</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                    Keep logging to build your fire!
                </p>
            </CardContent>
        </Card>
    )
}
