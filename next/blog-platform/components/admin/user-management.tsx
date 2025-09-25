"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, MoreHorizontal, Shield, Ban, UserCheck } from "lucide-react"
import { mockAdminUsers, type AdminUser } from "@/lib/admin"
import { useToast } from "@/hooks/use-toast"

export function UserManagement() {
  const [users, setUsers] = useState<AdminUser[]>(mockAdminUsers)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [roleFilter, setRoleFilter] = useState<string>("all")
  const { toast } = useToast()

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || user.status === statusFilter
    const matchesRole = roleFilter === "all" || user.role === roleFilter
    return matchesSearch && matchesStatus && matchesRole
  })

  const handleUserAction = (userId: string, action: string) => {
    setUsers((prev) =>
      prev.map((user) => {
        if (user.id === userId) {
          switch (action) {
            case "suspend":
              return { ...user, status: "suspended" as const }
            case "activate":
              return { ...user, status: "active" as const }
            case "ban":
              return { ...user, status: "banned" as const }
            case "promote":
              return { ...user, role: user.role === "user" ? ("moderator" as const) : ("admin" as const) }
            case "demote":
              return { ...user, role: user.role === "admin" ? ("moderator" as const) : ("user" as const) }
            default:
              return user
          }
        }
        return user
      }),
    )

    const actionMessages = {
      suspend: "정지",
      activate: "활성화",
      ban: "차단",
      promote: "승급",
      demote: "강등",
    }

    toast({
      title: "사용자 업데이트 완료",
      description: `사용자 ${actionMessages[action as keyof typeof actionMessages]} 작업이 성공적으로 완료되었습니다.`,
    })
  }

  const getStatusBadge = (status: AdminUser["status"]) => {
    switch (status) {
      case "active":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            활성
          </Badge>
        )
      case "suspended":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
            정지
          </Badge>
        )
      case "banned":
        return <Badge variant="destructive">차단</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getRoleBadge = (role: AdminUser["role"]) => {
    switch (role) {
      case "admin":
        return (
          <Badge variant="default" className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
            관리자
          </Badge>
        )
      case "moderator":
        return (
          <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            운영자
          </Badge>
        )
      case "user":
        return <Badge variant="outline">사용자</Badge>
      default:
        return <Badge variant="outline">{role}</Badge>
    }
  }

  return (
    <div className="space-y-8">
      <div className="border-b border-border/50 pb-6">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">사용자 관리</h1>
        <p className="text-muted-foreground mt-2">사용자, 역할 및 계정 상태 관리</p>
      </div>

      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold">사용자</CardTitle>
          <CardDescription>모든 플랫폼 사용자 보기 및 관리</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="사용자 검색..."
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
                <SelectItem value="active">활성</SelectItem>
                <SelectItem value="suspended">정지</SelectItem>
                <SelectItem value="banned">차단</SelectItem>
              </SelectContent>
            </Select>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full sm:w-[180px] bg-background/50 border-border/50">
                <SelectValue placeholder="역할별 필터" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">모든 역할</SelectItem>
                <SelectItem value="user">사용자</SelectItem>
                <SelectItem value="moderator">운영자</SelectItem>
                <SelectItem value="admin">관리자</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-lg border border-border/50 bg-background/30">
            <Table>
              <TableHeader>
                <TableRow className="border-border/50">
                  <TableHead className="font-semibold">사용자</TableHead>
                  <TableHead className="font-semibold">역할</TableHead>
                  <TableHead className="font-semibold">상태</TableHead>
                  <TableHead className="font-semibold">게시물</TableHead>
                  <TableHead className="font-semibold">팔로워</TableHead>
                  <TableHead className="font-semibold">가입일</TableHead>
                  <TableHead className="font-semibold">최근 활동</TableHead>
                  <TableHead className="w-[70px] font-semibold">작업</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id} className="border-border/50 hover:bg-muted/30">
                    <TableCell>
                      <div>
                        <div className="font-medium text-foreground">{user.name}</div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>{getRoleBadge(user.role)}</TableCell>
                    <TableCell>{getStatusBadge(user.status)}</TableCell>
                    <TableCell className="font-medium">{user.postsCount}</TableCell>
                    <TableCell className="font-medium">{user.followersCount}</TableCell>
                    <TableCell>{new Date(user.joinedAt).toLocaleDateString("ko-KR")}</TableCell>
                    <TableCell>{new Date(user.lastActive).toLocaleDateString("ko-KR")}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-muted/50">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-background/95 backdrop-blur-sm border-border/50">
                          {user.status === "active" ? (
                            <DropdownMenuItem
                              onClick={() => handleUserAction(user.id, "suspend")}
                              className="hover:bg-muted/50"
                            >
                              <Ban className="mr-2 h-4 w-4" />
                              정지
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem
                              onClick={() => handleUserAction(user.id, "activate")}
                              className="hover:bg-muted/50"
                            >
                              <UserCheck className="mr-2 h-4 w-4" />
                              활성화
                            </DropdownMenuItem>
                          )}
                          {user.role !== "admin" && (
                            <DropdownMenuItem
                              onClick={() => handleUserAction(user.id, "promote")}
                              className="hover:bg-muted/50"
                            >
                              <Shield className="mr-2 h-4 w-4" />
                              승급
                            </DropdownMenuItem>
                          )}
                          {user.role !== "user" && (
                            <DropdownMenuItem
                              onClick={() => handleUserAction(user.id, "demote")}
                              className="hover:bg-muted/50"
                            >
                              <Shield className="mr-2 h-4 w-4" />
                              강등
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            onClick={() => handleUserAction(user.id, "ban")}
                            className="text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                          >
                            <Ban className="mr-2 h-4 w-4" />
                            사용자 차단
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
