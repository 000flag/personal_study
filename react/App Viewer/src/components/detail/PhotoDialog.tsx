import { useEffect, useRef, useState } from "react";
import { Dialog, DialogContent, Box } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import { Navigation, Pagination, Keyboard } from "swiper/modules";

import type { PhotoFile } from "../../types/common";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "../../styles/PhotoDialog.css";

type Props = {
    open: boolean;
    onClose: () => void;
    photos: PhotoFile[];
    /** 최초로 포커싱할 이미지 인덱스 */
    initialIndex?: number;
};

const PhotoDialog = ({ open, onClose, photos, initialIndex = 0 }: Props) => {
    const [activeIndex, setActiveIndex] = useState<number>(initialIndex);
    const swiperRef = useRef<SwiperType | null>(null);

    // 다이얼로그가 열릴 때/초기 인덱스가 바뀔 때, 슬라이드 위치 동기화
    useEffect(() => {
        if (!open) return;
        const boundedIndex = Math.min(Math.max(initialIndex, 0), Math.max(photos.length - 1, 0));
        setActiveIndex(boundedIndex);
        const swiper = swiperRef.current;
        if (swiper && typeof swiper.slideTo === "function") {
            swiper.slideTo(boundedIndex, 0);
        }
    }, [open, initialIndex, photos.length]);

    // 썸네일 클릭 시 메인 슬라이드 이동
    useEffect(() => {
        const swiper = swiperRef.current;
        if (swiper && typeof swiper.slideTo === "function") {
            swiper.slideTo(activeIndex);
        }
    }, [activeIndex]);

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth={false}
            PaperProps={{ sx: { width: "90vw", height: "80vh", maxWidth: 1600 } }}
        >
            <DialogContent sx={{ p: 2, height: "100%", display: "flex", flexDirection: "column", gap: 2 }}>
                {/* 메인 뷰어 */}
                <Box sx={{ flex: 1, minHeight: 0 }}>
                    <Swiper
                        modules={[Navigation, Pagination, Keyboard]}
                        onSwiper={(swiper) => {
                            swiperRef.current = swiper;
                        }}
                        onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
                        initialSlide={activeIndex}
                        spaceBetween={20}
                        slidesPerView={1}
                        navigation
                        pagination={{ clickable: true }}
                        keyboard={{ enabled: true }}
                        style={{ height: "100%" }}
                    >
                        {photos.map((photo, idx) => (
                            <SwiperSlide key={`${photo.externalPath ?? photo.filename}-${idx}`}>
                                <Box display="flex" justifyContent="center" alignItems="center" sx={{ height: "100%", width: "100%" }}>
                                    <img
                                        src={photo.externalPath}
                                        alt={photo.filename}
                                        style={{ maxHeight: "100%", maxWidth: "100%", objectFit: "contain" }}
                                    />
                                </Box>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </Box>

                {/* 썸네일 바 */}
                <Box display="flex" justifyContent="center" alignItems="center" flexWrap="wrap" sx={{ gap: 1, pb: 1 }}>
                    {photos.map((photo, idx) => (
                        <img
                            key={`${photo.externalPath ?? photo.filename}-thumb-${idx}`}
                            src={photo.externalPath}
                            alt={photo.filename}
                            onClick={() => setActiveIndex(idx)}
                            style={{
                                width: 72,
                                height: 72,
                                objectFit: "cover",
                                borderRadius: 6,
                                border: idx === activeIndex ? "2px solid #000" : "1px solid #ccc",
                                cursor: "pointer",
                            }}
                        />
                    ))}
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default PhotoDialog;
