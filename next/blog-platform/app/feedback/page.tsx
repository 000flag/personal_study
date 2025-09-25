"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MessageSquare, Send, Star } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function FeedbackPage() {
  const [formData, setFormData] = useState({
    type: "",
    subject: "",
    message: "",
    rating: "",
    email: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    toast({
      title: "피드백이 전송되었습니다",
      description: "소중한 의견 감사합니다. 검토 후 답변드리겠습니다.",
    })

    setFormData({
      type: "",
      subject: "",
      message: "",
      rating: "",
      email: "",
    })
    setIsSubmitting(false)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">피드백 보내기</h1>
          <p className="text-muted-foreground mt-2">
            여러분의 의견은 플랫폼 개선에 큰 도움이 됩니다. 언제든지 피드백을 보내주세요.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader className="text-center">
              <MessageSquare className="h-8 w-8 mx-auto text-blue-500" />
              <CardTitle className="text-lg">기능 제안</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground text-center">새로운 기능이나 개선사항을 제안해주세요</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <Star className="h-8 w-8 mx-auto text-yellow-500" />
              <CardTitle className="text-lg">사용성 평가</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground text-center">플랫폼 사용 경험을 평가해주세요</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <MessageSquare className="h-8 w-8 mx-auto text-green-500" />
              <CardTitle className="text-lg">버그 신고</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground text-center">발견한 문제점이나 오류를 신고해주세요</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>피드백 양식</CardTitle>
            <CardDescription>아래 양식을 작성하여 피드백을 보내주세요</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="type">피드백 유형</Label>
                  <Select value={formData.type} onValueChange={(value) => handleInputChange("type", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="유형을 선택하세요" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="feature">기능 제안</SelectItem>
                      <SelectItem value="bug">버그 신고</SelectItem>
                      <SelectItem value="improvement">개선사항</SelectItem>
                      <SelectItem value="usability">사용성</SelectItem>
                      <SelectItem value="other">기타</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rating">전체적인 만족도</Label>
                  <Select value={formData.rating} onValueChange={(value) => handleInputChange("rating", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="평점을 선택하세요" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">⭐⭐⭐⭐⭐ 매우 만족</SelectItem>
                      <SelectItem value="4">⭐⭐⭐⭐ 만족</SelectItem>
                      <SelectItem value="3">⭐⭐⭐ 보통</SelectItem>
                      <SelectItem value="2">⭐⭐ 불만족</SelectItem>
                      <SelectItem value="1">⭐ 매우 불만족</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">제목</Label>
                <Input
                  id="subject"
                  value={formData.subject}
                  onChange={(e) => handleInputChange("subject", e.target.value)}
                  placeholder="피드백 제목을 입력하세요"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">상세 내용</Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => handleInputChange("message", e.target.value)}
                  placeholder="자세한 피드백 내용을 작성해주세요..."
                  rows={6}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">이메일 (선택사항)</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="답변을 받을 이메일 주소"
                />
                <p className="text-sm text-muted-foreground">
                  이메일을 입력하시면 피드백에 대한 답변을 받으실 수 있습니다
                </p>
              </div>

              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? (
                  "전송 중..."
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    피드백 보내기
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>자주 묻는 질문</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium">피드백에 대한 답변은 언제 받을 수 있나요?</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  일반적으로 3-5 영업일 내에 답변드립니다. 긴급한 문제의 경우 더 빠르게 처리됩니다.
                </p>
              </div>
              <div>
                <h4 className="font-medium">익명으로 피드백을 보낼 수 있나요?</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  네, 이메일 주소를 입력하지 않으시면 익명으로 피드백을 보낼 수 있습니다.
                </p>
              </div>
              <div>
                <h4 className="font-medium">제안한 기능이 실제로 구현되나요?</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  모든 제안을 검토하며, 사용자들에게 도움이 되는 기능들을 우선적으로 개발합니다.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
