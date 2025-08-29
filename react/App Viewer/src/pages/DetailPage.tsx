// src/pages/DetailPage.tsx
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import {
    Box,
    Card,
    CardContent,
    CardHeader,
    Chip,
    Divider,
    Grid,
    IconButton,
    Skeleton,
    Stack,
    Tooltip,
    Typography,
    Snackbar,
    Alert,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import LinkIcon from "@mui/icons-material/Link";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import EventNoteIcon from "@mui/icons-material/EventNote";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";

import type { EntityBase, PhotoStage } from "../types/common";
import { PHOTO_STAGES } from "../types/common";
import { fetchItem } from "../api/api";
import MainLayout from "../components/layout/MainLayout";
import PhotoTabs from "../components/detail/PhotoTabs";
import type { DetailAdapters } from "../types/adapters";

/* -----------------------------------------------------------
 * 내부 유틸
 * ---------------------------------------------------------*/
function parseCommaHashes(v: unknown): string[] {
    if (typeof v !== "string") return [];
    return v
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
}

/* -----------------------------------------------------------
 * Component
 * ---------------------------------------------------------*/
function DetailPage<T extends EntityBase & Record<string, unknown>>({
    adapters,
}: {
    adapters: DetailAdapters<T>;
}) {
    const { id: idParam } = useParams<{ id: string }>();

    const [item, setItem] = useState<T | null>(null);
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState<"email" | "link" | null>(null);

    useEffect(() => {
        let alive = true;

        async function load() {
            if (!idParam) return;
            setLoading(true);
            try {
                const url = adapters.itemUrl(idParam as unknown as T["id"]);
                const data = await fetchItem<T>(url);
                if (alive) setItem(data);
            } catch (e) {
                console.error("Detail fetch failed:", e);
                if (alive) setItem(null);
            } finally {
                if (alive) setLoading(false);
            }
        }

        void load();
        return () => {
            alive = false;
        };
    }, [adapters, idParam]);

    const title = useMemo(
        () => (item ? adapters.getTitle?.(item) ?? String(item.id) : ""),
        [adapters, item]
    );
    const subTitle = useMemo(
        () => (item ? adapters.getSubTitle?.(item) : undefined),
        [adapters, item]
    );
    const email = useMemo(
        () => (item ? adapters.getEmail?.(item) : undefined),
        [adapters, item]
    );
    const phone = useMemo(
        () => (item ? adapters.getPhone?.(item) : undefined),
        [adapters, item]
    );
    const createdAt = useMemo(
        () => (item ? adapters.getCreatedAt?.(item) : undefined),
        [adapters, item]
    );
    const domainDate = useMemo(
        () => (item ? adapters.getDomainDate?.(item) : undefined),
        [adapters, item]
    );

    // 단계별 해시
    const stageHashes: Partial<Record<PhotoStage, string>> = useMemo(() => {
        const map: Partial<Record<PhotoStage, string>> = {};
        if (!item) return map;
        for (const stage of PHOTO_STAGES) {
            const arr = adapters.getStageHashes
                ? adapters.getStageHashes(item, stage)
                : parseCommaHashes((item as Record<string, unknown>)[stage]);
            if (arr.length) map[stage] = arr.join(",");
        }
        return map;
    }, [adapters, item]);

    const handleCopyEmail = () => {
        if (!email) return;
        void navigator.clipboard.writeText(email);
        setCopied("email");
    };

    const handleCopyLink = () => {
        const href = window.location.href;
        void navigator.clipboard.writeText(href);
        setCopied("link");
    };

    const handleCloseSnackbar = () => setCopied(null);

    /* --------------------- RENDER --------------------- */
    if (loading) {
        return (
            <MainLayout>
                <Box sx={{ p: { xs: 2, md: 3 } }}>
                    <Skeleton variant="text" width={260} height={40} sx={{ mb: 1 }} />
                    <Skeleton variant="text" width={160} height={24} sx={{ mb: 3 }} />
                    <Grid container spacing={2} sx={{ mb: 2 }}>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Skeleton variant="rounded" height={220} />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Skeleton variant="rounded" height={220} />
                        </Grid>
                    </Grid>
                    <Skeleton variant="rounded" height={420} />
                </Box>
            </MainLayout>
        );
    }

    if (!item) {
        return (
            <MainLayout>
                <Box sx={{ p: { xs: 2, md: 3 } }}>
                    <Typography>데이터를 불러올 수 없습니다.</Typography>
                </Box>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <Box sx={{ p: { xs: 2, md: 3 } }}>
                {/* Header */}
                <Stack
                    direction={{ xs: "column", md: "row" }}
                    justifyContent="space-between"
                    alignItems={{ xs: "flex-start", md: "center" }}
                    spacing={1.5}
                    sx={{ mb: 1.5 }}
                >
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <Typography variant="h5" fontWeight={800}>
                            {title}
                        </Typography>
                        {subTitle && <Chip size="small" label={subTitle} />}
                        {/* 링크 복사 */}
                        <Tooltip title={copied === "link" ? "복사됨" : "링크 복사"} placement="top">
                            <IconButton size="small" onClick={handleCopyLink}>
                                <LinkIcon fontSize="inherit" />
                            </IconButton>
                        </Tooltip>
                    </Stack>

                    {createdAt && (
                        <Stack direction="row" alignItems="center" spacing={0.75}>
                            <EventNoteIcon fontSize="small" />
                            <Typography variant="body2" color="text.secondary">
                                생성일&nbsp;{new Date(createdAt).toLocaleString()}
                            </Typography>
                        </Stack>
                    )}
                </Stack>

                <Divider sx={{ mb: 2 }} />

                {/* Summary cards */}
                <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Card
                            sx={{
                                height: "100%",
                                borderRadius: 2,
                                border: "1px solid",
                                borderColor: "divider",
                                overflow: "hidden",
                            }}
                        >
                            <CardHeader
                                avatar={<AssignmentIndIcon fontSize="small" />}
                                title="기본 정보"
                                sx={{
                                    py: 1.5,
                                    "& .MuiCardHeader-title": { fontSize: 18, fontWeight: 700 },
                                    background:
                                        "linear-gradient(180deg, rgba(0,0,0,0.02) 0%, rgba(0,0,0,0.01) 100%)",
                                }}
                            />
                            <CardContent sx={{ pt: 1.5 }}>
                                <Stack spacing={1.25}>
                                    {email && (
                                        <Stack direction="row" alignItems="center" spacing={0.75}>
                                            <MailOutlineIcon fontSize="small" />
                                            <Typography>{email}</Typography>
                                            <Tooltip
                                                title={copied === "email" ? "복사됨" : "복사"}
                                                placement="top"
                                            >
                                                <IconButton size="small" onClick={handleCopyEmail}>
                                                    <ContentCopyIcon fontSize="inherit" />
                                                </IconButton>
                                            </Tooltip>
                                        </Stack>
                                    )}
                                    {phone && (
                                        <Stack direction="row" alignItems="center" spacing={0.75}>
                                            <PhoneIphoneIcon fontSize="small" />
                                            <Typography>{phone}</Typography>
                                        </Stack>
                                    )}
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <Card
                            sx={{
                                height: "100%",
                                borderRadius: 2,
                                border: "1px solid",
                                borderColor: "divider",
                                overflow: "hidden",
                            }}
                        >
                            <CardHeader
                                avatar={<EventNoteIcon fontSize="small" />}
                                title="도메인 정보"
                                sx={{
                                    py: 1.5,
                                    "& .MuiCardHeader-title": { fontSize: 18, fontWeight: 700 },
                                    background:
                                        "linear-gradient(180deg, rgba(0,0,0,0.02) 0%, rgba(0,0,0,0.01) 100%)",
                                }}
                            />
                            <CardContent sx={{ pt: 1.5 }}>
                                <Stack spacing={1.25}>
                                    <Typography variant="body2" color="text.secondary">
                                        아래 필드는 프로젝트에 맞게 어댑터에서 매핑하세요.
                                    </Typography>
                                    {domainDate && (
                                        <Stack direction="row" alignItems="center" spacing={0.75}>
                                            <EventNoteIcon fontSize="small" />
                                            <Typography>일자: {domainDate}</Typography>
                                        </Stack>
                                    )}
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                {/* Photos */}
                <Card
                    sx={{
                        borderRadius: 2,
                        border: "1px solid",
                        borderColor: "divider",
                        overflow: "hidden",
                        mb: 2,
                    }}
                >
                    <CardHeader
                        title="사진"
                        sx={{
                            py: 1.5,
                            "& .MuiCardHeader-title": { fontSize: 18, fontWeight: 700 },
                            background:
                                "linear-gradient(180deg, rgba(0,0,0,0.02) 0%, rgba(0,0,0,0.01) 100%)",
                        }}
                    />
                    <Divider />
                    <CardContent sx={{ pt: 2 }}>
                        <PhotoTabs stageHashes={stageHashes} />
                    </CardContent>
                </Card>
            </Box>

            {/* 복사 성공 Snackbar */}
            <Snackbar
                open={copied !== null}
                autoHideDuration={1600}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: "100%" }}>
                    {copied === "email" ? "이메일이 복사되었습니다." : "링크가 복사되었습니다."}
                </Alert>
            </Snackbar>
        </MainLayout>
    );
}

export default DetailPage;
