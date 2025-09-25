"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { Tag, TrendingUp, Clock, Hash } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { blogPosts } from "@/lib/blog-data"
import { MobilePostCard } from "@/components/feed/mobile-post-card"
import { DesktopPostCard } from "@/components/feed/desktop-post-card"
import { useMobile } from "@/hooks/use-mobile"

export default function TagPage() {
  const params = useParams()
  const slug = params.slug as string
  const [sortBy, setSortBy] = useState("latest")
  const isMobile = useMobile()

  const tagName = slug.replace(/-/g, " ")
  const tagPosts = blogPosts.filter((post) => post.tags.some((tag) => tag.toLowerCase().replace(/\s+/g, "-") === slug))

  const sortedPosts = [...tagPosts].sort((a, b) => {
    switch (sortBy) {
      case "popular":
        return b.likes - a.likes
      case "oldest":
        return new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime()
      default:
        return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    }
  })

  // Get related tags
  const relatedTags = Array.from(
    new Set(tagPosts.flatMap((post) => post.tags).filter((tag) => tag.toLowerCase().replace(/\s+/g, "-") !== slug)),
  ).slice(0, 10)

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Tag Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Hash className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">#{tagName}</h1>
              <p className="text-muted-foreground">
                {tagPosts.length} posts tagged with "{tagName}"
              </p>
            </div>
          </div>

          {/* Related Tags */}
          {relatedTags.length > 0 && (
            <div className="mb-4">
              <p className="text-sm font-medium mb-2">Related tags:</p>
              <div className="flex flex-wrap gap-2">
                {relatedTags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="cursor-pointer hover:bg-secondary/80">
                    #{tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Tag className="h-4 w-4" />
              {tagPosts.length} posts
            </div>
            <div className="flex items-center gap-1">
              <TrendingUp className="h-4 w-4" />
              {tagPosts.reduce((sum, post) => sum + post.likes, 0)} total likes
            </div>
          </div>
        </div>

        {/* Sort Tabs */}
        <Tabs value={sortBy} onValueChange={setSortBy} className="mb-6">
          <TabsList>
            <TabsTrigger value="latest">
              <Clock className="h-4 w-4 mr-2" />
              Latest
            </TabsTrigger>
            <TabsTrigger value="popular">
              <TrendingUp className="h-4 w-4 mr-2" />
              Popular
            </TabsTrigger>
            <TabsTrigger value="oldest">
              <Clock className="h-4 w-4 mr-2" />
              Oldest
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Posts */}
        {sortedPosts.length === 0 ? (
          <div className="text-center py-12">
            <Hash className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No posts found</h3>
            <p className="text-muted-foreground">No posts have been tagged with "{tagName}" yet.</p>
          </div>
        ) : (
          <div className={isMobile ? "grid grid-cols-2 gap-3" : "space-y-6"}>
            {sortedPosts.map((post) =>
              isMobile ? <MobilePostCard key={post.id} post={post} /> : <DesktopPostCard key={post.id} post={post} />,
            )}
          </div>
        )}
      </div>
    </div>
  )
}
