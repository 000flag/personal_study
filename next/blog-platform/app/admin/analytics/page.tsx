"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import { D3LineChart } from "@/components/admin/d3-line-chart"
import { D3DonutChart } from "@/components/admin/d3-donut-chart"
import { RefreshCw, Users, FileText, MessageCircle, Eye } from "lucide-react"

export default function AdminAnalyticsPage() {
  const [timeRange, setTimeRange] = useState("30d")
  const [isLoading, setIsLoading] = useState(false)

  const handleRefresh = async () => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsLoading(false)
  }

  // Mock analytics data
  const userAnalytics = [
    { date: "2024-01-14", value: 1180 },
    { date: "2024-01-15", value: 1195 },
    { date: "2024-01-16", value: 1210 },
    { date: "2024-01-17", value: 1225 },
    { date: "2024-01-18", value: 1235 },
    { date: "2024-01-19", value: 1242 },
    { date: "2024-01-20", value: 1247 },
  ]

  const pageViewsData = [
    { date: "2024-01-14", value: 15420 },
    { date: "2024-01-15", value: 16890 },
    { date: "2024-01-16", value: 18230 },
    { date: "2024-01-17", value: 17650 },
    { date: "2024-01-18", value: 19340 },
    { date: "2024-01-19", value: 20120 },
    { date: "2024-01-20", value: 21450 },
  ]

  const engagementData = [
    { date: "2024-01-14", value: 2340 },
    { date: "2024-01-15", value: 2567 },
    { date: "2024-01-16", value: 2890 },
    { date: "2024-01-17", value: 2756 },
    { date: "2024-01-18", value: 3120 },
    { date: "2024-01-19", value: 3345 },
    { date: "2024-01-20", value: 3567 },
  ]

  const deviceData = [
    { name: "Desktop", value: 45, color: "hsl(var(--blue-500))" },
    { name: "Mobile", value: 40, color: "hsl(var(--green-500))" },
    { name: "Tablet", value: 15, color: "hsl(var(--orange-500))" },
  ]

  const regionData = [
    { name: "North America", value: 35, color: "hsl(var(--blue-500))" },
    { name: "Europe", value: 30, color: "hsl(var(--green-500))" },
    { name: "Asia", value: 25, color: "hsl(var(--purple-500))" },
    { name: "Others", value: 10, color: "hsl(var(--orange-500))" },
  ]

  const trafficSourceData = [
    { name: "Direct", value: 40, color: "hsl(var(--blue-500))" },
    { name: "Search", value: 30, color: "hsl(var(--green-500))" },
    { name: "Social", value: 20, color: "hsl(var(--purple-500))" },
    { name: "Referral", value: 10, color: "hsl(var(--orange-500))" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Platform Analytics</h1>
          <p className="text-muted-foreground">Comprehensive platform statistics and insights</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* KPI Summary */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,247</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+12.5%</span> from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Page Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">21,450</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+18.2%</span> from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3,456</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+15.3%</span> from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Engagement</CardTitle>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3,567</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+22.1%</span> from last period
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Time Series Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>User Growth</CardTitle>
            <CardDescription>Total registered users over time</CardDescription>
          </CardHeader>
          <CardContent>
            <D3LineChart data={userAnalytics} width={400} height={300} color="hsl(var(--blue-500))" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Page Views</CardTitle>
            <CardDescription>Daily page views across the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <D3LineChart data={pageViewsData} width={400} height={300} color="hsl(var(--green-500))" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>User Engagement</CardTitle>
            <CardDescription>Daily likes, comments, and interactions</CardDescription>
          </CardHeader>
          <CardContent>
            <D3LineChart data={engagementData} width={400} height={300} color="hsl(var(--purple-500))" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Device Breakdown</CardTitle>
            <CardDescription>User device preferences</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <D3DonutChart data={deviceData} width={200} height={200} innerRadius={50} outerRadius={80} />
          </CardContent>
        </Card>
      </div>

      {/* Additional Analytics */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Geographic Distribution</CardTitle>
            <CardDescription>Users by region</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <D3DonutChart data={regionData} width={180} height={180} innerRadius={40} outerRadius={70} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Traffic Sources</CardTitle>
            <CardDescription>How users find the platform</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <D3DonutChart data={trafficSourceData} width={180} height={180} innerRadius={40} outerRadius={70} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Platform Health</CardTitle>
            <CardDescription>Key performance indicators</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Uptime</span>
                <Badge variant="default" className="bg-green-100 text-green-800">
                  99.9%
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Avg Response Time</span>
                <Badge variant="outline">120ms</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Error Rate</span>
                <Badge variant="outline">0.1%</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Active Sessions</span>
                <Badge variant="secondary">892</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
