"use client"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

export function ThemeToggle() {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-muted/50 text-muted-foreground text-sm">
      <span>시스템 테마</span>
      <span className="text-xs bg-background px-2 py-0.5 rounded border">{theme === "dark" ? "다크" : "라이트"}</span>
    </div>
  )
}
