"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Table, Form, Button, InputGroup } from "react-bootstrap"
import { type FileItem, fetchFiles, searchFiles } from "../api/api"
import "../css/FileList.css"

interface FileListProps {
  selectedFolderId?: string
  onFileSelect: (file: FileItem | null) => void
  selectedFile?: FileItem
}

type SortField = "name" | "size" | "dateModified" | "type"
type SortDirection = "asc" | "desc"

const FileList: React.FC<FileListProps> = ({ selectedFolderId, onFileSelect, selectedFile }) => {
  const [files, setFiles] = useState<FileItem[]>([])
  const [filteredFiles, setFilteredFiles] = useState<FileItem[]>([])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [showHidden, setShowHidden] = useState(false)
  const [sortField, setSortField] = useState<SortField>("name")
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc")
  const [dateFilter, setDateFilter] = useState("")

  useEffect(() => {
    loadFiles()
  }, [selectedFolderId])

  useEffect(() => {
    filterAndSortFiles()
  }, [files, searchQuery, showHidden, sortField, sortDirection, dateFilter])

  const loadFiles = async () => {
    setLoading(true)
    try {
      const fileData = await fetchFiles(selectedFolderId)
      setFiles(fileData)
    } catch (error) {
      console.error("Error loading files:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async () => {
    if (searchQuery.trim()) {
      setLoading(true)
      try {
        const searchResults = await searchFiles(searchQuery)
        setFiles(searchResults)
      } catch (error) {
        console.error("Error searching files:", error)
      } finally {
        setLoading(false)
      }
    } else {
      loadFiles()
    }
  }

  const filterAndSortFiles = () => {
    let filtered = [...files]

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter((file) => file.name.toLowerCase().includes(searchQuery.toLowerCase()))
    }

    // Apply hidden files filter
    if (!showHidden) {
      filtered = filtered.filter((file) => !file.name.startsWith("."))
    }

    // Apply date filter
    if (dateFilter) {
      const filterDate = new Date(dateFilter)
      filtered = filtered.filter((file) => {
        const fileDate = new Date(file.dateModified)
        return fileDate >= filterDate
      })
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: any = a[sortField]
      let bValue: any = b[sortField]

      if (sortField === "dateModified") {
        aValue = new Date(aValue).getTime()
        bValue = new Date(bValue).getTime()
      } else if (sortField === "size") {
        aValue = Number(aValue)
        bValue = Number(bValue)
      } else {
        aValue = String(aValue).toLowerCase()
        bValue = String(bValue).toLowerCase()
      }

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1
      return 0
    })

    setFilteredFiles(filtered)
  }

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
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

  const getFileIcon = (extension: string): string => {
    const iconMap: { [key: string]: string } = {
      pdf: "📄",
      doc: "📝",
      docx: "📝",
      xls: "📊",
      xlsx: "📊",
      ppt: "📈",
      pptx: "📈",
      jpg: "🖼️",
      jpeg: "🖼️",
      png: "🖼️",
      gif: "🖼️",
      mp4: "🎥",
      avi: "🎥",
      mov: "🎥",
      mp3: "🎵",
      wav: "🎵",
      zip: "🗜️",
      rar: "🗜️",
      txt: "📄",
      js: "⚡",
      ts: "⚡",
      tsx: "⚡",
      jsx: "⚡",
      html: "🌐",
      css: "🎨",
      default: "📄",
    }
    return iconMap[extension.toLowerCase()] || iconMap["default"]
  }

  const getSortClass = (field: SortField): string => {
    if (sortField !== field) return "sortable"
    return sortDirection === "asc" ? "sort-asc" : "sort-desc"
  }

  return (
    <div className="file-list-container">
      <div className="file-controls">
        <div className="control-group">
          <Form.Check
            type="switch"
            id="show-hidden"
            label="Show hidden"
            checked={showHidden}
            onChange={(e) => setShowHidden(e.target.checked)}
          />
        </div>

        <div className="control-group">
          <Form.Label htmlFor="date-filter">Modified after:</Form.Label>
          <Form.Control
            type="date"
            id="date-filter"
            size="sm"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          />
        </div>

        <div className="search-group">
          <InputGroup size="sm">
            <Form.Control
              type="text"
              placeholder="Search files..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            />
            <Button variant="outline-secondary" onClick={handleSearch}>
              🔍
            </Button>
          </InputGroup>
        </div>
      </div>

      <div className="file-table-container">
        {loading ? (
          <div className="text-center p-4">Loading files...</div>
        ) : filteredFiles.length === 0 ? (
          <div className="no-files">
            {searchQuery ? "No files found matching your search." : "No files in this folder."}
          </div>
        ) : (
          <Table hover className="file-table">
            <thead>
              <tr>
                <th className={getSortClass("name")} onClick={() => handleSort("name")}>
                  Name
                </th>
                <th className={getSortClass("size")} onClick={() => handleSort("size")}>
                  Size
                </th>
                <th className={getSortClass("type")} onClick={() => handleSort("type")}>
                  Type
                </th>
                <th className={getSortClass("dateModified")} onClick={() => handleSort("dateModified")}>
                  Date Modified
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredFiles.map((file) => (
                <tr
                  key={file.id}
                  className={selectedFile?.id === file.id ? "selected" : ""}
                  onClick={() => onFileSelect(file)}
                >
                  <td>
                    <div className="file-name-cell">
                      <span className="file-icon">{getFileIcon(file.extension)}</span>
                      {file.name}
                    </div>
                  </td>
                  <td className="file-size">{formatFileSize(file.size)}</td>
                  <td className="file-type">{file.type}</td>
                  <td className="file-date">{formatDate(file.dateModified)}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </div>
    </div>
  )
}

export default FileList
