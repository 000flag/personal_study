import {
    Box,
    Grid,
    TextField,
    Checkbox,
    FormControlLabel,
    Collapse,
    MenuItem,
} from "@mui/material";
import { useMemo, useState, type KeyboardEvent } from "react";
import type { CommonFilters, DateRange, Range, OptionItem } from "../../types/common";
import { useSearchContext } from "../context/SearchContext";

type Props = {
    open: boolean;
    /** 검색 실행 콜백(선택). Enter 키에서 호출됨 */
    onSearch?: () => void;
    /** 선택값 소스(문자열 또는 OptionItem 배열). 미전달 시 기본 예시 사용 */
    statusOptions?: string[] | OptionItem<string>[];
};

const DEFAULT_STATUS: string[] = ["신청", "검토", "승인", "완료"];

const toStatusArray = (src?: string[] | OptionItem<string>[]) =>
    (src ?? DEFAULT_STATUS).map((v) =>
        typeof v === "string" ? { value: v, label: v } : { value: v.value, label: v.label }
    );

const splitCommaList = (s: string): string[] =>
    s
        .split(/[,\s]+/g)
        .map((t) => t.trim())
        .filter(Boolean);

const parseIds = (s: string): (string | number)[] =>
    splitCommaList(s).map((v) => (v.match(/^\d+$/) ? Number(v) : v));

