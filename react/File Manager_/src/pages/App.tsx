"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import { Container, Form } from "react-bootstrap" // Import Form for the select box
import FolderExplorer from "../components/FolderExplorer"
import FileList from "../components/FileList"
import FileUpload from "../components/FileUpload"
import { useResizable } from "../hooks/useResizable" // This hook is for horizontal resizing
import type { FileItem } from "../api/api"
import "../styles/App.css"

const App: React.FC = () => {
  const [selectedFolderId, setSelectedFolderId] = useState<string>("1")
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null)
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [selectedCategory, setSelectedCategory] = useState<string>("all") // New state for category

  // Horizontal resizing states and logic (for larger screens)
  const { leftWidth, rightWidth, isResizing, handleMouseDown } = useResizable({
    initialLeftWidth: 250,
    initialRightWidth: 300,
    minLeftWidth: 200,
    maxLeftWidth: 400,
    minRightWidth: 250,
    maxRightWidth: 450,
    minMiddleWidth: 400,
  })

  // State to detect if layout is vertical (mobile)
  const [isMobileLayout, setIsMobileLayout] = useState(false)

  // Vertical resizing states and logic (for smaller screens)
  const [folderPanelHeight, setFolderPanelHeight] = useState(200)
  const [fileListPanelHeight, setFileListPanelHeight] = useState(400)
  // uploadPreviewPanelHeight will be flex: 1, but we need to track its min for calculations
  const [isVerticalResizing, setIsVerticalResizing] = useState<number | null>(null) // 0 for top resizer, 1 for bottom resizer
  const [startY, setStartY] = useState(0)
  const [startHeights, setStartHeights] = useState<number[]>([])

  useEffect(() => {
    const handleResize = () => {
      setIsMobileLayout(window.innerWidth <= 992)
    }
    window.addEventListener("resize", handleResize)
    handleResize() // Initial check
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Vertical resize handlers
  const handleVerticalMouseDown = useCallback(
    (e: React.MouseEvent, resizerIndex: number) => {
      e.preventDefault()
      setIsVerticalResizing(resizerIndex)
      setStartY(e.clientY)
      setStartHeights([folderPanelHeight, fileListPanelHeight]) // Only track managed heights
    },
    [folderPanelHeight, fileListPanelHeight],
  )

  const handleVerticalMouseMove = useCallback(
    (e: MouseEvent) => {
      if (isVerticalResizing === null) return

      const deltaY = e.clientY - startY
      let newFolderHeight = startHeights[0]
      let newFileListHeight = startHeights[1]

      // Define min/max heights based on CSS media queries for vertical layout
      const minFolderHeight = 120
      const maxFolderHeight = 300
      const minFileListHeight = 200
      const maxFileListHeight = 500 // This max is more of a guideline, as it's flex

      if (isVerticalResizing === 0) {
        // Resizing between folder and file list
        newFolderHeight = Math.max(minFolderHeight, Math.min(maxFolderHeight, startHeights[0] + deltaY))
        newFileListHeight = startHeights[1] - (newFolderHeight - startHeights[0]) // Adjust file list inversely

        // Ensure file list doesn't go below its min
        if (newFileListHeight < minFileListHeight) {
          newFolderHeight += minFileListHeight - newFileListHeight // Adjust folder back
          newFileListHeight = minFileListHeight
        }
        setFolderPanelHeight(newFolderHeight)
        setFileListPanelHeight(newFileListHeight)
      } else if (isVerticalResizing === 1) {
        // Resizing between file list and upload/preview
        newFileListHeight = Math.max(minFileListHeight, Math.min(maxFileListHeight, startHeights[1] + deltaY))
        // The bottom panel (upload/preview) is flex, so it will naturally adjust.
        // We just need to ensure the middle panel doesn't go below its min.
        setFileListPanelHeight(newFileListHeight)
      }
    },
    [isVerticalResizing, startY, startHeights],
  )

  const handleVerticalMouseUp = useCallback(() => {
    setIsVerticalResizing(null)
  }, [])

  useEffect(() => {
    if (isVerticalResizing !== null) {
      document.addEventListener("mousemove", handleVerticalMouseMove)
      document.addEventListener("mouseup", handleVerticalMouseUp)
      document.body.style.cursor = "row-resize"
      document.body.style.userSelect = "none"

      return () => {
        document.removeEventListener("mousemove", handleVerticalMouseMove)
        document.removeEventListener("mouseup", handleVerticalMouseUp)
        document.body.style.cursor = ""
        document.body.style.userSelect = ""
      }
    }
  }, [isVerticalResizing, handleVerticalMouseMove, handleVerticalMouseUp])

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
        <div
          className="panel left-panel"
          style={isMobileLayout ? { height: `${folderPanelHeight}px` } : { width: `${leftWidth}px` }}
        >
          <div className="panel-header">
            Folders
            <Form.Select
              size="sm"
              className="category-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              aria-label="Select folder category"
            >
              <option value="all">All</option>
              <option value="image">Image</option>
              <option value="video">Video</option>
              <option value="document">Document</option>
              <option value="audio">Audio</option>
            </Form.Select>
          </div>
          <FolderExplorer
            onFolderSelect={handleFolderSelect}
            selectedFolderId={selectedFolderId}
            selectedCategory={selectedCategory}
          />
        </div>

        {/* Resizer between Folder Explorer and File List */}
        {!isMobileLayout ? (
          <div
            className={`resizer ${isResizing === "left" ? "resizing" : ""}`}
            onMouseDown={(e) => handleMouseDown(e, "left")}
          />
        ) : (
          <div
            className={`resizer ${isVerticalResizing === 0 ? "resizing" : ""}`}
            onMouseDown={(e) => handleVerticalMouseDown(e, 0)}
          />
        )}

        {/* Middle Panel - File List */}
        <div className="panel middle-panel" style={isMobileLayout ? { height: `${fileListPanelHeight}px` } : {}}>
          <div className="panel-header">Files</div>
          <FileList
            selectedFolderId={selectedFolderId}
            onFileSelect={handleFileSelect}
            selectedFile={selectedFile}
            key={refreshTrigger} // Force re-render on upload
            selectedCategory={selectedCategory} // Pass selectedCategory
          />
        </div>

        {/* Resizer between File List and Upload & Preview */}
        {!isMobileLayout ? (
          <div
            className={`resizer ${isResizing === "right" ? "resizing" : ""}`}
            onMouseDown={(e) => handleMouseDown(e, "right")}
          />
        ) : (
          <div
            className={`resizer ${isVerticalResizing === 1 ? "resizing" : ""}`}
            onMouseDown={(e) => handleVerticalMouseDown(e, 1)}
          />
        )}

        {/* Right Panel - File Upload & Preview */}
        <div
          className="panel right-panel"
          style={isMobileLayout ? { flex: 1, minHeight: "150px" } : { width: `${rightWidth}px` }} // minHeight for flex panel
        >
          <div className="panel-header">Upload & Preview</div>
          <FileUpload
            selectedFolderId={selectedFolderId}
            selectedFile={selectedFile}
            onUploadComplete={handleUploadComplete}
            selectedCategory={selectedCategory} // Add this line
          />
        </div>

        {/* Resizing Overlay */}
        {(isResizing || isVerticalResizing !== null) && <div className="resizing-overlay" />}
      </div>
    </div>
  )
}

export default App
