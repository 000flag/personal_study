"use client"

import type React from "react"

import { useState } from "react"
import { Mail, MessageSquare, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { useTranslation } from "@/lib/i18n"

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const { t } = useTranslation()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false)
      toast({
        title: "메시지가 전송되었습니다!",
        description: "24시간 내에 답변드리겠습니다.",
      })
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="h-16 w-16 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mx-auto mb-6">
            <MessageSquare className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-4">문의하기</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            질문이나 제안사항이 있으시거나 도움이 필요하신가요? 언제든지 연락해 주세요. 메시지를 보내주시면 가능한 한
            빨리 답변드리겠습니다.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>메시지 보내기</CardTitle>
                <CardDescription>아래 양식을 작성해 주시면 24시간 내에 답변드리겠습니다.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium mb-2">
                        이름 *
                      </label>
                      <Input id="name" placeholder="성함을 입력해 주세요" required />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium mb-2">
                        이메일 *
                      </label>
                      <Input id="email" type="email" placeholder="your@email.com" required />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium mb-2">
                      주제 *
                    </label>
                    <Select required>
                      <SelectTrigger>
                        <SelectValue placeholder="주제를 선택해 주세요" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">일반 문의</SelectItem>
                        <SelectItem value="technical">기술 지원</SelectItem>
                        <SelectItem value="billing">결제 및 계정</SelectItem>
                        <SelectItem value="feature">기능 요청</SelectItem>
                        <SelectItem value="bug">버그 신고</SelectItem>
                        <SelectItem value="partnership">파트너십</SelectItem>
                        <SelectItem value="other">기타</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium mb-2">
                      메시지 *
                    </label>
                    <Textarea id="message" placeholder="어떻게 도와드릴까요?" className="min-h-[120px]" required />
                  </div>

                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        전송 중...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        메시지 보내기
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  이메일 지원
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-3">일반 문의 및 지원을 위해 직접 이메일을 보내주세요:</p>
                <a href="mailto:support@example.com" className="text-primary hover:underline font-medium">
                  support@example.com
                </a>
                <p className="text-sm text-muted-foreground mt-2">일반적으로 24시간 내에 답변드립니다</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>빠른 링크</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <a href="/faq" className="block text-primary hover:underline">
                  자주 묻는 질문
                </a>
                <a href="/help" className="block text-primary hover:underline">
                  도움말 센터 및 가이드
                </a>
                <a href="/legal/terms" className="block text-primary hover:underline">
                  서비스 이용약관
                </a>
                <a href="/legal/privacy" className="block text-primary hover:underline">
                  개인정보 보호정책
                </a>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>응답 시간</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm">일반 문의</span>
                  <span className="text-sm font-medium">24시간</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">기술 지원</span>
                  <span className="text-sm font-medium">12시간</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">긴급 문제</span>
                  <span className="text-sm font-medium">4시간</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
