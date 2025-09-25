"use client"

import { ArrowLeft, Shield } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useTranslation } from "@/lib/i18n"
import Link from "next/link"

export default function PrivacyPolicyPage() {
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
          <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-green-500 to-blue-600 flex items-center justify-center">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">개인정보 보호정책</h1>
            <p className="text-muted-foreground">최종 업데이트: 2024년 1월 1일</p>
          </div>
        </div>

        {/* Content */}
        <Card>
          <CardHeader>
            <CardTitle>귀하의 개인정보는 중요합니다</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-gray dark:prose-invert max-w-none">
            <p>
              본 개인정보 보호정책은 귀하가 당사의 블로그 플랫폼 서비스를 이용할 때 당사가 귀하의 정보를 수집, 사용,
              보호하는 방법을 설명합니다.
            </p>

            <h2>1. 수집하는 정보</h2>
            <h3>귀하가 제공하는 정보</h3>
            <ul>
              <li>
                <strong>계정 정보:</strong> 이메일 주소, 사용자명, 비밀번호, 프로필 정보
              </li>
              <li>
                <strong>콘텐츠:</strong> 블로그 게시물, 댓글, 이미지 및 기타 생성하거나 업로드하는 콘텐츠
              </li>
              <li>
                <strong>커뮤니케이션:</strong> 당사나 다른 사용자에게 플랫폼을 통해 보내는 메시지
              </li>
            </ul>

            <h3>자동으로 수집하는 정보</h3>
            <ul>
              <li>
                <strong>사용 데이터:</strong> 서비스와의 상호작용, 방문한 페이지, 소요 시간, 클릭
              </li>
              <li>
                <strong>기기 정보:</strong> 기기 유형, 운영 체제, 브라우저 유형, IP 주소
              </li>
              <li>
                <strong>쿠키:</strong> 경험을 향상시키기 위해 쿠키 및 유사한 기술을 사용합니다
              </li>
            </ul>

            <h2>2. 정보 사용 방법</h2>
            <p>수집한 정보를 다음 목적으로 사용합니다:</p>
            <ul>
              <li>서비스를 제공, 유지 및 개선</li>
              <li>거래를 처리하고 관련 정보를 전송</li>
              <li>기술적 공지, 업데이트, 보안 경고 및 지원 메시지 전송</li>
              <li>댓글, 질문 및 고객 서비스 요청에 응답</li>
              <li>제품, 서비스, 제안 및 이벤트에 대해 소통</li>
              <li>서비스와 관련된 트렌드, 사용량 및 활동을 모니터링하고 분석</li>
              <li>사기 거래 및 기타 불법 활동을 탐지, 조사 및 방지</li>
            </ul>

            <h2>3. 정보 공유 및 공개</h2>
            <p>다음 상황에서 귀하의 정보를 공유할 수 있습니다:</p>
            <ul>
              <li>
                <strong>동의가 있는 경우:</strong> 명시적 동의가 있을 때 정보를 공유할 수 있습니다
              </li>
              <li>
                <strong>공개 콘텐츠:</strong> 공개적으로 게시한 콘텐츠는 다른 사용자에게 표시됩니다
              </li>
              <li>
                <strong>서비스 제공업체:</strong> 당사를 대신하여 서비스를 수행하는 제3자 서비스 제공업체와 정보를
                공유할 수 있습니다
              </li>
              <li>
                <strong>법적 요구사항:</strong> 법률에 의해 요구되거나 당사의 권리를 보호하기 위해 정보를 공개할 수
                있습니다
              </li>
              <li>
                <strong>사업 양도:</strong> 합병, 인수 또는 자산 매각과 관련하여 정보가 양도될 수 있습니다
              </li>
            </ul>

            <h2>4. 데이터 보안</h2>
            <p>
              무단 접근, 변경, 공개 또는 파괴로부터 귀하의 개인정보를 보호하기 위해 적절한 기술적, 조직적 보안 조치를
              구현합니다. 그러나 인터넷을 통한 전송이나 전자 저장 방법은 100% 안전하지 않습니다.
            </p>

            <h2>5. 데이터 보존</h2>
            <p>
              계정이 활성화되어 있거나 서비스를 제공하는 데 필요한 기간 동안 귀하의 정보를 보존합니다. 법적 의무를
              준수하고, 분쟁을 해결하며, 계약을 시행하기 위해 필요한 경우 귀하의 정보를 보존하고 사용할 수 있습니다.
            </p>

            <h2>6. 귀하의 권리와 선택</h2>
            <p>개인정보와 관련하여 다음 권리를 가집니다:</p>
            <ul>
              <li>
                <strong>접근:</strong> 개인정보에 대한 접근을 요청할 수 있습니다
              </li>
              <li>
                <strong>업데이트:</strong> 언제든지 계정 정보를 업데이트할 수 있습니다
              </li>
              <li>
                <strong>삭제:</strong> 계정 및 개인정보 삭제를 요청할 수 있습니다
              </li>
              <li>
                <strong>이동성:</strong> 휴대 가능한 형식으로 데이터 사본을 요청할 수 있습니다
              </li>
              <li>
                <strong>거부:</strong> 마케팅 커뮤니케이션을 거부할 수 있습니다
              </li>
            </ul>

            <h2>7. 쿠키 및 추적 기술</h2>
            <p>
              귀하에 대한 개인정보를 수집하고 사용하기 위해 쿠키 및 유사한 추적 기술을 사용합니다. 브라우저 설정을 통해
              쿠키를 제어할 수 있지만, 쿠키를 비활성화하면 서비스 기능에 영향을 줄 수 있습니다.
            </p>

            <h2>8. 제3자 링크</h2>
            <p>
              당사 서비스에는 제3자 웹사이트나 서비스에 대한 링크가 포함될 수 있습니다. 당사는 이러한 제3자의 개인정보
              보호 관행이나 콘텐츠에 대해 책임지지 않습니다. 그들의 개인정보 보호정책을 읽어보시기 바랍니다.
            </p>

            <h2>9. 아동의 개인정보 보호</h2>
            <p>
              당사 서비스는 13세 미만의 아동을 대상으로 하지 않습니다. 13세 미만 아동으로부터 개인정보를 의도적으로
              수집하지 않습니다. 13세 미만 아동으로부터 개인정보를 수집했다는 것을 알게 되면, 해당 정보를 삭제하는
              조치를 취할 것입니다.
            </p>

            <h2>10. 국제 데이터 전송</h2>
            <p>
              귀하의 정보는 귀하의 거주 국가가 아닌 다른 국가로 전송되어 처리될 수 있습니다. 본 개인정보 보호정책에 따라
              귀하의 정보를 보호하기 위한 적절한 보호 조치가 마련되어 있음을 보장합니다.
            </p>

            <h2>11. 개인정보 보호정책 변경</h2>
            <p>
              때때로 본 개인정보 보호정책을 업데이트할 수 있습니다. 이 페이지에 새로운 개인정보 보호정책을 게시하고
              "최종 업데이트" 날짜를 업데이트하여 변경 사항을 알려드릴 것입니다.
            </p>

            <h2>12. 문의하기</h2>
            <p>
              본 개인정보 보호정책에 대해 질문이 있으시면 연락처 페이지를 통해 문의하거나 privacy@example.com으로
              이메일을 보내주세요.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
