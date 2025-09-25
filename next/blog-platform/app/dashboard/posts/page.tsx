import { ProtectedRoute } from "@/components/auth/protected-route"
import { ResponsiveLayout } from "@/components/layout/responsive-layout"
import { DraftManager } from "@/components/posts/draft-manager"

export default function PostsPage() {
  return (
    <ProtectedRoute>
      <ResponsiveLayout>
        <div className="container mx-auto px-4 py-6 max-w-6xl">
          <DraftManager />
        </div>
      </ResponsiveLayout>
    </ProtectedRoute>
  )
}
