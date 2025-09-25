"use client"

import { CheckCircle, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useTranslation } from "@/lib/i18n"
import Link from "next/link"

export default function SignupCompletePage() {
  const { t } = useTranslation()

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
          <CardTitle className="text-green-600 dark:text-green-400">환영합니다!</CardTitle>
          <CardDescription>
            계정이 성공적으로 생성되고 인증되었습니다. 이제 멋진 콘텐츠를 탐색하고 만들 수 있습니다.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-muted/50 rounded-lg p-4">
            <h3 className="font-medium mb-2">다음 단계는?</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• 프로필 완성하기</li>
              <li>• 첫 번째 블로그 글 작성하기</li>
              <li>• 흥미로운 작성자 팔로우하기</li>
              <li>• 인기 콘텐츠 탐색하기</li>
            </ul>
          </div>

          <Link href="/dashboard" className="block">
            <Button className="w-full">
              {t("dashboard")}로 이동
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>

          <Link href="/" className="block">
            <Button variant="outline" className="w-full bg-transparent">
              콘텐츠 탐색하기
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