const AdvancedSearch = ({ open, onSearch, statusOptions }: Props) => {
    // SearchContext는 공용 필터로 단언
    const { filters, setFilters } = useSearchContext() as {
        filters: CommonFilters;
        setFilters: (next: CommonFilters) => void;
    };

    // UI용 보조 상태
    const [idsInput, setIdsInput] = useState(() => (filters.ids ? filters.ids.join(", ") : ""));
    const [tagsInput, setTagsInput] = useState(() => (filters.tags ? filters.tags.join(", ") : ""));

    const statuses = useMemo(() => toStatusArray(statusOptions), [statusOptions]);

    const patch = (partial: Partial<CommonFilters>) => setFilters({ ...filters, ...partial });

    const updateDate = (
        key: keyof Pick<CommonFilters, "created" | "updated" | "date">,
        which: keyof DateRange,
        value: string
    ) => {
        const prev = (filters[key] ?? {}) as DateRange;
        const next: DateRange = { ...prev, [which]: value || undefined };
        setFilters({ ...filters, [key]: next });
    };

    const updateRange = (
        key: keyof Pick<CommonFilters, "number" | "amount">,
        which: keyof Range<number>,
        value: string
    ) => {
        const prev = (filters[key] ?? {}) as Range<number>;
        const n = value === "" ? undefined : Number(value);
        const next: Range<number> = { ...prev, [which]: Number.isNaN(n!) ? undefined : n };
        setFilters({ ...filters, [key]: next });
    };

    const handleEnter = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            onSearch?.();
        }
    };

    return (
        <Collapse in={open}>
            <Box
                sx={{
                    backgroundColor: "#FAFAFA",
                    border: "1px solid #E5E7EB",
                    p: 3,
                    borderRadius: 2,
                    mb: 3,
                }}
            >
                <Grid container spacing={2}>
                    {/* 자유 검색어 */}
                    <Grid size={{ xs: 12, md: 6, lg: 4 }}>
                        <TextField
                            label="검색어(q)"
                            fullWidth
                            size="small"
                            value={filters.q ?? ""}
                            onChange={(e) => patch({ q: e.target.value || undefined })}
                            onKeyDown={handleEnter}
                        />
                    </Grid>

                    {/* ID 배열 */}
                    <Grid size={{ xs: 12, md: 6, lg: 4 }}>
                        <TextField
                            label="IDs (쉼표 구분)"
                            fullWidth
                            size="small"
                            value={idsInput}
                            onChange={(e) => {
                                const v = e.target.value;
                                setIdsInput(v);
                                const ids = v.trim() ? parseIds(v) : undefined;
                                patch({ ids });
                            }}
                            onKeyDown={handleEnter}
                            placeholder="123, 456, ab-789"
                        />
                    </Grid>

                    {/* 상태 */}
                    <Grid size={{ xs: 12, md: 6, lg: 4 }}>
                        <TextField
                            label="상태"
                            fullWidth
                            size="small"
                            select
                            value={typeof filters.status === "string" ? filters.status : ""}
                            onChange={(e) => patch({ status: e.target.value || undefined })}
                        >
                            {statuses.map((opt) => (
                                <MenuItem key={opt.value} value={opt.value}>
                                    {opt.label}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>

                    {/* 태그 */}
                    <Grid size={{ xs: 12, md: 6, lg: 4 }}>
                        <TextField
                            label="태그(쉼표 구분)"
                            fullWidth
                            size="small"
                            value={tagsInput}
                            onChange={(e) => {
                                const v = e.target.value;
                                setTagsInput(v);
                                const tags = v.trim() ? splitCommaList(v) : undefined;
                                patch({ tags });
                            }}
                            onKeyDown={handleEnter}
                            placeholder="vip, new, flagged"
                        />
                    </Grid>

                    {/* 이름/이메일/전화 */}
                    <Grid size={{ xs: 12, md: 6, lg: 4 }}>
                        <TextField
                            label="이름"
                            fullWidth
                            size="small"
                            value={filters.name ?? ""}
                            onChange={(e) => patch({ name: e.target.value || undefined })}
                            onKeyDown={handleEnter}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6, lg: 4 }}>
                        <TextField
                            label="이메일"
                            fullWidth
                            size="small"
                            value={filters.email ?? ""}
                            onChange={(e) => patch({ email: e.target.value || undefined })}
                            onKeyDown={handleEnter}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6, lg: 4 }}>
                        <TextField
                            label="전화번호"
                            fullWidth
                            size="small"
                            value={filters.phone ?? ""}
                            onChange={(e) => patch({ phone: e.target.value || undefined })}
                            onKeyDown={handleEnter}
                        />
                    </Grid>

                    {/* 활성/보관 */}
                    <Grid size={{ xs: 12, md: 6, lg: 4 }}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={!!filters.active}
                                    onChange={(e) => patch({ active: e.target.checked || undefined })}
                                />
                            }
                            label="활성(Active)"
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6, lg: 4 }}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={!!filters.archived}
                                    onChange={(e) => patch({ archived: e.target.checked || undefined })}
                                />
                            }
                            label="보관(Archived)"
                        />
                    </Grid>

                    {/* 날짜 범위 */}
                    <Grid size={{ xs: 12, md: 6, lg: 4 }}>
                        <TextField
                            label="생성일 시작"
                            fullWidth
                            size="small"
                            type="date"
                            InputLabelProps={{ shrink: true }}
                            value={filters.created?.from ?? ""}
                            onChange={(e) => updateDate("created", "from", e.target.value)}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6, lg: 4 }}>
                        <TextField
                            label="생성일 종료"
                            fullWidth
                            size="small"
                            type="date"
                            InputLabelProps={{ shrink: true }}
                            value={filters.created?.to ?? ""}
                            onChange={(e) => updateDate("created", "to", e.target.value)}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6, lg: 4 }}>
                        <TextField
                            label="도메인일 시작"
                            fullWidth
                            size="small"
                            type="date"
                            InputLabelProps={{ shrink: true }}
                            value={filters.date?.from ?? ""}
                            onChange={(e) => updateDate("date", "from", e.target.value)}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6, lg: 4 }}>
                        <TextField
                            label="도메인일 종료"
                            fullWidth
                            size="small"
                            type="date"
                            InputLabelProps={{ shrink: true }}
                            value={filters.date?.to ?? ""}
                            onChange={(e) => updateDate("date", "to", e.target.value)}
                        />
                    </Grid>

                    {/* 숫자/금액 범위 */}
                    <Grid size={{ xs: 12, md: 6, lg: 4 }}>
                        <TextField
                            label="숫자 최소값"
                            fullWidth
                            size="small"
                            type="number"
                            value={filters.number?.min ?? ""}
                            onChange={(e) => updateRange("number", "min", e.target.value)}
                            onKeyDown={handleEnter}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6, lg: 4 }}>
                        <TextField
                            label="숫자 최대값"
                            fullWidth
                            size="small"
                            type="number"
                            value={filters.number?.max ?? ""}
                            onChange={(e) => updateRange("number", "max", e.target.value)}
                            onKeyDown={handleEnter}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6, lg: 4 }}>
                        <TextField
                            label="금액 최소값"
                            fullWidth
                            size="small"
                            type="number"
                            value={filters.amount?.min ?? ""}
                            onChange={(e) => updateRange("amount", "min", e.target.value)}
                            onKeyDown={handleEnter}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6, lg: 4 }}>
                        <TextField
                            label="금액 최대값"
                            fullWidth
                            size="small"
                            type="number"
                            value={filters.amount?.max ?? ""}
                            onChange={(e) => updateRange("amount", "max", e.target.value)}
                            onKeyDown={handleEnter}
                        />
                    </Grid>
                </Grid>
            </Box>
        </Collapse>
    );
};

export default AdvancedSearch;
