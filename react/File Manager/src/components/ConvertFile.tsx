"use client"

import { useState } from "react"
import { Button, Alert, Spinner } from "react-bootstrap"
import { ConfirmDialog } from "./ConfirmDialog"
import FileDetailModal from "./FileDetailModal"
import { FileItem } from "../api/type"
import { convertFile } from "../api/api"
import "../styles/ConvertFile.css"

interface ConvertFileProps {
    selectedFile?: FileItem | null
    onConvertComplete: () => void
    onClear: () => void
}

const ConvertFile: React.FC<ConvertFileProps> = ({
    selectedFile,
    onConvertComplete,
    onClear,
}) => {
    const conversionMap: Record<string, string[]> = {
        jpg: ["webp"],
        jpeg: ["webp"],
    }

    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
    const [converting, setConverting] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);

    const isImageFile = (file: FileItem) =>
        /\.(jpg|jpeg|png|gif|bmp|webp|ico|svg|heic)$/i.test(file.filename)
    const isVideoFile = (file: FileItem) =>
        /\.(mp4|avi|mov|wmv|flv|webm|mkv|m4a)$/i.test(file.filename)
    const getPreviewUrl = (file: FileItem) => file.externalPath

    // 현재 파일이 변환 대상인지 체크
    const srcExt = selectedFile?.filename.split(".").pop()?.toLowerCase() || ""
    const convertible = !!conversionMap[srcExt]

    const performConvert = async () => {
        setShowConfirm(false)
        if (!selectedFile || !convertible) return

        const targets = conversionMap[srcExt] || []
        const targetExt = targets[0]

        setConverting(true)
        setMessage(null)
        try {
            const result = await convertFile(selectedFile.id)
            if (result.success) {
                setMessage({
                    type: "success",
                    text: `${selectedFile.filename} → ${targetExt.toUpperCase()} 변환 완료`,
                })
                onConvertComplete()
            } else {
                setMessage({ type: "error", text: result.message || "변환에 실패했습니다." })
            }
        } catch {
            setMessage({ type: "error", text: "서버 오류로 변환에 실패했습니다." })
        } finally {
            setConverting(false)
        }
    }

    return (
        <>
            <div className="file-upload-container">
                <div className="upload-section">
                    {!selectedFile ? (
                        <div className="upload-dropzone">
                            변환할 파일을 선택해 주세요.
                        </div>
                    ) : (
                        <>
                            {!convertible ? (
                                <div className="upload-dropzone">
                                    JPG, JPEG 파일만 변환 가능합니다.
                                </div>
                            ) : (
                                <div className="upload-dropzone" title={selectedFile.filename}>
                                    {selectedFile.filename}
                                </div>
                            )}

                            {convertible && (
                                <div className="upload-actions">
                                    <Button
                                        variant="primary"
                                        size="sm"
                                        onClick={performConvert}
                                        disabled={converting}
                                    >
                                        {converting ? (
                                            <>
                                                <Spinner animation="border" size="sm" className="me-1" />
                                                변환 중…
                                            </>
                                        ) : (
                                            "파일 변환"
                                        )}
                                    </Button>
                                    <Button
                                        variant="outline-secondary"
                                        size="sm"
                                        onClick={() => {
                                            if (!converting) {
                                                onClear()
                                            }
                                        }}
                                        disabled={converting}
                                    >
                                        지우기
                                    </Button>
                                </div>
                            )}
                        </>
                    )}

                    {message && (
                        <Alert
                            variant={message.type === "success" ? "success" : "danger"}
                            className="mt-2"
                        >
                            {message.text}
                        </Alert>
                    )}
                </div>

                <div className="preview-section">
                    <div className="preview-header">미리보기</div>
                    <div className="file-preview">
                        {!selectedFile ? (
                            <div className="no-preview">파일을 선택하면 변환 UI가 표시됩니다</div>
                        ) : isImageFile(selectedFile) ? (
                            <>
                                <div className="preview-expand-wrapper">
                                    <Button
                                        variant="link"
                                        className="expand-icon-button"
                                        size="sm"
                                        onClick={() => setShowDetailModal(true)}
                                        title="상세 보기"
                                    >
                                        <i className="bi bi-box-arrow-up-right" />
                                    </Button>
                                </div>
                                <img
                                    src={getPreviewUrl(selectedFile)}
                                    alt={selectedFile.filename}
                                    className="preview-image"
                                    onClick={() => setShowDetailModal(true)}
                                />
                            </>
                        ) : isVideoFile(selectedFile) ? (
                            <>
                                <div className="preview-expand-wrapper">
                                    <Button
                                        variant="outline-secondary"
                                        size="sm"
                                        className="expand-button"
                                        onClick={() => setShowDetailModal(true)}
                                        title="상세 보기"
                                    >
                                        <i className="bi bi-box-arrow-up-right" />
                                    </Button>
                                </div>
                                <video
                                    src={getPreviewUrl(selectedFile)}
                                    controls
                                    className="preview-video"
                                >
                                    브라우저가 비디오 태그를 지원하지 않습니다.
                                </video>
                            </>
                        ) : (
                            <div className="no-preview">미리보기를 지원하지 않는 형식입니다</div>
                        )}
                    </div>


                </div>
            </div>

            {showConfirm && (
                <ConfirmDialog
                    title="파일 변환 확인"
                    info={{
                        작업: "변환",
                        파일명: selectedFile!.filename,
                    }}
                    onCancel={() => setShowConfirm(false)}
                    onConfirm={performConvert}
                />
            )}

            <FileDetailModal
                show={showDetailModal}
                onHide={() => setShowDetailModal(false)}
                file={selectedFile ?? null}
                isUploaded={false}
                previewUrl={selectedFile ? selectedFile.externalPath : null}
            />
        </>
    )
}

export default ConvertFile