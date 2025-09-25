import { ResponsiveLayout } from "@/components/layout/responsive-layout"
import { MainFeed } from "@/components/feed/main-feed"

export default function HomePage() {
  return (
    <ResponsiveLayout>
      <div className="max-w-4xl mx-auto px-6 py-8 md:py-12">
        <MainFeed />
      </div>
    </ResponsiveLayout>
  )
}
