import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import {
    Box,
    Button,
    Grid,
    InputLabel,
    NativeSelect,
    Snackbar,
    Tab,
    Tabs,
    Typography,
    FormControl,
    Tooltip,
    IconButton,
} from "@mui/material";
import { ContentCopy, DescriptionOutlined, LocalHospitalOutlined } from "@mui/icons-material";
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import MonitorWeightOutlinedIcon from '@mui/icons-material/MonitorWeightOutlined';
import { fetchModelDetail, fetchPhotos, saveNoteOrDiscount } from "../api/api";
import PhotoPreview from "../components/model/PhotoPreview";
import MainLayout from "../components/layout/MainLayout";
import type { ModelDetail, Photo } from "../types/model";

const tabLabels = [
    "지원사진", "수술전", "수술직후", "1주차", "2주차", "3주차",
    "1개월", "2개월", "3개월", "6개월",
];

const ModelDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const [model, setModel] = useState<ModelDetail | null>(null);
    const [photos, setPhotos] = useState<Photo[]>([]);
    const [tabIndex, setTabIndex] = useState(0);
    const [status, setStatus] = useState("");
    const [copied, setCopied] = useState(false);

    const fetchDetail = useCallback(async () => {
        if (!id) return;
        const data = await fetchModelDetail(id);
        setModel(data);
        setStatus(data?.status ?? "");
        const photoData = await fetchPhotos(id);
        setPhotos(photoData);
    }, [id]);

    useEffect(() => {
        fetchDetail();
    }, [fetchDetail]);

    const handleCopy = () => {
        if (!model?.email) return;
        navigator.clipboard.writeText(model.email);
        setCopied(true);
    };

    const handleCloseSnackbar = () => {
        setCopied(false);
    };

    const handleSave = async () => {
        if (!model) return;
        await saveNoteOrDiscount(model.id, {
            specialNote: model.note,
            discountMemo: model.discount,
        });
        alert("저장되었습니다.");
    };

    if (!model) return null;

    return (
        <MainLayout>
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: 1,
                }}
            >
                {/* 좌측: 모델명 */}
                <Typography
                    variant="h5"
                    gutterBottom
                    sx={{
                        mt: 2,
                        pb: 1,
                        flexGrow: 1,
                        borderBottom: "1px solid #e0e0e0",
                    }}
                >
                    {model.name} 모델 상세정보
                </Typography>

                {/* 우측: 상태 변경 + 저장 버튼 */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <FormControl variant="standard" sx={{ minWidth: 120 }}>
                        <InputLabel htmlFor="status-native">신청상태</InputLabel>
                        <NativeSelect
                            inputProps={{ name: "status", id: "status-native" }}
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                        >
                            {["신청", "검토", "승인", "완료"].map((s) => (
                                <option key={s} value={s}>
                                    {s}
                                </option>
                            ))}
                        </NativeSelect>
                    </FormControl>

                    <Button variant="contained" onClick={handleSave}>
                        저장
                    </Button>
                </Box>
            </Box>

            {/* 개인정보 + 신체정보 */}
            <Grid container spacing={2} alignItems="stretch" sx={{ mb: 2 }}>
                <Grid size={6}>
                    <Box sx={{ height: "100%", border: "1px solid #ddd", borderRadius: 2, p: 2 }}>
                        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                            <AccountCircleOutlinedIcon sx={{ fontSize: 24, mr: 1, verticalAlign: "middle" }} />
                            <Typography variant="h6" sx={{ lineHeight: 1.4 }}>
                                개인정보
                            </Typography>
                        </Box>
                        <Typography sx={{ mb: 1.2 }}><strong>이름</strong>: {model.name}</Typography>
                        <Typography sx={{ mb: 1.2 }}><strong>고객번호</strong>: {model.id}</Typography>
                        <Typography sx={{ mb: 1.2 }}>
                            <strong>이메일</strong>: {model.email}
                            <Tooltip title="복사">
                                <IconButton size="small" onClick={handleCopy}><ContentCopy fontSize="small" /></IconButton>
                            </Tooltip>
                        </Typography>
                        <Typography sx={{ mb: 1.2 }}><strong>전화번호</strong>: {model.telNo}</Typography>
                        <Typography sx={{ mb: 1.2 }}><strong>생년월일</strong>: {model.birth}</Typography>
                        <Typography sx={{ mb: 1.2 }}><strong>나이</strong>: {model.age} 세</Typography>
                    </Box>
                </Grid>

                <Grid size={6}>
                    <Box sx={{ height: "100%", border: "1px solid #ddd", borderRadius: 2, p: 2 }}>
                        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                            <MonitorWeightOutlinedIcon sx={{ fontSize: 24, mr: 1, verticalAlign: "middle" }} />
                            <Typography variant="h6" sx={{ lineHeight: 1.4 }}>
                                신체정보
                            </Typography>
                        </Box>
                        <Typography sx={{ mb: 1.2 }}>키: {model.height} cm</Typography>
                        <Typography sx={{ mb: 1.2 }}>몸무게: {model.weight} kg</Typography>
                        <Typography sx={{ mb: 1.2 }}>BMI: {model.bmi}</Typography>
                        <Typography sx={{ mb: 1.2 }}>
                            <strong>진행단계</strong>:&nbsp;
                            <Box
                                component="span"
                                sx={{
                                    px: 1.2,
                                    py: 0.3,
                                    bgcolor: "#2e6fd1ff",
                                    color: "#fff",
                                    borderRadius: 1,
                                    fontSize: "0.85rem",
                                    fontWeight: 500,
                                    display: "inline-block",
                                }}
                            >
                                {model.progressStage}
                            </Box>
                        </Typography>
                    </Box>
                </Grid>
            </Grid>

            {/* 수술정보 + 특이사항 */}
            <Grid container spacing={2} alignItems="stretch" sx={{ mb: 2 }}>
                <Grid size={6}>
                    <Box sx={{ height: "100%", border: "1px solid #ddd", borderRadius: 2, p: 2 }}>
                        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                            <LocalHospitalOutlined sx={{ fontSize: 24, mr: 1, verticalAlign: "middle" }} />
                            <Typography variant="h6" sx={{ lineHeight: 1.4 }}>
                                수술정보
                            </Typography>
                        </Box>
                        <Typography sx={{ mb: 1.2 }}>수술종류: {model.cstype}</Typography>
                        <Typography sx={{ mb: 1.2 }}>수술일: {model.operDate}</Typography>
                        <Typography sx={{ mb: 1.2 }}>경험: {model.experience || "없음"}</Typography>
                        <Typography sx={{ mb: 1.2 }}>사진수: {model.photoCount}</Typography>
                    </Box>
                </Grid>

                <Grid size={6}>
                    <Box sx={{ height: "100%", border: "1px solid #ddd", borderRadius: 2, p: 2 }}>
                        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                            <DescriptionOutlined sx={{ fontSize: 24, mr: 1, verticalAlign: "middle" }} />
                            <Typography variant="h6" sx={{ lineHeight: 1.4 }}>
                                특이사항 / 할인 / 계약서
                            </Typography>
                        </Box>
                        <Typography sx={{ mb: 1.2 }}>특이사항: {model.note || ""}</Typography>
                        <Typography sx={{ mb: 1.2 }}>할인 메모: {model.discount || ""}</Typography>
                        <Typography sx={{ mb: 1.2 }}>계약서: {model.contractFilePath}</Typography>
                    </Box>
                </Grid>
            </Grid>

            {/* 사진 영역 */}
            <Box sx={{ border: "1px solid #ddd", borderRadius: 2, p: 2 }}>
                <Tabs
                    value={tabIndex}
                    onChange={(_, newIndex) => setTabIndex(newIndex)}
                    variant="scrollable"
                    scrollButtons="auto"
                >
                    {tabLabels.map((label, index) => (
                        <Tab key={index} label={label} />
                    ))}
                </Tabs>

                <Box sx={{ mt: 2 }}>
                    <PhotoPreview
                        photos={photos}
                        category={tabLabels[tabIndex]}
                    />
                </Box>
            </Box>

            {/* 복사 완료 스낵바 */}
            <Snackbar
                open={copied}
                autoHideDuration={1500}
                onClose={handleCloseSnackbar}
                message="이메일이 복사되었습니다."
            />
        </MainLayout>
    );
};

export default ModelDetailPage;
