import { createContext, useContext } from "react";
import type { CommonFilters } from "../../types/common";

type Updater<T> = T | ((prev: T) => T);

export type SearchContextType = {
    /** 상세검색 필터 (common.ts의 CommonFilters) */
    filters: CommonFilters;
    /** 전체 교체 또는 (prev)=>next 업데이터 함수 모두 허용 */
    setFilters: (next: Updater<CommonFilters>) => void;

    /** 간단 검색어 (filters.q와 별도로 UI에서 관리할 때 사용) */
    keyword: string;
    setKeyword: (k: string) => void;
};

export const SearchContext = createContext<SearchContextType | null>(null);

export const useSearchContext = (): SearchContextType => {
    const ctx = useContext(SearchContext);
    if (!ctx) throw new Error("SearchContext not found");
    return ctx;
};
