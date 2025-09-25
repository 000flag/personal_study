"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Cookie, Shield, BarChart3, Target, Settings } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface CookieCategory {
  id: string
  name: string
  description: string
  required: boolean
  enabled: boolean
  icon: React.ReactNode
  cookies: {
    name: string
    purpose: string
    duration: string
  }[]
}

export default function CookieSettingsPage() {
  const [cookieSettings, setCookieSettings] = useState<CookieCategory[]>([
    {
      id: "essential",
      name: "필수 쿠키",
      description: "웹사이트의 기본 기능을 위해 반드시 필요한 쿠키입니다.",
      required: true,
      enabled: true,
      icon: <Shield className="h-5 w-5 text-green-500" />,
      cookies: [
        {
          name: "session_id",
          purpose: "사용자 세션 관리",
          duration: "브라우저 세션 종료 시까지",
        },
        {
          name: "csrf_token",
          purpose: "보안 토큰",
          duration: "24시간",
        },
        {
          name: "auth_token",
          purpose: "로그인 상태 유지",
          duration: "30일",
        },
      ],
    },
    {
      id: "analytics",
      name: "분석 쿠키",
      description: "웹사이트 사용 패턴을 분석하여 서비스를 개선하는 데 사용됩니다.",
      required: false,
      enabled: true,
      icon: <BarChart3 className="h-5 w-5 text-blue-500" />,
      cookies: [
        {
          name: "_ga",
          purpose: "Google Analytics 사용자 식별",
          duration: "2년",
        },
        {
          name: "_gid",
          purpose: "Google Analytics 세션 식별",
          duration: "24시간",
        },
        {
          name: "page_views",
          purpose: "페이지 조회수 추적",
          duration: "1년",
        },
      ],
    },
    {
      id: "marketing",
      name: "마케팅 쿠키",
      description: "개인화된 광고와 마케팅 콘텐츠를 제공하는 데 사용됩니다.",
      required: false,
      enabled: false,
      icon: <Target className="h-5 w-5 text-purple-500" />,
      cookies: [
        {
          name: "ad_preferences",
          purpose: "광고 선호도 저장",
          duration: "1년",
        },
        {
          name: "marketing_consent",
          purpose: "마케팅 동의 상태",
          duration: "2년",
        },
      ],
    },
    {
      id: "preferences",
      name: "기능 쿠키",
      description: "사용자의 선호도와 설정을 기억하는 데 사용됩니다.",
      required: false,
      enabled: true,
      icon: <Settings className="h-5 w-5 text-orange-500" />,
      cookies: [
        {
          name: "theme_preference",
          purpose: "다크/라이트 모드 설정",
          duration: "1년",
        },
        {
          name: "language_preference",
          purpose: "언어 설정",
          duration: "1년",
        },
        {
          name: "notification_settings",
          purpose: "알림 설정",
          duration: "6개월",
        },
      ],
    },
  ])

  const { toast } = useToast()

  const handleToggleCookie = (categoryId: string) => {
    setCookieSettings((prev) =>
      prev.map((category) =>
        category.id === categoryId && !category.required ? { ...category, enabled: !category.enabled } : category,
      ),
    )
  }

  const handleSaveSettings = () => {
    // In a real app, this would save to backend/localStorage
    toast({
      title: "설정이 저장되었습니다",
      description: "쿠키 설정이 성공적으로 업데이트되었습니다.",
    })
  }

  const handleAcceptAll = () => {
    setCookieSettings((prev) => prev.map((category) => ({ ...category, enabled: true })))
    toast({
      title: "모든 쿠키를 허용했습니다",
      description: "모든 쿠키 카테고리가 활성화되었습니다.",
    })
  }

  const handleRejectOptional = () => {
    setCookieSettings((prev) =>
      prev.map((category) => ({
        ...category,
        enabled: category.required,
      })),
    )
    toast({
      title: "선택적 쿠키를 거부했습니다",
      description: "필수 쿠키만 활성화되었습니다.",
    })
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-6">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Cookie className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight">쿠키 설정</h1>
          </div>
          <p className="text-muted-foreground">
            쿠키 사용에 대한 선호도를 설정하고 관리하세요. 언제든지 변경할 수 있습니다.
          </p>
        </div>

        <div className="flex justify-center gap-4 mb-6">
          <Button onClick={handleAcceptAll} className="px-6">
            모든 쿠키 허용
          </Button>
          <Button onClick={handleRejectOptional} variant="outline" className="px-6 bg-transparent">
            선택적 쿠키 거부
          </Button>
        </div>

        <div className="space-y-4">
          {cookieSettings.map((category) => (
            <Card key={category.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {category.icon}
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {category.name}
                        {category.required && (
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            필수
                          </Badge>
                        )}
                      </CardTitle>
                      <CardDescription className="mt-1">{category.description}</CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Label htmlFor={category.id} className="text-sm">
                      {category.enabled ? "활성화" : "비활성화"}
                    </Label>
                    <Switch
                      id={category.id}
                      checked={category.enabled}
                      onCheckedChange={() => handleToggleCookie(category.id)}
                      disabled={category.required}
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <h4 className="font-medium text-sm">이 카테고리의 쿠키:</h4>
                  <div className="space-y-2">
                    {category.cookies.map((cookie, index) => (
                      <div key={index} className="flex justify-between items-start p-3 bg-muted/50 rounded-lg">
                        <div>
                          <div className="font-medium text-sm">{cookie.name}</div>
                          <div className="text-xs text-muted-foreground">{cookie.purpose}</div>
                        </div>
                        <div className="text-xs text-muted-foreground text-right">
                          <div>유효기간:</div>
                          <div>{cookie.duration}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>쿠키 정책</CardTitle>
            <CardDescription>쿠키 사용에 대한 자세한 정보</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm text-muted-foreground">
              <p>
                쿠키는 웹사이트가 사용자의 브라우저에 저장하는 작은 텍스트 파일입니다. 쿠키를 통해 웹사이트는 사용자의
                방문을 기억하고 시간이 지남에 따라 사용자의 선호도를 학습할 수 있습니다.
              </p>
              <p>
                필수 쿠키는 웹사이트의 기본 기능을 위해 반드시 필요하며 비활성화할 수 없습니다. 다른 쿠키들은 사용자의
                선택에 따라 활성화하거나 비활성화할 수 있습니다.
              </p>
              <p>
                자세한 내용은{" "}
                <a href="/legal/privacy" className="text-primary hover:underline">
                  개인정보 처리방침
                </a>
                을 참조하세요.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-center">
          <Button onClick={handleSaveSettings} size="lg" className="px-8">
            설정 저장
          </Button>
        </div>
      </div>
    </div>
  )
}
