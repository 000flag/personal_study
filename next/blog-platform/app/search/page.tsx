"use client"

import { useState } from "react"
import { Search, Filter, Calendar, TrendingUp, MessageSquare } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { blogPosts } from "@/lib/blog-data"
import { MobilePostCard } from "@/components/feed/mobile-post-card"
import { DesktopPostCard } from "@/components/feed/desktop-post-card"
import { useMobile } from "@/hooks/use-mobile"
import { useTranslation } from "@/lib/i18n"

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("latest")
  const [dateRange, setDateRange] = useState("all")
  const [mediaType, setMediaType] = useState("all")
  const [showFilters, setShowFilters] = useState(false)
  const isMobile = useMobile()
  const { t } = useTranslation()

  const filteredPosts = blogPosts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    switch (sortBy) {
      case "popular":
        return b.likes - a.likes
      case "comments":
        return b.comments - a.comments
      case "oldest":
        return new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime()
      default:
        return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    }
  })

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Search Header */}
        <div className="mb-6">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="글, 작성자, 태그 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12"
            />
          </div>

          {/* Advanced Filters */}
          <Collapsible open={showFilters} onOpenChange={setShowFilters}>
            <CollapsibleTrigger asChild>
              <Button variant="outline" className="mb-4 bg-transparent">
                <Filter className="h-4 w-4 mr-2" />
                고급 필터
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-4 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">{t("sort_by")}</label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="latest">{t("newest")}</SelectItem>
                      <SelectItem value="oldest">{t("oldest")}</SelectItem>
                      <SelectItem value="popular">{t("most_popular")}</SelectItem>
                      <SelectItem value="comments">댓글 많은 순</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">날짜 범위</label>
                  <Select value={dateRange} onValueChange={setDateRange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">전체 기간</SelectItem>
                      <SelectItem value="today">{t("today")}</SelectItem>
                      <SelectItem value="week">{t("this_week")}</SelectItem>
                      <SelectItem value="month">{t("this_month")}</SelectItem>
                      <SelectItem value="year">올해</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">미디어 유형</label>
                  <Select value={mediaType} onValueChange={setMediaType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">모든 유형</SelectItem>
                      <SelectItem value="image">이미지</SelectItem>
                      <SelectItem value="video">비디오</SelectItem>
                      <SelectItem value="text">텍스트만</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>

        {/* Search Results */}
        {searchQuery && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">
              "{searchQuery}"에 대한 {sortedPosts.length}개 결과
            </h2>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">
                <TrendingUp className="h-3 w-3 mr-1" />
                인기
              </Badge>
              <Badge variant="secondary">
                <Calendar className="h-3 w-3 mr-1" />
                최신
              </Badge>
              <Badge variant="secondary">
                <MessageSquare className="h-3 w-3 mr-1" />
                많이 논의됨
              </Badge>
            </div>
          </div>
        )}

        {/* Results */}
        {searchQuery === "" ? (
          <div className="text-center py-12">
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">검색 시작하기</h3>
            <p className="text-muted-foreground">키워드를 입력하여 글, 작성자 또는 주제를 찾아보세요</p>
          </div>
        ) : sortedPosts.length === 0 ? (
          <div className="text-center py-12">
            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <Search className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2">결과를 찾을 수 없습니다</h3>
            <p className="text-muted-foreground mb-4">검색어나 필터를 조정해보세요</p>
            <Button variant="outline" onClick={() => setSearchQuery("")}>
              검색 지우기
            </Button>
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
