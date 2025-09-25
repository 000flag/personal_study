"use client"

import { useState } from "react"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { ResponsiveLayout } from "@/components/layout/responsive-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Edit, Trash2, Calendar, Clock, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const mockScheduledPosts = [
  {
    id: "1",
    title: "The Future of Web Development",
    excerpt: "Exploring upcoming trends and technologies that will shape web development...",
    scheduledAt: "2024-01-20T09:00:00Z",
    tags: ["Web Development", "Technology", "Future"],
    visibility: "public",
    status: "scheduled",
  },
  {
    id: "2",
    title: "Advanced CSS Grid Techniques",
    excerpt: "Master complex layouts with these advanced CSS Grid techniques and patterns...",
    scheduledAt: "2024-01-22T14:30:00Z",
    tags: ["CSS", "Grid", "Layout"],
    visibility: "public",
    status: "scheduled",
  },
  {
    id: "3",
    title: "Building Accessible Web Applications",
    excerpt: "A comprehensive guide to creating inclusive and accessible web experiences...",
    scheduledAt: "2024-01-25T11:15:00Z",
    tags: ["Accessibility", "Web Development", "UX"],
    visibility: "followers-only",
    status: "scheduled",
  },
]

export default function ScheduledPostsPage() {
  const [posts, setPosts] = useState(mockScheduledPosts)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("scheduled")

  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    switch (sortBy) {
      case "title":
        return a.title.localeCompare(b.title)
      case "scheduled":
      default:
        return new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime()
    }
  })

  const handleCancelSchedule = (postId: string) => {
    setPosts(posts.filter((post) => post.id !== postId))
  }

  const handleReschedule = (postId: string) => {
    // In a real app, this would open a date picker
    console.log("Reschedule post:", postId)
  }

  const getTimeUntilPublish = (scheduledAt: string) => {
    const now = new Date()
    const scheduled = new Date(scheduledAt)
    const diff = scheduled.getTime() - now.getTime()

    if (diff < 0) return "Overdue"

    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))

    if (days > 0) return `in ${days} day${days > 1 ? "s" : ""}`
    if (hours > 0) return `in ${hours} hour${hours > 1 ? "s" : ""}`
    return "soon"
  }

  return (
    <ProtectedRoute>
      <ResponsiveLayout>
        <div className="container mx-auto px-4 py-6 max-w-6xl">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold">Scheduled Posts</h1>
              <Button>
                <Edit className="h-4 w-4 mr-2" />
                Schedule New Post
              </Button>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search scheduled posts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="scheduled">Publish Date</SelectItem>
                  <SelectItem value="title">Title</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Scheduled Posts List */}
            <div className="space-y-4">
              {sortedPosts.map((post) => (
                <Card key={post.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-3">
                        <div className="space-y-1">
                          <h3 className="text-lg font-semibold line-clamp-1">{post.title}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(post.scheduledAt).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>
                              {new Date(post.scheduledAt).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                          <Badge variant="outline" className="text-blue-600 border-blue-200">
                            {getTimeUntilPublish(post.scheduledAt)}
                          </Badge>
                          <Badge variant={post.visibility === "public" ? "default" : "secondary"}>
                            {post.visibility.replace("-", " ")}
                          </Badge>
                        </div>

                        {post.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {post.tags.map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Post
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleReschedule(post.id)}>
                            <Clock className="h-4 w-4 mr-2" />
                            Reschedule
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleCancelSchedule(post.id)} className="text-destructive">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Cancel Schedule
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {sortedPosts.length === 0 && (
                <div className="text-center py-12">
                  <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No scheduled posts</h3>
                  <p className="text-muted-foreground mb-4">
                    {searchTerm
                      ? "No scheduled posts match your search"
                      : "Schedule your first post for future publishing"}
                  </p>
                  <Button>
                    <Edit className="h-4 w-4 mr-2" />
                    Schedule New Post
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
