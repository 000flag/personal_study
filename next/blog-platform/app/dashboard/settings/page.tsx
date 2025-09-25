import { ProtectedRoute } from "@/components/auth/protected-route"
import { ResponsiveLayout } from "@/components/layout/responsive-layout"
import { BlogSettings } from "@/components/dashboard/blog-settings"

export default function SettingsPage() {
  return (
    <ProtectedRoute>
      <ResponsiveLayout>
        <div className="container mx-auto px-4 py-6 max-w-4xl">
          <BlogSettings />
        </div>
      </ResponsiveLayout>
    </ProtectedRoute>
  )
}
