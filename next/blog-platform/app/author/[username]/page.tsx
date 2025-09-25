"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { User, MapPin, Link, Calendar, Users, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { blogPosts } from "@/lib/blog-data"
import { MobilePostCard } from "@/components/feed/mobile-post-card"
import { DesktopPostCard } from "@/components/feed/desktop-post-card"
import { useMobile } from "@/hooks/use-mobile"
import { useToast } from "@/hooks/use-toast"

// Mock author data
const authors = [
  {
    username: "sarah-chen",
    name: "Sarah Chen",
    bio: "Full-stack developer passionate about React, Node.js, and building scalable web applications. Always learning something new!",
    avatar: "/professional-woman-developer.png",
    location: "San Francisco, CA",
    website: "https://sarahchen.dev",
    joinedAt: "2023-01-15",
    followers: 1234,
    following: 567,
    isFollowing: false,
  },
  {
    username: "alex-rivera",
    name: "Alex Rivera",
    bio: "UI/UX designer and frontend developer. I love creating beautiful, accessible interfaces that users enjoy.",
    avatar: "/professional-designer.png",
    location: "New York, NY",
    website: "https://alexrivera.design",
    joinedAt: "2022-08-20",
    followers: 892,
    following: 234,
    isFollowing: false,
  },
]

export default function AuthorProfilePage() {
  const params = useParams()
  const username = params.username as string
  const { toast } = useToast()
  const [isFollowing, setIsFollowing] = useState(false)
  const isMobile = useMobile()

  const author = authors.find((a) => a.username === username)
  const authorPosts = blogPosts.filter((post) => post.author.username === username)

  const handleFollow = () => {
    setIsFollowing(!isFollowing)
    toast({
      description: isFollowing ? `Unfollowed ${author?.name}` : `Following ${author?.name}`,
    })
  }

  if (!author) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">작성자를 찾을 수 없습니다</h1>
          <p className="text-muted-foreground">찾고 있는 작성자가 존재하지 않습니다.</p>
        </div>
      </div>
    )
  }

  const totalLikes = authorPosts.reduce((sum, post) => sum + post.likes, 0)
  const totalComments = authorPosts.reduce((sum, post) => sum + post.comments, 0)

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Author Header */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              <Avatar className="h-24 w-24 mx-auto md:mx-0">
                <AvatarImage src={author.avatar || "/placeholder.svg"} />
                <AvatarFallback className="text-2xl">
                  {author.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                  <div>
                    <h1 className="text-2xl font-bold mb-1">{author.name}</h1>
                    <p className="text-muted-foreground">@{author.username}</p>
                  </div>
                  <Button onClick={handleFollow} variant={isFollowing ? "outline" : "default"} className="mt-4 md:mt-0">
                    <Users className="h-4 w-4 mr-2" />
                    {isFollowing ? "팔로잉" : "팔로우"}
                  </Button>
                </div>

                <p className="text-muted-foreground mb-4 text-pretty">{author.bio}</p>

                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
                  {author.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {author.location}
                    </div>
                  )}
                  {author.website && (
                    <a
                      href={author.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 hover:text-primary"
                    >
                      <Link className="h-4 w-4" />
                      Website
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Joined{" "}
                    {new Date(author.joinedAt).toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                    })}
                  </div>
                </div>

                <div className="flex items-center gap-6 text-sm">
                  <div>
                    <span className="font-semibold">{author.followers.toLocaleString()}</span>
                    <span className="text-muted-foreground ml-1">팔로워</span>
                  </div>
                  <div>
                    <span className="font-semibold">{author.following.toLocaleString()}</span>
                    <span className="text-muted-foreground ml-1">팔로잉</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold">{authorPosts.length}</div>
              <div className="text-sm text-muted-foreground">게시물</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold">{totalLikes.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">좋아요</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold">{totalComments.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">댓글</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold">
                {authorPosts.reduce((sum, post) => sum + post.views, 0).toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">조회수</div>
            </CardContent>
          </Card>
        </div>

        {/* Posts */}
        <Tabs defaultValue="posts" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="posts">게시물 ({authorPosts.length})</TabsTrigger>
            <TabsTrigger value="about">소개</TabsTrigger>
          </TabsList>

          <TabsContent value="posts" className="mt-6">
            {authorPosts.length === 0 ? (
              <div className="text-center py-12">
                <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">아직 게시물이 없습니다</h3>
                <p className="text-muted-foreground">{author.name}님이 아직 게시물을 작성하지 않았습니다.</p>
              </div>
            ) : (
              <div className={isMobile ? "grid grid-cols-2 gap-3" : "space-y-6"}>
                {authorPosts.map((post) =>
                  isMobile ? (
                    <MobilePostCard key={post.id} post={post} />
                  ) : (
                    <DesktopPostCard key={post.id} post={post} />
                  ),
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="about" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">{author.name}님 소개</h3>
                <p className="text-muted-foreground mb-6">{author.bio}</p>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">연락처</h4>
                    <div className="space-y-2 text-sm">
                      {author.website && (
                        <a
                          href={author.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-primary hover:underline"
                        >
                          <Link className="h-4 w-4" />
                          {author.website}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">활동</h4>
                    <div className="text-sm text-muted-foreground">
                      <p>가입일 {new Date(author.joinedAt).toLocaleDateString("ko-KR")}</p>
                      <p>{authorPosts.length}개의 게시물 작성</p>
                      <p>총 {totalLikes}개의 좋아요 받음</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
