"use client"

import { useMobile } from "@/hooks/use-mobile"
import { MobilePostCard } from "./mobile-post-card"
import { DesktopPostCard } from "./desktop-post-card"
import type { BlogPost } from "@/lib/blog-data"

interface FeedSectionProps {
  title: string
  posts: BlogPost[]
  showAll?: boolean
  onLike?: (postId: string) => void
  onBookmark?: (postId: string) => void
  onShare?: (postId: string) => void
}

export function FeedSection({ title, posts, showAll = false, onLike, onBookmark, onShare }: FeedSectionProps) {
  const isMobile = useMobile()
  const displayPosts = showAll ? posts : posts.slice(0, 6)

  if (posts.length === 0) return null

  return (
    <section className="space-y-8 animate-slide-up">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-light tracking-tight">{title}</h2>
        {!showAll && posts.length > 6 && (
          <button className="text-sm text-muted-foreground hover:text-foreground transition-colors">전체 보기 →</button>
        )}
      </div>

      {isMobile ? (
        <div className="space-y-8">
          {displayPosts.map((post) => (
            <MobilePostCard key={post.id} post={post} onLike={onLike} onBookmark={onBookmark} onShare={onShare} />
          ))}
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2">
          {displayPosts.map((post) => (
            <DesktopPostCard key={post.id} post={post} onLike={onLike} onBookmark={onBookmark} onShare={onShare} />
          ))}
        </div>
      )}
    </section>
  )
}
