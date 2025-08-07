import { useRef, useState } from "react"
import { Modal, Overlay, Tooltip } from "react-bootstrap"
import { FileItem } from "../api/type"
import "../styles/Modal.css"

interface FileDetailModalProps {
    show: boolean
    onHide: () => void
    file: File | FileItem | null
    isUploaded: boolean
    previewUrl?: string | null
}

const FileDetailModal: React.FC<FileDetailModalProps> = ({ show, onHide, file, isUploaded, previewUrl }) => {
    if (!file) return null

    const pathRef = useRef<HTMLDivElement>(null)
    const [copied, setCopied] = useState(false)

    const isImage = /\.(jpg|jpeg|png|gif|bmp|webp|ico|svg|heic)$/i.test("filename" in file ? file.filename : file.name)
    const isVideo = /\.(mp4|avi|mov|wmv|flv|webm|mkv|m4a)$/i.test("filename" in file ? file.filename : file.name)

    const name = "filename" in file ? file.filename : file.name
    const type = "fileTypes" in file ? file.fileTypes : file.type || "알 수 없음"
    const size = "fileSizeFormatted" in file
        ? file.fileSizeFormatted
        : `${(file.size / 1024 / 1024).toFixed(2)} MB`
    const description = "detail" in file ? file.detail : ""
    const date = "createdAt" in file
        ? new Date(file.createdAt).toLocaleString("ko-KR")
        : undefined

    return (
        <Modal show={show} onHide={onHide} size="lg" centered>
            <Modal.Header closeButton>
                <Modal.Title>📁 파일 상세 정보</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="detail-info-grid">
                    <div className="label">파일명</div>
                    <div className="value">{name}</div>
                    <div className="label">크기</div>
                    <div className="value">{size}</div>
                    <div className="label">유형</div>
                    <div className="value">{type}</div>
                    {description && (
                        <>
                            <div className="label">설명</div>
                            <div className="value">{description}</div>
                        </>
                    )}
                    {date && (
                        <>
                            <div className="label">생성일</div>
                            <div className="value">{date}</div>
                        </>
                    )}
                    {"externalPath" in file && (
                        <>
                            <div className="label">경로</div>
                            <div
                                className="value path"
                                ref={pathRef}
                                onClick={() => {
                                    navigator.clipboard.writeText(file.externalPath)
                                    setCopied(true)
                                    setTimeout(() => setCopied(false), 1500)
                                }}
                                title="클릭하여 복사"
                            >
                                {file.externalPath}
                            </div>
                            <Overlay target={pathRef.current} show={copied} placement="top">
                                {(props) => (
                                    <Tooltip id="copy-tooltip" {...props}>
                                        경로가 복사되었습니다!
                                    </Tooltip>
                                )}
                            </Overlay>
                        </>
                    )}
                </div>

                {(isImage || isVideo) && (
                    <div className="preview-media-wrapper">
                        {isImage ? (
                            <img
                                src={isUploaded ? previewUrl || "" : (file as FileItem).externalPath}
                                alt={name}
                                className="preview-media"
                            />
                        ) : (
                            <video
                                src={isUploaded ? previewUrl || "" : (file as FileItem).externalPath}
                                controls
                                className="preview-media"
                            />
                        )}
                    </div>
                )}
            </Modal.Body>
        </Modal>
    )
}

export default FileDetailModal