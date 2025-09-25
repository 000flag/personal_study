"use client"

import { useState } from "react"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { ResponsiveLayout } from "@/components/layout/responsive-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Search, Edit, Trash2, Calendar, FileText, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const mockDrafts = [
  {
    id: "1",
    title: "React Hooks 시작하기",
    excerpt: "애플리케이션에서 React hooks를 이해하고 사용하는 포괄적인 가이드...",
    content: "React hooks는 React 컴포넌트 작성 방식을 혁신했습니다...",
    wordCount: 1250,
    readTime: "6분",
    updatedAt: "2024-01-15T10:30:00Z",
    tags: ["React", "JavaScript", "Hooks"],
    visibility: "public",
  },
  {
    id: "2",
    title: "반응형 레이아웃 구축하기",
    excerpt: "현대적인 CSS 기법을 사용하여 아름다운 반응형 레이아웃을 만드는 방법을 배워보세요...",
    content: "반응형 디자인은 오늘날 웹 개발에서 매우 중요합니다...",
    wordCount: 890,
    readTime: "4분",
    updatedAt: "2024-01-14T15:45:00Z",
    tags: ["CSS", "디자인", "반응형"],
    visibility: "private",
  },
]

export default function DraftsPage() {
  const [drafts, setDrafts] = useState(mockDrafts)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("updated")
  const [selectedDrafts, setSelectedDrafts] = useState<string[]>([])

  const filteredDrafts = drafts.filter(
    (draft) =>
      draft.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      draft.content.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const sortedDrafts = [...filteredDrafts].sort((a, b) => {
    switch (sortBy) {
      case "title":
        return a.title.localeCompare(b.title)
      case "wordCount":
        return b.wordCount - a.wordCount
      default:
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    }
  })

  const handleSelectDraft = (draftId: string, checked: boolean) => {
    if (checked) {
      setSelectedDrafts([...selectedDrafts, draftId])
    } else {
      setSelectedDrafts(selectedDrafts.filter((id) => id !== draftId))
    }
  }

  const handleBulkDelete = () => {
    setDrafts(drafts.filter((draft) => !selectedDrafts.includes(draft.id)))
    setSelectedDrafts([])
  }

  return (
    <ProtectedRoute>
      <ResponsiveLayout>
        <div className="container mx-auto px-4 py-6 max-w-6xl">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold">초안</h1>
              <Button>
                <Edit className="h-4 w-4 mr-2" />새 초안
              </Button>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="초안 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="updated">최근 업데이트</SelectItem>
                  <SelectItem value="title">제목</SelectItem>
                  <SelectItem value="wordCount">단어 수</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Bulk Actions */}
            {selectedDrafts.length > 0 && (
              <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
                <span className="text-sm font-medium">{selectedDrafts.length}개의 초안이 선택됨</span>
                <Button variant="destructive" size="sm" onClick={handleBulkDelete}>
                  선택된 항목 삭제
                </Button>
              </div>
            )}

            {/* Drafts List */}
            <div className="space-y-4">
              {sortedDrafts.map((draft) => (
                <Card key={draft.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Checkbox
                        checked={selectedDrafts.includes(draft.id)}
                        onCheckedChange={(checked) => handleSelectDraft(draft.id, checked as boolean)}
                      />

                      <div className="flex-1 space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <h3 className="text-lg font-semibold line-clamp-1">{draft.title}</h3>
                            <p className="text-sm text-muted-foreground line-clamp-2">{draft.excerpt}</p>
                          </div>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Edit className="h-4 w-4 mr-2" />
                                편집
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <FileText className="h-4 w-4 mr-2" />
                                게시
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">
                                <Trash2 className="h-4 w-4 mr-2" />
                                삭제
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>업데이트 {new Date(draft.updatedAt).toLocaleDateString("ko-KR")}</span>
                          </div>
                          <span>{draft.wordCount} 단어</span>
                          <span>{draft.readTime} 읽기</span>
                          <Badge variant={draft.visibility === "public" ? "default" : "secondary"}>
                            {draft.visibility === "public" ? "공개" : "비공개"}
                          </Badge>
                        </div>

                        {draft.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {draft.tags.map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {sortedDrafts.length === 0 && (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">초안을 찾을 수 없습니다</h3>
                  <p className="text-muted-foreground mb-4">
                    {searchTerm ? "검색어를 조정해 보세요" : "첫 번째 초안을 작성해 보세요"}
                  </p>
                  <Button>
                    <Edit className="h-4 w-4 mr-2" />새 초안 만들기
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </ResponsiveLayout>
    </ProtectedRoute>
  )
}
