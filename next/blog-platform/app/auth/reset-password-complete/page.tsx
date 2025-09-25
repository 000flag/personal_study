"use client"

import { CheckCircle, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useTranslation } from "@/lib/i18n"
import Link from "next/link"

export default function ResetPasswordCompletePage() {
  const { t } = useTranslation()

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
          <CardTitle className="text-green-600 dark:text-green-400">비밀번호 재설정 완료!</CardTitle>
          <CardDescription>
            비밀번호가 성공적으로 업데이트되었습니다. 새 비밀번호로 로그인할 수 있습니다.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-muted/50 rounded-lg p-4">
            <h3 className="font-medium mb-2">보안 팁:</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• 강력하고 고유한 비밀번호를 사용하세요</li>
              <li>• 비밀번호를 다른 사람과 공유하지 마세요</li>
              <li>• 2단계 인증 활성화를 고려해보세요</li>
              <li>• 공용 기기에서는 로그아웃하세요</li>
            </ul>
          </div>

          <Link href="/auth/login" className="block">
            <Button className="w-full">
              {t("sign_in")}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>

          <Link href="/" className="block">
            <Button variant="outline" className="w-full bg-transparent">
              {t("home")}으로 돌아가기
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
