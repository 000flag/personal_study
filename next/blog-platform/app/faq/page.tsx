"use client"

import { useState } from "react"
import { HelpCircle, Search, ChevronDown, ChevronUp } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { useTranslation } from "@/lib/i18n"

const faqs = [
  {
    id: 1,
    category: "시작하기",
    question: "첫 번째 블로그 글은 어떻게 작성하나요?",
    answer:
      "첫 번째 블로그 글을 작성하려면 내비게이션 메뉴의 '글쓰기' 버튼을 클릭하거나 대시보드로 이동하여 '새 글'을 선택하세요. 리치 텍스트 에디터를 사용하거나 마크다운 형식으로 작성할 수 있습니다. 게시하기 전에 태그를 추가하고 카테고리를 선택하는 것을 잊지 마세요!",
  },
  {
    id: 2,
    category: "시작하기",
    question: "프로필은 어떻게 사용자 정의하나요?",
    answer:
      "대시보드로 이동하여 '설정' 또는 '프로필'을 클릭하세요. 프로필 사진을 업로드하고, 자기소개를 작성하고, 소셜 링크를 추가하고, 색상과 글꼴을 포함한 블로그의 모양을 사용자 정의할 수 있습니다.",
  },
  {
    id: 3,
    category: "글쓰기 및 게시",
    question: "나중에 게시할 글을 예약할 수 있나요?",
    answer:
      "네! 글을 작성하거나 편집할 때 미래의 게시 날짜를 설정할 수 있습니다. 예약된 시간에 자동으로 글이 게시됩니다. 대시보드에서 예약된 글을 관리할 수 있습니다.",
  },
  {
    id: 4,
    category: "글쓰기 및 게시",
    question: "글에 이미지를 추가하려면 어떻게 하나요?",
    answer:
      "에디터 도구 모음의 이미지 아이콘을 클릭하거나 이미지를 에디터에 직접 드래그 앤 드롭하여 이미지를 추가할 수 있습니다. 이미지당 최대 10MB까지 JPG, PNG, GIF 형식을 지원합니다.",
  },
  {
    id: 5,
    category: "계정 및 개인정보",
    question: "비밀번호는 어떻게 변경하나요?",
    answer:
      "계정 설정으로 이동하여 '보안'을 클릭하세요. 현재 비밀번호를 입력한 다음 새 비밀번호를 두 번 입력하여 확인하면 비밀번호를 변경할 수 있습니다.",
  },
  {
    id: 6,
    category: "계정 및 개인정보",
    question: "블로그를 비공개로 설정할 수 있나요?",
    answer:
      "네, 블로그와 개별 글의 공개 범위를 제어할 수 있습니다. 블로그 설정에서 블로그를 비공개, 공개 또는 팔로워 전용으로 설정할 수 있습니다. 게시할 때 개별 글의 공개 범위도 설정할 수 있습니다.",
  },
  {
    id: 7,
    category: "모바일 앱",
    question: "모바일 앱이 있나요?",
    answer:
      "휴대폰과 태블릿에서 훌륭하게 작동하는 모바일 최적화 웹 경험을 제공합니다. 모바일 기기에서 당사 웹사이트를 방문하시면 하단 내비게이션과 최적화된 레이아웃으로 인스타그램과 같은 경험을 하실 수 있습니다.",
  },
  {
    id: 8,
    category: "모바일 앱",
    question: "모바일 인터페이스는 어떻게 사용하나요?",
    answer:
      "모바일 기기에서는 홈, 검색, 작성, 알림, 프로필 탭이 있는 하단 내비게이션 바를 볼 수 있습니다. 글은 모바일 보기에 최적화된 카드 형식으로 표시됩니다. 스와이프하여 글과 상호작용하고 당겨서 새로고침을 사용하여 새 콘텐츠를 가져올 수 있습니다.",
  },
]

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [openItems, setOpenItems] = useState<number[]>([])
  const { t } = useTranslation()

  const filteredFAQs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.category.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const categories = Array.from(new Set(filteredFAQs.map((faq) => faq.category)))

  const toggleItem = (id: number) => {
    setOpenItems((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <HelpCircle className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">자주 묻는 질문</h1>
              <p className="text-muted-foreground">플랫폼에 대한 일반적인 질문의 답변을 찾아보세요</p>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="FAQ 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* FAQs by Category */}
        {categories.map((category) => {
          const categoryFAQs = filteredFAQs.filter((faq) => faq.category === category)
          return (
            <div key={category} className="mb-8">
              <h2 className="text-lg font-semibold mb-4">{category}</h2>
              <div className="space-y-3">
                {categoryFAQs.map((faq) => (
                  <Card key={faq.id}>
                    <Collapsible open={openItems.includes(faq.id)} onOpenChange={() => toggleItem(faq.id)}>
                      <CollapsibleTrigger asChild>
                        <CardContent className="p-4 cursor-pointer hover:bg-muted/50 transition-colors">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium text-left">{faq.question}</h3>
                            {openItems.includes(faq.id) ? (
                              <ChevronUp className="h-4 w-4 text-muted-foreground flex-shrink-0 ml-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4 text-muted-foreground flex-shrink-0 ml-4" />
                            )}
                          </div>
                        </CardContent>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <CardContent className="pt-0 pb-4 px-4">
                          <div className="border-t pt-4">
                            <p className="text-muted-foreground">{faq.answer}</p>
                          </div>
                        </CardContent>
                      </CollapsibleContent>
                    </Collapsible>
                  </Card>
                ))}
              </div>
            </div>
          )
        })}

        {filteredFAQs.length === 0 && (
          <div className="text-center py-12">
            <HelpCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">결과를 찾을 수 없습니다</h3>
            <p className="text-muted-foreground">검색어를 조정하거나 위의 모든 카테고리를 둘러보세요.</p>
          </div>
        )}

        {/* Contact Support */}
        <Card className="mt-8">
          <CardContent className="p-6 text-center">
            <h3 className="font-semibold mb-2">여전히 도움이 필요하신가요?</h3>
            <p className="text-muted-foreground mb-4">
              찾고 계신 내용을 찾을 수 없나요? 저희 지원팀이 도와드리겠습니다.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a href="/contact" className="text-primary hover:underline">
                지원팀에 문의하기
              </a>
              <span className="hidden sm:inline text-muted-foreground">•</span>
              <a href="/help" className="text-primary hover:underline">
                도움말 가이드 둘러보기
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
