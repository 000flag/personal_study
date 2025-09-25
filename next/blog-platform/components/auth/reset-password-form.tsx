"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/lib/auth"
import Link from "next/link"

export function ResetPasswordForm() {
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const { resetPassword, isLoading } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!email) {
      setError("이메일 주소를 입력해주세요")
      return
    }

    const result = await resetPassword(email)
    if (result.success) {
      setSuccess(true)
    } else {
      setError(result.error || "재설정 이메일 전송에 실패했습니다")
    }
  }

  if (success) {
    return (
      <Card className="w-full max-w-md mx-auto border-border/50 shadow-sm">
        <CardHeader className="space-y-4 text-center pb-6">
          <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto">
            <span className="text-2xl">✓</span>
          </div>
          <CardTitle className="text-2xl font-light tracking-tight">이메일을 확인하세요</CardTitle>
          <CardDescription className="text-muted-foreground">
            {email}로 비밀번호 재설정 링크를 보냈습니다
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Link href="/auth/login" className="w-full">
            <Button variant="outline" className="w-full h-11 font-normal bg-transparent">
              로그인으로 돌아가기
            </Button>
          </Link>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto border-border/50 shadow-sm">
      <CardHeader className="space-y-2 text-center pb-6">
        <CardTitle className="text-2xl font-light tracking-tight">비밀번호 재설정</CardTitle>
        <CardDescription className="text-muted-foreground">
          이메일 주소를 입력하시면 재설정 링크를 보내드립니다
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive" className="border-destructive/20 bg-destructive/5">
              <AlertDescription className="text-sm">{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              이메일
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="이메일을 입력하세요"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              className="h-11 bg-muted/30 border-border/50 focus:bg-background focus:border-border transition-all"
            />
          </div>
        </CardContent>

        <CardFooter className="flex flex-col space-y-4 pt-6">
          <Button
            type="submit"
            className="w-full h-11 bg-foreground text-background hover:bg-foreground/90 font-normal"
            disabled={isLoading}
          >
            {isLoading ? "전송 중..." : "재설정 링크 보내기"}
          </Button>

          <Link
            href="/auth/login"
            className="text-sm text-center text-muted-foreground hover:text-foreground transition-colors"
          >
            로그인으로 돌아가기
          </Link>
        </CardFooter>
      </form>
    </Card>
  )
}
