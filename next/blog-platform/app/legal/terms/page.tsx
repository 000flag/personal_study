"use client"

import { ArrowLeft, FileText } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useTranslation } from "@/lib/i18n"
import Link from "next/link"

export default function TermsOfServicePage() {
  const { t } = useTranslation()

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Back Button */}
        <Link href="/" className="inline-flex items-center text-muted-foreground hover:text-primary mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          홈으로 돌아가기
        </Link>

        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <FileText className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">서비스 이용약관</h1>
            <p className="text-muted-foreground">최종 업데이트: 2024년 1월 1일</p>
          </div>
        </div>

        {/* Content */}
        <Card>
          <CardHeader>
            <CardTitle>약관 동의</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-gray dark:prose-invert max-w-none">
            <p>
              본 블로그 플랫폼("서비스")에 접근하고 이용함으로써, 귀하는 본 약관의 조건들에 동의하고 이에 구속되는 것에
              동의합니다.
            </p>

            <h2>1. 약관 동의</h2>
            <p>
              본 서비스 이용약관("약관")은 당사가 운영하는 블로그 플랫폼의 이용을 규정합니다. 본 서비스에 접근하거나
              이용함으로써, 귀하는 본 약관에 구속되는 것에 동의합니다. 본 약관의 어떤 부분에 동의하지 않는다면, 서비스에
              접근할 수 없습니다.
            </p>

            <h2>2. 서비스 설명</h2>
            <p>
              본 서비스는 사용자가 블로그 콘텐츠를 생성, 게시, 공유할 수 있는 플랫폼을 제공합니다. 서비스에는 웹 및
              모바일 최적화 인터페이스, 사용자 프로필, 콘텐츠 관리 도구, 커뮤니티 기능이 포함됩니다.
            </p>

            <h2>3. 사용자 계정</h2>
            <p>
              당사와 계정을 생성할 때, 정확하고 완전하며 최신의 정보를 항상 제공해야 합니다. 비밀번호를 보호하고 계정
              하에서 발생하는 모든 활동에 대해 책임을 집니다.
            </p>
            <ul>
              <li>본 서비스를 이용하려면 최소 13세 이상이어야 합니다</li>
              <li>계정의 기밀성을 유지할 책임이 있습니다</li>
              <li>계정 하의 모든 활동에 대한 책임을 지는 것에 동의합니다</li>
              <li>계정의 무단 사용을 즉시 알려야 합니다</li>
            </ul>

            <h2>4. 콘텐츠 가이드라인</h2>
            <p>
              사용자는 플랫폼에 게시하는 콘텐츠에 대해 책임을 집니다. 콘텐츠를 게시함으로써, 다음을 진술하고 보증합니다:
            </p>
            <ul>
              <li>콘텐츠에 대한 소유권 또는 필요한 권리를 가지고 있습니다</li>
              <li>콘텐츠가 제3자의 권리를 침해하지 않습니다</li>
              <li>콘텐츠가 불법적이거나 해롭거나 위협적이거나 모욕적이지 않습니다</li>
              <li>콘텐츠에 스팸, 바이러스 또는 기타 악성 코드가 포함되어 있지 않습니다</li>
            </ul>

            <h2>5. 금지된 사용</h2>
            <p>다음 목적으로 본 서비스를 사용할 수 없습니다:</p>
            <ul>
              <li>불법적인 목적이나 다른 사람에게 불법 행위를 권유하는 목적</li>
              <li>국제, 연방, 지방 또는 주 규정, 규칙, 법률 또는 지역 조례를 위반하는 목적</li>
              <li>당사 또는 타인의 지적 재산권을 침해하거나 위반하는 목적</li>
              <li>
                괴롭히거나, 모욕하거나, 해를 끼치거나, 명예를 훼손하거나, 중상하거나, 비하하거나, 위협하거나, 차별하는
                목적
              </li>
              <li>허위 또는 오해의 소지가 있는 정보를 제출하는 목적</li>
              <li>바이러스나 기타 악성 코드를 업로드하거나 전송하는 목적</li>
            </ul>

            <h2>6. 지적 재산권</h2>
            <p>
              서비스와 그 원본 콘텐츠, 기능 및 기능성은 당사와 그 라이선서의 독점적 재산이며 앞으로도 그럴 것입니다.
              서비스는 저작권, 상표권 및 기타 법률로 보호됩니다.
            </p>
            <p>
              사용자는 플랫폼에서 생성하고 게시하는 콘텐츠의 소유권을 유지합니다. 콘텐츠를 게시함으로써, 서비스에서 해당
              콘텐츠를 사용, 수정, 공개적으로 수행, 공개적으로 표시, 복제 및 배포할 수 있는 전 세계적, 비독점적, 로열티
              없는 라이선스를 당사에 부여합니다.
            </p>

            <h2>7. 개인정보 보호정책</h2>
            <p>
              귀하의 개인정보는 중요합니다. 서비스 이용을 규정하는 개인정보 보호정책을 검토하여 당사의 관행을 이해하시기
              바랍니다.
            </p>

            <h2>8. 서비스 종료</h2>
            <p>
              당사는 사전 통지나 책임 없이 즉시 귀하의 계정을 종료하거나 정지하고 서비스 접근을 차단할 수 있으며, 이는
              약관 위반을 포함하여 어떤 이유로든 당사의 단독 재량에 따릅니다.
            </p>

            <h2>9. 면책 조항</h2>
            <p>
              본 플랫폼의 정보는 "있는 그대로" 제공됩니다. 법률이 허용하는 최대 범위 내에서, 당사는 모든 진술, 보증,
              조건 및 약관을 배제합니다.
            </p>

            <h2>10. 책임 제한</h2>
            <p>
              어떤 경우에도 당사, 이사, 직원, 파트너, 대리인, 공급업체 또는 계열사는 이익, 데이터, 사용, 영업권 또는
              기타 무형 손실의 손실을 포함하여 간접적, 부수적, 특별, 결과적 또는 징벌적 손해에 대해 책임을 지지
              않습니다.
            </p>

            <h2>11. 약관 변경</h2>
            <p>
              당사는 언제든지 단독 재량으로 본 약관을 수정하거나 교체할 권리를 보유합니다. 중대한 개정이 있는 경우,
              새로운 약관이 발효되기 최소 30일 전에 통지하도록 노력할 것입니다.
            </p>

            <h2>12. 연락처 정보</h2>
            <p>
              본 서비스 이용약관에 대해 질문이 있으시면 연락처 페이지를 통해 문의하거나 legal@example.com으로 이메일을
              보내주세요.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
