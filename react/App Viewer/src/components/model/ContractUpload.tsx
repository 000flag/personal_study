import { useRef, useState } from "react";
import {
    Box,
    Button,
    Modal,
    Typography,
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { uploadContractPdf } from "../../api/api";

interface ContractUploadProps {
    modelId: number;
    modelName: string;
    open: boolean;
    onClose: () => void;
}

const ContractUpload: React.FC<ContractUploadProps> = ({
    modelId,
    modelName,
    open,
    onClose,
}) => {
    const [file, setFile] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files?.[0];
        if (!selected) return;

        if (selected.type !== "application/pdf") {
            setError("PDF 파일만 업로드 가능합니다.");
            setFile(null);
        } else if (selected.size > 10 * 1024 * 1024) {
            setError("파일 크기는 10MB 이하만 가능합니다.");
            setFile(null);
        } else {
            setError(null);
            setFile(selected);
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        const confirmed = window.confirm(
            `"${modelName}" 계약서를 저장하시겠습니까?`
        );
        if (!confirmed) return;

        try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("modelId", modelId.toString());

            await uploadContractPdf(modelId, file);

            alert("업로드가 완료되었습니다.");
            setFile(null);
            onClose();
        } catch (err) {
            alert("업로드 중 오류가 발생했습니다.");
            console.error(err);
        }
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    bgcolor: "background.paper",
                    boxShadow: 24,
                    borderRadius: 2,
                    p: 3,
                    width: 300,
                }}
            >
                <Typography variant="subtitle1" gutterBottom>
                    PDF 파일 (10MB 이하)
                </Typography>

                <Box
                    sx={{
                        border: "1px dashed #ccc",
                        borderRadius: 1,
                        padding: 2,
                        textAlign: "center",
                        cursor: "pointer",
                        mb: 2,
                    }}
                    onClick={() => fileInputRef.current?.click()}
                >
                    <input
                        type="file"
                        accept=".pdf"
                        ref={fileInputRef}
                        style={{ display: "none" }}
                        onChange={handleFileChange}
                    />
                    <UploadFileIcon sx={{ fontSize: 40, color: "#999" }} />
                    <Typography variant="body2" sx={{ mt: 1 }}>
                        {file ? file.name : "선택된 파일 없음"}
                    </Typography>
                </Box>

                {error && (
                    <Typography color="error" variant="body2" sx={{ mb: 1 }}>
                        {error}
                    </Typography>
                )}

                <Button
                    variant="contained"
                    fullWidth
                    disabled={!file}
                    onClick={handleUpload}
                >
                    업로드
                </Button>
            </Box>
        </Modal>
    );
};

export default ContractUpload;
