"use client"

import { useState } from "react"
import { Megaphone, Calendar, Pin, ArrowRight } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const announcements = [
  {
    id: 1,
    title: "새로운 모바일 경험 출시",
    excerpt: "개선된 네비게이션과 피드를 갖춘 새로운 인스타그램 스타일의 모바일 경험을 소개합니다.",
    content: "전체 공지사항 내용이 여기에 표시됩니다...",
    type: "feature",
    isPinned: true,
    publishedAt: "2024-01-15",
    slug: "new-mobile-experience-launch",
  },
  {
    id: 2,
    title: "정기 점검 - 1월 20일",
    excerpt: "플랫폼 성능과 보안을 개선하기 위한 정기 점검을 실시합니다.",
    content: "점검 세부사항이 여기에 표시됩니다...",
    type: "maintenance",
    isPinned: false,
    publishedAt: "2024-01-10",
    slug: "scheduled-maintenance-january-20th",
  },
  {
    id: 3,
    title: "커뮤니티 가이드라인 업데이트",
    excerpt: "모든 사용자를 위한 안전하고 환영받는 환경을 보장하기 위해 커뮤니티 가이드라인을 업데이트했습니다.",
    content: "가이드라인 업데이트 세부사항이 여기에 표시됩니다...",
    type: "policy",
    isPinned: false,
    publishedAt: "2024-01-05",
    slug: "community-guidelines-update",
  },
]

const typeColors = {
  feature: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
  maintenance: "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400",
  policy: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
}

const typeLabels = {
  feature: "기능",
  maintenance: "점검",
  policy: "정책",
}

export default function AnnouncementsPage() {
  const [filter, setFilter] = useState<string>("all")

  const filteredAnnouncements = announcements.filter((announcement) =>
    filter === "all" ? true : announcement.type === filter,
  )

  const pinnedAnnouncements = filteredAnnouncements.filter((a) => a.isPinned)
  const regularAnnouncements = filteredAnnouncements.filter((a) => !a.isPinned)

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Megaphone className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">공지사항</h1>
              <p className="text-muted-foreground">최신 뉴스와 업데이트를 확인하세요</p>
            </div>
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant={filter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("all")}
              className={filter !== "all" ? "bg-transparent" : ""}
            >
              전체
            </Button>
            <Button
              variant={filter === "feature" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("feature")}
              className={filter !== "feature" ? "bg-transparent" : ""}
            >
              기능
            </Button>
            <Button
              variant={filter === "maintenance" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("maintenance")}
              className={filter !== "maintenance" ? "bg-transparent" : ""}
            >
              점검
            </Button>
            <Button
              variant={filter === "policy" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("policy")}
              className={filter !== "policy" ? "bg-transparent" : ""}
            >
              정책
            </Button>
          </div>
        </div>

        {/* Pinned Announcements */}
        {pinnedAnnouncements.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Pin className="h-5 w-5" />
              고정됨
            </h2>
            <div className="space-y-4">
              {pinnedAnnouncements.map((announcement) => (
                <Card key={announcement.id} className="border-l-4 border-l-primary">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={typeColors[announcement.type as keyof typeof typeColors]}>
                            {typeLabels[announcement.type as keyof typeof typeLabels]}
                          </Badge>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            {new Date(announcement.publishedAt).toLocaleDateString("ko-KR")}
                          </div>
                        </div>
                        <CardTitle className="text-lg">{announcement.title}</CardTitle>
                        <CardDescription className="mt-2">{announcement.excerpt}</CardDescription>
                      </div>
                      <Pin className="h-4 w-4 text-muted-foreground ml-4 flex-shrink-0" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Link href={`/announcements/${announcement.slug}`}>
                      <Button variant="ghost" size="sm" className="p-0 h-auto">
                        더 읽기
                        <ArrowRight className="ml-1 h-3 w-3" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Regular Announcements */}
        <div className="space-y-4">
          {regularAnnouncements.map((announcement) => (
            <Card key={announcement.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Badge className={typeColors[announcement.type as keyof typeof typeColors]}>
                    {typeLabels[announcement.type as keyof typeof typeLabels]}
                  </Badge>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {new Date(announcement.publishedAt).toLocaleDateString("ko-KR")}
                  </div>
                </div>
                <CardTitle className="text-lg">{announcement.title}</CardTitle>
                <CardDescription>{announcement.excerpt}</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href={`/announcements/${announcement.slug}`}>
                  <Button variant="ghost" size="sm" className="p-0 h-auto">
                    더 읽기
                    <ArrowRight className="ml-1 h-3 w-3" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredAnnouncements.length === 0 && (
          <div className="text-center py-12">
            <Megaphone className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">공지사항이 없습니다</h3>
            <p className="text-muted-foreground">현재 필터와 일치하는 공지사항이 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  )
}
