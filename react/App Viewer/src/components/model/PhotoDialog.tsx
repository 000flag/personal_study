import { useState } from "react";
import { Dialog, DialogContent, Box } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Photo } from "../../types/model";
import "swiper/css"; // Swiper core CSS
import "swiper/css/navigation";
import "swiper/css/pagination";
import "../../styles/PhotoDialog.css";

const PhotoDialog = ({
    open,
    onClose,
    photos,
}: {
    open: boolean;
    onClose: () => void;
    photos: Photo[];
}) => {
    const [activeIndex, setActiveIndex] = useState(0);

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <DialogContent>
                <Swiper
                    spaceBetween={20}
                    slidesPerView={1}
                    onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
                    initialSlide={activeIndex}
                    style={{ height: "400px" }}
                >
                    {photos.map((photo, idx) => (
                        <SwiperSlide key={idx}>
                            <Box
                                display="flex"
                                justifyContent="center"
                                alignItems="center"
                                height="100%"
                            >
                                <img
                                    src={photo.externalPath}
                                    alt={photo.filename}
                                    style={{ maxHeight: "100%", maxWidth: "100%" }}
                                />
                            </Box>
                        </SwiperSlide>
                    ))}
                </Swiper>

                <Box display="flex" justifyContent="center" mt={2} flexWrap="wrap">
                    {photos.map((photo, idx) => (
                        <img
                            key={idx}
                            src={photo.thumbnailUrl || photo.externalPath}
                            alt={photo.filename}
                            onClick={() => setActiveIndex(idx)}
                            style={{
                                width: 60,
                                height: 60,
                                objectFit: "cover",
                                margin: "4px",
                                border: idx === activeIndex ? "2px solid black" : "1px solid #ccc",
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
