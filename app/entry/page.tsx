
import { MetricsForm } from '@/components/metrics-form'
import { NutritionForm } from '@/components/nutrition-form'
import { BiometricsChart } from '@/components/dashboard/biometrics-chart'
import { getBiometricStats } from '@/actions/dashboard'

export default async function EntryPage() {
    const biometricData = await getBiometricStats('monthly') // Last 30 days context

    return (
        <div className="container max-w-6xl mx-auto py-8 px-4 space-y-8">
            <h1 className="text-3xl font-bold mb-6">Daily Entry</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                {/* Left Column: Metrics & Chart */}
                <div className="space-y-6">
                    <MetricsForm />

                    <div className="border rounded-xl p-4 bg-card shadow-sm">
                        <h3 className="text-lg font-semibold mb-4 ml-2">Recent Trends</h3>
                        <div className="h-[300px]">
                            <BiometricsChart data={biometricData} period="monthly" />
                        </div>
                    </div>
                </div>

                {/* Right Column: Nutrition */}
                <div>
                    <NutritionForm />
                </div>
            </div>
        </div>
    )
}

