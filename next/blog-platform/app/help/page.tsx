"use client"

import { BookOpen, Play, Users, Settings, PenTool, BarChart3 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useTranslation } from "@/lib/i18n"
import Link from "next/link"

const guides = [
  {
    icon: PenTool,
    title: "시작하기",
    description: "첫 번째 블로그 글 작성과 프로필 설정의 기본 사항을 배워보세요",
    topics: ["첫 글 작성하기", "프로필 설정하기", "인터페이스 이해하기", "모바일 vs 데스크톱"],
    href: "/help/getting-started",
  },
  {
    icon: Settings,
    title: "계정 관리",
    description: "계정 설정, 개인정보 보호 및 보안 기본 설정을 관리하세요",
    topics: ["프로필 사용자 정의", "개인정보 설정", "비밀번호 보안", "계정 삭제"],
    href: "/help/account",
  },
  {
    icon: Play,
    title: "글쓰기 및 게시",
    description: "에디터 도구로 매력적인 콘텐츠를 만드는 기술을 마스터하세요",
    topics: ["리치 텍스트 에디터", "마크다운 지원", "이미지 추가", "글 예약", "카테고리와 태그"],
    href: "/help/writing",
  },
  {
    icon: BarChart3,
    title: "분석 및 성장",
    description: "분석 인사이트로 독자를 이해하고 블로그를 성장시키세요",
    topics: ["분석 읽기", "지표 이해하기", "독자 늘리기", "참여도 팁"],
    href: "/help/analytics",
  },
  {
    icon: Users,
    title: "커뮤니티 기능",
    description: "다른 작성자들과 연결하고 커뮤니티를 구축하세요",
    topics: ["작성자 팔로우", "댓글 시스템", "소셜 공유", "팔로워 늘리기"],
    href: "/help/community",
  },
]

export default function HelpPage() {
  const { t } = useTranslation()

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="h-16 w-16 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mx-auto mb-6">
            <BookOpen className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-4">도움말 센터</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            블로그 플랫폼을 최대한 활용하기 위해 알아야 할 모든 것. 시작하기부터 고급 기능까지.
          </p>
        </div>

        {/* Quick Start */}
        <Card className="mb-12 border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Play className="h-5 w-5" />
              빠른 시작 가이드
            </CardTitle>
            <CardDescription>플랫폼이 처음이신가요? 빠른 개요를 위해 여기서 시작하세요.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-2 text-sm font-semibold">
                  1
                </div>
                <h3 className="font-medium mb-1">계정 생성</h3>
                <p className="text-sm text-muted-foreground">가입하고 이메일을 인증하세요</p>
              </div>
              <div className="text-center">
                <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-2 text-sm font-semibold">
                  2
                </div>
                <h3 className="font-medium mb-1">프로필 설정</h3>
                <p className="text-sm text-muted-foreground">자기소개를 추가하고 블로그를 사용자 정의하세요</p>
              </div>
              <div className="text-center">
                <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-2 text-sm font-semibold">
                  3
                </div>
                <h3 className="font-medium mb-1">첫 글 작성</h3>
                <p className="text-sm text-muted-foreground">첫 번째 블로그 글을 작성하고 게시하세요</p>
              </div>
            </div>
            <div className="text-center mt-6">
              <Button asChild>
                <Link href="/help/getting-started">가이드 시작하기</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Help Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {guides.map((guide) => {
            const Icon = guide.icon
            return (
              <Card key={guide.title} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{guide.title}</CardTitle>
                    </div>
                  </div>
                  <CardDescription>{guide.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-4">
                    {guide.topics.map((topic) => (
                      <li key={topic} className="text-sm text-muted-foreground flex items-center gap-2">
                        <div className="h-1 w-1 rounded-full bg-muted-foreground" />
                        {topic}
                      </li>
                    ))}
                  </ul>
                  <Button variant="outline" asChild className="w-full bg-transparent">
                    <Link href={guide.href}>더 알아보기</Link>
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Popular Articles */}
        <Card>
          <CardHeader>
            <CardTitle>인기 도움말 문서</CardTitle>
            <CardDescription>이번 주 가장 많이 본 도움말 주제</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                "첫 번째 블로그 글 작성하는 방법",
                "모바일 vs 데스크톱 레이아웃 이해하기",
                "프로필과 자기소개 설정하기",
                "리치 텍스트 에디터 사용하기",
                "댓글과 참여도 관리하기",
              ].map((article, index) => (
                <div
                  key={article}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="h-6 w-6 rounded bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
                    {index + 1}
                  </div>
                  <span className="flex-1">{article}</span>
                  <Button variant="ghost" size="sm">
                    읽기
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Contact Support */}
        <div className="text-center mt-12">
          <h2 className="text-xl font-semibold mb-4">여전히 도움이 필요하신가요?</h2>
          <p className="text-muted-foreground mb-6">
            찾고 계신 내용을 찾을 수 없나요? 저희 지원팀이 도와드릴 준비가 되어 있습니다.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild>
              <Link href="/contact">지원팀에 문의하기</Link>
            </Button>
            <Button variant="outline" asChild className="bg-transparent">
              <Link href="/faq">FAQ 둘러보기</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
