# PHP 기초 강의

## 🔗 강의 링크

[유튜브 강의 보러 가기](https://youtu.be/3l6ivQlyhWA?si=pRESzu-f9KIqLnqV)

## 🛠️ 개발 환경

- IDE: Visual Studio Code  
- DB: MySQL Workbench (❌ HeidiSQL 사용 안 함)

## 🪟 윈도우 기반 환경

- `cmd(명령 프롬프트)` 또는 `Windows PowerShell` → **관리자 권한으로 실행** → `C:\Windows\System32\drivers\etc\hosts` 파일 편집(`cd drivers\etc` -> `code hosts`)
- 로컬 환경 구성:
  - `127.0.0.1` (내 컴퓨터) → 도메인(URL) 매핑 → 디렉토리 접근
  - 루트 디렉토리 예시: `C:\xampp\htdocs\`

## ⚡ cmd와 PowerShell 차이점

| 항목 | cmd (명령 프롬프트) | PowerShell |
|------|----------------------|------------|
| 기본 목적 | 오래된 명령어 기반 시스템 관리 | 객체 기반 자동화 및 스크립팅 |
| 출력 | 텍스트 기반 출력 | .NET 객체 출력 (예: 배열, 리스트 등) |
| 사용 명령어 | `dir`, `copy`, `cd`, `ipconfig` 등 전통적 DOS 명령어 | `Get-Process`, `Set-ExecutionPolicy` 등 PowerShell 전용 명령어 (cmdlet) |
| 스크립트 확장자 | `.bat`, `.cmd` | `.ps1` |
| 활용도 | 단순 명령 실행 | 시스템 관리 자동화, 복잡한 스크립팅 가능 |

> 💡 대부분의 간단한 작업(cmd 실행, 파일 수정 등)은 **cmd 또는 PowerShell 둘 다 사용 가능**하지만, 고급 시스템 제어나 자동화는 PowerShell이 더 강력합니다.

## ⚙️ 아파치 환경 설정

- `127.0.0.1` 또는 `localhost`는 내 컴퓨터를 의미함
- **아파치 환경 설정 파일(httpd.conf 등)**에서 `localhost`가 실제로 어떤 디렉토리를 가리킬지 지정해야 함

## 📁 디렉토리 구조 및 경로

- **절대 경로 (Absolute Path)**  
  : 루트부터 전체 경로를 모두 명시 (예: `C:/xampp/htdocs/index.php`)

- **상대 경로 (Relative Path)**  
  : 현재 파일의 위치 기준으로 경로를 계산  
  (예: `../images/logo.png`, `./css/style.css`)

---
