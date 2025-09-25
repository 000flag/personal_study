import { ProtectedRoute } from "@/components/auth/protected-route"
import { ResponsiveLayout } from "@/components/layout/responsive-layout"
import { PostEditor } from "@/components/editor/post-editor"

export default function WritePage() {
  return (
    <ProtectedRoute>
      <ResponsiveLayout>
        <PostEditor />
      </ResponsiveLayout>
    </ProtectedRoute>
  )
}
