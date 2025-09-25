"use client"

import type React from "react"

import { useAuth } from "@/lib/auth"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Loader2 } from "lucide-react"

interface ProtectedRouteProps {
  children: React.ReactNode
  redirectTo?: string
  requireAdmin?: boolean
}

export function ProtectedRoute({ children, redirectTo = "/auth/login", requireAdmin = false }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push(redirectTo)
    }
    if (!isLoading && user && requireAdmin && user.role !== "admin") {
      router.push("/dashboard")
    }
  }, [user, isLoading, router, redirectTo, requireAdmin])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  if (requireAdmin && user.role !== "admin") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
          <p className="text-muted-foreground">You don't have permission to access this area.</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
