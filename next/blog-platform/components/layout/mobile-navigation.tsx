"use client"

import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth"
import { useTranslation } from "@/lib/i18n"
import Link from "next/link"

export function MobileNavigation() {
  const { user } = useAuth()
  const { t } = useTranslation()

  const navItems = [
    {
      label: t("nav.home"),
      href: "/",
      active: true,
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      ),
    },
    {
      label: t("nav.search"),
      href: "/search",
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      ),
    },
    {
      label: t("nav.writePost"),
      href: "/write",
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      ),
    },
    {
      label: t("nav.notifications"),
      href: "/notifications",
      badge: user ? 3 : 0,
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5-5-5h5v-12" />
        </svg>
      ),
    },
    {
      label: user ? t("profile") : t("auth.signIn"),
      href: user ? "/profile" : "/auth/login",
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      ),
    },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-md border-t border-border/40 z-50 shadow-lg">
      <div className="flex items-center justify-around py-3 px-4 max-w-md mx-auto">
        {navItems.map((item) => (
          <Link key={item.label} href={item.href} className="flex-1">
            <Button
              variant={item.active ? "default" : "ghost"}
              size="sm"
              className="flex flex-col items-center gap-1.5 h-auto py-2.5 px-2 relative w-full hover:bg-accent/50 rounded-xl transition-all"
            >
              <div className="relative">
                <div className={item.active ? "text-primary-foreground" : "text-muted-foreground"}>{item.icon}</div>
                {item.badge && item.badge > 0 && (
                  <span className="absolute -top-1 -right-1 h-2.5 w-2.5 bg-red-500 rounded-full border border-background"></span>
                )}
              </div>
              <span
                className={`text-xs font-medium ${item.active ? "text-primary-foreground" : "text-muted-foreground"}`}
              >
                {item.label}
              </span>
            </Button>
          </Link>
        ))}
      </div>
    </nav>
  )
}
