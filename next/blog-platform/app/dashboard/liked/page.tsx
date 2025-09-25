"use client"

import { useState } from "react"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { ResponsiveLayout } from "@/components/layout/responsive-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { blogPosts } from "@/lib/blog-data"
import { MobilePostCard } from "@/components/feed/mobile-post-card"
import { DesktopPostCard } from "@/components/feed/desktop-post-card"
import { useMobile } from "@/hooks/use-mobile"
import { Search, Heart, Calendar, TrendingUp } from "lucide-react"

export default function LikedPostsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("liked")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const isMobile = useMobile()

  // Mock liked posts (in a real app, this would come from user's liked posts)
  const likedPosts = blogPosts.slice(0, 6).map((post) => ({
    ...post,
    likedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
  }))

  const filteredPosts = likedPosts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.author.name.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory = categoryFilter === "all" || post.category === categoryFilter

    return matchesSearch && matchesCategory
  })

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    switch (sortBy) {
      case "title":
        return a.title.localeCompare(b.title)
      case "author":
        return a.author.name.localeCompare(b.author.name)
      case "published":
        return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      case "liked":
      default:
        return new Date(b.likedAt).getTime() - new Date(a.likedAt).getTime()
    }
  })

  const categories = Array.from(new Set(likedPosts.map((post) => post.category)))

  return (
    <ProtectedRoute>
      <ResponsiveLayout>
        <div className="container mx-auto px-4 py-6 max-w-6xl">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">Liked Posts</h1>
                <p className="text-muted-foreground">Posts you've liked and want to revisit</p>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-red-500" />
                <span className="font-semibold">{likedPosts.length}</span>
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search liked posts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="liked">Recently Liked</SelectItem>
                  <SelectItem value="published">Recently Published</SelectItem>
                  <SelectItem value="title">Title</SelectItem>
                  <SelectItem value="author">Author</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <Heart className="h-4 w-4 text-red-500" />
                  <span className="text-sm font-medium">Total Liked</span>
                </div>
                <div className="text-2xl font-bold mt-1">{likedPosts.length}</div>
              </div>
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-medium">This Month</span>
                </div>
                <div className="text-2xl font-bold mt-1">
                  {likedPosts.filter((post) => new Date(post.likedAt).getMonth() === new Date().getMonth()).length}
                </div>
              </div>
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium">Categories</span>
                </div>
                <div className="text-2xl font-bold mt-1">{categories.length}</div>
              </div>
            </div>

            {/* Posts */}
            {sortedPosts.length === 0 ? (
              <div className="text-center py-12">
                <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No liked posts found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm || categoryFilter !== "all"
                    ? "Try adjusting your filters"
                    : "Start liking posts to build your collection"}
                </p>
                <Button asChild>
                  <a href="/">Explore Posts</a>
                </Button>
              </div>
            ) : (
              <div className={isMobile ? "grid grid-cols-2 gap-3" : "space-y-6"}>
                {sortedPosts.map((post) =>
                  isMobile ? (
                    <MobilePostCard key={post.id} post={post} />
                  ) : (
                    <DesktopPostCard key={post.id} post={post} />
                  ),
                )}
              </div>
            )}
          </div>
        </div>
      </ResponsiveLayout>
    </ProtectedRoute>
  )
}
