import { API_BASE } from "../api/api";
import type { EntityBase } from "./common";
import type { ListAdapters, DetailAdapters } from "./adapters";

/**
 * 앱에서 쓰는 공용 아이템 타입
 * - 필요한 최소 필드만 전제, 나머지는 getter에서 안전하게 캐스팅해서 사용
 */
export type AppItem = EntityBase & Record<string, unknown>;

/* -------------------------------------------
 * ListPage 어댑터
 * -----------------------------------------*/
export const listAdapters: ListAdapters<AppItem> = {
    // 실제 목록 API로 교체 필요
    listUrl: `${API_BASE}/api/items/search`,

    table: {
        getName: (row: AppItem) =>
            String((row as Record<string, unknown>).name ?? row.id),

        getPhone: (row: AppItem) =>
            (row as Record<string, unknown>).phone as string | undefined,

        getDomainDate: (row: AppItem) =>
            (row as Record<string, unknown>).date as string | undefined,

        getStatus: (row: AppItem) =>
            (row as Record<string, unknown>).status as string | undefined,

        getCreatedAt: (row: AppItem) =>
            (row as Record<string, unknown>).createdAt as string | undefined,

        // getStageHashes 미지정 시 DataTable 기본 동작:
        // row[stage]가 "a,b,c" 형태의 콤마 문자열이라고 가정.
    },
};

/* -------------------------------------------
 * DetailPage 어댑터
 * -----------------------------------------*/
export const detailAdapters: DetailAdapters<AppItem> = {
    // 실제 상세 API로 교체 필요
    itemUrl: (id: AppItem["id"]) => `${API_BASE}/api/items/${id}`,

    getTitle: (item: AppItem) =>
        String((item as Record<string, unknown>).name ?? item.id),

    getSubTitle: (item: AppItem) =>
        (item as Record<string, unknown>).status as string | undefined,

    getEmail: (item: AppItem) =>
        (item as Record<string, unknown>).email as string | undefined,

    getPhone: (item: AppItem) =>
        (item as Record<string, unknown>).phone as string | undefined,

    getCreatedAt: (item: AppItem) =>
        (item as Record<string, unknown>).createdAt as string | undefined,

    getDomainDate: (item: AppItem) =>
        (item as Record<string, unknown>).date as string | undefined,

    // getStageHashes 미지정 시 DetailPage 기본 동작:
    // item[stage]가 "a,b,c" 형태의 콤마 문자열이라고 가정.
};
