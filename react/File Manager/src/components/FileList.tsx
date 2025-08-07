"use client"

import { useState, useEffect, useRef } from "react"
import { Table, Form, Button, InputGroup, Row, Col, Pagination } from "react-bootstrap"
import { FileItem, Folder, SearchOptions, SearchResponse } from "../api/type"
import { searchFiles } from "../api/api"
import "../styles/FileList.css"

type SortField = "filename" | "detail" | "size" | "createdAt" | "fileTypes"
type SortDirection = "asc" | "desc"
type SearchMode = "default" | "basic" | "detailed"

interface DetailedSearchParams {
    filename: string
    fileTypes: string
    fileUsage: string
    extension: string
    detail: string
    isDeleted: string
    isActivated: string
    createdFrom: string
    createdTo: string
    minSize: string
    maxSize: string
    page: string
    size: string
    sortBy: string
    sortDirection: string
}

interface FileListProps {
    folders: Folder[]
    selectedFolderId?: string
    onFileSelect: (file: FileItem | null) => void
    selectedFile?: FileItem | null
    selectedCategory?: Folder["category"] | null
    fileTypesList: string[]
}

const FileList: React.FC<FileListProps> = ({
    folders,
    selectedFolderId,
    onFileSelect,
    selectedFile,
    selectedCategory,
    fileTypesList
}) => {
    const [searchResponse, setSearchResponse] = useState<SearchResponse | null>(null)
    const [loading, setLoading] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [sortField, setSortField] = useState<SortField>("createdAt")
    const [sortDirection, setSortDirection] = useState<SortDirection>("desc")
    const [detailedSearchToggle, setDetailedSearchToggle] = useState(false)
    const [currentPage, setCurrentPage] = useState(0)
    const [pageSize, setPageSize] = useState(10)
    const [searchMode, setSearchMode] = useState<SearchMode>("default")

    const startDateRef = useRef<HTMLInputElement>(null)
    const endDateRef = useRef<HTMLInputElement>(null)
    const firstLoadDone = useRef(false)

    // 폴더 변경 시
    useEffect(() => {
        if (!selectedFolderId) {
            return
        }

        console.log("[selectedFolderId]")

        setCurrentPage(0)
        setSearchMode("default")
        setSearchQuery("")
        loadFiles(0, pageSize)
    }, [selectedFolderId])

    // 파일 타입 변경 시
    useEffect(() => {
        if (!selectedCategory) {
            return
        }

        console.log("[selectedCategory]")

        setCurrentPage(0)
        setSearchMode("default")
        setSearchQuery("")
        setDetailedSearch(prev => ({
            ...prev,
            fileTypes: selectedCategory?.toUpperCase() ?? "",
        }))
        loadFiles(0, pageSize)
    }, [selectedCategory])

    // 페이지네이션과 정렬 변경 시에만 실행
    useEffect(() => {
        if (!firstLoadDone.current) {
            firstLoadDone.current = true
            return
        }

        console.log("[currentPage, pageSize] - searchMode:", searchMode)

        // 현재 검색 모드에 따라 적절한 함수 호출
        if (searchMode === "basic" && searchQuery.trim()) {
            handleSearch()
        } else if (searchMode === "detailed") {
            handleDetailedSearch()
        } else if (searchMode === "default") {
            loadFiles(currentPage, pageSize)
        }
    }, [currentPage, pageSize])

    // 폴더 이름 가져오기
    const getFolderName = (folderId?: string): string => {
        if (!folderId) return ""
        const folder = folders.find(f => f.id === folderId)
        return folder ? folder.name : ""
    }

    // 상세 검색 매개변수
    const [detailedSearch, setDetailedSearch] = useState<DetailedSearchParams>({
        filename: "",
        fileTypes: selectedCategory?.toUpperCase() ?? "",
        fileUsage: getFolderName(selectedFolderId),
        extension: "",
        detail: "",
        isDeleted: "",
        isActivated: "",
        createdFrom: "",
        createdTo: "",
        minSize: "",
        maxSize: "",
        page: "0",
        size: "10",
        sortBy: "createdAt",
        sortDirection: "DESC",
    })

    const loadFiles = async (page = 0, size = 10) => {
        setLoading(true)
        try {
            const opts: SearchOptions = {
                fileUsage: !selectedFolderId ? "" : getFolderName(selectedFolderId),
                fileTypes: !selectedCategory ? "" : selectedCategory?.toUpperCase() ?? "",
                page: page.toString(),
                size: size.toString(),
                sortBy: sortField,
                sortDirection: sortDirection.toUpperCase(),
            }
            const results = await searchFiles("", opts)
            setSearchResponse(results)
        } catch (error) {
            console.error("파일 로딩 오류:", error)
        } finally {
            setLoading(false)
        }
    }

    // 일반 검색
    const handleSearch = async () => {
        setLoading(true)
        try {
            const opts: SearchOptions = {
                fileUsage: !selectedFolderId ? "" : getFolderName(selectedFolderId),
                fileTypes: !selectedCategory ? "" : selectedCategory?.toUpperCase() ?? "",
                page: currentPage.toString(),
                size: pageSize.toString(),
                sortBy: sortField,
                sortDirection: sortDirection.toUpperCase(),
            }
            const results = await searchFiles(searchQuery, opts)
            setSearchResponse(results)
        } catch (error) {
            console.error("파일 검색 오류:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleDetailedSearch = async () => {
        setLoading(true)
        try {
            const opts: SearchOptions = {
                ...detailedSearch,
                page: currentPage.toString(),
                size: pageSize.toString(),
                sortBy: sortField,
                sortDirection: sortDirection.toUpperCase(),
            }
            const results = await searchFiles("", opts)
            setSearchResponse(results)
        } catch (error) {
            console.error("상세 검색 오류:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleSearchTrigger = () => {
        console.log("handleSearchTrigger")
        setCurrentPage(0)
        setSearchMode("basic")
        handleSearch()
    }

    const handleDetailedSearchTrigger = () => {
        console.log("handleDetailedSearchTrigger")
        setCurrentPage(0)
        setSearchMode("detailed")
        handleDetailedSearch()
    }

    const handleSort = (field: SortField) => {
        const direction = sortField === field && sortDirection === "asc" ? "desc" : "asc"
        setSortField(field)
        setSortDirection(direction)
        // 정렬 변경 시 재검색 - 현재 페이지를 0으로 초기화
        setCurrentPage(0)
    }

    const handleDetailedSearchChange = (field: keyof DetailedSearchParams, value: string) => {
        setDetailedSearch(prev => ({
            ...prev,
            [field]: value,
        }))
    }

    const resetDetailedSearch = () => {
        setDetailedSearch({
            filename: "",
            fileTypes: selectedCategory?.toUpperCase() ?? "",
            fileUsage: getFolderName(selectedFolderId),
            extension: "",
            detail: "",
            isDeleted: "",
            isActivated: "",
            createdFrom: "",
            createdTo: "",
            minSize: "",
            maxSize: "",
            page: "0",
            size: pageSize.toString(),
            sortBy: "createdAt",
            sortDirection: "DESC",
        })
        setCurrentPage(0)
        setSearchMode("default")
        setSearchQuery("")
        loadFiles(0, pageSize)
    }

    const handlePageChange = (page: number) => {
        setCurrentPage(page)
    }

    const handlePageSizeChange = (newSize: number) => {
        setPageSize(newSize)
        setCurrentPage(0)
    }

    const formatDate = (dateString: string): string =>
        new Date(dateString).toLocaleString("ko-KR", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
        })

    const getFileIcon = (extension: string): string => {
        const iconMap: Record<string, string> = {
            pdf: "📄", doc: "📝", docx: "📝", xls: "📊", xlsx: "📊",
            ppt: "📈", pptx: "📈", jpg: "🖼️", jpeg: "🖼️", png: "🖼️",
            gif: "🖼️", webp: "🖼️", mp4: "🎥", avi: "🎥", mov: "🎥",
            mp3: "🎵", wav: "🎵", zip: "🗜️", rar: "🗜️", txt: "📄",
            js: "⚡", ts: "⚡", tsx: "⚡", jsx: "⚡", html: "🌐",
            css: "🎨", default: "📄",
        }
        return iconMap[extension.toLowerCase()] || iconMap["default"]
    }

    const getSortClass = (field: SortField): string =>
        sortField !== field ? "sortable" : sortDirection === "asc" ? "sort-asc" : "sort-desc"

    const files = searchResponse?.data.content || []
    const totalElements = searchResponse?.data.totalElements || 0
    const totalPages = searchResponse?.data.totalPages || 0

    const renderPaginationItems = () => {
        const items = []
        const maxVisible = 5
        let startPage = Math.max(0, currentPage - Math.floor(maxVisible / 2))
        let endPage = Math.min(totalPages - 1, startPage + maxVisible - 1)
        if (endPage - startPage < maxVisible - 1) {
            startPage = Math.max(0, endPage - maxVisible + 1)
        }

        if (startPage > 0) {
            items.push(<Pagination.Item key={0} onClick={() => handlePageChange(0)}>1</Pagination.Item>)
            if (startPage > 1) items.push(<Pagination.Ellipsis key="start-ellipsis" />)
        }

        for (let p = startPage; p <= endPage; p++) {
            items.push(
                <Pagination.Item key={p} active={p === currentPage} onClick={() => handlePageChange(p)}>
                    {p + 1}
                </Pagination.Item>
            )
        }

        if (endPage < totalPages - 1) {
            if (endPage < totalPages - 2) items.push(<Pagination.Ellipsis key="end-ellipsis" />)
            items.push(<Pagination.Item key={totalPages - 1} onClick={() => handlePageChange(totalPages - 1)}>
                {totalPages}
            </Pagination.Item>)
        }

        return items
    }

    return (
        <div className="file-list-container">
            <div className="file-controls">
                <div className="control-group">
                    <Form.Check
                        type="switch"
                        id="detailed-search-toggle"
                        label="상세 검색"
                        checked={detailedSearchToggle}
                        onChange={(e) => {
                            setDetailedSearchToggle(e.target.checked)
                            // 토글 변경 시에는 현재 결과를 유지하고 모드만 변경
                            if (!e.target.checked) {
                                // 상세 검색에서 일반 검색으로 전환
                                // 현재 검색 결과를 유지하고 searchMode만 변경
                                if (searchMode === "detailed") {
                                    setSearchMode("basic")
                                }
                            }
                        }}
                    />
                </div>

                {detailedSearchToggle ? (
                    <div className="detailed-search-container">
                        <Row>
                            <Col md={4}>
                                <Form.Group>
                                    <Form.Label className="small">파일명</Form.Label>
                                    <Form.Control
                                        type="text"
                                        size="sm"
                                        placeholder="파일명"
                                        value={detailedSearch.filename}
                                        onKeyPress={(e) => {
                                            if (e.key === "Enter") {
                                                e.preventDefault();
                                                handleDetailedSearchTrigger();
                                            }
                                        }}
                                        onChange={(e) => handleDetailedSearchChange("filename", e.target.value)}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group>
                                    <Form.Label className="small">상세 설명</Form.Label>
                                    <Form.Control
                                        type="text"
                                        size="sm"
                                        placeholder="상세 설명"
                                        value={detailedSearch.detail}
                                        onKeyPress={(e) => {
                                            if (e.key === "Enter") {
                                                e.preventDefault();
                                                handleDetailedSearchTrigger();
                                            }
                                        }}
                                        onChange={(e) => handleDetailedSearchChange("detail", e.target.value)}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group>
                                    <Form.Label className="small">확장자</Form.Label>
                                    <Form.Control
                                        type="text"
                                        size="sm"
                                        placeholder="확장자"
                                        value={detailedSearch.extension}
                                        onKeyPress={(e) => {
                                            if (e.key === "Enter") {
                                                e.preventDefault();
                                                handleDetailedSearchTrigger();
                                            }
                                        }}
                                        onChange={(e) => handleDetailedSearchChange("extension", e.target.value)}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={3}>
                                <Form.Group>
                                    <Form.Label className="small">파일 유형</Form.Label>
                                    <Form.Select
                                        size="sm"
                                        value={detailedSearch.fileTypes}
                                        onChange={(e) => {
                                            const val = e.target.value
                                            handleDetailedSearchChange("fileTypes", val)
                                        }}
                                    >
                                        <option value="">파일 타입 선택</option>
                                        {fileTypesList.map((ft) => (
                                            <option key={ft} value={ft}>{ft}</option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={3}>
                                <Form.Group>
                                    <Form.Label className="small">파일 용도</Form.Label>
                                    <Form.Select
                                        size="sm"
                                        value={detailedSearch.fileUsage}
                                        onChange={(e) => handleDetailedSearchChange("fileUsage", e.target.value)}
                                    >
                                        <option value="">파일 용도 선택</option>
                                        {folders.map((folder) => (
                                            <option key={folder.id} value={folder.name}>
                                                {folder.name}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={3}>
                                <Form.Group>
                                    <Form.Label className="small">삭제 여부</Form.Label>
                                    <Form.Select
                                        size="sm"
                                        value={detailedSearch.isDeleted}
                                        onChange={(e) => handleDetailedSearchChange("isDeleted", e.target.value)}
                                    >
                                        <option value="">---</option>
                                        <option value="true">예</option>
                                        <option value="false">아니오</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={3}>
                                <Form.Group>
                                    <Form.Label className="small">활성화 여부</Form.Label>
                                    <Form.Select
                                        size="sm"
                                        value={detailedSearch.isActivated}
                                        onChange={(e) => handleDetailedSearchChange("isActivated", e.target.value)}
                                    >
                                        <option value="">---</option>
                                        <option value="true">예</option>
                                        <option value="false">아니오</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={3}>
                                <Form.Group>
                                    <Form.Label className="small" htmlFor="createdFrom">생성일 (시작)</Form.Label>
                                    <Form.Control
                                        id="createdFrom"
                                        type="datetime-local"
                                        size="sm"
                                        value={detailedSearch.createdFrom}
                                        onChange={(e) => handleDetailedSearchChange("createdFrom", e.target.value)}
                                        ref={startDateRef}
                                        onClick={() => startDateRef.current?.showPicker()}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={3}>
                                <Form.Group>
                                    <Form.Label className="small" htmlFor="createdTo">생성일 (종료)</Form.Label>
                                    <Form.Control
                                        id="createdTo"
                                        type="datetime-local"
                                        size="sm"
                                        value={detailedSearch.createdTo}
                                        onChange={(e) => handleDetailedSearchChange("createdTo", e.target.value)}
                                        ref={endDateRef}
                                        onClick={() => endDateRef.current?.showPicker()}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={3}>
                                <Form.Group>
                                    <Form.Label className="small">최소 크기 (바이트)</Form.Label>
                                    <Form.Control
                                        type="number"
                                        size="sm"
                                        min={0}
                                        placeholder="최소 크기"
                                        value={detailedSearch.minSize}
                                        onChange={(e) => handleDetailedSearchChange("minSize", e.target.value)}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={3}>
                                <Form.Group>
                                    <Form.Label className="small">최대 크기 (바이트)</Form.Label>
                                    <Form.Control
                                        type="number"
                                        size="sm"
                                        min={0}
                                        placeholder="최대 크기"
                                        value={detailedSearch.maxSize}
                                        onChange={(e) => handleDetailedSearchChange("maxSize", e.target.value)}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <div className="mt-2 d-flex gap-2 justify-content-end">
                            <Button variant="primary" size="sm" onClick={handleDetailedSearchTrigger}>
                                검색
                            </Button>
                            <Button variant="outline-secondary" size="sm" onClick={resetDetailedSearch}>
                                초기화
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="search-group">
                        <InputGroup size="sm">
                            <Form.Control
                                type="text"
                                placeholder="파일명 검색"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyPress={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault();
                                        handleSearchTrigger();
                                    }
                                }}
                            />
                            <Button variant="outline-secondary" onClick={handleSearchTrigger}>
                                🔍
                            </Button>
                        </InputGroup>
                    </div>
                )}

                <div className="control-group page-size-group">
                    <Form.Select
                        id="page-size-select"
                        size="sm"
                        value={pageSize}
                        onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                        style={{ width: "auto" }}
                    >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                    </Form.Select>
                </div>
            </div>

            <div className="file-table-container">
                {loading ? (
                    <div className="text-center p-4">파일 로딩 중...</div>
                ) : files.length === 0 ? (
                    <div className="no-files">
                        {searchQuery || detailedSearchToggle ? "검색 조건에 맞는 파일이 없습니다." : "이 폴더에 파일이 없습니다."}
                    </div>
                ) : (
                    <>
                        <Table hover className="file-table">
                            <thead>
                                <tr>
                                    <th className={getSortClass("filename")} onClick={() => handleSort("filename")}>이름</th>
                                    <th className={getSortClass("detail")} onClick={() => handleSort("detail")}>설명</th>
                                    <th className={getSortClass("size")} onClick={() => handleSort("size")}>크기</th>
                                    <th className={getSortClass("fileTypes")} onClick={() => handleSort("fileTypes")}>유형</th>
                                    <th className={getSortClass("createdAt")} onClick={() => handleSort("createdAt")}>생성일</th>
                                </tr>
                            </thead>
                            <tbody>
                                {files.map(file => (
                                    <tr
                                        key={file.id}
                                        className={selectedFile?.id === file.id ? "selected" : ""}
                                        onClick={() => onFileSelect(file)}
                                    >
                                        <td>
                                            <div className="file-name-cell">
                                                <span className="file-icon">{getFileIcon(file.extension)}</span>
                                                {file.filename}
                                            </div>
                                        </td>
                                        <td className="file-detail">{file.detail}</td>
                                        <td className="file-size">{file.fileSizeFormatted}</td>
                                        <td className="file-type">{file.fileTypes}</td>
                                        <td className="file-date">{formatDate(file.createdAt)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>

                        <div className="pagination-container d-flex justify-content-between align-items-center p-3">
                            <div className="pagination-info">
                                총 {totalElements}개
                            </div>
                            <Pagination className="mb-0">
                                <Pagination.First onClick={() => handlePageChange(0)} disabled={currentPage === 0} />
                                <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 0} />
                                {renderPaginationItems()}
                                <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages - 1} />
                                <Pagination.Last onClick={() => handlePageChange(totalPages - 1)} disabled={currentPage === totalPages - 1} />
                            </Pagination>
                        </div>
                    </>
                )}
            </div>
        </div >
    )
}

export default FileList