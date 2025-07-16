"use client"

import type React from "react"
import { useState } from "react"
import { Container } from "react-bootstrap"
import FolderExplorer from "./components/FolderExplorer"
import FileList from "./components/FileList"
import FileUpload from "./components/FileUpload"
import { useResizable } from "./hooks/useResizable"
import type { FileItem } from "./api/api"
import "./css/App.css"

const App: React.FC = () => {
  const [selectedFolderId, setSelectedFolderId] = useState<string>("1")
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const { leftWidth, rightWidth, isResizing, handleMouseDown } = useResizable({
    initialLeftWidth: 250,
    initialRightWidth: 300,
    minLeftWidth: 200,
    maxLeftWidth: 400,
    minRightWidth: 250,
    maxRightWidth: 450,
    minMiddleWidth: 400,
  })

  const handleFolderSelect = (folderId: string) => {
    setSelectedFolderId(folderId)
    setSelectedFile(null) // Clear selected file when changing folders
  }

  const handleFileSelect = (file: FileItem | null) => {
    setSelectedFile(file)
  }

  const handleUploadComplete = () => {
    // Trigger a refresh of the file list
    setRefreshTrigger((prev) => prev + 1)
  }

  return (
    <div className="file-manager">
      <div className="file-manager-header">
        <Container fluid>
          <h4 className="mb-0">File Manager</h4>
        </Container>
      </div>

      <div className="file-manager-content">
        {/* Left Panel - Folder Explorer */}
        <div className="panel left-panel" style={{ width: `${leftWidth}px` }}>
          <div className="panel-header">Folders</div>
          <FolderExplorer onFolderSelect={handleFolderSelect} selectedFolderId={selectedFolderId} />
        </div>

        {/* Left Resizer */}
        <div
          className={`resizer ${isResizing === "left" ? "resizing" : ""}`}
          onMouseDown={(e) => handleMouseDown(e, "left")}
        />

        {/* Middle Panel - File List */}
        <div className="panel middle-panel">
          <div className="panel-header">Files</div>
          <FileList
            selectedFolderId={selectedFolderId}
            onFileSelect={handleFileSelect}
            selectedFile={selectedFile}
            key={refreshTrigger} // Force re-render on upload
          />
        </div>

        {/* Right Resizer */}
        <div
          className={`resizer ${isResizing === "right" ? "resizing" : ""}`}
          onMouseDown={(e) => handleMouseDown(e, "right")}
        />

        {/* Right Panel - File Upload & Preview */}
        <div className="panel right-panel" style={{ width: `${rightWidth}px` }}>
          <div className="panel-header">Upload & Preview</div>
          <FileUpload
            selectedFolderId={selectedFolderId}
            selectedFile={selectedFile}
            onUploadComplete={handleUploadComplete}
          />
        </div>

        {/* Resizing Overlay */}
        {isResizing && <div className="resizing-overlay" />}
      </div>
    </div>
  )
}

export default App
