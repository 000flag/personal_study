export interface Folder {
    id: string
    name: string
    path: string
    parentId: string | null
    children: string[]
    category: string
}

export interface FolderApiResponse {
    data: string[]
}

export interface FileItem {
    id: number
    refId?: number
    size: number
    fileTypes: string
    fileUsage: string
    extension: string
    detail: string
    hash: string
    filename: string
    externalPath: string
    activated: boolean
    createdAt: string
    fileSizeFormatted: string
    thumbnailUrl: string
}

export interface SearchResponse {
    timestamp: string
    data: {
        content: FileItem[]
        pageable: {
            pageNumber: number
            pageSize: number
            sort: {
                sorted: boolean
                unsorted: boolean
                empty: boolean
            }
            offset: number
            paged: boolean
            unpaged: boolean
        }
        totalElements: number
        totalPages: number
        last: boolean
        numberOfElements: number
        number: number
        sort: {
            sorted: boolean
            unsorted: boolean
            empty: boolean
        }
        first: boolean
        size: number
        empty: boolean
    }
}

export interface UploadResponse {
    success: boolean
    fileId?: string
    message?: string
}

export interface SearchOptions {
    filename?: string
    fileTypes?: string
    fileUsage?: string
    extension?: string
    detail?: string
    isDeleted?: string
    isActivated?: string
    createdFrom?: string
    createdTo?: string
    minSize?: string
    maxSize?: string
    page?: string
    size?: string
    sortBy?: string
    sortDirection?: string
}

export interface ConvertResponse {
    success: boolean
    message?: string
}

export interface FileTypesResponse {
    timestamp: string
    data: string[]
}
