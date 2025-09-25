"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { useAnalytics } from "@/lib/analytics"
import { Eye, Users, UserPlus, Heart, MessageCircle, TrendingUp, TrendingDown, RefreshCw } from "lucide-react"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

export function AnalyticsOverview() {
  const { data, timeRange, setTimeRange, isLoading, refreshData } = useAnalytics()

  const kpiCards = [
    {
      title: "Total Views",
      value: data.views.total.toLocaleString(),
      change: "+12.5%",
      trend: "up",
      icon: Eye,
      color: "text-blue-600",
    },
    {
      title: "Unique Visitors",
      value: data.visitors.unique.toLocaleString(),
      change: "+8.2%",
      trend: "up",
      icon: Users,
      color: "text-green-600",
    },
    {
      title: "Subscribers",
      value: data.subscribers.total.toLocaleString(),
      change: `+${data.subscribers.growth}%`,
      trend: "up",
      icon: UserPlus,
      color: "text-purple-600",
    },
    {
      title: "Engagement",
      value: data.engagement.likes.toLocaleString(),
      change: "+15.3%",
      trend: "up",
      icon: Heart,
      color: "text-red-600",
    },
  ]

  const COLORS = ["#be123c", "#ec4899", "#f59e0b", "#d97706", "#dc2626"]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Analytics Overview</h2>
        <div className="flex items-center gap-3">
          <Select value={timeRange} onValueChange={(value: any) => setTimeRange(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={refreshData} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpiCards.map((kpi) => (
          <Card key={kpi.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
              <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpi.value}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                {kpi.trend === "up" ? (
                  <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                ) : (
                  <TrendingDown className="h-3 w-3 mr-1 text-red-500" />
                )}
                <span className={kpi.trend === "up" ? "text-green-500" : "text-red-500"}>{kpi.change}</span>
                <span className="ml-1">from last period</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Views Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Views Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={data.views.daily}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="views" stroke="#be123c" fill="#be123c" fillOpacity={0.1} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Engagement Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Engagement Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data.engagement.daily}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="likes" stroke="#be123c" strokeWidth={2} />
                <Line type="monotone" dataKey="comments" stroke="#ec4899" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Device Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Device Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data.demographics.devices}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {data.demographics.devices.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Posts */}
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Posts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.topPosts.slice(0, 5).map((post, index) => (
                <div key={post.id} className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-sm line-clamp-1">{post.title}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {post.views}
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="h-3 w-3" />
                        {post.likes}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle className="h-3 w-3" />
                        {post.comments}
                      </span>
                    </div>
                  </div>
                  <div className="text-lg font-bold text-primary">#{index + 1}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
