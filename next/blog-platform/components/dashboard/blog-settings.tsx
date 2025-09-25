"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Upload, Save, Palette, Globe, Shield, Bell, X } from "lucide-react"
import { useTranslation } from "@/lib/i18n"

interface BlogSettings {
  general: {
    blogTitle: string
    tagline: string
    description: string
    logo: string
    favicon: string
    coverImage: string
  }
  seo: {
    metaTitle: string
    metaDescription: string
    keywords: string[]
    ogImage: string
    twitterHandle: string
  }
  domain: {
    customDomain: string
    subdomain: string
    httpsEnabled: boolean
  }
  theme: {
    primaryColor: string
    accentColor: string
    fontFamily: string
    darkMode: boolean
  }
  privacy: {
    publicBlog: boolean
    allowComments: boolean
    moderateComments: boolean
    allowSubscriptions: boolean
  }
  notifications: {
    emailNotifications: boolean
    newComments: boolean
    newSubscribers: boolean
    weeklyDigest: boolean
  }
}

export function BlogSettings() {
  const { toast } = useToast()
  const { t } = useTranslation()
  const [settings, setSettings] = useState<BlogSettings>({
    general: {
      blogTitle: "내 블로그",
      tagline: "생각과 아이디어 공유",
      description: "기술, 디자인, 그리고 삶에 대한 개인 블로그입니다.",
      logo: "",
      favicon: "",
      coverImage: "",
    },
    seo: {
      metaTitle: "내 블로그 - 생각과 아이디어",
      metaDescription: "기술, 디자인, 그리고 삶에 대한 통찰을 공유하는 개인 블로그입니다.",
      keywords: ["블로그", "기술", "디자인", "개인"],
      ogImage: "",
      twitterHandle: "@myblog",
    },
    domain: {
      customDomain: "",
      subdomain: "myblog",
      httpsEnabled: true,
    },
    theme: {
      primaryColor: "#22c55e",
      accentColor: "#10b981",
      fontFamily: "Work Sans",
      darkMode: false,
    },
    privacy: {
      publicBlog: true,
      allowComments: true,
      moderateComments: true,
      allowSubscriptions: true,
    },
    notifications: {
      emailNotifications: true,
      newComments: true,
      newSubscribers: true,
      weeklyDigest: false,
    },
  })

  const [newKeyword, setNewKeyword] = useState("")
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    toast({
      title: "설정이 저장되었습니다",
      description: "블로그 설정이 성공적으로 업데이트되었습니다.",
    })
    setIsSaving(false)
  }

  const addKeyword = () => {
    if (newKeyword.trim() && !settings.seo.keywords.includes(newKeyword.trim())) {
      setSettings((prev) => ({
        ...prev,
        seo: {
          ...prev.seo,
          keywords: [...prev.seo.keywords, newKeyword.trim()],
        },
      }))
      setNewKeyword("")
    }
  }

  const removeKeyword = (keyword: string) => {
    setSettings((prev) => ({
      ...prev,
      seo: {
        ...prev.seo,
        keywords: prev.seo.keywords.filter((k) => k !== keyword),
      },
    }))
  }

  const updateSettings = (section: keyof BlogSettings, field: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{t("blog_settings")}</h2>
        <Button onClick={handleSave} disabled={isSaving}>
          <Save className="h-4 w-4 mr-2" />
          {isSaving ? "저장 중..." : t("save")}
        </Button>
      </div>

      <div className="grid gap-6">
        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              일반 설정
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="blog-title">블로그 제목</Label>
                <Input
                  id="blog-title"
                  value={settings.general.blogTitle}
                  onChange={(e) => updateSettings("general", "blogTitle", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tagline">태그라인</Label>
                <Input
                  id="tagline"
                  value={settings.general.tagline}
                  onChange={(e) => updateSettings("general", "tagline", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">설명</Label>
              <Textarea
                id="description"
                value={settings.general.description}
                onChange={(e) => updateSettings("general", "description", e.target.value)}
                rows={3}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label>로고</Label>
                <Button variant="outline" className="w-full bg-transparent">
                  <Upload className="h-4 w-4 mr-2" />
                  로고 업로드
                </Button>
              </div>
              <div className="space-y-2">
                <Label>파비콘</Label>
                <Button variant="outline" className="w-full bg-transparent">
                  <Upload className="h-4 w-4 mr-2" />
                  파비콘 업로드
                </Button>
              </div>
              <div className="space-y-2">
                <Label>커버 이미지</Label>
                <Button variant="outline" className="w-full bg-transparent">
                  <Upload className="h-4 w-4 mr-2" />
                  커버 업로드
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* SEO Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              SEO 설정
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="meta-title">Meta Title</Label>
                <Input
                  id="meta-title"
                  value={settings.seo.metaTitle}
                  onChange={(e) => updateSettings("seo", "metaTitle", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="twitter-handle">Twitter Handle</Label>
                <Input
                  id="twitter-handle"
                  value={settings.seo.twitterHandle}
                  onChange={(e) => updateSettings("seo", "twitterHandle", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="meta-description">Meta Description</Label>
              <Textarea
                id="meta-description"
                value={settings.seo.metaDescription}
                onChange={(e) => updateSettings("seo", "metaDescription", e.target.value)}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>Keywords</Label>
              <div className="flex gap-2">
                <Input
                  value={newKeyword}
                  onChange={(e) => setNewKeyword(e.target.value)}
                  placeholder="Add a keyword..."
                  onKeyPress={(e) => e.key === "Enter" && addKeyword()}
                />
                <Button onClick={addKeyword}>Add</Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {settings.seo.keywords.map((keyword) => (
                  <Badge key={keyword} variant="secondary" className="gap-1">
                    {keyword}
                    <button onClick={() => removeKeyword(keyword)}>
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Domain Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              도메인 설정
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="subdomain">서브도메인</Label>
                <div className="flex">
                  <Input
                    id="subdomain"
                    value={settings.domain.subdomain}
                    onChange={(e) => updateSettings("domain", "subdomain", e.target.value)}
                    className="rounded-r-none"
                  />
                  <div className="bg-muted px-3 py-2 border border-l-0 rounded-r-md text-sm text-muted-foreground">
                    .blogspace.com
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="custom-domain">사용자 지정 도메인</Label>
                <Input
                  id="custom-domain"
                  value={settings.domain.customDomain}
                  onChange={(e) => updateSettings("domain", "customDomain", e.target.value)}
                  placeholder="yourdomain.com"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="https"
                checked={settings.domain.httpsEnabled}
                onCheckedChange={(checked) => updateSettings("domain", "httpsEnabled", checked)}
              />
              <Label htmlFor="https">HTTPS 활성화</Label>
            </div>
          </CardContent>
        </Card>

        {/* Theme Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              테마 설정
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="primary-color">기본 색상</Label>
                <div className="flex gap-2">
                  <Input
                    id="primary-color"
                    type="color"
                    value={settings.theme.primaryColor}
                    onChange={(e) => updateSettings("theme", "primaryColor", e.target.value)}
                    className="w-16 h-10 p-1"
                  />
                  <Input
                    value={settings.theme.primaryColor}
                    onChange={(e) => updateSettings("theme", "primaryColor", e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="accent-color">강조 색상</Label>
                <div className="flex gap-2">
                  <Input
                    id="accent-color"
                    type="color"
                    value={settings.theme.accentColor}
                    onChange={(e) => updateSettings("theme", "accentColor", e.target.value)}
                    className="w-16 h-10 p-1"
                  />
                  <Input
                    value={settings.theme.accentColor}
                    onChange={(e) => updateSettings("theme", "accentColor", e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="font-family">글꼴</Label>
                <Select
                  value={settings.theme.fontFamily}
                  onValueChange={(value) => updateSettings("theme", "fontFamily", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Work Sans">Work Sans</SelectItem>
                    <SelectItem value="Inter">Inter</SelectItem>
                    <SelectItem value="Roboto">Roboto</SelectItem>
                    <SelectItem value="Open Sans">Open Sans</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="dark-mode"
                checked={settings.theme.darkMode}
                onCheckedChange={(checked) => updateSettings("theme", "darkMode", checked)}
              />
              <Label htmlFor="dark-mode">기본적으로 다크 모드 활성화</Label>
            </div>
          </CardContent>
        </Card>

        {/* Privacy Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              프라이버시 설정
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="public-blog">공개 블로그</Label>
                  <p className="text-sm text-muted-foreground">블로그를 누구나 볼 수 있도록 허용</p>
                </div>
                <Switch
                  id="public-blog"
                  checked={settings.privacy.publicBlog}
                  onCheckedChange={(checked) => updateSettings("privacy", "publicBlog", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="allow-comments">댓글 허용</Label>
                  <p className="text-sm text-muted-foreground">사용자가 게시물에 댓글을 남길 수 있도록 허용</p>
                </div>
                <Switch
                  id="allow-comments"
                  checked={settings.privacy.allowComments}
                  onCheckedChange={(checked) => updateSettings("privacy", "allowComments", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="moderate-comments">댓글 승인</Label>
                  <p className="text-sm text-muted-foreground">댓글이 나타나기 전에 승인</p>
                </div>
                <Switch
                  id="moderate-comments"
                  checked={settings.privacy.moderateComments}
                  onCheckedChange={(checked) => updateSettings("privacy", "moderateComments", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="allow-subscriptions">구독 허용</Label>
                  <p className="text-sm text-muted-foreground">사용자가 블로그를 구독할 수 있도록 허용</p>
                </div>
                <Switch
                  id="allow-subscriptions"
                  checked={settings.privacy.allowSubscriptions}
                  onCheckedChange={(checked) => updateSettings("privacy", "allowSubscriptions", checked)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              알림 설정
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="email-notifications">이메일 알림</Label>
                  <p className="text-sm text-muted-foreground">이메일을 통해 알림 받기</p>
                </div>
                <Switch
                  id="email-notifications"
                  checked={settings.notifications.emailNotifications}
                  onCheckedChange={(checked) => updateSettings("notifications", "emailNotifications", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="new-comments">새 댓글</Label>
                  <p className="text-sm text-muted-foreground">새 댓글 알림 받기</p>
                </div>
                <Switch
                  id="new-comments"
                  checked={settings.notifications.newComments}
                  onCheckedChange={(checked) => updateSettings("notifications", "newComments", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="new-subscribers">새 구독자</Label>
                  <p className="text-sm text-muted-foreground">새 구독자 알림 받기</p>
                </div>
                <Switch
                  id="new-subscribers"
                  checked={settings.notifications.newSubscribers}
                  onCheckedChange={(checked) => updateSettings("notifications", "newSubscribers", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="weekly-digest">주간 요약</Label>
                  <p className="text-sm text-muted-foreground">주간 분석 요약 받기</p>
                </div>
                <Switch
                  id="weekly-digest"
                  checked={settings.notifications.weeklyDigest}
                  onCheckedChange={(checked) => updateSettings("notifications", "weeklyDigest", checked)}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
