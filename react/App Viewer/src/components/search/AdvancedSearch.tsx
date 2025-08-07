import {
    Box,
    Grid,
    TextField,
    Checkbox,
    FormControlLabel,
    Collapse,
    MenuItem
} from "@mui/material";
import { useSearchContext } from "../context/SearchContext";

const statusOptions = ["신청", "검토", "승인", "완료"];

const AdvancedSearch = ({ open }: { open: boolean }) => {
    const { filters, setFilters } = useSearchContext();

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
                    <Grid container={true} component="div" spacing={2}>
                        <TextField
                            label="모델번호"
                            fullWidth
                            size="small"
                            value={filters.id || ""}
                            onChange={(e) => setFilters({ ...filters, id: e.target.value })}
                        />
                    </Grid>

                    <Grid container={true} component="div" spacing={2}>
                        <TextField
                            label="신청 상태"
                            fullWidth
                            size="small"
                            select
                            value={filters.status || ""}
                            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                        >
                            {statusOptions.map((option) => (
                                <MenuItem key={option} value={option}>
                                    {option}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>

                    <Grid container={true} component="div" spacing={2}>
                        <TextField
                            label="모델 이름"
                            fullWidth
                            size="small"
                            value={filters.name || ""}
                            onChange={(e) => setFilters({ ...filters, name: e.target.value })}
                        />
                    </Grid>

                    <Grid container={true} component="div" spacing={2}>
                        <TextField
                            label="이메일"
                            fullWidth
                            size="small"
                            value={filters.email || ""}
                            onChange={(e) => setFilters({ ...filters, email: e.target.value })}
                        />
                    </Grid>

                    <Grid container={true} component="div" spacing={2}>
                        <TextField
                            label="전화번호"
                            fullWidth
                            size="small"
                            value={filters.telNo || ""}
                            onChange={(e) => setFilters({ ...filters, telNo: e.target.value })}
                        />
                    </Grid>

                    <Grid container={true} component="div" spacing={2}>
                        <TextField
                            label="시술 종류"
                            fullWidth
                            size="small"
                            value={filters.cstype || ""}
                            onChange={(e) => setFilters({ ...filters, cstype: e.target.value })}
                        />
                    </Grid>

                    <Grid container={true} component="div" spacing={2}>
                        <TextField
                            label="최소 키 (cm)"
                            fullWidth
                            size="small"
                            type="number"
                            value={filters.minHeight || ""}
                            onChange={(e) => setFilters({ ...filters, minHeight: e.target.value })}
                        />
                    </Grid>

                    <Grid container={true} component="div" spacing={2}>
                        <TextField
                            label="최대 키 (cm)"
                            fullWidth
                            size="small"
                            type="number"
                            value={filters.maxHeight || ""}
                            onChange={(e) => setFilters({ ...filters, maxHeight: e.target.value })}
                        />
                    </Grid>

                    <Grid container={true} component="div" spacing={2}>
                        <TextField
                            label="최소 몸무게 (kg)"
                            fullWidth
                            size="small"
                            type="number"
                            value={filters.minWeight || ""}
                            onChange={(e) => setFilters({ ...filters, minWeight: e.target.value })}
                        />
                    </Grid>

                    <Grid container={true} component="div" spacing={2}>
                        <TextField
                            label="최대 몸무게 (kg)"
                            fullWidth
                            size="small"
                            type="number"
                            value={filters.maxWeight || ""}
                            onChange={(e) => setFilters({ ...filters, maxWeight: e.target.value })}
                        />
                    </Grid>

                    <Grid container={true} component="div" spacing={2}>
                        <TextField
                            label="최소 나이"
                            fullWidth
                            size="small"
                            type="number"
                            value={filters.minAge || ""}
                            onChange={(e) => setFilters({ ...filters, minAge: e.target.value })}
                        />
                    </Grid>

                    <Grid container={true} component="div" spacing={2}>
                        <TextField
                            label="최대 나이"
                            fullWidth
                            size="small"
                            type="number"
                            value={filters.maxAge || ""}
                            onChange={(e) => setFilters({ ...filters, maxAge: e.target.value })}
                        />
                    </Grid>

                    <Grid container={true} component="div" spacing={2}>
                        <TextField
                            label="생년월일"
                            fullWidth
                            size="small"
                            type="date"
                            InputLabelProps={{ shrink: true }}
                            value={filters.birth || ""}
                            onChange={(e) => setFilters({ ...filters, birth: e.target.value })}
                        />
                    </Grid>

                    <Grid container={true} component="div" spacing={2}>
                        <TextField
                            label="수술일 시작"
                            fullWidth
                            size="small"
                            type="date"
                            InputLabelProps={{ shrink: true }}
                            value={filters.operDateFrom || ""}
                            onChange={(e) => setFilters({ ...filters, operDateFrom: e.target.value })}
                        />
                    </Grid>

                    <Grid container={true} component="div" spacing={2}>
                        <TextField
                            label="수술일 종료"
                            fullWidth
                            size="small"
                            type="date"
                            InputLabelProps={{ shrink: true }}
                            value={filters.operDateTo || ""}
                            onChange={(e) => setFilters({ ...filters, operDateTo: e.target.value })}
                        />
                    </Grid>

                    <Grid container={true} component="div" spacing={2}>
                        <TextField
                            label="생성일 시작"
                            fullWidth
                            size="small"
                            type="date"
                            InputLabelProps={{ shrink: true }}
                            value={filters.createdFrom || ""}
                            onChange={(e) => setFilters({ ...filters, createdFrom: e.target.value })}
                        />
                    </Grid>

                    <Grid container={true} component="div" spacing={2}>
                        <TextField
                            label="생성일 종료"
                            fullWidth
                            size="small"
                            type="date"
                            InputLabelProps={{ shrink: true }}
                            value={filters.createdTo || ""}
                            onChange={(e) => setFilters({ ...filters, createdTo: e.target.value })}
                        />
                    </Grid>

                    <Grid container={true} component="div" spacing={2}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={filters.activated === "true"}
                                    onChange={(e) =>
                                        setFilters({
                                            ...filters,
                                            activated: e.target.checked ? "true" : ""
                                        })
                                    }
                                />
                            }
                            label="활성화된 모델만 보기"
                        />
                    </Grid>
                </Grid>
            </Box>
        </Collapse>
    );
};

export default AdvancedSearch;
