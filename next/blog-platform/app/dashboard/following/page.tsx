"use client"

import { useState } from "react"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { ResponsiveLayout } from "@/components/layout/responsive-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Users, Calendar, MessageCircle, UserMinus } from "lucide-react"

const mockFollowing = [
  {
    id: "1",
    name: "Tech Insights",
    username: "techinsights",
    avatar: "",
    bio: "Latest trends in technology and software development",
    followedAt: "2024-01-12T09:00:00Z",
    postsCount: 45,
    followersCount: 1200,
    lastPostAt: "2024-01-15T10:30:00Z",
    category: "Technology",
  },
  {
    id: "2",
    name: "Design Weekly",
    username: "designweekly",
    avatar: "/professional-designer.png",
    bio: "Weekly design inspiration and UI/UX tips",
    followedAt: "2024-01-10T14:30:00Z",
    postsCount: 32,
    followersCount: 890,
    lastPostAt: "2024-01-14T16:45:00Z",
    category: "Design",
  },
  {
    id: "3",
    name: "Code Academy",
    username: "codeacademy",
    avatar: "",
    bio: "Learn programming with practical examples and tutorials",
    followedAt: "2024-01-08T11:15:00Z",
    postsCount: 67,
    followersCount: 2100,
    lastPostAt: "2024-01-15T08:20:00Z",
    category: "Education",
  },
  {
    id: "4",
    name: "Startup Stories",
    username: "startupstories",
    avatar: "/professional-woman-developer.png",
    bio: "Real stories from entrepreneurs and startup founders",
    followedAt: "2024-01-05T16:45:00Z",
    postsCount: 28,
    followersCount: 567,
    lastPostAt: "2024-01-13T12:10:00Z",
    category: "Business",
  },
]

export default function FollowingPage() {
  const [following, setFollowing] = useState(mockFollowing)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("recent")
  const [categoryFilter, setCategoryFilter] = useState("all")

  const filteredFollowing = following.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.bio.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory = categoryFilter === "all" || user.category === categoryFilter

    return matchesSearch && matchesCategory
  })

  const sortedFollowing = [...filteredFollowing].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name)
      case "posts":
        return b.postsCount - a.postsCount
      case "followers":
        return b.followersCount - a.followersCount
      case "active":
        return new Date(b.lastPostAt).getTime() - new Date(a.lastPostAt).getTime()
      case "recent":
      default:
        return new Date(b.followedAt).getTime() - new Date(a.followedAt).getTime()
    }
  })

  const handleUnfollow = (userId: string) => {
    setFollowing((prev) => prev.filter((user) => user.id !== userId))
  }

  const categories = Array.from(new Set(following.map((user) => user.category)))

  const getLastPostTime = (lastPostAt: string) => {
    const now = new Date()
    const lastPost = new Date(lastPostAt)
    const diffInHours = Math.floor((now.getTime() - lastPost.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 24) return `${diffInHours}h ago`
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays}d ago`
    return lastPost.toLocaleDateString()
  }

  return (
    <ProtectedRoute>
      <ResponsiveLayout>
        <div className="container mx-auto px-4 py-6 max-w-6xl">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">Following</h1>
                <p className="text-muted-foreground">Blogs and authors you follow</p>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-500" />
                <span className="font-semibold">{following.length}</span>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-medium">Following</span>
                </div>
                <div className="text-2xl font-bold mt-1">{following.length}</div>
              </div>
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium">Total Posts</span>
                </div>
                <div className="text-2xl font-bold mt-1">
                  {following.reduce((sum, user) => sum + user.postsCount, 0)}
                </div>
              </div>
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-purple-500" />
                  <span className="text-sm font-medium">Categories</span>
                </div>
                <div className="text-2xl font-bold mt-1">{categories.length}</div>
              </div>
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-orange-500" />
                  <span className="text-sm font-medium">Active Today</span>
                </div>
                <div className="text-2xl font-bold mt-1">
                  {
                    following.filter((user) => {
                      const lastPost = new Date(user.lastPostAt)
                      const today = new Date()
                      return lastPost.toDateString() === today.toDateString()
                    }).length
                  }
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search following..."
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
                  <SelectItem value="recent">Recently Followed</SelectItem>
                  <SelectItem value="active">Most Active</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="posts">Most Posts</SelectItem>
                  <SelectItem value="followers">Most Followers</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Following List */}
            <div className="space-y-4">
              {sortedFollowing.map((user) => (
                <Card key={user.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={user.avatar || "/placeholder.svg"} />
                          <AvatarFallback>
                            {user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>

                        <div className="space-y-2">
                          <div>
                            <h3 className="font-semibold">{user.name}</h3>
                            <p className="text-sm text-muted-foreground">@{user.username}</p>
                          </div>

                          <p className="text-sm text-muted-foreground max-w-md">{user.bio}</p>

                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <Badge variant="outline" className="text-xs">
                              {user.category}
                            </Badge>
                            <div className="flex items-center gap-1">
                              <MessageCircle className="h-3 w-3" />
                              <span>{user.postsCount} posts</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              <span>{user.followersCount} followers</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              <span>Last post {getLastPostTime(user.lastPostAt)}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUnfollow(user.id)}
                          className="bg-transparent hover:bg-destructive hover:text-destructive-foreground"
                        >
                          <UserMinus className="h-4 w-4 mr-2" />
                          Unfollow
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {sortedFollowing.length === 0 && (
                <div className="text-center py-12">
                  <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No one found</h3>
                  <p className="text-muted-foreground mb-4">
                    {searchTerm || categoryFilter !== "all"
                      ? "Try adjusting your filters"
                      : "Discover and follow interesting authors"}
                  </p>
                  <Button asChild>
                    <a href="/search">Discover Authors</a>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </ResponsiveLayout>
    </ProtectedRoute>
  )
}
