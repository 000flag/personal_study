import { useEffect, useState, useCallback } from "react";
import type { Filters, RawModel } from "../types/model";
import { fetchModels } from "../api/api";
import { SearchContext } from "../components/context/SearchContext";
import SearchBar from "../components/search/SearchBar";
import AdvancedSearch from "../components/search/AdvancedSearch";
import ModelTable from "../components/model/ModelTable";
import MainLayout from "../components/layout/MainLayout";

const ModelListPage = () => {
    const [models, setModels] = useState<RawModel[]>([]);
    const [filters, setFilters] = useState<Filters>({});
    const [keyword, setKeyword] = useState("");
    const [showAdvanced, setShowAdvanced] = useState(false);

    // useCallback으로 load 함수 고정
    const load = useCallback(async () => {
        const res = await fetchModels(0, filters, keyword);
        setModels(res.data.content);
    }, [filters, keyword]);

    useEffect(() => {
        load();
    }, [load]);

    return (
        <SearchContext.Provider
            value={{ filters, setFilters, keyword, setKeyword }}
        >
            <MainLayout>
                <SearchBar
                    onSimpleSearch={load}
                    onToggleAdvanced={() => setShowAdvanced((prev) => !prev)}
                />
                <AdvancedSearch open={showAdvanced} />
                <ModelTable models={models} />
            </MainLayout>
        </SearchContext.Provider>
    );
};

export default ModelListPage;
