import { useCallback, useEffect, useMemo, useState } from "react";
import { Pagination } from "@mui/material";

import type { CommonFilters, EntityBase } from "../types/common";
import { fetchPaged } from "../api/api";

import { SearchContext } from "../components/context/SearchContext";
import SearchBar from "../components/search/SearchBar";
import AdvancedSearch from "../components/search/AdvancedSearch";
import DataTable, { type GetStageHashes } from "../components/detail/DataTable";
import MainLayout from "../components/layout/MainLayout";

const PAGE_SIZE = 20;

/* -----------------------------------------------------------
 * Adapters: API endpoint와 테이블 액세서 지정(필요한 것만)
 * ---------------------------------------------------------*/
export interface ListAdapters<T extends EntityBase & Record<string, unknown>> {
    /** 필수: 페이징 검색 API endpoint (예: `${API_BASE}/api/items/search`) */
    listUrl: string;

    /** 테이블 표시에 필요한 값 액세서(선택) */
    table?: {
        getName?: (row: T) => string;
        getPhone?: (row: T) => string | undefined;
        getDomainDate?: (row: T) => string | undefined;
        getStatus?: (row: T) => string | undefined;
        getCreatedAt?: (row: T) => string | undefined;

        /** 사진 해시 추출자 (없으면 기본: row[stage] 콤마 문자열 가정) */
        getStageHashes?: GetStageHashes<T>;

        /** 툴바 상태 선택지 (표시용) */
        statusOptions?: string[];
    };
}

/* -----------------------------------------------------------
 * Component
 * ---------------------------------------------------------*/
function ListPage<T extends EntityBase & Record<string, unknown>>({
    adapters,
}: {
    adapters: ListAdapters<T>;
}) {
    const [rows, setRows] = useState<T[]>([]);

    // 검색 드래프트(입력값)
    const [filtersDraft, setFiltersDraft] = useState<CommonFilters>({});
    const [keywordDraft, setKeywordDraft] = useState("");

    // 실제 적용값
    const [filters, setFilters] = useState<CommonFilters>({});
    const [keyword, setKeyword] = useState("");

    const [showAdvanced, setShowAdvanced] = useState(false);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const p = await fetchPaged<T>(adapters.listUrl, {
                page,
                size: PAGE_SIZE,
                sortBy: "createdAt",
                direction: "desc",
                ...filters,
                q: keyword,
            });

            setRows(p.content);
            setTotalPages(Math.max(1, p.totalPages || 1));
        } catch (err) {
            console.error("데이터 로딩 실패:", err);
            setRows([]);
            setTotalPages(1);
        } finally {
            setLoading(false);
        }
    }, [adapters.listUrl, page, filters, keyword]);

    useEffect(() => {
        void load();
    }, [load]);

    /** 검색 버튼/Enter 시에만 드래프트 → 적용 */
    const applySearch = useCallback(() => {
        setPage(0);
        setFilters(filtersDraft);
        setKeyword(keywordDraft);
    }, [filtersDraft, keywordDraft]);

    const displayPage = useMemo(() => Math.max(1, page + 1), [page]);

    const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
        setPage(value - 1);
    };

    return (
        <SearchContext.Provider
            value={{
                filters: filtersDraft,
                setFilters: setFiltersDraft,
                keyword: keywordDraft,
                setKeyword: setKeywordDraft,
            }}
        >
            <MainLayout>
                <SearchBar
                    onSimpleSearch={applySearch}
                    onToggleAdvanced={() => setShowAdvanced((prev) => !prev)}
                    isAdvancedOpen={showAdvanced}
                />
                <AdvancedSearch open={showAdvanced} onSearch={applySearch} />

                <DataTable<T>
                    rows={rows}
                    page={page}
                    pageSize={PAGE_SIZE}
                    getName={adapters.table?.getName}
                    getPhone={adapters.table?.getPhone}
                    getDomainDate={adapters.table?.getDomainDate}
                    getStatus={adapters.table?.getStatus}
                    getCreatedAt={adapters.table?.getCreatedAt}
                    getStageHashes={adapters.table?.getStageHashes}
                    statusOptions={adapters.table?.statusOptions}
                />

                <Pagination
                    count={totalPages}
                    page={displayPage}
                    onChange={handlePageChange}
                    siblingCount={1}
                    boundaryCount={1}
                    size="large"
                    disabled={loading}
                    showFirstButton
                    showLastButton
                    sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        mt: 3,
                        "& .MuiPaginationItem-root": { borderRadius: "50%" },
                        "& .Mui-selected": {
                            backgroundColor: "#1976d2",
                            color: "#fff",
                            "&:hover": { backgroundColor: "#1565c0" },
                        },
                    }}
                />
            </MainLayout>
        </SearchContext.Provider>
    );
}

export default ListPage;
