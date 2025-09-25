"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import type { BlogPost } from "@/lib/blog-data"
import { formatDate } from "@/lib/blog-data"
import Image from "next/image"

interface MobilePostCardProps {
  post: BlogPost
  onLike?: (postId: string) => void
  onBookmark?: (postId: string) => void
  onShare?: (postId: string) => void
}

export function MobilePostCard({ post, onLike, onBookmark, onShare }: MobilePostCardProps) {
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
    <article className="bg-card border border-border/50 rounded-lg overflow-hidden">
      {/* Header with author info */}
      <div className="flex items-center justify-between p-4 pb-3">
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={post.author.avatar || "/placeholder.svg"} alt={post.author.name} />
            <AvatarFallback className="text-xs font-medium">{post.author.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">{post.author.name}</p>
            <p className="text-xs text-muted-foreground">{formatDate(post.publishedAt)}</p>
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

      {/* Image with proper aspect ratio */}
      <div className="relative aspect-[4/3] mx-4 rounded-md overflow-hidden">
        <Image src={post.coverImage || "/placeholder.svg"} alt={post.title} fill className="object-cover" />
        <div className="absolute top-2 left-2">
          <Badge variant="secondary" className="bg-background/90 text-foreground text-xs font-medium">
            {post.category}
          </Badge>
        </div>
      </div>

      {/* Content section */}
      <div className="p-4 space-y-3">
        <h3 className="font-medium leading-snug line-clamp-2">{post.title}</h3>

        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">{post.excerpt}</p>

        {/* Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-border/50">
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
            <Button
              variant="ghost"
              size="sm"
              className="h-auto p-0 text-muted-foreground hover:text-foreground"
              onClick={() => onShare?.(post.id)}
            >
              <span>↗</span>
            </Button>
          </div>

          <div className="text-xs text-muted-foreground">{post.readTime}분</div>
        </div>
      </div>
    </article>
  )
}
