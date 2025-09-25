import type React from "react"
import { ProtectedRoute } from "@/components/auth/protected-route"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Shield, Users, AlertTriangle, Settings, BarChart3, FileText, MessageSquare, Folder, Tag } from "lucide-react"
import Link from "next/link"

const adminNavItems = [
  {
    title: "대시보드",
    url: "/admin",
    icon: BarChart3,
  },
  {
    title: "사용자 관리",
    url: "/admin/users",
    icon: Users,
  },
  {
    title: "게시물 관리",
    url: "/admin/posts",
    icon: FileText,
  },
  {
    title: "댓글 관리",
    url: "/admin/comments",
    icon: MessageSquare,
  },
  {
    title: "카테고리",
    url: "/admin/categories",
    icon: Folder,
  },
  {
    title: "태그",
    url: "/admin/tags",
    icon: Tag,
  },
  {
    title: "콘텐츠 검토",
    url: "/admin/moderation",
    icon: AlertTriangle,
  },
  {
    title: "분석",
    url: "/admin/analytics",
    icon: BarChart3,
  },
  {
    title: "플랫폼 설정",
    url: "/admin/settings",
    icon: Settings,
  },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute requireAdmin>
      <SidebarProvider>
        <div className="flex min-h-screen bg-background">
          <Sidebar className="border-r border-border/50">
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupLabel className="flex items-center gap-2 px-4 py-3 text-base font-semibold">
                  <Shield className="h-5 w-5 text-primary" />
                  관리자 패널
                </SidebarGroupLabel>
                <SidebarGroupContent className="px-2">
                  <SidebarMenu>
                    {adminNavItems.map((item) => (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                          asChild
                          className="w-full justify-start gap-3 px-3 py-2.5 text-sm font-medium hover:bg-accent/50 data-[active=true]:bg-primary/10 data-[active=true]:text-primary data-[active=true]:border-r-2 data-[active=true]:border-primary"
                        >
                          <Link href={item.url}>
                            <item.icon className="h-4 w-4" />
                            <span>{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
          </Sidebar>
          <main className="flex-1 bg-muted/30">
            <div className="p-6 max-w-7xl mx-auto">{children}</div>
          </main>
        </div>
      </SidebarProvider>
    </ProtectedRoute>
  )
}
