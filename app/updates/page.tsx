
import { WeeklyUpdateView } from '@/components/updates/weekly-update-view'

export default function UpdatesPage() {
    return (
        <div className="container max-w-4xl mx-auto py-8">
            <h1 className="text-3xl font-bold mb-8">Data Entry & Updates</h1>
            <WeeklyUpdateView />
        </div>
    )
}
