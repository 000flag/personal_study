import type { EntityBase, PhotoStage } from "./common";

/** DataTable/Detail에서 사진 해시를 꺼내는 함수 시그니처 */
export type GetStageHashes<T> = (row: T, stage: PhotoStage) => string[];

/** List 페이지용 어댑터(프로젝트별 매핑 담당) */
export interface ListAdapters<T extends EntityBase & Record<string, unknown>> {
    /** 페이징 목록 API 엔드포인트 (예: `${API_BASE}/api/items/search`) */
    listUrl: string;

    /** 테이블 표시용 액세서(필요한 것만 지정) */
    table?: {
        getName?: (row: T) => string;
        getPhone?: (row: T) => string | undefined;
        /** 예: 예약일/수술일 등 도메인 날짜 */
        getDomainDate?: (row: T) => string | undefined;
        getStatus?: (row: T) => string | undefined;
        getCreatedAt?: (row: T) => string | undefined;

        /** 단계별 사진 해시 추출자 (미지정 시 기본: row[stage]가 콤마 문자열) */
        getStageHashes?: GetStageHashes<T>;

        /** (옵션) 툴바 상태 선택지 */
        statusOptions?: string[];
    };
}

/** Detail 페이지용 어댑터(프로젝트별 매핑 담당) */
export interface DetailAdapters<T extends EntityBase & Record<string, unknown>> {
    /** 주어진 id로 상세 API URL 생성 (필수) */
    itemUrl: (id: T["id"]) => string;

    // 아래는 모두 선택: 없으면 기본 표기/숨김
    getTitle?: (item: T) => string;
    getSubTitle?: (item: T) => string | undefined;
    getEmail?: (item: T) => string | undefined;
    getPhone?: (item: T) => string | undefined;
    getCreatedAt?: (item: T) => string | undefined;
    /** 예: 예약일/주문일 등 도메인 날짜 */
    getDomainDate?: (item: T) => string | undefined;

    /** 단계별 사진 해시 추출자 (미지정 시 기본: item[stage]가 콤마 문자열) */
    getStageHashes?: (item: T, stage: PhotoStage) => string[];
}
