"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/lib/auth"
import { useMobile } from "@/hooks/use-mobile"
import { useTranslation } from "@/lib/i18n"
import Link from "next/link"

interface TopHeaderProps {
  onMenuClick?: () => void
}

export function TopHeader({ onMenuClick }: TopHeaderProps) {
  const isMobile = useMobile()
  const { user } = useAuth()
  const { t } = useTranslation()

  return (
    <header className="bg-background/95 backdrop-blur-md border-b border-border/40 px-6 py-4 sticky top-0 z-50 shadow-sm">
      <div className="flex items-center gap-6 max-w-7xl mx-auto">
        {isMobile && (
          <Button variant="ghost" size="sm" onClick={onMenuClick} className="h-9 w-9 p-0 hover:bg-accent/50">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </Button>
        )}

        {!isMobile && (
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="w-9 h-9 bg-gradient-to-br from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white dark:text-slate-900 font-bold text-lg">B</span>
              </div>
              <div className="absolute -inset-1 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <div>
              <h1 className="text-xl font-semibold tracking-tight bg-gradient-to-r from-slate-900 to-slate-600 dark:from-slate-100 dark:to-slate-400 bg-clip-text text-transparent">
                BlogSpace
              </h1>
              <p className="text-xs text-muted-foreground font-medium">{t("brand.tagline")}</p>
            </div>
          </Link>
        )}

        <div className="flex-1 max-w-lg">
          <div className="relative">
            <Input
              placeholder={t("search.placeholder")}
              className="pl-11 pr-4 bg-muted/30 border-border/30 focus:bg-background focus:border-border/60 transition-all h-10 text-sm rounded-xl shadow-sm"
            />
            <div className="absolute left-3.5 top-1/2 transform -translate-y-1/2">
              <svg className="h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" className="h-9 w-9 p-0 relative hover:bg-accent/50 rounded-xl">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5-5-5h5v-12" />
                </svg>
                <span className="absolute -top-1 -right-1 h-2.5 w-2.5 bg-red-500 rounded-full border border-background"></span>
              </Button>
              <Link href="/dashboard">
                <Avatar className="h-9 w-9 ring-2 ring-border/20 hover:ring-border/40 transition-all">
                  <AvatarImage src={user.avatar || "/placeholder.svg"} />
                  <AvatarFallback className="bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 text-slate-700 dark:text-slate-300 text-sm font-medium">
                    {user.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/auth/signup">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-9 px-4 text-sm font-medium hover:bg-accent/50 rounded-xl"
                >
                  {t("auth.signUp")}
                </Button>
              </Link>
              <Link href="/auth/login">
                <Button
                  size="sm"
                  className="h-9 px-4 text-sm font-medium bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-slate-200 dark:text-slate-900 rounded-xl shadow-sm"
                >
                  {t("auth.signIn")}
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
