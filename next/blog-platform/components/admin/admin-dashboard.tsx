"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, FileText, AlertTriangle, Activity, TrendingUp, TrendingDown } from "lucide-react"
import { mockSystemStats } from "@/lib/admin"
import { D3LineChart } from "./d3-line-chart"
import { D3Sparkline } from "./d3-sparkline"
import { D3DonutChart } from "./d3-donut-chart"

export function AdminDashboard() {
  const stats = mockSystemStats

  // Transform data for D3 charts
  const userGrowthData = stats.userGrowth.map((item) => ({
    date: item.date,
    value: item.users,
  }))

  const contentGrowthData = stats.contentGrowth.map((item) => ({
    date: item.date,
    value: item.posts,
  }))

  const userStatusData = [
    { name: "활성", value: stats.activeUsers, color: "hsl(var(--green-500))" },
    { name: "비활성", value: stats.totalUsers - stats.activeUsers, color: "hsl(var(--muted))" },
  ]

  const contentStatusData = [
    { name: "게시됨", value: stats.publishedPosts, color: "hsl(var(--blue-500))" },
    { name: "초안", value: stats.totalPosts - stats.publishedPosts, color: "hsl(var(--orange-500))" },
  ]

  return (
    <div className="space-y-8">
      <div className="border-b border-border/50 pb-6">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">관리자 대시보드</h1>
        <p className="text-muted-foreground mt-2">플랫폼 개요 및 시스템 통계</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">전체 사용자</CardTitle>
            <Users className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{stats.totalUsers.toLocaleString()}</div>
            <div className="flex items-center justify-between mt-2">
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600 flex items-center gap-1 font-medium">
                  <TrendingUp className="h-3 w-3" />
                  +12%
                </span>
                지난달 대비
              </p>
              <D3Sparkline data={userGrowthData.slice(-7)} width={60} height={20} trend="up" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">활성 사용자</CardTitle>
            <Activity className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{stats.activeUsers.toLocaleString()}</div>
            <div className="flex items-center justify-between mt-2">
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600 flex items-center gap-1 font-medium">
                  <TrendingUp className="h-3 w-3" />
                  +8%
                </span>
                지난주 대비
              </p>
              <D3Sparkline
                data={userGrowthData.slice(-7).map((d) => ({ ...d, value: Math.floor(d.value * 0.7) }))}
                width={60}
                height={20}
                trend="up"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">전체 게시물</CardTitle>
            <FileText className="h-5 w-5 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{stats.totalPosts.toLocaleString()}</div>
            <div className="flex items-center justify-between mt-2">
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600 flex items-center gap-1 font-medium">
                  <TrendingUp className="h-3 w-3" />
                  +15%
                </span>
                지난달 대비
              </p>
              <D3Sparkline data={contentGrowthData.slice(-7)} width={60} height={20} trend="up" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">대기 중인 신고</CardTitle>
            <AlertTriangle className="h-5 w-5 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{stats.reportsCount}</div>
            <div className="flex items-center justify-between mt-2">
              <p className="text-xs text-muted-foreground">
                <span className="text-red-600 flex items-center gap-1 font-medium">
                  <TrendingDown className="h-3 w-3" />
                  +3
                </span>
                오늘 신규
              </p>
              <D3Sparkline
                data={[
                  { date: "2024-01-14", value: 18 },
                  { date: "2024-01-15", value: 20 },
                  { date: "2024-01-16", value: 19 },
                  { date: "2024-01-17", value: 22 },
                  { date: "2024-01-18", value: 21 },
                  { date: "2024-01-19", value: 20 },
                  { date: "2024-01-20", value: 23 },
                ]}
                width={60}
                height={20}
                trend="down"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold">사용자 증가</CardTitle>
            <CardDescription>지난 주 일별 사용자 등록 현황</CardDescription>
          </CardHeader>
          <CardContent>
            <D3LineChart data={userGrowthData} width={400} height={300} color="hsl(var(--primary))" title="" />
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold">콘텐츠 증가</CardTitle>
            <CardDescription>지난 주 일별 게시물 발행 현황</CardDescription>
          </CardHeader>
          <CardContent>
            <D3LineChart data={contentGrowthData} width={400} height={300} color="hsl(var(--chart-2))" title="" />
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold">사용자 상태 분포</CardTitle>
            <CardDescription>활성 vs 비활성 사용자</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <D3DonutChart data={userStatusData} width={200} height={200} innerRadius={50} outerRadius={80} />
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold">콘텐츠 상태 분포</CardTitle>
            <CardDescription>게시됨 vs 초안 게시물</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <D3DonutChart data={contentStatusData} width={200} height={200} innerRadius={50} outerRadius={80} />
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold">빠른 작업</CardTitle>
          <CardDescription>일반적인 관리 작업</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="flex items-center space-x-3 p-4 rounded-lg bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Badge
                    variant="secondary"
                    className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
                  >
                    {stats.reportsCount}
                  </Badge>
                  <span className="text-sm font-medium">검토 대기 신고</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-4 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
              <FileText className="h-5 w-5 text-blue-600" />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    {stats.totalPosts - stats.publishedPosts}
                  </Badge>
                  <span className="text-sm font-medium">검토 중인 게시물</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-4 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800">
              <Users className="h-5 w-5 text-green-600" />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Badge
                    variant="secondary"
                    className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                  >
                    {stats.activeUsers}
                  </Badge>
                  <span className="text-sm font-medium">온라인 사용자</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
