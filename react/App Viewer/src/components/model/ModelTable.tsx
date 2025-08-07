import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
    Box,
    Checkbox,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Button,
    Tooltip,
    IconButton,
    Select,
    MenuItem,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DownloadIcon from "@mui/icons-material/Download";
import type { RawModel, Photo } from "../../types/model";
import { fetchPhotos } from "../../api/api";
import PhotoPreview from "./PhotoPreview";
import PhotoDialog from "./PhotoDialog";
import ContractUpload from "./ContractUpload";
import NoteCell from "./NoteCell";

const photoStages = [
    "지원사진",
    "수술전",
    "수술직후",
    "1주차",
    "2주차",
    "3주차",
    "1개월",
    "2개월",
    "3개월",
    "6개월",
];

const ModelTable = ({
    models,
    onSelectChange,
}: {
    models: RawModel[];
    onSelectChange?: (selected: number[]) => void;
}) => {
    const [hoveredId, setHoveredId] = useState<number | null>(null);
    const [hoveredKind, setHoveredKind] = useState<string | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogPhotos, setDialogPhotos] = useState<Photo[]>([]);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const [uploadTarget, setUploadTarget] = useState<{ id: number; name: string } | null>(null);
    const navigate = useNavigate();

    const getStatusColor = (status: string): string => {
        switch (status) {
            case "신청":
                return "#42a5f5"; // 파란색
            case "검토":
                return "#ab47bc"; // 보라색
            case "승인":
                return "#26a69a"; // 청록색
            case "완료":
                return "#ef5350"; // 빨간색
            default:
                return "#90a4ae"; // 기본 회색
        }
    };

    const getStageColor = (stage: string): string => {
        switch (stage) {
            case "초기":
                return "#90caf9"; // 하늘색
            case "중기":
                return "#ffcc80"; // 주황
            case "후기":
                return "#a5d6a7"; // 연녹색
            case "완료":
                return "#ce93d8"; // 연보라
            default:
                return "#b0bec5"; // 회색
        }
    };

    const handleCheckboxChange = (id: number) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    };

    const handleSelectAll = (checked: boolean) => {
        const ids = checked ? models.map((m) => m.id) : [];
        setSelectedIds(ids);
    };

    const safeNotifySelection = useCallback(() => {
        if (onSelectChange) onSelectChange(selectedIds);
    }, [onSelectChange, selectedIds]);

    useEffect(() => {
        safeNotifySelection();
    }, [safeNotifySelection]);

    const handleOpenDialog = async (id: number, kind: string) => {
        const photos = await fetchPhotos(id, kind);
        setDialogPhotos(photos);
        setDialogOpen(true);
    };

    return (
        <>
            {selectedIds.length > 0 && (
                <Box display="flex" gap={2} mb={2} alignItems="center">
                    <Typography>{selectedIds.length}개 선택됨</Typography>
                    <Button variant="outlined" size="small" color="error">
                        삭제
                    </Button>
                    <Button variant="outlined" size="small">
                        다운로드
                    </Button>
                    <Select size="small" defaultValue="">
                        <MenuItem value="">상태 변경</MenuItem>
                        {["신청", "검토", "승인", "완료"].map((s) => (
                            <MenuItem key={s} value={s}>
                                {s}
                            </MenuItem>
                        ))}
                    </Select>
                </Box>
            )}

            <TableContainer>
                <Table size="small" sx={{ backgroundColor: "#fff" }}>
                    <TableHead>
                        <TableRow>
                            <TableCell padding="checkbox">
                                <Checkbox
                                    checked={selectedIds.length === models.length}
                                    onChange={(e) => handleSelectAll(e.target.checked)}
                                />
                            </TableCell>
                            <TableCell
                                align="center"
                                sx={{
                                    whiteSpace: "nowrap",
                                    minWidth: 80,
                                    padding: "8px 12px",
                                }}
                            >
                                번호
                            </TableCell>
                            <TableCell
                                align="center"
                                sx={{
                                    whiteSpace: "nowrap",
                                    minWidth: 80,
                                    padding: "8px 12px",
                                }}
                            >
                                이름
                            </TableCell>
                            <TableCell
                                align="center"
                                sx={{
                                    whiteSpace: "nowrap",
                                    minWidth: 80,
                                    padding: "8px 12px",
                                }}
                            >
                                휴대폰
                            </TableCell>
                            <TableCell
                                align="center"
                                sx={{
                                    whiteSpace: "nowrap",
                                    minWidth: 80,
                                    padding: "8px 12px",
                                }}
                            >
                                수술일
                            </TableCell>
                            <TableCell
                                align="center"
                                sx={{
                                    whiteSpace: "nowrap",
                                    minWidth: 80,
                                    padding: "8px 12px",
                                }}
                            >
                                시술
                            </TableCell>
                            <TableCell
                                align="center"
                                sx={{
                                    whiteSpace: "nowrap",
                                    minWidth: 80,
                                    padding: "8px 12px",
                                }}
                            >
                                신청상태
                            </TableCell>
                            <TableCell
                                align="center"
                                sx={{
                                    whiteSpace: "nowrap",
                                    minWidth: 80,
                                    padding: "8px 12px",
                                }}
                            >
                                진행상태
                            </TableCell>
                            <TableCell align="center" colSpan={10}>
                                업로드
                            </TableCell>
                            <TableCell
                                align="center"
                                sx={{
                                    whiteSpace: "nowrap",
                                    minWidth: 180,
                                    maxWidth: 200,
                                    padding: "8px 12px",
                                }}
                            >
                                특이사항
                            </TableCell>
                            <TableCell
                                align="center"
                                sx={{
                                    whiteSpace: "nowrap",
                                    minWidth: 180,
                                    maxWidth: 200,
                                    padding: "8px 12px",
                                }}
                            >
                                할인
                            </TableCell>
                            <TableCell
                                align="center"
                                sx={{
                                    whiteSpace: "nowrap",
                                    minWidth: 80,
                                    padding: "8px 12px",
                                }}
                            >
                                계약서
                            </TableCell>
                            <TableCell
                                align="center"
                                sx={{
                                    whiteSpace: "nowrap",
                                    minWidth: 80,
                                    padding: "8px 12px",
                                }}
                            >
                                계약서 업로드
                            </TableCell>
                            <TableCell
                                align="center"
                                sx={{
                                    whiteSpace: "nowrap",
                                    minWidth: 80,
                                    padding: "8px 12px",
                                }}
                            >
                                등록일
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell colSpan={8} />
                            {photoStages.map((stage) => (
                                <TableCell
                                    key={stage}
                                    align="center"
                                    sx={{
                                        whiteSpace: "nowrap",
                                        textAlign: "center",
                                        minWidth: 70,
                                        padding: "8px 12px",
                                    }}
                                >
                                    {stage}
                                </TableCell>
                            ))}
                            <TableCell colSpan={5} />
                        </TableRow>

                    </TableHead>
                    <TableBody>
                        {models.map((model, index) => (
                            <TableRow key={model.id} hover>
                                <TableCell padding="checkbox">
                                    <Checkbox
                                        checked={selectedIds.includes(model.id)}
                                        onChange={() => handleCheckboxChange(model.id)}
                                    />
                                </TableCell>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell
                                    onClick={() => navigate(`/model/${model.id}`)}
                                    style={{ cursor: "pointer" }}
                                >
                                    <Box fontWeight="bold">{model.name}</Box>
                                    <Typography
                                        variant="caption"
                                        sx={{
                                            writingMode: "horizontal-tb",
                                            transform: "none",
                                            whiteSpace: "nowrap",
                                        }}>
                                        {model.birth}
                                    </Typography>
                                </TableCell>
                                <TableCell>{model.telNo}</TableCell>
                                <TableCell>-</TableCell>
                                <TableCell
                                    sx={{
                                        writingMode: "horizontal-tb",
                                        transform: "none",
                                        whiteSpace: "nowrap",
                                    }}
                                >
                                    {model.cstype}
                                </TableCell>
                                <TableCell>
                                    <Box
                                        component="span"
                                        sx={{
                                            display: "inline-block",
                                            px: 1.5,
                                            py: 0.5,
                                            borderRadius: "999px",
                                            backgroundColor: getStatusColor(model.status),
                                            color: "#fff",
                                            fontSize: "0.75rem",
                                            fontWeight: 600,
                                            textAlign: "center",
                                            minWidth: "60px",
                                        }}
                                    >
                                        {model.status}
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    <Box
                                        component="span"
                                        sx={{
                                            display: "inline-block",
                                            px: 1.5,
                                            py: 0.5,
                                            borderRadius: "999px",
                                            backgroundColor: getStageColor(model.progressStage),
                                            color: "#fff",
                                            fontSize: "0.75rem",
                                            fontWeight: 600,
                                            textAlign: "center",
                                            minWidth: "60px",
                                        }}
                                    >
                                        {model.progressStage}
                                    </Box>
                                </TableCell>
                                {photoStages.map((stage) => {
                                    const hasPhoto = model.picSubmission.includes(stage);
                                    return (
                                        <TableCell key={stage} align="center">
                                            {hasPhoto ? (
                                                <Box sx={{ display: "flex", alignItems: "center", gap: 1, justifyContent: "center" }}>
                                                    <Tooltip title="미리보기">
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => handleOpenDialog(model.id, stage)}
                                                            onMouseEnter={(e) => {
                                                                setHoveredId(model.id);
                                                                setHoveredKind(stage);
                                                                setAnchorEl(e.currentTarget);
                                                            }}
                                                            onMouseLeave={() => {
                                                                setHoveredId(null);
                                                                setHoveredKind(null);
                                                                setAnchorEl(null);
                                                            }}
                                                            sx={{
                                                                px: 1,
                                                                py: 0.5,
                                                                borderRadius: "6px",
                                                                display: "flex",
                                                                alignItems: "center",
                                                                gap: 0.5,
                                                                border: "1px solid rgba(0,0,0,0.1)",
                                                            }}
                                                        >
                                                            <VisibilityIcon fontSize="small" />
                                                            <Typography variant="caption" sx={{ lineHeight: 1 }}>
                                                                n
                                                            </Typography>
                                                        </IconButton>
                                                    </Tooltip>

                                                    <Button size="small" sx={{ minWidth: 32, px: 1 }}>
                                                        <DownloadIcon fontSize="small" />
                                                    </Button>
                                                </Box>
                                            ) : (
                                                <Typography variant="caption" color="textSecondary">
                                                    -
                                                </Typography>
                                            )}
                                        </TableCell>
                                    );
                                })}
                                <TableCell>
                                    <NoteCell
                                        modelId={model.id}
                                        type="note"
                                        initialValue={model.note}
                                    />
                                </TableCell>

                                <TableCell>
                                    <NoteCell
                                        modelId={model.id}
                                        type="discount"
                                        initialValue={model.discount}
                                    />
                                </TableCell>
                                <TableCell>-</TableCell>
                                <TableCell>
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        onClick={() => setUploadTarget({ id: model.id, name: model.name })}
                                    >
                                        업로드
                                    </Button>
                                </TableCell>
                                <TableCell
                                    sx={{
                                        writingMode: "horizontal-tb",
                                        transform: "none",
                                        whiteSpace: "nowrap",
                                    }}
                                >
                                    {new Date(model.createdAt).toLocaleDateString()}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <PhotoDialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                photos={dialogPhotos}
            />

            <PhotoPreview
                id={hoveredId}
                pictureKind={hoveredKind}
                anchorEl={anchorEl}
                open={Boolean(hoveredId && hoveredKind && anchorEl)}
            />

            {uploadTarget && (
                <ContractUpload
                    modelId={uploadTarget?.id ?? 0}
                    modelName={uploadTarget?.name ?? ""}
                    open={!!uploadTarget}
                    onClose={() => setUploadTarget(null)}
                />
            )}
        </>
    );
};

export default ModelTable;
