"use client"

import type React from "react"

import { useState } from "react"
import { useMobile } from "@/hooks/use-mobile"
import { MobileNavigation } from "./mobile-navigation"
import { DesktopSidebar } from "./desktop-sidebar"
import { TopHeader } from "./top-header"

interface ResponsiveLayoutProps {
  children: React.ReactNode
}

export function ResponsiveLayout({ children }: ResponsiveLayoutProps) {
  const isMobile = useMobile()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  if (isMobile) {
    return (
      <div className="flex flex-col h-screen bg-background overflow-hidden">
        <TopHeader onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto pb-16">{children}</main>
        <MobileNavigation />
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <DesktopSidebar collapsed={sidebarCollapsed} onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)} />
      <div className="flex-1 flex flex-col min-w-0">
        <TopHeader />
        <main className="flex-1 overflow-y-auto">
          <div className="min-h-full p-6">{children}</div>
        </main>
      </div>
    </div>
  )
}
