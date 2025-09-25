"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/lib/auth"
import { useTranslation } from "@/lib/i18n"
import Link from "next/link"
import { categories } from "@/data/categories"
import { cn } from "@/lib/utils"

interface DesktopSidebarProps {
  collapsed?: boolean
  onToggleCollapse?: () => void
}

export function DesktopSidebar({ collapsed = false, onToggleCollapse }: DesktopSidebarProps) {
  const { user, logout } = useAuth()
  const { t } = useTranslation()

  const mainNavItems = [
    {
      label: t("nav.home"),
      href: "/",
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
      label: t("nav.trending"),
      href: "/trending",
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
    },
    {
      label: t("nav.bookmarks"),
      href: "/bookmarks",
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
          />
        </svg>
      ),
    },
  ]

  const dashboardItems = user
    ? [
        {
          label: t("nav.dashboard"),
          href: "/dashboard",
          icon: (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          ),
        },
        {
          label: t("nav.myPosts"),
          href: "/dashboard/posts",
          icon: (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          ),
        },
        {
          label: t("nav.subscribers"),
          href: "/dashboard/subscribers",
          icon: (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
              />
            </svg>
          ),
        },
        {
          label: t("nav.settings"),
          href: "/dashboard/settings",
          icon: (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          ),
        },
      ]
    : []

  const adminItems =
    user?.role === "admin"
      ? [
          {
            label: t("nav.admin"),
            href: "/admin",
            icon: (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            ),
          },
        ]
      : []

  return (
    <aside
      className={cn(
        "bg-card/50 backdrop-blur-sm border-r border-border/40 flex flex-col transition-all duration-300 shadow-sm",
        collapsed ? "w-16" : "w-72",
      )}
    >
      <div className="p-4 border-b border-border/30">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="w-8 h-8 bg-gradient-to-br from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 rounded-lg flex items-center justify-center shadow-md">
                  <span className="text-white dark:text-slate-900 font-bold text-sm">B</span>
                </div>
              </div>
              <div>
                <h1 className="text-lg font-semibold tracking-tight">BlogSpace</h1>
                <p className="text-xs text-muted-foreground">{t("brand.tagline")}</p>
              </div>
            </Link>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleCollapse}
            className="h-8 w-8 p-0 hover:bg-accent/50 rounded-lg"
          >
            <svg
              className={cn("h-4 w-4 transition-transform duration-200", collapsed && "rotate-180")}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          </Button>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {mainNavItems.map((item) => (
          <Link key={item.label} href={item.href}>
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start h-11 text-left font-normal hover:bg-accent/60 transition-all rounded-xl group",
                collapsed ? "px-3" : "px-4",
              )}
            >
              <div className="flex items-center gap-3">
                <div className="text-muted-foreground group-hover:text-foreground transition-colors">{item.icon}</div>
                {!collapsed && <span className="text-sm">{item.label}</span>}
              </div>
            </Button>
          </Link>
        ))}

        {user && (
          <>
            <Separator className="my-4" />

            {!collapsed && (
              <h3 className="text-xs font-semibold text-muted-foreground px-4 mb-2 uppercase tracking-wider">
                {t("nav.myBlog")}
              </h3>
            )}

            {dashboardItems.map((item) => (
              <Link key={item.label} href={item.href}>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start h-11 text-left font-normal hover:bg-accent/60 transition-all rounded-xl group",
                    collapsed ? "px-3" : "px-4",
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className="text-muted-foreground group-hover:text-foreground transition-colors">
                      {item.icon}
                    </div>
                    {!collapsed && <span className="text-sm">{item.label}</span>}
                  </div>
                </Button>
              </Link>
            ))}

            {user.role === "admin" && (
              <>
                <Separator className="my-4" />
                {!collapsed && (
                  <h3 className="text-xs font-semibold text-muted-foreground px-4 mb-2 uppercase tracking-wider">
                    {t("nav.administration")}
                  </h3>
                )}
                {adminItems.map((item) => (
                  <Link key={item.label} href={item.href}>
                    <Button
                      variant="ghost"
                      className={cn(
                        "w-full justify-start h-11 text-left font-normal hover:bg-accent/60 transition-all rounded-xl group",
                        collapsed ? "px-3" : "px-4",
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-muted-foreground group-hover:text-foreground transition-colors">
                          {item.icon}
                        </div>
                        {!collapsed && <span className="text-sm">{item.label}</span>}
                      </div>
                    </Button>
                  </Link>
                ))}
              </>
            )}
          </>
        )}

        {!collapsed && (
          <>
            <Separator className="my-4" />

            <div className="space-y-1">
              <h3 className="text-xs font-semibold text-muted-foreground px-4 mb-2 uppercase tracking-wider">
                {t("nav.categories")}
              </h3>
              {categories.slice(0, 5).map((category) => (
                <Button
                  key={category.name}
                  variant="ghost"
                  className="w-full justify-between px-4 h-10 hover:bg-accent/60 transition-all rounded-xl"
                >
                  <span className="font-normal text-sm">{category.name}</span>
                  <Badge variant="secondary" className="text-xs bg-muted/60 text-muted-foreground border-0">
                    {category.count}
                  </Badge>
                </Button>
              ))}
            </div>

            <Separator className="my-4" />
          </>
        )}

        <Link href="/write">
          <Button
            className={cn(
              "w-full h-11 bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-slate-200 dark:text-slate-900 font-medium rounded-xl shadow-sm transition-all",
              collapsed ? "px-3" : "px-4",
            )}
          >
            {collapsed ? (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            ) : (
              t("nav.writePost")
            )}
          </Button>
        </Link>
      </nav>

      <div className="p-3 border-t border-border/30">
        {user ? (
          <div className="space-y-3">
            {!collapsed && (
              <div className="flex items-center gap-3 p-3 rounded-xl bg-accent/30">
                <Avatar className="h-10 w-10 ring-2 ring-border/20">
                  <AvatarImage src={user.avatar || "/placeholder.svg"} />
                  <AvatarFallback className="bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 text-slate-700 dark:text-slate-300 font-medium">
                    {user.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{user.name}</p>
                  <p className="text-xs text-muted-foreground truncate">@{user.username}</p>
                </div>
              </div>
            )}

            {collapsed ? (
              <Avatar className="h-10 w-10 mx-auto ring-2 ring-border/20">
                <AvatarImage src={user.avatar || "/placeholder.svg"} />
                <AvatarFallback className="bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 text-slate-700 dark:text-slate-300 font-medium">
                  {user.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
            ) : (
              <div className="flex gap-2">
                <Link href="/dashboard/settings" className="flex-1">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-xs bg-transparent hover:bg-accent/50 rounded-lg"
                  >
                    {t("settings")}
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={logout}
                  className="text-xs text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950 bg-transparent rounded-lg"
                >
                  {t("logout")}
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            {collapsed ? (
              <Link href="/auth/login">
                <Button className="w-full h-10 bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-slate-200 dark:text-slate-900 font-medium rounded-xl">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                    />
                  </svg>
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/auth/login">
                  <Button className="w-full h-10 bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-slate-200 dark:text-slate-900 font-medium rounded-xl shadow-sm">
                    {t("auth.signIn")}
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button
                    variant="outline"
                    className="w-full h-10 font-medium rounded-xl bg-transparent hover:bg-accent/50"
                  >
                    {t("auth.signUp")}
                  </Button>
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </aside>
  )
}
