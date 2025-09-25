"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"
import { Search, MoreHorizontal, Eye, Edit, Trash2, CheckCircle, XCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Post {
  id: string
  title: string
  author: string
  status: "published" | "draft" | "pending" | "archived"
  category: string
  views: number
  likes: number
  comments: number
  createdAt: string
  updatedAt: string
}

const mockPosts: Post[] = [
  {
    id: "1",
    title: "Next.js 15 시작하기",
    author: "김철수",
    status: "published",
    category: "기술",
    views: 1250,
    likes: 89,
    comments: 23,
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "2",
    title: "웹 개발의 미래",
    author: "이영희",
    status: "pending",
    category: "기술",
    views: 0,
    likes: 0,
    comments: 0,
    createdAt: "2024-01-20T14:30:00Z",
    updatedAt: "2024-01-20T14:30:00Z",
  },
  {
    id: "3",
    title: "디자인 시스템 모범 사례",
    author: "박민수",
    status: "draft",
    category: "디자인",
    views: 0,
    likes: 0,
    comments: 0,
    createdAt: "2024-01-18T09:15:00Z",
    updatedAt: "2024-01-19T16:45:00Z",
  },
  {
    id: "4",
    title: "확장 가능한 React 애플리케이션 구축",
    author: "정수진",
    status: "published",
    category: "기술",
    views: 2100,
    likes: 156,
    comments: 45,
    createdAt: "2024-01-10T11:20:00Z",
    updatedAt: "2024-01-10T11:20:00Z",
  },
  {
    id: "5",
    title: "UX 리서치 방법론",
    author: "최동훈",
    status: "archived",
    category: "디자인",
    views: 890,
    likes: 67,
    comments: 12,
    createdAt: "2024-01-05T13:45:00Z",
    updatedAt: "2024-01-05T13:45:00Z",
  },
]

export function PostsManagement() {
  const [posts, setPosts] = useState<Post[]>(mockPosts)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [selectedPosts, setSelectedPosts] = useState<string[]>([])
  const { toast } = useToast()

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.author.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || post.status === statusFilter
    const matchesCategory = categoryFilter === "all" || post.category === categoryFilter
    return matchesSearch && matchesStatus && matchesCategory
  })

  const handlePostAction = (postId: string, action: string) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          switch (action) {
            case "publish":
              return { ...post, status: "published" as const }
            case "unpublish":
              return { ...post, status: "draft" as const }
            case "archive":
              return { ...post, status: "archived" as const }
            case "delete":
              return post // Will be filtered out below
            default:
              return post
          }
        }
        return post
      }),
    )

    if (action === "delete") {
      setPosts((prev) => prev.filter((post) => post.id !== postId))
    }

    const actionMessages = {
      publish: "게시",
      unpublish: "게시 취소",
      archive: "보관",
      delete: "삭제",
    }

    toast({
      title: "게시물 업데이트 완료",
      description: `게시물 ${actionMessages[action as keyof typeof actionMessages]} 작업이 성공적으로 완료되었습니다.`,
    })
  }

  const handleBulkAction = (action: string) => {
    if (selectedPosts.length === 0) return

    setPosts((prev) =>
      prev.map((post) => {
        if (selectedPosts.includes(post.id)) {
          switch (action) {
            case "publish":
              return { ...post, status: "published" as const }
            case "unpublish":
              return { ...post, status: "draft" as const }
            case "archive":
              return { ...post, status: "archived" as const }
            default:
              return post
          }
        }
        return post
      }),
    )

    if (action === "delete") {
      setPosts((prev) => prev.filter((post) => !selectedPosts.includes(post.id)))
    }

    setSelectedPosts([])
    toast({
      title: "일괄 작업 완료",
      description: `${selectedPosts.length}개 게시물이 성공적으로 업데이트되었습니다.`,
    })
  }

  const getStatusBadge = (status: Post["status"]) => {
    switch (status) {
      case "published":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            게시됨
          </Badge>
        )
      case "draft":
        return (
          <Badge variant="secondary" className="bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200">
            초안
          </Badge>
        )
      case "pending":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
            검토 중
          </Badge>
        )
      case "archived":
        return <Badge variant="outline">보관됨</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const togglePostSelection = (postId: string) => {
    setSelectedPosts((prev) => (prev.includes(postId) ? prev.filter((id) => id !== postId) : [...prev, postId]))
  }

  const toggleAllPosts = () => {
    setSelectedPosts(selectedPosts.length === filteredPosts.length ? [] : filteredPosts.map((post) => post.id))
  }

  return (
    <div className="space-y-8">
      <div className="border-b border-border/50 pb-6">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">게시물 관리</h1>
        <p className="text-muted-foreground mt-2">모든 게시물, 초안 및 게시된 콘텐츠 관리</p>
      </div>

      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold">모든 게시물</CardTitle>
          <CardDescription>플랫폼의 모든 게시물 보기 및 관리</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="게시물 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-background/50 border-border/50 focus:bg-background focus:border-border"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px] bg-background/50 border-border/50">
                <SelectValue placeholder="상태별 필터" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">모든 상태</SelectItem>
                <SelectItem value="published">게시됨</SelectItem>
                <SelectItem value="draft">초안</SelectItem>
                <SelectItem value="pending">검토 중</SelectItem>
                <SelectItem value="archived">보관됨</SelectItem>
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-[180px] bg-background/50 border-border/50">
                <SelectValue placeholder="카테고리별 필터" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">모든 카테고리</SelectItem>
                <SelectItem value="기술">기술</SelectItem>
                <SelectItem value="디자인">디자인</SelectItem>
                <SelectItem value="비즈니스">비즈니스</SelectItem>
                <SelectItem value="라이프스타일">라이프스타일</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {selectedPosts.length > 0 && (
            <div className="flex items-center gap-3 mb-6 p-4 bg-muted/50 rounded-lg border border-border/50">
              <span className="text-sm font-medium">{selectedPosts.length}개 게시물 선택됨</span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleBulkAction("publish")}
                className="hover:bg-green-50 dark:hover:bg-green-950/20"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                게시
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleBulkAction("unpublish")}
                className="hover:bg-orange-50 dark:hover:bg-orange-950/20"
              >
                <XCircle className="h-4 w-4 mr-2" />
                게시 취소
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleBulkAction("archive")}
                className="hover:bg-blue-50 dark:hover:bg-blue-950/20"
              >
                보관
              </Button>
              <Button size="sm" variant="destructive" onClick={() => handleBulkAction("delete")}>
                <Trash2 className="h-4 w-4 mr-2" />
                삭제
              </Button>
            </div>
          )}

          <div className="rounded-lg border border-border/50 bg-background/30">
            <Table>
              <TableHeader>
                <TableRow className="border-border/50">
                  <TableHead className="w-[50px]">
                    <Checkbox
                      checked={selectedPosts.length === filteredPosts.length && filteredPosts.length > 0}
                      onCheckedChange={toggleAllPosts}
                    />
                  </TableHead>
                  <TableHead className="font-semibold">제목</TableHead>
                  <TableHead className="font-semibold">작성자</TableHead>
                  <TableHead className="font-semibold">상태</TableHead>
                  <TableHead className="font-semibold">카테고리</TableHead>
                  <TableHead className="font-semibold">조회수</TableHead>
                  <TableHead className="font-semibold">좋아요</TableHead>
                  <TableHead className="font-semibold">댓글</TableHead>
                  <TableHead className="font-semibold">작성일</TableHead>
                  <TableHead className="w-[70px] font-semibold">작업</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPosts.map((post) => (
                  <TableRow key={post.id} className="border-border/50 hover:bg-muted/30">
                    <TableCell>
                      <Checkbox
                        checked={selectedPosts.includes(post.id)}
                        onCheckedChange={() => togglePostSelection(post.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="font-medium max-w-[300px] truncate text-foreground">{post.title}</div>
                    </TableCell>
                    <TableCell className="font-medium">{post.author}</TableCell>
                    <TableCell>{getStatusBadge(post.status)}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{post.category}</Badge>
                    </TableCell>
                    <TableCell className="font-medium">{post.views.toLocaleString()}</TableCell>
                    <TableCell className="font-medium">{post.likes}</TableCell>
                    <TableCell className="font-medium">{post.comments}</TableCell>
                    <TableCell>{new Date(post.createdAt).toLocaleDateString("ko-KR")}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-muted/50">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-background/95 backdrop-blur-sm border-border/50">
                          <DropdownMenuItem className="hover:bg-muted/50">
                            <Eye className="mr-2 h-4 w-4" />
                            보기
                          </DropdownMenuItem>
                          <DropdownMenuItem className="hover:bg-muted/50">
                            <Edit className="mr-2 h-4 w-4" />
                            편집
                          </DropdownMenuItem>
                          {post.status === "published" ? (
                            <DropdownMenuItem
                              onClick={() => handlePostAction(post.id, "unpublish")}
                              className="hover:bg-orange-50 dark:hover:bg-orange-950/20"
                            >
                              <XCircle className="mr-2 h-4 w-4" />
                              게시 취소
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem
                              onClick={() => handlePostAction(post.id, "publish")}
                              className="hover:bg-green-50 dark:hover:bg-green-950/20"
                            >
                              <CheckCircle className="mr-2 h-4 w-4" />
                              게시
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            onClick={() => handlePostAction(post.id, "archive")}
                            className="hover:bg-blue-50 dark:hover:bg-blue-950/20"
                          >
                            보관
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handlePostAction(post.id, "delete")}
                            className="text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            삭제
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
