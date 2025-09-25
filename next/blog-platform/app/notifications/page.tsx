"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Bell, Heart, MessageCircle, UserPlus, Settings, Check, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Notification {
  id: string
  type: "like" | "comment" | "follow" | "system"
  title: string
  message: string
  isRead: boolean
  createdAt: string
  actionUrl?: string
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "like",
    title: "New Like",
    message: "Sarah Wilson liked your post 'Getting Started with Next.js 15'",
    isRead: false,
    createdAt: "2024-01-20T10:30:00Z",
    actionUrl: "/post/getting-started-nextjs-15",
  },
  {
    id: "2",
    type: "comment",
    title: "New Comment",
    message: "John Doe commented on your post 'The Future of Web Development'",
    isRead: false,
    createdAt: "2024-01-20T09:15:00Z",
    actionUrl: "/post/future-web-development",
  },
  {
    id: "3",
    type: "follow",
    title: "New Follower",
    message: "Mike Johnson started following you",
    isRead: true,
    createdAt: "2024-01-19T16:45:00Z",
    actionUrl: "/author/mike-johnson",
  },
  {
    id: "4",
    type: "system",
    title: "System Update",
    message: "New features have been added to the platform. Check out the changelog!",
    isRead: true,
    createdAt: "2024-01-19T14:20:00Z",
    actionUrl: "/changelog",
  },
  {
    id: "5",
    type: "like",
    title: "New Like",
    message: "Alice Brown liked your post 'Design Systems Best Practices'",
    isRead: true,
    createdAt: "2024-01-18T11:30:00Z",
    actionUrl: "/post/design-systems-best-practices",
  },
]

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
  const [filter, setFilter] = useState<string>("all")
  const { toast } = useToast()

  const filteredNotifications = notifications.filter((notification) => {
    if (filter === "unread") return !notification.isRead
    if (filter === "read") return notification.isRead
    if (filter !== "all") return notification.type === filter
    return true
  })

  const handleMarkAsRead = (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === notificationId ? { ...notification, isRead: true } : notification,
      ),
    )
  }

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((notification) => ({ ...notification, isRead: true })))
    toast({
      title: "All notifications marked as read",
      description: "All your notifications have been marked as read.",
    })
  }

  const handleDeleteNotification = (notificationId: string) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== notificationId))
    toast({
      title: "Notification deleted",
      description: "The notification has been removed.",
    })
  }

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "like":
        return <Heart className="h-4 w-4 text-red-500" />
      case "comment":
        return <MessageCircle className="h-4 w-4 text-blue-500" />
      case "follow":
        return <UserPlus className="h-4 w-4 text-green-500" />
      case "system":
        return <Settings className="h-4 w-4 text-purple-500" />
      default:
        return <Bell className="h-4 w-4" />
    }
  }

  const unreadCount = notifications.filter((n) => !n.isRead).length

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">알림</h1>
            <p className="text-muted-foreground">
              {unreadCount > 0 ? `${unreadCount}개의 읽지 않은 알림이 있습니다` : "모든 알림을 확인했습니다"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="필터" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">모든 알림</SelectItem>
                <SelectItem value="unread">읽지 않음</SelectItem>
                <SelectItem value="read">읽음</SelectItem>
                <SelectItem value="like">좋아요</SelectItem>
                <SelectItem value="comment">댓글</SelectItem>
                <SelectItem value="follow">팔로우</SelectItem>
                <SelectItem value="system">시스템</SelectItem>
              </SelectContent>
            </Select>
            {unreadCount > 0 && (
              <Button onClick={handleMarkAllAsRead} variant="outline">
                <Check className="h-4 w-4 mr-2" />
                모두 읽음 처리
              </Button>
            )}
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              알림 목록
            </CardTitle>
            <CardDescription>최근 활동 및 업데이트를 확인하세요</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredNotifications.length === 0 ? (
                <div className="text-center py-8">
                  <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium">알림이 없습니다</h3>
                  <p className="text-muted-foreground">새로운 알림이 있으면 여기에 표시됩니다</p>
                </div>
              ) : (
                filteredNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`flex items-start gap-4 p-4 rounded-lg border transition-colors ${
                      !notification.isRead ? "bg-blue-50 border-blue-200" : "bg-background"
                    }`}
                  >
                    <div className="flex-shrink-0 mt-1">{getNotificationIcon(notification.type)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium">{notification.title}</h4>
                          <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                          <p className="text-xs text-muted-foreground mt-2">
                            {new Date(notification.createdAt).toLocaleString("ko-KR")}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          {!notification.isRead && (
                            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                              새로움
                            </Badge>
                          )}
                          <div className="flex items-center gap-1">
                            {!notification.isRead && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleMarkAsRead(notification.id)}
                                className="h-8 w-8 p-0"
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDeleteNotification(notification.id)}
                              className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
