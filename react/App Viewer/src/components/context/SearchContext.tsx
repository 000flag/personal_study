import { createContext, useContext } from "react";
import type { Filters } from "../../types/model";

export type SearchContextType = {
    filters: Filters;
    setFilters: (f: Filters) => void;
    keyword: string;
    setKeyword: (k: string) => void;
};

export const SearchContext = createContext<SearchContextType | null>(null);

export const useSearchContext = () => {
    const ctx = useContext(SearchContext);
    if (!ctx) throw new Error("SearchContext not found");
    return ctx;
};
