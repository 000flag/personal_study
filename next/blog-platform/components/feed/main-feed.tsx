"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FeedSection } from "./feed-section"
import { mockPosts, getTrendingPosts, getRecommendedPosts } from "@/lib/blog-data"
import { useToast } from "@/hooks/use-toast"
import { useTranslation } from "@/lib/i18n"

export function MainFeed() {
  const [posts, setPosts] = useState(mockPosts)
  const { toast } = useToast()
  const { t } = useTranslation()

  const trendingPosts = getTrendingPosts()
  const recommendedPosts = getRecommendedPosts()

  const handleLike = (postId: string) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? { ...post, isLiked: !post.isLiked, likes: post.isLiked ? post.likes - 1 : post.likes + 1 }
          : post,
      ),
    )
  }

  const handleBookmark = (postId: string) => {
    setPosts((prev) => prev.map((post) => (post.id === postId ? { ...post, isBookmarked: !post.isBookmarked } : post)))

    const post = posts.find((p) => p.id === postId)
    if (post) {
      toast({
        title: post.isBookmarked ? "북마크에서 제거됨" : "북마크에 추가됨",
        description: post.title,
      })
    }
  }

  const handleShare = (postId: string) => {
    const post = posts.find((p) => p.id === postId)
    if (post) {
      navigator.clipboard.writeText(`${window.location.origin}/post/${postId}`)
      toast({
        title: "링크 복사됨!",
        description: "게시물 링크가 클립보드에 복사되었습니다",
      })
    }
  }

  return (
    <div className="space-y-16 animate-fade-in">
      <section className="text-center space-y-6 py-8">
        <h1 className="text-4xl md:text-5xl font-light tracking-tight">생각을 나누는 공간</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          깊이 있는 글과 다양한 관점을 만나보세요
        </p>
      </section>

      <Tabs defaultValue="recommended" className="w-full">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 h-12 bg-muted/50 rounded-lg p-1">
          <TabsTrigger
            value="recommended"
            className="rounded-md font-medium data-[state=active]:bg-background data-[state=active]:shadow-sm"
          >
            추천
          </TabsTrigger>
          <TabsTrigger
            value="trending"
            className="rounded-md font-medium data-[state=active]:bg-background data-[state=active]:shadow-sm"
          >
            인기
          </TabsTrigger>
          <TabsTrigger
            value="following"
            className="rounded-md font-medium data-[state=active]:bg-background data-[state=active]:shadow-sm"
          >
            팔로잉
          </TabsTrigger>
        </TabsList>

        <TabsContent value="recommended" className="mt-12">
          <FeedSection
            title="추천 게시물"
            posts={recommendedPosts}
            onLike={handleLike}
            onBookmark={handleBookmark}
            onShare={handleShare}
          />
        </TabsContent>

        <TabsContent value="trending" className="mt-12">
          <FeedSection
            title="인기 게시물"
            posts={trendingPosts}
            onLike={handleLike}
            onBookmark={handleBookmark}
            onShare={handleShare}
          />
        </TabsContent>

        <TabsContent value="following" className="mt-12">
          <FeedSection
            title="팔로잉"
            posts={posts.slice(0, 3)}
            onLike={handleLike}
            onBookmark={handleBookmark}
            onShare={handleShare}
          />
        </TabsContent>
      </Tabs>

      <div className="border-t border-border/50 pt-16">
        <FeedSection
          title="최신 게시물"
          posts={posts}
          showAll
          onLike={handleLike}
          onBookmark={handleBookmark}
          onShare={handleShare}
        />
      </div>
    </div>
  )
}
