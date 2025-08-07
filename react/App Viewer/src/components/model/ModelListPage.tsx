import { useEffect, useState, useCallback } from "react";
import { Box, Pagination } from "@mui/material";
import type { Filters, RawModel } from "../../types/model";
import { fetchModels } from "../../api/api";
import { SearchContext } from "../context/SearchContext";
import MainLayout from "../layout/MainLayout";
import SearchBar from "../search/SearchBar";
import AdvancedSearch from "../search/AdvancedSearch";
import ModelTable from "./ModelTable";

const ModelListPage = () => {
    const [models, setModels] = useState<RawModel[]>([]);
    const [filters, setFilters] = useState<Filters>({});
    const [keyword, setKeyword] = useState("");
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [page, setPage] = useState(0);
    const [total, setTotal] = useState(0);

    const load = useCallback(async () => {
        try {
            const res = await fetchModels(page, filters, keyword);
            setModels(res.data.content);
            setTotal(res.data.totalElements);
        } catch (err) {
            console.error("데이터 로딩 실패:", err);
        }
    }, [page, filters, keyword]);

    useEffect(() => {
        load();
    }, [page, load]);

    return (
        <SearchContext.Provider value={{ filters, setFilters, keyword, setKeyword }}>
            <MainLayout>
                <SearchBar
                    onSimpleSearch={() => {
                        setPage(0); // 검색 시 페이지를 첫 페이지로 초기화
                        load();
                    }}
                    onToggleAdvanced={() => setShowAdvanced((prev) => !prev)}
                />
                <AdvancedSearch open={showAdvanced} />
                <ModelTable models={models} />
                <Box sx={{ minHeight: 80, mt: 3, display: "flex", justifyContent: "center" }}>
                    <Pagination
                        count={Math.max(1, Math.ceil(total / 20))}
                        page={Math.max(1, page + 1)}
                        onChange={(_, value) => setPage(value - 1)}
                        sx={{ mt: 3, display: "flex", justifyContent: "center" }}
                    />
                </Box>
            </MainLayout>
        </SearchContext.Provider>
    );
};

export default ModelListPage;
