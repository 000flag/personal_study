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
import { Search, Users, Calendar, MessageCircle, UserCheck, UserX } from "lucide-react"

const mockFollowers = [
  {
    id: "1",
    name: "Alex Johnson",
    username: "alexj",
    avatar: "/professional-designer.png",
    bio: "Frontend developer passionate about React and design systems",
    followedAt: "2024-01-10T09:00:00Z",
    postsCount: 23,
    followersCount: 156,
    isFollowingBack: true,
  },
  {
    id: "2",
    name: "Maria Garcia",
    username: "mariag",
    avatar: "/professional-woman-developer.png",
    bio: "UX designer and accessibility advocate",
    followedAt: "2024-01-08T14:30:00Z",
    postsCount: 18,
    followersCount: 89,
    isFollowingBack: false,
  },
  {
    id: "3",
    name: "David Chen",
    username: "davidc",
    avatar: "",
    bio: "Full-stack developer, coffee enthusiast",
    followedAt: "2024-01-05T11:15:00Z",
    postsCount: 31,
    followersCount: 203,
    isFollowingBack: true,
  },
  {
    id: "4",
    name: "Sarah Wilson",
    username: "sarahw",
    avatar: "",
    bio: "Product manager and tech writer",
    followedAt: "2024-01-03T16:45:00Z",
    postsCount: 12,
    followersCount: 67,
    isFollowingBack: false,
  },
]

export default function FollowersPage() {
  const [followers, setFollowers] = useState(mockFollowers)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("recent")
  const [filterBy, setFilterBy] = useState("all")

  const filteredFollowers = followers.filter((follower) => {
    const matchesSearch =
      follower.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      follower.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      follower.bio.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesFilter =
      filterBy === "all" ||
      (filterBy === "following-back" && follower.isFollowingBack) ||
      (filterBy === "not-following-back" && !follower.isFollowingBack)

    return matchesSearch && matchesFilter
  })

  const sortedFollowers = [...filteredFollowers].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name)
      case "posts":
        return b.postsCount - a.postsCount
      case "followers":
        return b.followersCount - a.followersCount
      case "recent":
      default:
        return new Date(b.followedAt).getTime() - new Date(a.followedAt).getTime()
    }
  })

  const handleFollowBack = (followerId: string) => {
    setFollowers((prev) =>
      prev.map((follower) =>
        follower.id === followerId ? { ...follower, isFollowingBack: !follower.isFollowingBack } : follower,
      ),
    )
  }

  const handleRemoveFollower = (followerId: string) => {
    setFollowers((prev) => prev.filter((follower) => follower.id !== followerId))
  }

  const stats = {
    total: followers.length,
    followingBack: followers.filter((f) => f.isFollowingBack).length,
    notFollowingBack: followers.filter((f) => !f.isFollowingBack).length,
  }

  return (
    <ProtectedRoute>
      <ResponsiveLayout>
        <div className="container mx-auto px-4 py-6 max-w-6xl">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">Followers</h1>
                <p className="text-muted-foreground">People who follow your blog</p>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-500" />
                <span className="font-semibold">{followers.length}</span>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-medium">Total Followers</span>
                </div>
                <div className="text-2xl font-bold mt-1">{stats.total}</div>
              </div>
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <UserCheck className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium">Following Back</span>
                </div>
                <div className="text-2xl font-bold mt-1">{stats.followingBack}</div>
              </div>
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <UserX className="h-4 w-4 text-orange-500" />
                  <span className="text-sm font-medium">Not Following Back</span>
                </div>
                <div className="text-2xl font-bold mt-1">{stats.notFollowingBack}</div>
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search followers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={filterBy} onValueChange={setFilterBy}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Followers</SelectItem>
                  <SelectItem value="following-back">Following Back</SelectItem>
                  <SelectItem value="not-following-back">Not Following Back</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Recently Followed</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="posts">Most Posts</SelectItem>
                  <SelectItem value="followers">Most Followers</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Followers List */}
            <div className="space-y-4">
              {sortedFollowers.map((follower) => (
                <Card key={follower.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={follower.avatar || "/placeholder.svg"} />
                          <AvatarFallback>
                            {follower.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>

                        <div className="space-y-2">
                          <div>
                            <h3 className="font-semibold">{follower.name}</h3>
                            <p className="text-sm text-muted-foreground">@{follower.username}</p>
                          </div>

                          <p className="text-sm text-muted-foreground max-w-md">{follower.bio}</p>

                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <MessageCircle className="h-3 w-3" />
                              <span>{follower.postsCount} posts</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              <span>{follower.followersCount} followers</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              <span>Followed {new Date(follower.followedAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {follower.isFollowingBack && (
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            Following
                          </Badge>
                        )}

                        <Button
                          variant={follower.isFollowingBack ? "outline" : "default"}
                          size="sm"
                          onClick={() => handleFollowBack(follower.id)}
                          className={follower.isFollowingBack ? "bg-transparent" : ""}
                        >
                          {follower.isFollowingBack ? "Unfollow" : "Follow Back"}
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveFollower(follower.id)}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {sortedFollowers.length === 0 && (
                <div className="text-center py-12">
                  <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No followers found</h3>
                  <p className="text-muted-foreground mb-4">
                    {searchTerm || filterBy !== "all"
                      ? "Try adjusting your filters"
                      : "Share your content to gain followers"}
                  </p>
                  <Button asChild>
                    <a href="/dashboard/posts">Create New Post</a>
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
