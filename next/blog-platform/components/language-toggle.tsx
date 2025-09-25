"use client"

import { Button } from "@/components/ui/button"
import { useTranslation } from "@/lib/i18n"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function LanguageToggle() {
  const { language, setLanguage, t } = useTranslation()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm">
          <span className="text-sm">🌐</span>
          <span className="sr-only">{t("language")}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setLanguage("ko")}>
          <span className={language === "ko" ? "font-semibold" : ""}>{t("korean")}</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setLanguage("en")}>
          <span className={language === "en" ? "font-semibold" : ""}>{t("english")}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
