import { useEffect, useState } from "react";
import {
    Typography,
    Paper,
    Popper,
    Fade,
} from "@mui/material";
import { fetchPhotos } from "../../api/api";
import type { Photo } from "../../types/model";

interface Props {
    id: number | null;
    pictureKind: string | null;
    anchorEl: HTMLElement | null;
    open: boolean;
}

const PhotoPreview = ({ id, pictureKind, anchorEl, open }: Props) => {
    const [photos, setPhotos] = useState<Photo[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (id && pictureKind && open) {
            setLoading(true);
            fetchPhotos(id, pictureKind)
                .then((res) => {
                    setPhotos(res);
                })
                .catch((err) => {
                    console.error("사진 조회 실패, 빈 배열 반환", err);
                    setPhotos([]);
                })
                .finally(() => {
                    setLoading(false);
                });
        } else {
            setPhotos([]);
        }
    }, [id, pictureKind, open]);

    return (
        <Popper
            open={open}
            anchorEl={anchorEl}
            placement="top"
            transition
            modifiers={[
                {
                    name: "offset",
                    options: {
                        offset: [0, 10],
                    },
                },
            ]}
        >
            {({ TransitionProps }) => (
                <Fade {...TransitionProps} timeout={200}>
                    <Paper
                        elevation={4}
                        sx={{
                            maxWidth: 240,
                            maxHeight: 320,
                            p: 1,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            overflow: "hidden",
                            borderRadius: 2,
                            border: "1px solid rgba(0,0,0,0.1)",
                        }}
                    >
                        {loading ? (
                            <Typography variant="body2" color="textSecondary">
                                불러오는 중...
                            </Typography>
                        ) : photos.length === 0 ? (
                            <Typography variant="body2" color="textSecondary">
                                미리볼 사진이 없습니다.
                            </Typography>
                        ) : (
                            <img
                                src={photos[0].externalPath}
                                alt="preview"
                                style={{
                                    maxWidth: "100%",
                                    maxHeight: "100%",
                                    objectFit: "contain",
                                    borderRadius: 4,
                                }}
                            />
                        )}
                    </Paper>
                </Fade>
            )}
        </Popper>
    );
};

export default PhotoPreview;
