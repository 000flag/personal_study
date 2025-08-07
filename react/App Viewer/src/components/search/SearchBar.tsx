import { useSearchContext } from "../context/SearchContext";
import {
    Box,
    Button,
    FormControl,
    Grid,
    InputLabel,
    NativeSelect,
    TextField,
    Tooltip
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import TuneIcon from "@mui/icons-material/Tune";

interface Props {
    onSimpleSearch: () => void;
    onToggleAdvanced: () => void;
}

const statusOptions = ["전체", "신청", "검토", "승인", "완료"];

const SearchBar = ({ onSimpleSearch, onToggleAdvanced }: Props) => {
    const { filters, setFilters, keyword, setKeyword } = useSearchContext();

    const handleStatusChange = (value: string) => {
        setFilters({
            ...filters,
            status: value === "전체" ? undefined : value,
        });
        onSimpleSearch(); // 상태 변경 시 바로 검색
    };

    return (
        <Box sx={{ px: 3, py: 2 }}>
            <Grid container={true} component="div" spacing={2} alignItems="center">
                <Grid component="div">
                    <FormControl size="small">
                        <InputLabel variant="standard" htmlFor="status-native">신청상태</InputLabel>
                        <NativeSelect
                            id="status-native"
                            value={filters.status ?? "전체"}
                            onChange={(e) => handleStatusChange(e.target.value)}
                            inputProps={{
                                name: 'status',
                                id: 'status-native',
                            }}
                        >
                            {statusOptions.map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </NativeSelect>
                    </FormControl>
                </Grid>
                <Grid component="div">
                    <TextField
                        size="small"
                        placeholder="모델 이름으로 검색"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                onSimpleSearch();
                            }
                        }}
                    />
                </Grid>
                <Grid component="div">
                    <Button
                        variant="contained"
                        startIcon={<SearchIcon />}
                        onClick={onSimpleSearch}
                    >
                        검색
                    </Button>
                </Grid>
                <Grid component="div">
                    <Tooltip title="상세검색">
                        <Button onClick={onToggleAdvanced}>
                            <TuneIcon />
                        </Button>
                    </Tooltip>
                </Grid>
            </Grid>
        </Box>
    );
};

export default SearchBar;
