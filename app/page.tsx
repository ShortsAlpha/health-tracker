
import { DashboardView } from '@/components/dashboard/dashboard-view'

export const dynamic = 'force-dynamic'

export default function DashboardPage() {
  return (
    <div className="container max-w-screen-xl mx-auto py-8 px-4 space-y-8">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>
      <DashboardView />
    </div>
  )
}
