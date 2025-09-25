"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { BlogPost } from "@/lib/blog-data"
import { formatDate } from "@/lib/blog-data"
import Image from "next/image"

interface FeaturedPostsSliderProps {
  posts: BlogPost[]
  autoPlay?: boolean
  autoPlayInterval?: number
}

export function FeaturedPostsSlider({ posts, autoPlay = true, autoPlayInterval = 5000 }: FeaturedPostsSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (!autoPlay || posts.length <= 1) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % posts.length)
    }, autoPlayInterval)

    return () => clearInterval(interval)
  }, [autoPlay, autoPlayInterval, posts.length])

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + posts.length) % posts.length)
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % posts.length)
  }

  if (posts.length === 0) return null

  const currentPost = posts[currentIndex]

  return (
    <div className="relative h-64 md:h-80 lg:h-96 rounded-lg overflow-hidden group bg-gray-900">
      <Image
        src={currentPost.coverImage || "/placeholder.svg"}
        alt={currentPost.title}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-105"
      />

      <div className="absolute inset-0 bg-black/90" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/60" />

      {/* Navigation Arrows */}
      {posts.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="sm"
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white opacity-0 group-hover:opacity-100 transition-opacity border border-white/30"
            onClick={goToPrevious}
          >
            <span className="text-lg">‹</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white opacity-0 group-hover:opacity-100 transition-opacity border border-white/30"
            onClick={goToNext}
          >
            <span className="text-lg">›</span>
          </Button>
        </>
      )}

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-6 text-white bg-black/40 backdrop-blur-sm">
        <Badge variant="secondary" className="mb-3 shadow-lg bg-black/80 text-white border-white/30 hover:bg-black/90">
          Featured • {currentPost.category}
        </Badge>
        <h2 className="text-2xl md:text-3xl font-bold mb-2 text-balance text-white bg-black/60 backdrop-blur-sm rounded-lg p-3 border border-white/20">
          {currentPost.title}
        </h2>
        <p className="text-white mb-4 line-clamp-2 text-pretty bg-black/40 backdrop-blur-sm rounded-md p-2 border border-white/10">
          {currentPost.excerpt}
        </p>
        <div className="flex items-center justify-between bg-black/40 backdrop-blur-sm rounded-md p-2 border border-white/10">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-black/80 backdrop-blur-sm flex items-center justify-center border border-white/50 shadow-lg">
                <span className="text-sm font-semibold text-white">{currentPost.author.name.charAt(0)}</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-white">{currentPost.author.name}</p>
                <p className="text-xs text-white/90">{formatDate(currentPost.publishedAt)}</p>
              </div>
            </div>
          </div>
          <div className="text-sm text-white/90">{currentPost.readTime} min read</div>
        </div>
      </div>

      {/* Pagination Dots */}
      {posts.length > 1 && (
        <div className="absolute bottom-4 right-6 flex gap-2">
          {posts.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-all shadow-lg border border-white/50 ${
                index === currentIndex ? "bg-white" : "bg-white/60"
              }`}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
