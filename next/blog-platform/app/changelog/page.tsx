"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Plus, Bug, Zap, Shield } from "lucide-react"

interface ChangelogEntry {
  version: string
  date: string
  type: "major" | "minor" | "patch"
  changes: {
    type: "feature" | "improvement" | "bugfix" | "security"
    title: string
    description: string
  }[]
}

const changelogData: ChangelogEntry[] = [
  {
    version: "1.2.0",
    date: "2024-01-20",
    type: "minor",
    changes: [
      {
        type: "feature",
        title: "다크 모드 지원",
        description: "사용자가 라이트/다크 테마를 선택할 수 있는 기능을 추가했습니다.",
      },
      {
        type: "feature",
        title: "한국어 지원",
        description: "플랫폼 전체가 한국어로 번역되었습니다.",
      },
      {
        type: "improvement",
        title: "모바일 반응형 개선",
        description: "모바일 기기에서의 사용성을 크게 개선했습니다.",
      },
    ],
  },
  {
    version: "1.1.5",
    date: "2024-01-15",
    type: "patch",
    changes: [
      {
        type: "bugfix",
        title: "댓글 알림 오류 수정",
        description: "댓글 작성 시 알림이 제대로 전송되지 않던 문제를 해결했습니다.",
      },
      {
        type: "bugfix",
        title: "이미지 업로드 안정성 개선",
        description: "대용량 이미지 업로드 시 발생하던 오류를 수정했습니다.",
      },
      {
        type: "improvement",
        title: "검색 성능 최적화",
        description: "검색 결과 로딩 속도를 30% 개선했습니다.",
      },
    ],
  },
  {
    version: "1.1.0",
    date: "2024-01-10",
    type: "minor",
    changes: [
      {
        type: "feature",
        title: "북마크 기능",
        description: "마음에 드는 게시글을 북마크하여 나중에 쉽게 찾을 수 있습니다.",
      },
      {
        type: "feature",
        title: "팔로우 시스템",
        description: "관심 있는 작성자를 팔로우하여 새 게시글 알림을 받을 수 있습니다.",
      },
      {
        type: "improvement",
        title: "에디터 기능 강화",
        description: "게시글 작성 시 더 많은 서식 옵션을 사용할 수 있습니다.",
      },
      {
        type: "security",
        title: "보안 강화",
        description: "사용자 데이터 보호를 위한 추가 보안 조치를 적용했습니다.",
      },
    ],
  },
  {
    version: "1.0.0",
    date: "2024-01-01",
    type: "major",
    changes: [
      {
        type: "feature",
        title: "플랫폼 정식 출시",
        description: "BlogSpace 플랫폼이 정식으로 출시되었습니다.",
      },
      {
        type: "feature",
        title: "게시글 작성 및 관리",
        description: "마크다운 에디터를 통한 게시글 작성 및 관리 기능을 제공합니다.",
      },
      {
        type: "feature",
        title: "댓글 시스템",
        description: "게시글에 댓글을 작성하고 소통할 수 있는 기능을 제공합니다.",
      },
      {
        type: "feature",
        title: "사용자 인증",
        description: "안전한 회원가입 및 로그인 시스템을 구축했습니다.",
      },
    ],
  },
]

export default function ChangelogPage() {
  const getChangeIcon = (type: string) => {
    switch (type) {
      case "feature":
        return <Plus className="h-4 w-4 text-green-500" />
      case "improvement":
        return <Zap className="h-4 w-4 text-blue-500" />
      case "bugfix":
        return <Bug className="h-4 w-4 text-orange-500" />
      case "security":
        return <Shield className="h-4 w-4 text-purple-500" />
      default:
        return <Plus className="h-4 w-4" />
    }
  }

  const getVersionBadge = (type: string) => {
    switch (type) {
      case "major":
        return <Badge className="bg-red-100 text-red-800">주요 업데이트</Badge>
      case "minor":
        return <Badge className="bg-blue-100 text-blue-800">기능 업데이트</Badge>
      case "patch":
        return <Badge className="bg-green-100 text-green-800">버그 수정</Badge>
      default:
        return <Badge variant="outline">{type}</Badge>
    }
  }

  const getChangeTypeBadge = (type: string) => {
    switch (type) {
      case "feature":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            새 기능
          </Badge>
        )
      case "improvement":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            개선
          </Badge>
        )
      case "bugfix":
        return (
          <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
            버그 수정
          </Badge>
        )
      case "security":
        return (
          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
            보안
          </Badge>
        )
      default:
        return <Badge variant="outline">{type}</Badge>
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">변경 사항</h1>
          <p className="text-muted-foreground mt-2">플랫폼의 최신 업데이트와 개선사항을 확인하세요</p>
        </div>

        <div className="space-y-6">
          {changelogData.map((entry) => (
            <Card key={entry.version}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CardTitle className="text-xl">버전 {entry.version}</CardTitle>
                    {getVersionBadge(entry.type)}
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm">{new Date(entry.date).toLocaleDateString("ko-KR")}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {entry.changes.map((change, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                      <div className="flex-shrink-0 mt-0.5">{getChangeIcon(change.type)}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">{change.title}</h4>
                          {getChangeTypeBadge(change.type)}
                        </div>
                        <p className="text-sm text-muted-foreground">{change.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>업데이트 알림</CardTitle>
            <CardDescription>새로운 업데이트 소식을 받아보세요</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              새로운 기능과 개선사항에 대한 알림을 받으려면{" "}
              <a href="/notifications" className="text-primary hover:underline">
                알림 설정
              </a>
              에서 업데이트 알림을 활성화하세요.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
