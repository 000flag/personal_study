"use client"

import { useState } from "react"
import { ArrowLeft, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useTranslation } from "@/lib/i18n"
import Link from "next/link"

export default function TermsConsentPage() {
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [agreedToPrivacy, setAgreedToPrivacy] = useState(false)
  const [agreedToMarketing, setAgreedToMarketing] = useState(false)
  const { t } = useTranslation()

  const canProceed = agreedToTerms && agreedToPrivacy

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>약관 및 개인정보 보호</CardTitle>
          <CardDescription>계속하려면 서비스 이용약관과 개인정보 보호정책을 검토하고 동의해주세요.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Terms of Service */}
          <div className="space-y-3">
            <h3 className="font-medium">서비스 이용약관</h3>
            <ScrollArea className="h-32 w-full border rounded-md p-3">
              <div className="text-sm text-muted-foreground space-y-2">
                <p>
                  <strong>1. 약관 동의</strong>
                </p>
                <p>
                  본 블로그 플랫폼에 접근하고 이용함으로써, 귀하는 본 약관의 조건들에 동의하고 이에 구속되는 것에
                  동의합니다.
                </p>
                <p>
                  <strong>2. 콘텐츠 가이드라인</strong>
                </p>
                <p>
                  사용자는 게시하는 콘텐츠에 대해 책임을 집니다. 콘텐츠는 불법적이거나 해롭거나 위협적이거나
                  모욕적이거나 괴롭히거나 명예를 훼손하거나 저속하거나 음란하거나 기타 불쾌한 내용이어서는 안 됩니다.
                </p>
                <p>
                  <strong>3. 사용자 계정</strong>
                </p>
                <p>
                  계정과 비밀번호의 기밀성을 유지할 책임이 있습니다. 계정 하에서 발생하는 모든 활동에 대한 책임을 지는
                  것에 동의합니다.
                </p>
                <p>
                  <strong>4. 지적 재산권</strong>
                </p>
                <p>
                  사용자는 생성한 콘텐츠의 소유권을 유지합니다. 콘텐츠를 게시함으로써, 플랫폼에서 콘텐츠를 사용, 수정 및
                  표시할 수 있는 라이선스를 당사에 부여합니다.
                </p>
              </div>
            </ScrollArea>
            <div className="flex items-center space-x-2">
              <Checkbox id="terms" checked={agreedToTerms} onCheckedChange={setAgreedToTerms} />
              <label htmlFor="terms" className="text-sm">
                <Link href="/legal/terms" className="text-primary hover:underline">
                  서비스 이용약관
                </Link>
                에 동의합니다 <span className="text-red-500">*</span>
              </label>
            </div>
          </div>

          {/* Privacy Policy */}
          <div className="space-y-3">
            <h3 className="font-medium">개인정보 보호정책</h3>
            <ScrollArea className="h-32 w-full border rounded-md p-3">
              <div className="text-sm text-muted-foreground space-y-2">
                <p>
                  <strong>1. 수집하는 정보</strong>
                </p>
                <p>계정을 생성하거나, 콘텐츠를 게시하거나, 당사에 연락할 때 직접 제공하는 정보를 수집합니다.</p>
                <p>
                  <strong>2. 정보 사용 방법</strong>
                </p>
                <p>수집한 정보를 서비스를 제공, 유지 및 개선하고, 거래를 처리하며, 귀하와 소통하기 위해 사용합니다.</p>
                <p>
                  <strong>3. 정보 공유</strong>
                </p>
                <p>
                  본 정책에 설명된 경우를 제외하고는 귀하의 동의 없이 개인정보를 제3자에게 판매, 거래 또는 양도하지
                  않습니다.
                </p>
                <p>
                  <strong>4. 데이터 보안</strong>
                </p>
                <p>
                  무단 접근, 변경, 공개 또는 파괴로부터 귀하의 개인정보를 보호하기 위해 적절한 보안 조치를 구현합니다.
                </p>
              </div>
            </ScrollArea>
            <div className="flex items-center space-x-2">
              <Checkbox id="privacy" checked={agreedToPrivacy} onCheckedChange={setAgreedToPrivacy} />
              <label htmlFor="privacy" className="text-sm">
                <Link href="/legal/privacy" className="text-primary hover:underline">
                  개인정보 보호정책
                </Link>
                에 동의합니다 <span className="text-red-500">*</span>
              </label>
            </div>
          </div>

          {/* Marketing Communications */}
          <div className="space-y-3">
            <h3 className="font-medium">마케팅 커뮤니케이션</h3>
            <div className="flex items-center space-x-2">
              <Checkbox id="marketing" checked={agreedToMarketing} onCheckedChange={setAgreedToMarketing} />
              <label htmlFor="marketing" className="text-sm">
                마케팅 커뮤니케이션 및 새로운 기능에 대한 업데이트 수신에 동의합니다 (선택사항)
              </label>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/auth/signup" className="flex-1">
              <Button variant="outline" className="w-full bg-transparent">
                <ArrowLeft className="mr-2 h-4 w-4" />
                뒤로
              </Button>
            </Link>
            <Button className="flex-1" disabled={!canProceed}>
              <Check className="mr-2 h-4 w-4" />
              동의하고 계속하기
            </Button>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            <span className="text-red-500">*</span> 계정 생성에 필수
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
