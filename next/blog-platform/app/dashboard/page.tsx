import { ProtectedRoute } from "@/components/auth/protected-route"
import { ResponsiveLayout } from "@/components/layout/responsive-layout"
import { AnalyticsOverview } from "@/components/dashboard/analytics-overview"

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <ResponsiveLayout>
        <div className="container mx-auto px-4 py-6 max-w-6xl">
          <AnalyticsOverview />
        </div>
      </ResponsiveLayout>
    </ProtectedRoute>
  )
}
