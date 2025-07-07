
# 캘린더 라이브러리 추천 보고서

## 요구 조건

- 무료(오픈소스)
- React + TypeScript 완전 호환
- 커스텀 가능
- 사용법이 어렵지 않음

---

## 1. FullCalendar

- **특징**
    - React 공식 래퍼(`@fullcalendar/react`)와 TypeScript 지원
    - 무료(기본 기능 오픈소스, 일부 고급 기능 유료지만 대부분의 일정/이벤트 관리에는 무료로 충분)
    - 다양한 뷰(월/주/일/리스트 등) 제공, 커스텀 렌더링 지원
    - 문서와 예제가 풍부해 진입장벽이 낮음
    - Bootstrap 등 다양한 스타일 프레임워크와 연동 가능
- **추천 사유**
    - 대규모 커뮤니티와 꾸준한 업데이트로 장기적 활용에 용이
    - 이벤트 클릭, 커스텀 팝업, 외부 컴포넌트와의 연동 등 확장성 우수
    - React/TS 프로젝트에서 바로 활용 가능하며, HTML/JS/CSS 환경에서도 활용 가능

## 2. React Big Calendar

- **특징**
    - React 전용, TypeScript 지원
    - 무료 오픈소스
    - 커스텀 렌더링 및 다양한 뷰 지원
    - Bootstrap 스타일을 기본으로 지원
- **추천 사유**
    - 심플한 API와 커스텀 렌더링이 쉬워 빠른 적용 가능
    - 이벤트 클릭 등 인터랙션 구현이 간단
    - React 기반의 장기 프로젝트에 적합

## 3. DayPilot Lite for React

- **특징**
    - 무료 버전(Lite) 존재, TypeScript 지원
    - 다양한 뷰(월/주/일), 커스텀 이벤트 렌더링 지원
    - React에 최적화
- **추천 사유**
    - 문서가 잘 정리되어 있고, 커스텀 렌더링이 쉬움
    - 상업적 사용 시에도 무료 버전 활용 가능

---

## 비교표

| 라이브러리 | 무료 | React/TS 지원 | 커스텀 용이성 | 난이도 | 라이선스 | 추천 용도 | 주요 특징 |
| :-- | :-- | :-- | :-- | :-- | :-- | :-- | :-- |
| FullCalendar | O | O | 매우 높음 | 쉬움 | MIT | 대규모 프로젝트, 복잡한 일정 관리 | 다양한 뷰, 강력한 커스텀, 대규모 |
| React Big Calendar | O | O | 높음 | 쉬움 | MIT | 간단한 사내 도구, 빠른 개발 | Bootstrap 스타일, 심플 API |
| DayPilot Lite for React | O | O | 높음 | 쉬움 | Apache 2.0 (Lite) | 개인/스타트업, 문서화된 가벼운 일정 | 다양한 뷰, 무료 버전 존재 |

---

## 결론 및 추천

**FullCalendar**를 가장 추천.

- 커스텀 팝업, 이벤트 클릭 핸들링, Bootstrap 연동 등 요구하신 모든 기능을 쉽게 구현할 수 있습니다.
- React + TypeScript 환경에서 장기적으로 확장/유지보수가 용이합니다.
- **요구한 모든 기능을 가장 쉽게 구현 가능하며, 커뮤니티와 문서가 탄탄해 안정적입니다.**

**React Big Calendar**도 심플한 프로젝트나 Bootstrap 스타일을 선호한다면 좋은 선택입니다.

**DayPilot Lite**는 문서가 잘 정리되어 있고, 무료로도 충분히 활용 가능합니다.

---

### 참고 링크

- [FullCalendar](https://fullcalendar.io/docs/react)
- [React Big Calendar](https://github.com/jquense/react-big-calendar)
- [DayPilot Lite for React](https://react.daypilot.org/)
