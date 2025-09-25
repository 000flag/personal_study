"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import type { BlogPost } from "@/lib/blog-data"
import { formatDate } from "@/lib/blog-data"
import Image from "next/image"

interface DesktopPostCardProps {
  post: BlogPost
  onLike?: (postId: string) => void
  onBookmark?: (postId: string) => void
  onShare?: (postId: string) => void
}

export function DesktopPostCard({ post, onLike, onBookmark, onShare }: DesktopPostCardProps) {
  const [isLiked, setIsLiked] = useState(post.isLiked)
  const [isBookmarked, setIsBookmarked] = useState(post.isBookmarked)
  const [likes, setLikes] = useState(post.likes)

  const handleLike = () => {
    setIsLiked(!isLiked)
    setLikes((prev) => (isLiked ? prev - 1 : prev + 1))
    onLike?.(post.id)
  }

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked)
    onBookmark?.(post.id)
  }

  return (
    <article className="group bg-card border border-border/50 rounded-lg overflow-hidden hover-lift hover:border-border transition-all duration-200">
      {/* Image section with proper aspect ratio */}
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={post.coverImage || "/placeholder.svg"}
          alt={post.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute top-3 left-3">
          <Badge variant="secondary" className="bg-background/90 text-foreground text-xs font-medium">
            {post.category}
          </Badge>
        </div>
      </div>

      {/* Content section with improved spacing */}
      <div className="p-6 space-y-4">
        {/* Author and date */}
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={post.author.avatar || "/placeholder.svg"} alt={post.author.name} />
            <AvatarFallback className="text-xs font-medium">{post.author.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="font-medium">{post.author.name}</span>
              <span>·</span>
              <span>{formatDate(post.publishedAt)}</span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className={`h-8 w-8 rounded-full ${
              isBookmarked ? "text-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
            onClick={handleBookmark}
          >
            {isBookmarked ? "★" : "☆"}
          </Button>
        </div>

        {/* Title and excerpt with better typography */}
        <div className="space-y-3">
          <h3 className="text-lg font-medium leading-tight hover:text-primary cursor-pointer transition-colors line-clamp-2">
            {post.title}
          </h3>
          <p className="text-muted-foreground leading-relaxed line-clamp-2 text-sm">{post.excerpt}</p>
        </div>

        {/* Actions with clean layout */}
        <div className="flex items-center justify-between pt-4 border-t border-border/50">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              className={`h-auto p-0 flex items-center gap-2 ${
                isLiked ? "text-red-500" : "text-muted-foreground hover:text-red-500"
              }`}
              onClick={handleLike}
            >
              <span>{isLiked ? "♥" : "♡"}</span>
              <span className="text-sm">{likes}</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-auto p-0 flex items-center gap-2 text-muted-foreground hover:text-foreground"
            >
              <span>💬</span>
              <span className="text-sm">{post.comments}</span>
            </Button>
          </div>
          <div className="text-xs text-muted-foreground">{post.readTime}분 읽기</div>
        </div>
      </div>
    </article>
  )
}
