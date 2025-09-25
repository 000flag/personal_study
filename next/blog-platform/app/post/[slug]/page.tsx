"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Heart, Bookmark, Share2, MessageCircle, Eye, Calendar, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent } from "@/components/ui/card"
import { blogPosts } from "@/lib/blog-data"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import Image from "next/image"

export default function PostDetailPage() {
  const params = useParams()
  const slug = params.slug as string
  const { toast } = useToast()
  const [isLiked, setIsLiked] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [tableOfContents, setTableOfContents] = useState<Array<{ id: string; text: string; level: number }>>([])

  const post = blogPosts.find((p) => p.slug === slug)
  const relatedPosts = blogPosts.filter((p) => p.id !== post?.id && p.category === post?.category).slice(0, 3)

  const currentIndex = blogPosts.findIndex((p) => p.slug === slug)
  const previousPost = currentIndex > 0 ? blogPosts[currentIndex - 1] : null
  const nextPost = currentIndex < blogPosts.length - 1 ? blogPosts[currentIndex + 1] : null

  // Generate table of contents from content
  useEffect(() => {
    if (post?.content) {
      const headings = post.content.match(/#{1,6}\s+.+/g) || []
      const toc = headings.map((heading, index) => {
        const level = heading.match(/^#+/)?.[0].length || 1
        const text = heading.replace(/^#+\s+/, "")
        return {
          id: `heading-${index}`,
          text,
          level,
        }
      })
      setTableOfContents(toc)
    }
  }, [post])

  const handleLike = () => {
    setIsLiked(!isLiked)
    toast({
      description: isLiked ? "좋아요에서 제거됨" : "좋아요에 추가됨",
    })
  }

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked)
    toast({
      description: isBookmarked ? "북마크에서 제거됨" : "북마크에 추가됨",
    })
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    toast({
      description: "링크가 클립보드에 복사됨",
    })
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">게시물을 찾을 수 없습니다</h1>
          <p className="text-muted-foreground">찾고 있는 게시물이 존재하지 않습니다.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Table of Contents - Desktop */}
          <div className="hidden lg:block">
            <div className="sticky top-6">
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-3">목차</h3>
                  <nav className="space-y-2">
                    {tableOfContents.map((item) => (
                      <a
                        key={item.id}
                        href={`#${item.id}`}
                        className={`block text-sm hover:text-primary transition-colors ${
                          item.level === 1 ? "font-medium" : item.level === 2 ? "ml-3" : "ml-6"
                        }`}
                      >
                        {item.text}
                      </a>
                    ))}
                  </nav>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Post Header */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="secondary">{post.category}</Badge>
                <span className="text-sm text-muted-foreground">•</span>
                <span className="text-sm text-muted-foreground">{post.readTime}</span>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold mb-4 text-balance">{post.title}</h1>

              <p className="text-lg text-muted-foreground mb-6 text-pretty">{post.excerpt}</p>

              {/* Author & Meta */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={post.author.avatar || "/placeholder.svg"} />
                    <AvatarFallback>
                      {post.author.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <Link href={`/author/${post.author.username}`} className="font-medium hover:underline">
                      {post.author.name}
                    </Link>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {new Date(post.publishedAt).toLocaleDateString()}
                      <span>•</span>
                      <Eye className="h-3 w-3" />
                      {post.views.toLocaleString()} views
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={handleLike} className={isLiked ? "text-red-500" : ""}>
                    <Heart className={`h-4 w-4 mr-1 ${isLiked ? "fill-current" : ""}`} />
                    {post.likes + (isLiked ? 1 : 0)}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleBookmark}
                    className={isBookmarked ? "text-blue-500" : ""}
                  >
                    <Bookmark className={`h-4 w-4 ${isBookmarked ? "fill-current" : ""}`} />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={handleShare}>
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Featured Image */}
              {post.image && (
                <div className="relative aspect-video rounded-lg overflow-hidden mb-8">
                  <Image src={post.image || "/placeholder.svg"} alt={post.title} fill className="object-cover" />
                </div>
              )}
            </div>

            {/* Post Content */}
            <div className="prose prose-gray dark:prose-invert max-w-none mb-8">
              <div className="whitespace-pre-wrap">{post.content}</div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-8">
              {post.tags.map((tag) => (
                <Link key={tag} href={`/tag/${tag.toLowerCase().replace(/\s+/g, "-")}`}>
                  <Badge variant="outline" className="hover:bg-secondary">
                    #{tag}
                  </Badge>
                </Link>
              ))}
            </div>

            <Separator className="mb-8" />

            {/* Comments Section */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <MessageCircle className="h-5 w-5" />
                <h3 className="text-lg font-semibold">{post.comments}개의 댓글</h3>
              </div>
              <div className="text-center py-8 text-muted-foreground">
                <MessageCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>댓글이 여기에 표시됩니다</p>
              </div>
            </div>

            {/* Navigation */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {previousPost && (
                <Link href={`/post/${previousPost.slug}`}>
                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <ChevronLeft className="h-4 w-4" />
                        이전 게시물
                      </div>
                      <h4 className="font-medium line-clamp-2">{previousPost.title}</h4>
                    </CardContent>
                  </Card>
                </Link>
              )}
              {nextPost && (
                <Link href={`/post/${nextPost.slug}`}>
                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2 text-sm text-muted-foreground mb-2">
                        다음 게시물
                        <ChevronRight className="h-4 w-4" />
                      </div>
                      <h4 className="font-medium line-clamp-2">{nextPost.title}</h4>
                    </CardContent>
                  </Card>
                </Link>
              )}
            </div>

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-4">관련 게시물</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {relatedPosts.map((relatedPost) => (
                    <Link key={relatedPost.id} href={`/post/${relatedPost.slug}`}>
                      <Card className="hover:shadow-md transition-shadow cursor-pointer">
                        <CardContent className="p-4">
                          {relatedPost.image && (
                            <div className="relative aspect-video rounded-md overflow-hidden mb-3">
                              <Image
                                src={relatedPost.image || "/placeholder.svg"}
                                alt={relatedPost.title}
                                fill
                                className="object-cover"
                              />
                            </div>
                          )}
                          <h4 className="font-medium line-clamp-2 mb-2">{relatedPost.title}</h4>
                          <p className="text-sm text-muted-foreground line-clamp-2">{relatedPost.excerpt}</p>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
