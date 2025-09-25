import Link from "next/link"

import { useTranslation } from "@/lib/i18n"
import { ThemeToggle } from "@/components/theme-toggle"
import { LanguageToggle } from "@/components/language-toggle"

export function Header() {
  const { t } = useTranslation()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="hidden font-bold sm:inline-block">BlogSpace</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link href="/">{t("home")}</Link>
            <Link href="/search">{t("search")}</Link>
            <Link href="/categories">{t("categories")}</Link>
            <Link href="/about">{t("about")}</Link>
            <Link href="/contact">{t("contact")}</Link>
          </nav>
        </div>

        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">{/* Search component */}</div>
          <nav className="flex items-center space-x-2">
            <ThemeToggle />
            <LanguageToggle />
            {/* ... existing auth buttons ... */}
          </nav>
        </div>
      </div>
    </header>
  )
}
