import { useMemo } from "react";
import { useSearchContext } from "../context/SearchContext";
import type { CommonFilters, OptionItem } from "../../types/common";

import {
    Box,
    Button,
    FormControl,
    InputLabel,
    NativeSelect,
    Grid,
    TextField,
    FormControlLabel,
    Switch,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

type Props = {
    onSimpleSearch: () => void;
    onToggleAdvanced: () => void;
    isAdvancedOpen: boolean;
    /** 선택: 상태 드롭다운 옵션 커스터마이즈 (문자열 또는 {value,label}) */
    statusOptions?: string[] | OptionItem<string>[];
    /** 선택: 검색창 placeholder */
    placeholder?: string;
};

/** 기본 상태 옵션 (프로젝트에서 자유롭게 교체 가능) */
const DEFAULT_STATUS = ["전체", "신청", "검토", "승인", "완료"];

/** 문자열/OptionItem 혼용 소스 → OptionItem 배열로 정규화 */
function normalizeOptions(src?: string[] | OptionItem<string>[]): OptionItem<string>[] {
    const base = src && src.length > 0 ? src : DEFAULT_STATUS;
    return base.map((v) =>
        typeof v === "string" ? { value: v, label: v } : { value: v.value, label: v.label }
    );
}

const SearchBar = ({
    onSimpleSearch,
    onToggleAdvanced,
    isAdvancedOpen,
    statusOptions,
    placeholder = "검색어를 입력하세요",
}: Props) => {
    // 전역 SearchContext 값은 보일러플레이트이므로 공용 타입으로 단언
    const { filters, setFilters, keyword, setKeyword } = useSearchContext() as {
        filters: CommonFilters;
        setFilters: (next: CommonFilters) => void;
        keyword: string;
        setKeyword: (s: string) => void;
    };

    const statusItems = useMemo(() => normalizeOptions(statusOptions), [statusOptions]);

    const handleStatusChange = (value: string) => {
        setFilters({
            ...filters,
            status: value === "전체" ? undefined : value,
        });
    };

    return (
        <Box sx={{ px: 3, py: 2 }}>
            <Grid container spacing={2} alignItems="center" wrap="wrap">
                {/* 상태 선택 */}
                <Grid>
                    <FormControl size="small" variant="standard">
                        <InputLabel htmlFor="status-native">상태</InputLabel>
                        <NativeSelect
                            id="status-native"
                            value={typeof filters.status === "string" ? filters.status : "전체"}
                            onChange={(e) => handleStatusChange(e.target.value)}
                            inputProps={{ name: "status", "aria-label": "status" }}
                        >
                            {statusItems.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </NativeSelect>
                    </FormControl>
                </Grid>

                {/* 키워드 입력 */}
                <Grid size={{ xs: 12, sm: 'auto' }}>
                    <TextField
                        size="small"
                        placeholder={placeholder}
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") onSimpleSearch();
                        }}
                        inputProps={{ "aria-label": "keyword" }}
                    />
                </Grid>

                {/* 검색 버튼 */}
                <Grid>
                    <Button variant="contained" startIcon={<SearchIcon />} onClick={onSimpleSearch}>
                        검색
                    </Button>
                </Grid>

                {/* 상세검색 토글 */}
                <Grid>
                    <FormControlLabel
                        control={<Switch checked={isAdvancedOpen} onChange={onToggleAdvanced} size="small" />}
                        label="상세검색"
                    />
                </Grid>
            </Grid>
        </Box>
    );
};

export default SearchBar;
