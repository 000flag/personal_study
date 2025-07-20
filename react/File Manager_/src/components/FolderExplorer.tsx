"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { type Folder, fetchFolders } from "../api/api"
import "../styles/FolderExplorer.css"

interface FolderExplorerProps {
  onFolderSelect: (folderId: string) => void
  selectedFolderId?: string
  selectedCategory: string // New prop for category
}

const FolderExplorer: React.FC<FolderExplorerProps> = ({ onFolderSelect, selectedFolderId, selectedCategory }) => {
  const [folders, setFolders] = useState<Folder[]>([])
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(["1"]))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadFolders() // Remove category parameter since folders are shared
  }, []) // Remove selectedCategory dependency since folders don't change

  const loadFolders = async () => {
    setLoading(true)
    try {
      const folderData = await fetchFolders() // Remove category parameter
      setFolders(folderData)
    } catch (error) {
      console.error("Error loading folders:", error)
    } finally {
      setLoading(false)
    }
  }

  const toggleFolder = (folderId: string) => {
    const newExpanded = new Set(expandedFolders)
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId)
    } else {
      newExpanded.add(folderId)
    }
    setExpandedFolders(newExpanded)
  }

  const renderFolder = (folder: Folder, level = 0) => {
    const hasChildren = folder.children && folder.children.length > 0
    const isExpanded = expandedFolders.has(folder.id)
    const isSelected = selectedFolderId === folder.id

    return (
      <li key={folder.id} className="folder-item">
        <button
          className={`folder-button ${isSelected ? "active" : ""}`}
          onClick={() => onFolderSelect(folder.id)}
          style={{ paddingLeft: `${0.75 + level * 1}rem` }}
        >
          {hasChildren && (
            <span
              className={`expand-icon ${isExpanded ? "expanded" : ""}`}
              onClick={(e) => {
                e.stopPropagation()
                toggleFolder(folder.id)
              }}
            >
              ▶
            </span>
          )}
          <span className="folder-icon">📁</span>
          <span className="folder-name">{folder.name}</span>
        </button>

        {hasChildren && isExpanded && (
          <ul className="folder-tree folder-children">
            {folder.children.map((childId) => {
              const childFolder = folders.find((f) => f.id === childId)
              return childFolder ? renderFolder(childFolder, level + 1) : null
            })}
          </ul>
        )}
      </li>
    )
  }

  const rootFolders = folders.filter((folder) => folder.parentId === null)

  if (loading) {
    return (
      <div className="folder-explorer">
        <div className="panel-content">
          <div className="text-center p-3">Loading folders...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="folder-explorer">
      <div className="panel-content">
        <ul className="folder-tree">{rootFolders.map((folder) => renderFolder(folder))}</ul>
      </div>
    </div>
  )
}

export default FolderExplorer
