"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/lib/auth"
import Link from "next/link"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const { login, isLoading } = useAuth()
  const router = useRouter()

  const quickLogin = async (testEmail: string) => {
    setEmail(testEmail)
    setPassword("Test1234!")
    setError("")

    const result = await login(testEmail, "Test1234!")
    if (result.success) {
      router.push("/")
    } else {
      setError(result.error || "로그인에 실패했습니다")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!email || !password) {
      setError("모든 필드를 입력해주세요")
      return
    }

    const result = await login(email, password)
    if (result.success) {
      router.push("/")
    } else {
      setError(result.error || "로그인에 실패했습니다")
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto border-border/50 shadow-sm">
      <CardHeader className="space-y-2 text-center pb-6">
        <CardTitle className="text-2xl font-light tracking-tight">로그인</CardTitle>
        <CardDescription className="text-muted-foreground">BlogSpace 계정으로 로그인하세요</CardDescription>
      </CardHeader>

      <div className="px-6 pb-4">
        <div className="bg-muted/30 rounded-lg p-4 space-y-3">
          <h4 className="text-sm font-medium text-foreground">테스트 계정</h4>
          <div className="space-y-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-full justify-start text-xs h-8 bg-transparent"
              onClick={() => quickLogin("admin@example.com")}
              disabled={isLoading}
            >
              관리자: admin@example.com
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-full justify-start text-xs h-8 bg-transparent"
              onClick={() => quickLogin("user1@example.com")}
              disabled={isLoading}
            >
              사용자1: user1@example.com
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-full justify-start text-xs h-8 bg-transparent"
              onClick={() => quickLogin("user2@example.com")}
              disabled={isLoading}
            >
              사용자2: user2@example.com
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">모든 계정 비밀번호: Test1234!</p>
        </div>
      </div>

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

          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium">
              비밀번호
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="비밀번호를 입력하세요"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              className="h-11 bg-muted/30 border-border/50 focus:bg-background focus:border-border transition-all"
            />
          </div>

          <div className="text-right">
            <Link
              href="/auth/reset-password"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              비밀번호를 잊으셨나요?
            </Link>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col space-y-4 pt-6">
          <Button
            type="submit"
            className="w-full h-11 bg-foreground text-background hover:bg-foreground/90 font-normal"
            disabled={isLoading}
          >
            {isLoading ? "로그인 중..." : "로그인"}
          </Button>

          <p className="text-sm text-center text-muted-foreground">
            계정이 없으신가요?{" "}
            <Link href="/auth/signup" className="text-foreground hover:underline font-medium">
              회원가입
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  )
}
