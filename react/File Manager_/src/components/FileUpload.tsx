"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button, ProgressBar, Alert, Form } from "react-bootstrap"
import { type FileItem, uploadFile } from "../api/api"
import "../styles/FileUpload.css"

interface FileUploadProps {
  selectedFolderId?: string
  selectedFile?: FileItem | null
  onUploadComplete: () => void
  selectedCategory: string
}

const FileUpload: React.FC<FileUploadProps> = ({
  selectedFolderId,
  selectedFile,
  onUploadComplete,
  selectedCategory,
}) => {
  const [dragOver, setDragOver] = useState(false)
  const [selectedUploadFile, setSelectedUploadFile] = useState<File | null>(null)
  const [description, setDescription] = useState("")
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadMessage, setUploadMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [warningMessage, setWarningMessage] = useState<{ type: "danger"; text: string } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // Cleanup object URLs when component unmounts or file changes
    return () => {
      if (selectedUploadFile && (isImageFile(selectedUploadFile) || isVideoFile(selectedUploadFile))) {
        URL.revokeObjectURL(getFilePreviewUrl(selectedUploadFile))
      }
    }
  }, [selectedUploadFile])

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
    setWarningMessage(null) // Clear previous warnings
    setUploadMessage(null) // Clear previous upload messages

    if (selectedCategory === "all") {
      // Add this condition
      setWarningMessage({
        type: "danger",
        text: "File upload is disabled for 'All' category. Please select a specific category.",
      })
      return
    }
    if (!selectedFolderId) {
      setWarningMessage({ type: "danger", text: "Please select a folder to upload." })
      return
    }
    if (!selectedUploadFile) {
      setWarningMessage({ type: "danger", text: "Please select a file to upload." })
      return
    }
    if (!description.trim()) {
      setWarningMessage({ type: "danger", text: "Please enter a description." })
      return
    }

    setUploading(true)
    setUploadProgress(0)

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

      const result = await uploadFile(selectedUploadFile, selectedFolderId, description) // Pass description

      clearInterval(progressInterval)
      setUploadProgress(100)

      if (result.success) {
        setUploadMessage({ type: "success", text: "File uploaded successfully!" })
        setSelectedUploadFile(null)
        setDescription("") // Clear description after successful upload
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
        setWarningMessage(null) // Also clear warnings after a delay
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
    const name = file instanceof File ? file.name : file.name
    return /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(name)
  }

  const isVideoFile = (file: FileItem | File): boolean => {
    const name = file instanceof File ? file.name : file.name
    return /\.(mp4|avi|mov|wmv|flv|webm|mkv)$/i.test(name)
  }

  const getFilePreviewUrl = (file: File): string => {
    return URL.createObjectURL(file)
  }

  const getPreviewUrl = (file: FileItem): string => {
    // In a real application, this would return the actual file URL
    return `/placeholder.svg?height=200&width=300&text=${encodeURIComponent(file.name)}`
  }

  return (
    <div className="file-upload-container">
      <div className="upload-section">
        <div
          className={`upload-dropzone ${dragOver ? "drag-over" : ""} ${selectedCategory === "all" ? "disabled-upload" : ""}`} // Add disabled-upload class
          onDragOver={selectedCategory === "all" ? undefined : handleDragOver} // Disable drag events
          onDragLeave={selectedCategory === "all" ? undefined : handleDragLeave}
          onDrop={selectedCategory === "all" ? undefined : handleDrop}
          onClick={selectedCategory === "all" ? undefined : () => fileInputRef.current?.click()} // Disable click
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
          <input
            ref={fileInputRef}
            type="file"
            className="file-input"
            onChange={handleFileSelect}
            multiple={false}
            disabled={selectedCategory === "all"}
          />{" "}
          {/* Disable input */}
        </div>

        {selectedUploadFile && (
          <>
            <Form.Group controlId="fileDescription" className="mt-3">
              <Form.Label className="sr-only">File Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                placeholder="Enter file description (optional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="description-input"
              />
            </Form.Group>

            <div className="upload-actions">
              <Button
                variant="primary"
                size="sm"
                onClick={handleUpload}
                disabled={uploading || selectedCategory === "all"}
              >
                {" "}
                {/* Add selectedCategory === "all" */}
                {uploading ? "Uploading..." : "Upload File"}
              </Button>
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={() => {
                  setSelectedUploadFile(null)
                  setDescription("") // Clear description on clear
                  if (fileInputRef.current) fileInputRef.current.value = ""
                }}
                disabled={uploading}
              >
                Clear
              </Button>
            </div>
          </>
        )}

        {uploading && (
          <div className="upload-progress">
            <ProgressBar now={uploadProgress} label={`${uploadProgress}%`} />
          </div>
        )}

        {warningMessage && (
          <Alert variant={warningMessage.type} className="mt-2">
            {warningMessage.text}
          </Alert>
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

            {isVideoFile(selectedFile) && (
              <video
                src={getPreviewUrl(selectedFile) || ""}
                controls
                className="preview-video"
                style={{ maxWidth: "100%", maxHeight: "200px", marginTop: "1rem" }}
              >
                Your browser does not support the video tag.
              </video>
            )}
          </div>
        ) : selectedUploadFile ? (
          <div className="file-preview">
            <div className="preview-info">
              <div className="preview-item">
                <span className="preview-label">Name:</span>
                <span className="preview-value">{selectedUploadFile.name}</span>
              </div>
              <div className="preview-item">
                <span className="preview-label">Size:</span>
                <span className="preview-value">{formatFileSize(selectedUploadFile.size)}</span>
              </div>
              <div className="preview-item">
                <span className="preview-label">Type:</span>
                <span className="preview-value">{selectedUploadFile.type || "Unknown"}</span>
              </div>
              {description && (
                <div className="preview-item">
                  <span className="preview-label">Description:</span>
                  <span className="preview-value">{description}</span>
                </div>
              )}
            </div>

            {isImageFile(selectedUploadFile) && (
              <img
                src={getFilePreviewUrl(selectedUploadFile) || "/placeholder.svg"}
                alt={selectedUploadFile.name}
                className="preview-image"
              />
            )}

            {isVideoFile(selectedUploadFile) && (
              <video
                src={getFilePreviewUrl(selectedUploadFile)}
                controls
                className="preview-video"
                style={{ maxWidth: "100%", maxHeight: "200px", marginTop: "1rem" }}
              >
                Your browser does not support the video tag.
              </video>
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
