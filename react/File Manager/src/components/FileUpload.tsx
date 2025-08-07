"use client"

import React, { useState, useEffect, useRef } from "react"
import { Button, ProgressBar, Alert, Form, Tooltip, Overlay } from "react-bootstrap"
import { ConfirmDialog } from "./ConfirmDialog"
import FileDetailModal from "./FileDetailModal"
import { FileItem, Folder } from "../api/type"
import { uploadFile, fetchFolders } from "../api/api"
import "../styles/FileUpload.css"

interface FileUploadProps {
    selectedFile?: FileItem | null
    onUploadComplete: () => void
}

const FileUpload: React.FC<FileUploadProps> = ({
    selectedFile,
    onUploadComplete,
}) => {
    // 폴더 목록 및 선택
    const [folders, setFolders] = useState<Folder[]>([]);
    const [folderLoading, setFolderLoading] = useState(false);
    const [selectedFolderId, setSelectedFolderId] = useState<string>("");
    const [selectedCategory, setSelectedCategory] = useState<Folder["category"] | "">("none");
    const [copied, setCopied] = useState(false);
    const previewRef = useRef<HTMLSpanElement>(null);
    const [showDetailModal, setShowDetailModal] = useState(false);

    // 모달 확인용 state
    const [showConfirm, setShowConfirm] = useState(false)
    const [confirmInfo, setConfirmInfo] = useState<{
        category: Folder["category"] | ""
        folderName: string
        fileName: string
        description: string
    }>({ category: "", folderName: "", fileName: "", description: "" })

    // 업로드 파일, 설명, 진행 상태 등
    const [dragOver, setDragOver] = useState(false)
    const [selectedUploadFile, setSelectedUploadFile] = useState<File | null>(null)
    const [description, setDescription] = useState("")
    const [uploading, setUploading] = useState(false)
    const [uploadProgress, setUploadProgress] = useState(0)
    const [uploadMessage, setUploadMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
    const [warningMessage, setWarningMessage] = useState<{ type: "danger"; text: string } | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)

    // 카테고리 변경 시 폴더 목록 로딩
    useEffect(() => {
        setFolders([])
        setSelectedFolderId("")
        if (!selectedCategory) {
            setFolderLoading(false)
            return
        }
        setFolderLoading(true)
        fetchFolders(selectedCategory)
            .then(setFolders)
            .catch((err) => console.error("폴더 로딩 오류:", err))
            .finally(() => setFolderLoading(false))
    }, [selectedCategory])

    // 미리보기 URL 해제
    useEffect(() => {
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl)
            }
        }
    }, [previewUrl])

    // 파일 타입별 최대 크기 (바이트)
    const MAX_FILE_SIZES: Record<string, number> = {
        image: 10 * 1024 * 1024,
        video: 15 * 1024 * 1024,
        zip: 5 * 1024 * 1024,
        pdf: 5 * 1024 * 1024,
    }

    // 허용 확장자 목록
    const getAllowedExtensions = (category: string): string[] => {
        switch (category.toLowerCase()) {
            case "image":
                return ["jpg", "jpeg", "png", "ico", "svg", "gif", "webp"]
            case "video":
                return ["mp4", "m4a", "avi", "mov", "wmv"]
            case "zip":
                return ["zip"]
            case "pdf":
                return ["pdf"]
            default:
                return []
        }
    }

    const isFileExtensionAllowed = (fileName: string, category: string): boolean => {
        const exts = getAllowedExtensions(category)
        if (exts.length === 0) return true
        const ext = fileName.split(".").pop()?.toLowerCase() || ""
        return exts.includes(ext)
    }

    const getExtensionValidationMessage = (category: string): string => {
        const exts = getAllowedExtensions(category)
        if (exts.length === 0) return ""
        return `${category.toUpperCase()} 카테고리에는 ${exts.join(", ")} 파일만 허용됩니다.`
    }

    const getSizeExceededMessage = (category: string): string => {
        const mb = MAX_FILE_SIZES[category.toLowerCase()] / (1024 * 1024)
        return `${category.toUpperCase()} 카테고리의 최대 업로드 용량은 ${mb}MB 입니다.`
    }

    const isFileSizeAllowed = (file: File, category: string): boolean => {
        const limit = MAX_FILE_SIZES[category.toLowerCase()]
        return !limit || file.size <= limit
    }

    // 드래그 앤 드롭 이벤트
    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        setDragOver(true)
    }
    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault()
        setDragOver(false)
    }
    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        setDragOver(false)
        const files = Array.from(e.dataTransfer.files)
        if (!files.length || !selectedCategory) return
        const file = files[0]
        if (!isFileExtensionAllowed(file.name, selectedCategory)) {
            setWarningMessage({ type: "danger", text: `잘못된 파일 형식입니다. ${getExtensionValidationMessage(selectedCategory)}` })
            return
        }
        if (!isFileSizeAllowed(file, selectedCategory)) {
            setWarningMessage({ type: "danger", text: getSizeExceededMessage(selectedCategory) })
            return
        }
        if (previewUrl) URL.revokeObjectURL(previewUrl)
        setPreviewUrl(URL.createObjectURL(file))
        setSelectedUploadFile(file)
        setWarningMessage(null)
    }

    // 파일 선택 창
    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (!files || !files.length || !selectedCategory) return
        const file = files[0]
        if (!isFileExtensionAllowed(file.name, selectedCategory)) {
            setWarningMessage({ type: "danger", text: `잘못된 파일 형식입니다. ${getExtensionValidationMessage(selectedCategory)}` })
            e.target.value = ""
            return
        }
        if (!isFileSizeAllowed(file, selectedCategory)) {
            setWarningMessage({ type: "danger", text: getSizeExceededMessage(selectedCategory) })
            e.target.value = ""
            return
        }
        if (previewUrl) URL.revokeObjectURL(previewUrl)
        setPreviewUrl(URL.createObjectURL(file))
        setSelectedUploadFile(file)
        setWarningMessage(null)
    }

    // 업로드 버튼 클릭 → 모달 표시
    const handleUpload = () => {
        setWarningMessage(null)
        setUploadMessage(null)

        if (!selectedCategory) {
            setWarningMessage({ type: "danger", text: "파일 타입을 선택해주세요." })
            return
        }
        if (!selectedFolderId) {
            setWarningMessage({ type: "danger", text: "업로드할 폴더를 선택해주세요." })
            return
        }
        if (!selectedUploadFile) {
            setWarningMessage({ type: "danger", text: "업로드할 파일을 선택해주세요." })
            return
        }
        if (!description.trim()) {
            setWarningMessage({ type: "danger", text: "설명을 입력해주세요." })
            return
        }

        const folderName = folders.find((f) => f.id === selectedFolderId)?.name ?? ""
        setConfirmInfo({
            category: selectedCategory,
            folderName,
            fileName: selectedUploadFile.name,
            description,
        })
        setShowConfirm(true)
    }

    // 모달 확인 → 실제 업로드
    const confirmUpload = async () => {
        setShowConfirm(false)
        setUploading(true)
        setUploadProgress(0)
        try {
            const progressInterval = setInterval(() => {
                setUploadProgress((prev) => (prev >= 90 ? (clearInterval(progressInterval), 90) : prev + 10))
            }, 200)

            const result = await uploadFile(
                confirmInfo.category as Folder["category"],
                selectedUploadFile!,
                confirmInfo.folderName,
                description
            )
            clearInterval(progressInterval)
            setUploadProgress(100)

            if (result.success) {
                setUploadMessage({ type: "success", text: "파일이 성공적으로 업로드되었습니다!" })
                setSelectedUploadFile(null)
                setDescription("")
                if (fileInputRef.current) fileInputRef.current.value = ""
                onUploadComplete()
            } else {
                setUploadMessage({ type: "error", text: result.message || "업로드에 실패했습니다." })
            }
        } catch (error) {
            setUploadMessage({ type: "error", text: "업로드 오류가 발생했습니다." })
        } finally {
            setUploading(false)
            setTimeout(() => {
                setUploadProgress(0)
                setUploadMessage(null)
                setWarningMessage(null)
            }, 3000)
        }
    }

    // 유틸 함수들
    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return "0 바이트"
        const k = 1024
        const sizes = ["바이트", "KB", "MB", "GB"]
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`
    }

    const formatDate = (dateString: string): string =>
        new Date(dateString).toLocaleDateString("ko-KR", {
            year: "numeric", month: "short", day: "numeric",
            hour: "2-digit", minute: "2-digit",
        })

    const isImageFile = (file: FileItem | File): boolean =>
        /\.(jpg|jpeg|png|gif|bmp|webp|ico|svg|heic)$/i.test("filename" in file ? file.filename : file.name)

    const isVideoFile = (file: FileItem | File): boolean =>
        /\.(mp4|avi|mov|wmv|flv|webm|mkv|m4a)$/i.test("filename" in file ? file.filename : file.name)

    const getPreviewUrl = (file: FileItem): string => file.externalPath

    const getAcceptAttribute = (category: string): string => {
        const exts = getAllowedExtensions(category)
        return exts.length === 0 ? "*/*" : exts.map((e) => `.${e}`).join(",")
    }

    const isTextTruncated = (text: string, maxLength = 30): boolean =>
        text.length > maxLength

    return (
        <div className="file-upload-container">
            <div className="upload-section">
                {/* 파일 타입 & 폴더 선택 */}
                <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
                    <Form.Select
                        size="sm"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value as Folder["category"])}
                        aria-label="파일 타입 선택"
                    >
                        <option value="">파일 타입 선택</option>
                        <option value="IMAGE">IMAGE</option>
                        <option value="VIDEO">VIDEO</option>
                        <option value="ZIP">ZIP</option>
                        <option value="PDF">PDF</option>
                    </Form.Select>
                    <Form.Select
                        size="sm"
                        value={selectedFolderId}
                        onChange={(e) => setSelectedFolderId(e.target.value)}
                        aria-label="업로드 폴더 선택"
                        disabled={!selectedCategory || folderLoading}
                    >
                        <option value="">
                            {folderLoading ? "폴더 로딩 중..." : "폴더 선택"}
                        </option>
                        {folders.map((f) => (
                            <option key={f.id} value={f.id}>{f.name}</option>
                        ))}
                    </Form.Select>
                </div>

                {/* 드롭존 */}
                <div
                    className={`upload-dropzone ${dragOver ? "drag-over" : ""}`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={(e) => {
                        if (!(selectedCategory && selectedFolderId)) {
                            e.preventDefault();
                            return;
                        }
                        fileInputRef.current?.click();
                    }}
                >
                    {(!selectedCategory || !selectedFolderId) ? (
                        <div className="no-category-text">
                            파일 타입과 폴더를 먼저 선택하세요.
                        </div>
                    ) : (
                        <>
                            <div className="upload-icon">📁</div>
                            <div className="upload-text">
                                {selectedUploadFile
                                    ? selectedUploadFile.name
                                    : "파일을 여기에 드롭하거나 클릭하여 찾아보기"}
                            </div>
                            <div className="upload-subtext">
                                {selectedUploadFile
                                    ? `${formatFileSize(selectedUploadFile.size)} • ${selectedUploadFile.type || "알 수 없는 형식"}`
                                    : getAllowedExtensions(selectedCategory).length > 0
                                        ? `지원 형식: ${getAllowedExtensions(selectedCategory).join(", ")} 파일`
                                        : "모든 파일 형식 지원"}
                            </div>
                        </>
                    )}
                    <input
                        ref={fileInputRef}
                        type="file"
                        className="file-input"
                        onChange={handleFileSelect}
                        accept={selectedCategory ? getAcceptAttribute(selectedCategory) : ""}
                        disabled={!selectedCategory}
                    />
                </div>


                {warningMessage && (
                    <Alert variant="danger" className="mt-2">
                        {warningMessage.text}
                    </Alert>
                )}
                {uploadMessage && (
                    <Alert variant={uploadMessage.type === "success" ? "success" : "danger"} className="mt-2">
                        {uploadMessage.text}
                    </Alert>
                )}

                {/* 설명 & 업로드/지우기 */}
                {selectedUploadFile && (
                    <>
                        <Form.Group controlId="fileDescription" className="mt-3">
                            <Form.Control
                                as="textarea"
                                rows={2}
                                placeholder="파일 설명을 입력하세요"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="description-input"
                            />
                        </Form.Group>
                        <div className="upload-actions">
                            <Button variant="primary" size="sm" onClick={handleUpload} disabled={uploading}>
                                {uploading ? "업로드 중..." : "파일 업로드"}
                            </Button>
                            <Button
                                variant="outline-secondary"
                                size="sm"
                                onClick={() => {
                                    setSelectedUploadFile(null)
                                    setDescription("")
                                    if (fileInputRef.current) fileInputRef.current.value = ""
                                }}
                                disabled={uploading}
                            >
                                지우기
                            </Button>
                        </div>
                    </>
                )}

                {/* 진행률 & 메시지 */}
                {uploading && (
                    <div className="upload-progress">
                        <ProgressBar now={uploadProgress} label={`${uploadProgress}%`} />
                    </div>
                )}
            </div>

            {/* 미리보기 */}
            <div className="preview-section">
                <div className="preview-header">미리보기</div>
                {selectedUploadFile ? (
                    <div className="file-preview">
                        <div className="preview-expand-wrapper">
                            <Button
                                variant="link"
                                className="expand-icon-button"
                                onClick={() => setShowDetailModal(true)}
                                title="상세 보기"
                            >
                                <i className="bi bi-box-arrow-up-right" />
                            </Button>
                        </div>
                        <div className="preview-info">
                            <div className="preview-item">
                                <span className="preview-label">이름:</span>
                                <span
                                    className={`preview-value ${isTextTruncated(selectedUploadFile.name) ? "truncated" : ""}`}
                                    title={isTextTruncated(selectedUploadFile.name) ? selectedUploadFile.name : undefined}
                                >
                                    {selectedUploadFile.name}
                                </span>
                            </div>
                            <div className="preview-item">
                                <span className="preview-label">크기:</span>
                                <span className="preview-value">{formatFileSize(selectedUploadFile.size)}</span>
                            </div>
                            <div className="preview-item">
                                <span className="preview-label">유형:</span>
                                <span className="preview-value">{selectedUploadFile.type || "알 수 없음"}</span>
                            </div>
                            {description && (
                                <div className="preview-item">
                                    <span className="preview-label">설명:</span>
                                    <span
                                        className={`preview-value ${isTextTruncated(description) ? "truncated" : ""}`}
                                        title={isTextTruncated(description) ? description : undefined}
                                    >
                                        {description}
                                    </span>
                                </div>
                            )}
                        </div>
                        {isImageFile(selectedUploadFile) && previewUrl && (
                            <img
                                src={previewUrl}
                                alt={selectedUploadFile.name}
                                className="preview-image"
                                onClick={() => setShowDetailModal(true)}
                            />
                        )}
                        {isVideoFile(selectedUploadFile) && previewUrl && (
                            <video
                                src={previewUrl}
                                controls
                                muted
                                className="preview-video"
                                preload="metadata"
                                onClick={() => setShowDetailModal(true)}
                            />
                        )}
                    </div>
                ) : selectedFile ? (
                    <div className="file-preview">
                        <div className="preview-expand-wrapper">
                            <Button
                                variant="link"
                                className="expand-icon-button"
                                onClick={() => setShowDetailModal(true)}
                                title="상세 보기"
                            >
                                <i className="bi bi-box-arrow-up-right" />
                            </Button>
                        </div>
                        <div className="preview-info">
                            <div className="preview-item">
                                <span className="preview-label">이름:</span>
                                <span
                                    className={`preview-value ${isTextTruncated(selectedFile.filename) ? "truncated" : ""}`}
                                    title={isTextTruncated(selectedFile.filename) ? selectedFile.filename : undefined}
                                >
                                    {selectedFile.filename}
                                </span>
                            </div>
                            <div className="preview-item">
                                <span className="preview-label">크기:</span>
                                <span className="preview-value">{selectedFile.fileSizeFormatted}</span>
                            </div>
                            <div className="preview-item">
                                <span className="preview-label">유형:</span>
                                <span className="preview-value">{selectedFile.fileTypes}</span>
                            </div>
                            <div className="preview-item">
                                <span className="preview-label">수정일:</span>
                                <span className="preview-value">{formatDate(selectedFile.createdAt)}</span>
                            </div>
                            <div className="preview-item">
                                <span className="preview-label">설명:</span>
                                <span
                                    className={`preview-value ${isTextTruncated(selectedFile.detail) ? "truncated" : ""}`}
                                    title={isTextTruncated(selectedFile.detail) ? selectedFile.detail : undefined}
                                >
                                    {selectedFile.detail}
                                </span>
                            </div>
                            {/* 경로 클릭 시 복사 */}
                            <div className="preview-item">
                                <span className="preview-label">경로:</span>
                                <span
                                    className="preview-value copyable"
                                    ref={previewRef}
                                    onClick={() => {
                                        navigator.clipboard.writeText(selectedFile.externalPath);
                                        setCopied(true);
                                        setTimeout(() => setCopied(false), 2000);
                                    }}
                                    title="클릭하여 경로 복사"
                                >
                                    {selectedFile.externalPath}
                                </span>
                                <Overlay target={previewRef.current} show={copied} placement="top">
                                    {props => (
                                        <Tooltip id="copy-tooltip" {...props}>
                                            경로가 복사되었습니다!
                                        </Tooltip>
                                    )}
                                </Overlay>
                            </div>
                        </div>
                        {isImageFile(selectedFile) && (
                            <img
                                src={getPreviewUrl(selectedFile) || "/placeholder.svg"}
                                alt={selectedFile.filename}
                                className="preview-image"
                                onClick={() => setShowDetailModal(true)}
                            />
                        )}
                        {isVideoFile(selectedFile) && (
                            <video
                                src={getPreviewUrl(selectedFile) || ""}
                                controls
                                className="preview-video"
                                style={{ maxWidth: "100%", maxHeight: "200px", marginTop: "1rem" }}
                                onClick={() => setShowDetailModal(true)}
                            >
                                브라우저가 비디오 태그를 지원하지 않습니다.
                            </video>
                        )}
                    </div>
                ) : (
                    <div className="no-preview">파일을 선택하면 세부 정보를 볼 수 있습니다</div>
                )}
            </div>

            {/* 확인용 Modal */}
            {showConfirm && (
                <ConfirmDialog
                    title="업로드 확인"
                    info={{
                        "파일 타입": confirmInfo.category,
                        "폴더 경로": confirmInfo.folderName,
                        "파일명": confirmInfo.fileName,
                        "설명": confirmInfo.description,
                    }}
                    onCancel={() => setShowConfirm(false)}
                    onConfirm={confirmUpload}
                />
            )}

            <FileDetailModal
                show={showDetailModal}
                onHide={() => setShowDetailModal(false)}
                file={selectedUploadFile ?? selectedFile ?? null}
                isUploaded={!!selectedUploadFile}
                previewUrl={previewUrl}
            />
        </div>
    )
}

export default FileUpload