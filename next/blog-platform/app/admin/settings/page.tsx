"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Settings, Globe, Shield, Bell, Database } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    siteName: "LIVLOG",
    siteDescription: "인스타그램 스타일의 모바일 피드를 갖춘 현대적인 블로그 플랫폼",
    maintenanceMode: false,
    registrationEnabled: true,
    emailVerificationRequired: true,
    moderationEnabled: true,
    autoApproveComments: false,
    maxPostsPerDay: 10,
    maxFileSize: 5, // MB
    allowedFileTypes: "jpg,jpeg,png,gif,webp,mp4,pdf",
  })

  const { toast } = useToast()

  const handleSave = () => {
    // In a real app, this would save to the backend
    toast({
      title: "설정 저장됨",
      description: "플랫폼 설정이 성공적으로 업데이트되었습니다.",
    })
  }

  const handleSettingChange = (key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">플랫폼 설정</h1>
        <p className="text-muted-foreground">플랫폼 전체 설정 및 기능을 구성합니다</p>
      </div>

      <div className="grid gap-6">
        {/* Site Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              사이트 구성
            </CardTitle>
            <CardDescription>기본 사이트 정보 및 브랜딩</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="siteName">사이트 이름</Label>
              <Input
                id="siteName"
                value={settings.siteName}
                onChange={(e) => handleSettingChange("siteName", e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="siteDescription">사이트 설명</Label>
              <Textarea
                id="siteDescription"
                value={settings.siteDescription}
                onChange={(e) => handleSettingChange("siteDescription", e.target.value)}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Security & Access */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              보안 및 접근
            </CardTitle>
            <CardDescription>사용자 등록 및 보안 설정</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>유지보수 모드</Label>
                <p className="text-sm text-muted-foreground">유지보수를 위해 일시적으로 사이트 접근을 비활성화합니다</p>
              </div>
              <Switch
                checked={settings.maintenanceMode}
                onCheckedChange={(checked) => handleSettingChange("maintenanceMode", checked)}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>사용자 등록</Label>
                <p className="text-sm text-muted-foreground">새로운 사용자의 계정 등록을 허용합니다</p>
              </div>
              <Switch
                checked={settings.registrationEnabled}
                onCheckedChange={(checked) => handleSettingChange("registrationEnabled", checked)}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>이메일 인증 필수</Label>
                <p className="text-sm text-muted-foreground">새 계정에 대해 이메일 인증을 요구합니다</p>
              </div>
              <Switch
                checked={settings.emailVerificationRequired}
                onCheckedChange={(checked) => handleSettingChange("emailVerificationRequired", checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Content Moderation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              콘텐츠 조정
            </CardTitle>
            <CardDescription>콘텐츠 조정 및 승인 설정을 구성합니다</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>콘텐츠 조정</Label>
                <p className="text-sm text-muted-foreground">게시물 및 댓글에 대한 콘텐츠 조정을 활성화합니다</p>
              </div>
              <Switch
                checked={settings.moderationEnabled}
                onCheckedChange={(checked) => handleSettingChange("moderationEnabled", checked)}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>댓글 자동 승인</Label>
                <p className="text-sm text-muted-foreground">신뢰할 수 있는 사용자의 댓글을 자동으로 승인합니다</p>
              </div>
              <Switch
                checked={settings.autoApproveComments}
                onCheckedChange={(checked) => handleSettingChange("autoApproveComments", checked)}
              />
            </div>
            <Separator />
            <div className="grid gap-2">
              <Label htmlFor="maxPosts">일일 최대 게시물 수 (사용자당)</Label>
              <Input
                id="maxPosts"
                type="number"
                value={settings.maxPostsPerDay}
                onChange={(e) => handleSettingChange("maxPostsPerDay", Number.parseInt(e.target.value))}
              />
            </div>
          </CardContent>
        </Card>

        {/* File Upload Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              파일 업로드 설정
            </CardTitle>
            <CardDescription>파일 업로드 제한 및 허용 유형을 구성합니다</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="maxFileSize">최대 파일 크기 (MB)</Label>
              <Input
                id="maxFileSize"
                type="number"
                value={settings.maxFileSize}
                onChange={(e) => handleSettingChange("maxFileSize", Number.parseInt(e.target.value))}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="allowedTypes">허용된 파일 유형</Label>
              <Input
                id="allowedTypes"
                value={settings.allowedFileTypes}
                onChange={(e) => handleSettingChange("allowedFileTypes", e.target.value)}
                placeholder="jpg,jpeg,png,gif,webp,mp4,pdf"
              />
              <p className="text-sm text-muted-foreground">쉼표로 구분된 허용 파일 확장자 목록</p>
            </div>
          </CardContent>
        </Card>

        {/* System Status */}
        <Card>
          <CardHeader>
            <CardTitle>시스템 상태</CardTitle>
            <CardDescription>현재 시스템 정보 및 상태</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">플랫폼 버전</span>
                <Badge variant="outline">v1.0.0</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">데이터베이스 상태</span>
                <Badge
                  variant="default"
                  className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                >
                  연결됨
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">스토리지 상태</span>
                <Badge
                  variant="default"
                  className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                >
                  사용 가능
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">이메일 서비스</span>
                <Badge
                  variant="default"
                  className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                >
                  활성
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button onClick={handleSave} className="w-full sm:w-auto">
            <Settings className="h-4 w-4 mr-2" />
            설정 저장
          </Button>
        </div>
      </div>
    </div>
  )
}
