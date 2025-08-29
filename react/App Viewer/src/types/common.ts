// common.ts — project-agnostic boilerplate (drop-in)

/* -----------------------------------------------------------
 * 0) Utilities
 * ---------------------------------------------------------*/
export type Nullable<T> = T | null | undefined;
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type DeepReadonly<T> = { readonly [P in keyof T]: DeepReadonly<T[P]> };
export type Json = string | number | boolean | null | Json[] | { [k: string]: Json };

/* -----------------------------------------------------------
 * 1) Sorting / Paging (Spring 등과 호환 가능한 형태 + 단순 형태)
 * ---------------------------------------------------------*/
export type SortDirection = "asc" | "desc";

export interface SortState {
    sorted: boolean;
    empty: boolean;
    unsorted: boolean;
}

export interface Pageable {
    pageNumber: number;
    pageSize: number;
    sort: SortState;
    offset: number;
    paged: boolean;
    unpaged: boolean;
}

export interface Page<T> {
    content: T[];
    pageable: Pageable;
    totalElements: number;
    totalPages: number;
    last: boolean;
    size: number;
    number: number;
    sort: SortState;
    numberOfElements: number;
    first: boolean;
    empty: boolean;
}

export interface SimplePageMeta {
    pageNumber: number;
    pageSize: number;
    totalPages: number;
    totalElements: number;
}

export interface SimplePageData<T> {
    content: T[];
    pageable: SimplePageMeta;
    totalPages: number;
    totalElements: number;
}

export interface PaginatedRequest {
    page?: number;      // 0-based
    size?: number;      // page size
    sortBy?: string;    // e.g. "createdAt"
    direction?: SortDirection;
}

/** Page<T> → SimplePageData<T> 축약 변환 */
export function toSimplePageData<T>(p: Page<T>): SimplePageData<T> {
    return {
        content: p.content,
        pageable: {
            pageNumber: p.number,
            pageSize: p.size,
            totalPages: p.totalPages,
            totalElements: p.totalElements,
        },
        totalPages: p.totalPages,
        totalElements: p.totalElements,
    };
}

/* -----------------------------------------------------------
 * 2) API Envelope & Error / Result
 * ---------------------------------------------------------*/
export type ApiEnvelope<T> = {
    timestamp: string;  // ISO-8601
    data: T;
};

export interface ApiError {
    timestamp: string;
    status: number;     // HTTP status code
    error: string;      // short error name
    message?: string;   // human-readable message
    path?: string;      // request path
    details?: Json;     // field errors, etc.
}

export type ApiResult<T> =
    | { ok: true; value: T }
    | { ok: false; error: ApiError };

/* -----------------------------------------------------------
 * 3) Entity base (어디서든 공통으로 쓸 최소 필드)
 * ---------------------------------------------------------*/
export interface EntityBase {
    id: string | number;
    createdAt?: string; // ISO
    updatedAt?: string; // ISO
    status?: string;    // e.g. "ACTIVE" | "INACTIVE" | ...
    activated?: boolean;
}

/* -----------------------------------------------------------
 * 4) Common Filters (범용 검색 필터 세트)
 *  - 프로젝트마다 필요한 부분만 골라 사용
 * ---------------------------------------------------------*/
export type Range<T> = {
    min?: T;
    max?: T;
};

export interface DateRange {
    from?: string; // ISO-8601 or yyyy-MM-dd
    to?: string;   // ISO-8601 or yyyy-MM-dd
}

/** 가장 보편적인 필드들만 남긴 공통 필터 */
export interface CommonFilters {
    // free text & ids
    q?: string;                // free-text query
    ids?: (string | number)[];

    // categorical
    status?: string | string[];
    tags?: string[];

    // identity-ish
    name?: string;
    email?: string;
    phone?: string;

    // flags
    active?: boolean;
    archived?: boolean;

    // date ranges
    created?: DateRange;
    updated?: DateRange;
    date?: DateRange;          // 도메인 별 의미(예: 주문일, 예약일)

    // numeric ranges
    number?: Range<number>;    // 범용 숫자 범위
    amount?: Range<number>;    // 가격/금액 등
}

/** 요청에 붙여 보내기 좋은 공통 검색 페이로드 */
export type CommonSearchRequest = PaginatedRequest & CommonFilters;

/* -----------------------------------------------------------
 * 5) CodeBook / Option (셀렉트 옵션, 코드 테이블 공통)
 * ---------------------------------------------------------*/
export interface OptionItem<V = string> {
    value: V;
    label: string;
    color?: string;     // optional tag color
    order?: number;     // display order
    group?: string;     // optgroup grouping
    disabled?: boolean;
    meta?: Json;        // arbitrary extra data
}

/** 코드북: 코드값(키) → OptionItem 매핑 */
export type CodeBook<V = string> = Record<string, OptionItem<V>>;

/** 간단한 배열 ↔ 코드북 변환 */
export const CodeBookUtil = {
    fromArray<V = string>(items: OptionItem<V>[], key: keyof OptionItem<V> = "value"): CodeBook<V> {
        const map: CodeBook<V> = {};
        for (const it of items) map[String(it[key])] = it;
        return map;
    },
    toArray<V = string>(book: CodeBook<V>): OptionItem<V>[] {
        return Object.values(book).sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    },
};

/* -----------------------------------------------------------
 * 6) Photos (프로젝트 불문 공통: 간략하게 3단계)
 * ---------------------------------------------------------*/
export const PHOTO_STAGES = ["submission", "picBefore", "picAfter"] as const;
export type PhotoStage = (typeof PHOTO_STAGES)[number];

/** 3단계 키만 허용하는 안전한 해시 맵 */
export type PhotoStageHashes = Partial<Record<PhotoStage, string>>;

export interface PhotoFile {
    id?: string | number;
    filename: string;
    externalPath?: string; // CDN/URL
    bytes?: number;
    hash?: string;         // storage hash or content hash
    meta?: Json;           // EXIF 등
}

/** 안전한 단계 값 접근자 */
export function getStageValue<T extends Partial<Record<PhotoStage, string>>>(
    obj: T,
    stage: PhotoStage
): string | undefined {
    return obj[stage];
}

/** 존재하는 단계만 수집 */
export function collectStages<T extends Partial<Record<PhotoStage, string>>>(
    obj: T
): Array<{ stage: PhotoStage; value: string }> {
    const out: Array<{ stage: PhotoStage; value: string }> = [];
    for (const s of PHOTO_STAGES) {
        const v = obj[s];
        if (v) out.push({ stage: s, value: v });
    }
    return out;
}

/* -----------------------------------------------------------
 * 7) Lightweight DTO examples
 * ---------------------------------------------------------*/
export interface IdRequest {
    id: string | number;
}

export interface BulkIdsRequest {
    ids: (string | number)[];
}

export interface ToggleRequest {
    id: string | number;
    active: boolean;
}

export interface UploadResponse {
    id: string;
    url: string;
    filename: string;
    size?: number;
    meta?: Json;
}

/* -----------------------------------------------------------
 * 8) Small helpers
 * ---------------------------------------------------------*/
export function ok<T>(value: T): ApiResult<T> {
    return { ok: true, value };
}
export function err<T = never>(error: ApiError): ApiResult<T> {
    return { ok: false, error };
}
