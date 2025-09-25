"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { Folder, TrendingUp, Clock, Users } from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { blogPosts } from "@/lib/blog-data"
import { categories } from "@/data/categories"
import { MobilePostCard } from "@/components/feed/mobile-post-card"
import { DesktopPostCard } from "@/components/feed/desktop-post-card"
import { useMobile } from "@/hooks/use-mobile"

export default function CategoryPage() {
  const params = useParams()
  const slug = params.slug as string
  const [sortBy, setSortBy] = useState("latest")
  const isMobile = useMobile()

  const category = categories.find((cat) => cat.slug === slug)
  const categoryPosts = blogPosts.filter((post) => post.category === category?.name)

  const sortedPosts = [...categoryPosts].sort((a, b) => {
    switch (sortBy) {
      case "popular":
        return b.likes - a.likes
      case "oldest":
        return new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime()
      default:
        return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    }
  })

  if (!category) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Folder className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">카테고리를 찾을 수 없습니다</h1>
          <p className="text-muted-foreground">찾고 있는 카테고리가 존재하지 않습니다.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Category Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center">
              <Folder className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{category.name}</h1>
              <p className="text-muted-foreground">{category.description}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              {categoryPosts.length}개의 게시물
            </div>
            <div className="flex items-center gap-1">
              <TrendingUp className="h-4 w-4" />총 {categoryPosts.reduce((sum, post) => sum + post.likes, 0)}개의 좋아요
            </div>
          </div>
        </div>

        {/* Sort Tabs */}
        <Tabs value={sortBy} onValueChange={setSortBy} className="mb-6">
          <TabsList>
            <TabsTrigger value="latest">
              <Clock className="h-4 w-4 mr-2" />
              최신
            </TabsTrigger>
            <TabsTrigger value="popular">
              <TrendingUp className="h-4 w-4 mr-2" />
              인기
            </TabsTrigger>
            <TabsTrigger value="oldest">
              <Clock className="h-4 w-4 mr-2" />
              오래된 순
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Posts */}
        {sortedPosts.length === 0 ? (
          <div className="text-center py-12">
            <Folder className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">아직 게시물이 없습니다</h3>
            <p className="text-muted-foreground">{category.name}에 대한 첫 번째 글을 작성해 보세요!</p>
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
