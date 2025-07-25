"use client"

import React, { useState, useEffect, useCallback } from "react"
import { Container, Form } from "react-bootstrap"
import FolderExplorer from "../components/FolderExplorer"
import FileList from "../components/FileList"
import FileUpload from "../components/FileUpload"
import ConvertFile from "../components/ConvertFile"
import { useResizable } from "../hooks/useResizable"
import { fetchFolders, fetchFileTypes } from "../api/api"
import type { FileItem, Folder } from "../api/api"
import 'bootstrap-icons/font/bootstrap-icons.css'
import "../styles/App.css"

const App: React.FC = () => {
  const [folders, setFolders] = useState<Folder[]>([])
  const [selectedFolderId, setSelectedFolderId] = useState<string>("none")
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null)
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [activeTab, setActiveTab] = useState<"upload" | "convert">("upload")
  const [selectedCategory, setSelectedCategory] = useState<Folder["category"] | null>(null)
  const [fileTypesList, setFileTypesList] = useState<string[]>([])

  // 마운트 시 용도, 타입 목록 로드
  useEffect(() => {
    fetchFolders()
      .then(setFolders)
      .catch(console.error)

    fetchFileTypes()
      .then(setFileTypesList)
      .catch(console.error)
  }, [])

  const { leftWidth, rightWidth, isResizing, handleMouseDown } = useResizable({
    initialLeftWidth: 350,
    initialRightWidth: 600,
    minLeftWidth: 200,
    maxLeftWidth: 400,
    minRightWidth: 250,
    maxRightWidth: 750,
    minMiddleWidth: 400,
  })

  const [isMobileLayout, setIsMobileLayout] = useState(false)
  const [folderPanelHeight, setFolderPanelHeight] = useState(200)
  const [fileListPanelHeight, setFileListPanelHeight] = useState(400)
  const [isVerticalResizing, setIsVerticalResizing] = useState<number | null>(null)
  const [startY, setStartY] = useState(0)
  const [startHeights, setStartHeights] = useState<number[]>([])

  useEffect(() => {
    const onResize = () => setIsMobileLayout(window.innerWidth <= 992)
    window.addEventListener("resize", onResize)
    onResize()
    return () => window.removeEventListener("resize", onResize)
  }, [])

  const handleVerticalMouseDown = useCallback(
    (e: React.MouseEvent, idx: number) => {
      e.preventDefault()
      setIsVerticalResizing(idx)
      setStartY(e.clientY)
      setStartHeights([folderPanelHeight, fileListPanelHeight])
    },
    [folderPanelHeight, fileListPanelHeight]
  )

  const handleVerticalMouseMove = useCallback(
    (e: MouseEvent) => {
      if (isVerticalResizing === null) return
      const deltaY = e.clientY - startY
      let newF = startHeights[0]
      let newL = startHeights[1]
      const [minF, maxF] = [120, 300]
      const [minL, maxL] = [200, 500]
      if (isVerticalResizing === 0) {
        newF = Math.max(minF, Math.min(maxF, startHeights[0] + deltaY))
        newL = startHeights[1] - (newF - startHeights[0])
        if (newL < minL) {
          newF += minL - newL
          newL = minL
        }
      } else {
        newL = Math.max(minL, Math.min(maxL, startHeights[1] + deltaY))
      }
      setFolderPanelHeight(newF)
      setFileListPanelHeight(newL)
    },
    [isVerticalResizing, startY, startHeights]
  )

  const handleVerticalMouseUp = useCallback(() => setIsVerticalResizing(null), [])

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

  const handleFolderSelect = (id: string) => {
    setSelectedFolderId(id)
    setSelectedFile(null)
  }

  const handleFileSelect = (file: FileItem | null) => setSelectedFile(file)
  const handleUploadComplete = () => setRefreshTrigger(p => p + 1)

  return (
    <div className="file-manager">
      <div className="file-manager-header"><Container fluid><h4>파일 관리</h4></Container></div>
      <div className="file-manager-content">
        <div className="panel left-panel" style={isMobileLayout ? { height: folderPanelHeight } : { width: leftWidth }}>
          <div className="panel-header">
            폴더
            <Form.Select
              size="sm"
              className="category-select"
              value={selectedCategory ?? ""}
              onChange={e => setSelectedCategory(e.target.value as Folder["category"])}
            >
              <option value="">파일 타입</option>
              {fileTypesList.map((ft) => (
                <option key={ft} value={ft}>
                  {ft}
                </option>
              ))}
            </Form.Select>
          </div>
          <FolderExplorer
            selectedFolderId={selectedFolderId}
            onFolderSelect={handleFolderSelect}
          />
        </div>

        {!isMobileLayout ?
          <div className={`resizer ${isResizing === "left" ? "resizing" : ""}`} onMouseDown={e => handleMouseDown(e, "left")} /> :
          <div className={`resizer ${isVerticalResizing === 0 ? "resizing" : ""}`} onMouseDown={e => handleVerticalMouseDown(e, 0)} />}

        <div className="panel middle-panel" style={isMobileLayout ? { height: fileListPanelHeight } : {}}>
          <div className="panel-header">파일</div>
          <FileList
            key={`refresh-${refreshTrigger}`}
            folders={folders}
            selectedFolderId={selectedFolderId}
            selectedFile={selectedFile}
            selectedCategory={selectedCategory}
            onFileSelect={handleFileSelect}
          />
        </div>

        {!isMobileLayout ?
          <div className={`resizer ${isResizing === "right" ? "resizing" : ""}`} onMouseDown={e => handleMouseDown(e, "right")} /> :
          <div className={`resizer ${isVerticalResizing === 1 ? "resizing" : ""}`} onMouseDown={e => handleVerticalMouseDown(e, 1)} />}

        <div className="panel right-panel" style={isMobileLayout ? { flex: 1, minHeight: 150 } : { width: rightWidth }}>
          <div className="panel-header">업로드 / 변환</div>
          <div className="tab-header">
            <button className={`tab-button ${activeTab === 'upload' ? 'active' : ''}`} onClick={() => setActiveTab('upload')}>Upload</button>
            <button className={`tab-button ${activeTab === 'convert' ? 'active' : ''}`} onClick={() => setActiveTab('convert')}>Convert</button>
          </div>
          <div className="panel-content" style={{ padding: 0 }}>
            {activeTab === 'upload'
              ? <FileUpload selectedFile={selectedFile} onUploadComplete={handleUploadComplete} />
              : <ConvertFile
                selectedFile={selectedFile}
                onConvertComplete={() => {/* 변환 후 갱신 */ }}
                onClear={() => setSelectedFile(null)} // 파일 해제
              />
            }
          </div>
        </div>

        {(isResizing || isVerticalResizing !== null) && <div className="resizing-overlay" />}
      </div>
    </div>
  )
}

export default App