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

export function SignupForm() {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [error, setError] = useState("")
  const { signup, isLoading } = useAuth()
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!formData.name || !formData.username || !formData.email || !formData.password) {
      setError("모든 필드를 입력해주세요")
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError("비밀번호가 일치하지 않습니다")
      return
    }

    if (formData.password.length < 6) {
      setError("비밀번호는 최소 6자 이상이어야 합니다")
      return
    }

    const result = await signup(formData.email, formData.password, formData.name, formData.username)
    if (result.success) {
      router.push("/auth/signup-complete")
    } else {
      setError(result.error || "회원가입에 실패했습니다")
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto border-border/50 shadow-sm">
      <CardHeader className="space-y-2 text-center pb-6">
        <CardTitle className="text-2xl font-light tracking-tight">회원가입</CardTitle>
        <CardDescription className="text-muted-foreground">BlogSpace에 가입하고 이야기를 공유하세요</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive" className="border-destructive/20 bg-destructive/5">
              <AlertDescription className="text-sm">{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">
              이름
            </Label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="이름을 입력하세요"
              value={formData.name}
              onChange={handleChange}
              disabled={isLoading}
              className="h-11 bg-muted/30 border-border/50 focus:bg-background focus:border-border transition-all"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="username" className="text-sm font-medium">
              사용자명
            </Label>
            <Input
              id="username"
              name="username"
              type="text"
              placeholder="사용자명을 입력하세요"
              value={formData.username}
              onChange={handleChange}
              disabled={isLoading}
              className="h-11 bg-muted/30 border-border/50 focus:bg-background focus:border-border transition-all"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              이메일
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="이메일을 입력하세요"
              value={formData.email}
              onChange={handleChange}
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
              name="password"
              type="password"
              placeholder="비밀번호를 입력하세요"
              value={formData.password}
              onChange={handleChange}
              disabled={isLoading}
              className="h-11 bg-muted/30 border-border/50 focus:bg-background focus:border-border transition-all"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-sm font-medium">
              비밀번호 확인
            </Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="비밀번호를 다시 입력하세요"
              value={formData.confirmPassword}
              onChange={handleChange}
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
            {isLoading ? "가입 중..." : "계정 만들기"}
          </Button>

          <p className="text-sm text-center text-muted-foreground">
            이미 계정이 있으신가요?{" "}
            <Link href="/auth/login" className="text-foreground hover:underline font-medium">
              로그인
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  )
}
