import { useState } from "react";
import { Box, IconButton, TextareaAutosize, Tooltip } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import { saveNoteOrDiscount } from "../../api/api";

interface NoteCellProps {
    modelId: number;
    type: "note" | "discount";
    initialValue: string;
}

const NoteCell: React.FC<NoteCellProps> = ({ modelId, type, initialValue }) => {
    const [value, setValue] = useState(initialValue);
    const [saving, setSaving] = useState(false);

    const handleSave = async () => {
        if (saving) return;
        setSaving(true);
        try {
            await saveNoteOrDiscount(modelId, type, value);
            alert("저장되었습니다.");
        } catch (err) {
            alert("저장 실패");
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    return (
        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
            <TextareaAutosize
                minRows={2}
                maxRows={4}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                style={{
                    width: "100%",
                    minWidth: "160px",
                    resize: "none",
                    padding: "6px 8px",
                    fontSize: "0.9rem",
                    borderRadius: 4,
                    border: "1px solid #ccc",
                }}
                placeholder={type === "note" ? "특이사항 입력" : "할인 내용 입력"}
            />
            <Tooltip title="저장">
                <IconButton
                    size="small"
                    color="primary"
                    onClick={handleSave}
                    disabled={saving}
                    sx={{ mt: "4px" }}
                >
                    <SaveIcon fontSize="small" />
                </IconButton>
            </Tooltip>
        </Box>
    );
};

export default NoteCell;
