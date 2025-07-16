"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Button, ProgressBar, Alert } from "react-bootstrap"
import { type FileItem, uploadFile } from "../api/api"
import "../css/FileUpload.css"

interface FileUploadProps {
  selectedFolderId?: string
  selectedFile?: FileItem
  onUploadComplete: () => void
}

const FileUpload: React.FC<FileUploadProps> = ({ selectedFolderId, selectedFile, onUploadComplete }) => {
  const [dragOver, setDragOver] = useState(false)
  const [selectedUploadFile, setSelectedUploadFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadMessage, setUploadMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

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
    if (files.length > 0) {
      setSelectedUploadFile(files[0])
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      setSelectedUploadFile(files[0])
    }
  }

  const handleUpload = async () => {
    if (!selectedUploadFile || !selectedFolderId) {
      setUploadMessage({ type: "error", text: "Please select a file and folder." })
      return
    }

    setUploading(true)
    setUploadProgress(0)
    setUploadMessage(null)

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 200)

      const result = await uploadFile(selectedUploadFile, selectedFolderId)

      clearInterval(progressInterval)
      setUploadProgress(100)

      if (result.success) {
        setUploadMessage({ type: "success", text: "File uploaded successfully!" })
        setSelectedUploadFile(null)
        onUploadComplete()

        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = ""
        }
      } else {
        setUploadMessage({ type: "error", text: result.message || "Upload failed." })
      }
    } catch (error) {
      setUploadMessage({ type: "error", text: "Upload error occurred." })
    } finally {
      setUploading(false)
      setTimeout(() => {
        setUploadProgress(0)
        setUploadMessage(null)
      }, 3000)
    }
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const isImageFile = (file: FileItem | File): boolean => {
    const name = "name" in file ? file.name : file.name
    return /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(name)
  }

  const getPreviewUrl = (file: FileItem): string => {
    // In a real application, this would return the actual file URL
    return `/placeholder.svg?height=200&width=300&text=${encodeURIComponent(file.name)}`
  }

  return (
    <div className="file-upload-container">
      <div className="upload-section">
        <div
          className={`upload-dropzone ${dragOver ? "drag-over" : ""}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="upload-icon">📁</div>
          <div className="upload-text">
            {selectedUploadFile ? selectedUploadFile.name : "Drop files here or click to browse"}
          </div>
          <div className="upload-subtext">
            {selectedUploadFile
              ? `${formatFileSize(selectedUploadFile.size)} • ${selectedUploadFile.type || "Unknown type"}`
              : "Supports all file types"}
          </div>

          <input ref={fileInputRef} type="file" className="file-input" onChange={handleFileSelect} multiple={false} />
        </div>

        {selectedUploadFile && (
          <div className="upload-actions">
            <Button variant="primary" size="sm" onClick={handleUpload} disabled={uploading || !selectedFolderId}>
              {uploading ? "Uploading..." : "Upload File"}
            </Button>
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={() => {
                setSelectedUploadFile(null)
                if (fileInputRef.current) fileInputRef.current.value = ""
              }}
              disabled={uploading}
            >
              Clear
            </Button>
          </div>
        )}

        {uploading && (
          <div className="upload-progress">
            <ProgressBar now={uploadProgress} label={`${uploadProgress}%`} />
          </div>
        )}

        {uploadMessage && (
          <Alert variant={uploadMessage.type === "success" ? "success" : "danger"} className="mt-2">
            {uploadMessage.text}
          </Alert>
        )}
      </div>

      <div className="preview-section">
        <div className="preview-header">File Preview</div>

        {selectedFile ? (
          <div className="file-preview">
            <div className="preview-info">
              <div className="preview-item">
                <span className="preview-label">Name:</span>
                <span className="preview-value">{selectedFile.name}</span>
              </div>
              <div className="preview-item">
                <span className="preview-label">Size:</span>
                <span className="preview-value">{formatFileSize(selectedFile.size)}</span>
              </div>
              <div className="preview-item">
                <span className="preview-label">Type:</span>
                <span className="preview-value">{selectedFile.type}</span>
              </div>
              <div className="preview-item">
                <span className="preview-label">Modified:</span>
                <span className="preview-value">{formatDate(selectedFile.dateModified)}</span>
              </div>
              <div className="preview-item">
                <span className="preview-label">Path:</span>
                <span className="preview-value">{selectedFile.path}</span>
              </div>
            </div>

            {isImageFile(selectedFile) && (
              <img
                src={getPreviewUrl(selectedFile) || "/placeholder.svg"}
                alt={selectedFile.name}
                className="preview-image"
              />
            )}
          </div>
        ) : (
          <div className="no-preview">Select a file to see its details</div>
        )}
      </div>
    </div>
  )
}

export default FileUpload
