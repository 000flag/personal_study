"use client"

import type React from "react"

import { useState } from "react"
import { Mail, ArrowLeft, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { useTranslation } from "@/lib/i18n"
import Link from "next/link"

export default function VerifyEmailPage() {
  const [code, setCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const { toast } = useToast()
  const { t } = useTranslation()

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate verification
    setTimeout(() => {
      setIsLoading(false)
      if (code === "123456") {
        toast({
          title: "이메일 인증 완료!",
          description: "계정이 성공적으로 활성화되었습니다.",
        })
        // Redirect to success page
        window.location.href = "/auth/signup-complete"
      } else {
        toast({
          title: "잘못된 코드",
          description: "코드를 확인하고 다시 시도해주세요.",
          variant: "destructive",
        })
      }
    }, 1000)
  }

  const handleResend = async () => {
    setIsResending(true)
    setTimeout(() => {
      setIsResending(false)
      toast({
        description: "인증 코드가 이메일로 전송되었습니다.",
      })
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Mail className="h-6 w-6 text-primary" />
          </div>
          <CardTitle>이메일 인증</CardTitle>
          <CardDescription>
            이메일 주소로 6자리 인증 코드를 보내드렸습니다. 아래에 입력하여 계정을 활성화하세요.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleVerify} className="space-y-4">
            <div>
              <Input
                type="text"
                placeholder="6자리 코드 입력"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                maxLength={6}
                className="text-center text-lg tracking-widest"
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading || code.length !== 6}>
              {isLoading && <RefreshCw className="mr-2 h-4 w-4 animate-spin" />}
              이메일 인증
            </Button>

            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">코드를 받지 못하셨나요?</p>
              <Button variant="ghost" onClick={handleResend} disabled={isResending} className="text-sm">
                {isResending && <RefreshCw className="mr-2 h-4 w-4 animate-spin" />}
                코드 재전송
              </Button>
            </div>

            <div className="text-center">
              <Link
                href="/auth/login"
                className="inline-flex items-center text-sm text-muted-foreground hover:text-primary"
              >
                <ArrowLeft className="mr-1 h-4 w-4" />
                로그인으로 돌아가기
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
