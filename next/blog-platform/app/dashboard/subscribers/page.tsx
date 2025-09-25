import { ProtectedRoute } from "@/components/auth/protected-route"
import { ResponsiveLayout } from "@/components/layout/responsive-layout"
import { SubscriberManagement } from "@/components/dashboard/subscriber-management"

export default function SubscribersPage() {
  return (
    <ProtectedRoute>
      <ResponsiveLayout>
        <div className="container mx-auto px-4 py-6 max-w-6xl">
          <SubscriberManagement />
        </div>
      </ResponsiveLayout>
    </ProtectedRoute>
  )
}
