import { useEffect, useMemo, useRef, useState } from "react";
import {
    Box,
    Tabs,
    Tab,
    Paper,
    Typography,
    ImageList,
    ImageListItem,
    ImageListItemBar,
    IconButton,
    Chip,
    Stack,
    Skeleton,
    Button,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import RefreshIcon from "@mui/icons-material/Refresh";
import DownloadIcon from "@mui/icons-material/Download";

import type { PhotoFile, PhotoStage } from "../../types/common";
import { PHOTO_STAGES } from "../../types/common";
import { fetchFilesByHashes, downloadCompressedByLabel } from "../../api/api";
import PhotoDialog from "./PhotoDialog";

type StageHashes = Partial<Record<PhotoStage, string | undefined>>;

export type DownloadConfig = {
    endpointUrl: string;
    method?: "POST" | "PUT";
    headers?: HeadersInit;
    payloadKey?: string;
    payloadValueStrategy?: (hashes: string[]) => unknown;
    sanitizeLabel?: (s: string) => string;
    filenameSuffix?: string;
};

type Props = {
    stageHashes: StageHashes;
    /** 탭 라벨 커스터마이즈 (기본: 제출/이전/이후) */
    stageLabels?: Partial<Record<PhotoStage, string>>;
    /** 모두 다운로드 버튼을 활성화하려면 설정 */
    downloadConfig?: DownloadConfig;
};

function parseHashes(raw?: string): string[] {
    return (raw || "")
        .split(",")
        .map((h) => h.trim())
        .filter(Boolean);
}

export default function PhotoTabs({
    stageHashes,
    stageLabels,
    downloadConfig,
}: Props) {
    const [tab, setTab] = useState(0);
    const [photos, setPhotos] = useState<PhotoFile[]>([]);
    const [loading, setLoading] = useState(false);
    const [errMsg, setErrMsg] = useState("");

    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogIndex, setDialogIndex] = useState(0);

    // 탭별 결과 캐시
    const cacheRef = useRef<Record<PhotoStage, PhotoFile[]>>({} as Record<
        PhotoStage,
        PhotoFile[]
    >);

    const theme = useTheme();
    const upLg = useMediaQuery(theme.breakpoints.up("lg"));
    const upMd = useMediaQuery(theme.breakpoints.up("md"));
    const upSm = useMediaQuery(theme.breakpoints.up("sm"));
    const cols = upLg ? 4 : upMd ? 3 : upSm ? 2 : 1;

    const labelsMap: Record<PhotoStage, string> = useMemo(
        () => ({
            submission: stageLabels?.submission ?? "제출",
            picBefore: stageLabels?.picBefore ?? "이전",
            picAfter: stageLabels?.picAfter ?? "이후",
        }),
        [stageLabels]
    );

    // 실제 표시할 스테이지(해시 키가 존재하는 것만)
    const stagesToShow = useMemo(
        () => PHOTO_STAGES.filter((s) => s in stageHashes),
        [stageHashes]
    );

    // 라벨이 하나도 없을 때
    if (stagesToShow.length === 0) {
        return (
            <Paper
                elevation={0}
                sx={{ p: 4, textAlign: "center", border: "1px dashed", borderColor: "divider", borderRadius: 2 }}
            >
                <Typography color="text.secondary">표시할 사진 단계가 없습니다.</Typography>
            </Paper>
        );
    }

    const currentStage = stagesToShow[Math.min(tab, stagesToShow.length - 1)];
    const currentLabel = labelsMap[currentStage];
    const currentHashes = parseHashes(stageHashes[currentStage]);

    const load = async (stage: PhotoStage, { force }: { force?: boolean } = {}) => {
        setErrMsg("");

        if (!force && cacheRef.current[stage]) {
            setPhotos(cacheRef.current[stage]);
            setLoading(false);
            return;
        }

        setLoading(true);
        try {
            const arr = parseHashes(stageHashes[stage]);
            if (arr.length === 0) {
                cacheRef.current[stage] = [];
                setPhotos([]);
                return;
            }
            const list = await fetchFilesByHashes(arr);
            const result = Array.isArray(list) ? list : [];
            cacheRef.current[stage] = result;
            setPhotos(result);
        } catch {
            setErrMsg("사진을 불러오지 못했습니다.");
            setPhotos([]);
        } finally {
            setLoading(false);
        }
    };

    // 탭/데이터 변경 시 로드
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        load(currentStage);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tab, stageHashes]);

    // 탭 인덱스 보정
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        if (tab >= stagesToShow.length) setTab(0);
    }, [stagesToShow.length, tab]);

    // stageHashes 변경 시 캐시 초기화
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        cacheRef.current = {} as Record<PhotoStage, PhotoFile[]>;
    }, [stageHashes]);

    const handleRefresh = () => load(currentStage, { force: true });

    const handleDownloadAll = () => {
        if (!downloadConfig || currentHashes.length === 0) return;
        downloadCompressedByLabel(currentLabel, currentHashes, downloadConfig);
    };

    const openDialogAt = (index: number) => {
        setDialogIndex(index);
        setDialogOpen(true);
    };

    return (
        <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
            {/* Tabs */}
            <Tabs
                value={tab}
                onChange={(_, v) => setTab(v)}
                variant="scrollable"
                scrollButtons="auto"
                aria-label="사진 단계 탭"
                sx={{
                    mb: 1,
                    "& .MuiTab-root": { textTransform: "none", minHeight: 48 },
                    "& .MuiTabs-indicator": { height: 3 },
                }}
            >
                {stagesToShow.map((stage, idx) => {
                    const count = parseHashes(stageHashes[stage]).length;
                    return (
                        <Tab
                            key={stage}
                            disabled={count === 0}
                            label={
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <span>{labelsMap[stage]}</span>
                                    <Chip size="small" label={count} variant="outlined" />
                                </Stack>
                            }
                            id={`photo-tab-${idx}`}
                            aria-controls={`photo-tabpanel-${idx}`}
                        />
                    );
                })}
            </Tabs>

            {/* Actions */}
            <Box display="flex" justifyContent="flex-end" alignItems="center" gap={1} sx={{ mb: 1 }}>
                <Button size="small" variant="outlined" startIcon={<RefreshIcon />} onClick={handleRefresh}>
                    새로고침
                </Button>
                {downloadConfig && (
                    <Button
                        size="small"
                        variant="contained"
                        startIcon={<DownloadIcon />}
                        onClick={handleDownloadAll}
                        disabled={currentHashes.length === 0}
                    >
                        모두 다운로드
                    </Button>
                )}
            </Box>

            {/* 본문 */}
            {loading && (
                <Box py={1}>
                    <ImageList cols={cols} gap={12}>
                        {Array.from({ length: cols * 2 }).map((_, i) => (
                            <Skeleton key={i} variant="rounded" height={200} sx={{ borderRadius: 2 }} />
                        ))}
                    </ImageList>
                </Box>
            )}

            {!loading && errMsg && (
                <Box py={4} textAlign="center">
                    <Typography color="error" sx={{ mb: 1 }}>
                        {errMsg}
                    </Typography>
                    <Button size="small" variant="outlined" onClick={handleRefresh} startIcon={<RefreshIcon />}>
                        다시 시도
                    </Button>
                </Box>
            )}

            {!loading && !errMsg && currentHashes.length === 0 && (
                <Typography sx={{ py: 4, textAlign: "center", color: "text.secondary" }}>
                    해당 단계에 등록된 사진이 없습니다.
                </Typography>
            )}

            {!loading && !errMsg && currentHashes.length > 0 && photos.length === 0 && (
                <Typography sx={{ py: 4, textAlign: "center", color: "text.secondary" }}>
                    사진 정보를 불러오는 중입니다…
                </Typography>
            )}

            {!loading && !errMsg && photos.length > 0 && (
                <ImageList cols={cols} gap={12}>
                    {photos.map((p, idx) => {
                        const src = p.externalPath;
                        const title = p.filename || `photo_${idx + 1}`;
                        return (
                            <ImageListItem
                                key={`${src}-${idx}`}
                                sx={{
                                    borderRadius: 2,
                                    overflow: "hidden",
                                    border: "1px solid #eee",
                                    transition: "transform .15s ease",
                                    "&:hover": { transform: "translateY(-2px)" },
                                }}
                            >
                                <img
                                    src={src}
                                    alt={title}
                                    loading="lazy"
                                    style={{
                                        width: "100%",
                                        height: 200,
                                        objectFit: "cover",
                                        display: "block",
                                        cursor: "zoom-in",
                                    }}
                                    onClick={() => openDialogAt(idx)}
                                />
                                <ImageListItemBar
                                    title={title}
                                    actionIcon={
                                        <IconButton
                                            aria-label="open"
                                            onClick={() => window.open(src, "_blank", "noopener,noreferrer")}
                                            sx={{ color: "white" }}
                                        >
                                            <OpenInNewIcon />
                                        </IconButton>
                                    }
                                />
                            </ImageListItem>
                        );
                    })}
                </ImageList>
            )}

            {/* 포토 다이얼로그 */}
            {/* 기존 PhotoDialog 그대로 사용 (공용화된 버전) */}
            {/* import type { PhotoFile } from "../../types/common"; */}
            {/* photos는 PhotoFile[] */}
            {/* initialIndex는 dialogIndex */}
            {/* onClose는 setDialogOpen(false) */}
            <PhotoDialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                photos={photos}
                initialIndex={dialogIndex}
            />
        </Paper>
    );
}
