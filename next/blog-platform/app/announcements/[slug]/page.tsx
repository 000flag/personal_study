"use client"

import { useParams } from "next/navigation"
import { ArrowLeft, Calendar, Megaphone } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

const announcements = [
  {
    id: 1,
    title: "New Mobile Experience Launch",
    excerpt: "We're excited to introduce our new Instagram-like mobile experience with improved navigation and feed.",
    content: `We're thrilled to announce the launch of our completely redesigned mobile experience! 

## What's New

### Instagram-like Feed
- **Square post cards** optimized for mobile viewing
- **Infinite scroll** for seamless browsing
- **Improved image loading** with better performance

### Enhanced Navigation
- **Bottom tab bar** for easy one-handed navigation
- **Swipe gestures** for quick actions
- **Optimized touch targets** for better accessibility

### Performance Improvements
- **50% faster loading times** on mobile devices
- **Reduced data usage** with optimized images
- **Better offline support** for reading saved posts

## Getting Started

The new mobile experience is automatically enabled for all users on phones and tablets. Simply visit our site on your mobile device to experience the new interface.

## Feedback

We'd love to hear your thoughts on the new mobile experience! Please share your feedback through our contact form or reach out to us on social media.

Thank you for being part of our community!`,
    type: "feature",
    isPinned: true,
    publishedAt: "2024-01-15",
    slug: "new-mobile-experience-launch",
  },
]

const typeColors = {
  feature: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
  maintenance: "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400",
  policy: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
}

export default function AnnouncementDetailPage() {
  const params = useParams()
  const slug = params.slug as string

  const announcement = announcements.find((a) => a.slug === slug)

  if (!announcement) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Megaphone className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Announcement not found</h1>
          <p className="text-muted-foreground">The announcement you're looking for doesn't exist.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-3xl">
        {/* Back Button */}
        <Link href="/announcements" className="inline-flex items-center text-muted-foreground hover:text-primary mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to announcements
        </Link>

        {/* Announcement Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Badge className={typeColors[announcement.type as keyof typeof typeColors]}>{announcement.type}</Badge>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Calendar className="h-3 w-3" />
              {new Date(announcement.publishedAt).toLocaleDateString()}
            </div>
          </div>

          <h1 className="text-3xl font-bold mb-4 text-balance">{announcement.title}</h1>
          <p className="text-lg text-muted-foreground text-pretty">{announcement.excerpt}</p>
        </div>

        {/* Content */}
        <Card>
          <CardContent className="p-6">
            <div className="prose prose-gray dark:prose-invert max-w-none">
              <div className="whitespace-pre-wrap">{announcement.content}</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
