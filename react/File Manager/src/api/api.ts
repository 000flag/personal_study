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

const API_URL = process.env.REACT_APP_API_URL;

// 캐시 변수
let cachedUsageNames: string[] | null = null

// 폴더 가져오기
export const fetchFolders = async (
  category: Folder["category"] = "image"
): Promise<Folder[]> => {
  try {
    // 캐시에 데이터가 없을 때만 fetch
    if (cachedUsageNames === null) {
      const response = await fetch(`/api/common/file-usages`, {
        cache: "no-store",
      })
      if (!response.ok) throw new Error("폴더 조회 실패")
      const json = (await response.json()) as FolderApiResponse
      cachedUsageNames = json.data
    }

    // 캐시된 문자열 배열을 Folder[]로 매핑하여 반환
    return cachedUsageNames.map((name) => ({
      id: name,
      name,
      path: `/${name}`,
      parentId: null,
      children: [],
      category,
    }))
  } catch (err) {
    console.error("폴더 가져오기 오류:", err)
    return []
  }
}

// 파일 가져오기
export const fetchFiles = async (
  folderId?: string,
  category: Folder["category"] = "image",
  page = 0,
  size = 10
): Promise<SearchResponse> => {
  try {
    // 폴더 목록 조회
    const folders = await fetchFolders(category)

    // folderId와 일치하는 폴더를 찾아 이름 사용
    const matched = folderId
      ? folders.find((f) => f.id === folderId)
      : undefined
    const folderName = matched ? matched.name : ""

    const searchOptions: SearchOptions = {
      fileUsage: folderName,
      fileTypes: category.toUpperCase(),
      page: page.toString(),
      size: size.toString(),
      sortBy: "createdAt",
      sortDirection: "DESC",
    }

    return await searchFiles("", searchOptions)
  } catch (error) {
    console.error("파일 가져오기 오류:", error)
    return {
      timestamp: new Date().toISOString(),
      data: {
        content: [],
        pageable: {
          pageNumber: 0,
          pageSize: size,
          sort: { sorted: false, unsorted: true, empty: true },
          offset: 0,
          paged: true,
          unpaged: false,
        },
        totalElements: 0,
        totalPages: 0,
        last: true,
        numberOfElements: 0,
        number: 0,
        sort: { sorted: false, unsorted: true, empty: true },
        first: true,
        size: size,
        empty: true,
      },
    }
  }
}

// 파일 업로드
export const uploadFile = async (category: string, file: File, folderName: string, description: string): Promise<UploadResponse> => {
  try {
    const selectedFile = file;
    const usage = folderName;
    const detail = description;

    const formData = new FormData();
    formData.append("file", selectedFile);

    // 쿼리스트링
    const params = new URLSearchParams({
      usage,
      detail
    }).toString();

    // fetch 요청
    const response = await fetch(`/api/upload/${category.toLowerCase()}?${params}`, {
      method: "PUT",
      body: formData,
      headers: {
        Accept: "application/json"
      }
    });

    if (response.ok) {
      const result = await response.json();
      return { success: true, fileId: result.fileId };
    } else {
      return { success: false, message: "업로드에 실패했습니다." };
    }
  } catch (error) {
    console.error("파일을 업로드하는 도중 오류가 발생했습니다: ", error);
    return { success: false, message: "업로드 중 오류가 발생했습니다." };
  }
}

// 실패 응답 생성
const createEmptySearchResponse = (size: string | undefined): SearchResponse => {
  const pageSize = Number.parseInt(size || "10")
  return {
    timestamp: new Date().toISOString(),
    data: {
      content: [],
      pageable: {
        pageNumber: 0,
        pageSize,
        sort: { sorted: false, unsorted: true, empty: true },
        offset: 0,
        paged: true,
        unpaged: false,
      },
      totalElements: 0,
      totalPages: 0,
      last: true,
      numberOfElements: 0,
      number: 0,
      sort: { sorted: false, unsorted: true, empty: true },
      first: true,
      size: pageSize,
      empty: true,
    },
  }
}

// 옵션으로 파일 검색
export const searchFiles = async (query: string, options?: SearchOptions): Promise<SearchResponse> => {
  try {
    const params = new URLSearchParams()

    // 기본 페이지네이션 및 정렬 파라미터 설정
    params.append("page", options?.page || "0")
    params.append("size", options?.size || "10")
    params.append("sortBy", options?.sortBy || "createdAt")
    params.append("sortDirection", options?.sortDirection || "DESC")

    // 검색어가 있으면 추가
    if (query.trim()) {
      params.append("filename", encodeURIComponent(query))
    }

    // 추가 검색 옵션이 있으면 설정
    if (options?.filename?.trim()) params.set("filename", encodeURIComponent(options.filename))
    if (options?.fileTypes) params.append("fileTypes", options.fileTypes === 'PDF' ? 'FILE' : options.fileTypes)
    if (options?.fileUsage) params.append("fileUsage", options.fileUsage)
    if (options?.extension?.trim()) params.append("extension", options.extension)
    if (options?.detail?.trim()) params.append("detail", options.detail)
    if (options?.isDeleted) params.append("isDeleted", options.isDeleted)
    if (options?.isActivated) params.append("isActivated", options.isActivated)
    if (options?.createdFrom) params.append("createdFrom", options.createdFrom)
    if (options?.createdTo) params.append("createdTo", options.createdTo)
    if (options?.minSize) params.append("minSize", options.minSize)
    if (options?.maxSize) params.append("maxSize", options.maxSize)

    // 검색 API 호출
    const response = await fetch(`/api/search?${params.toString()}`, {
      cache: "no-store"
    });

    // 정상 응답 처리
    if (response.ok) {
      const data: SearchResponse = await response.json()
      return data
    } else {
      console.error("검색 API 오류:", response.status, response.statusText)
      return createEmptySearchResponse(options?.size)
    }
  } catch (error) {
    console.error("파일 검색 오류:", error)
    return createEmptySearchResponse(options?.size)
  }
}

// 변환
export const convertFile = async (fileId: number): Promise<ConvertResponse> => {
  try {
    const response = await fetch(`/api/convert/image?id=${fileId}`,
      {
        method: "GET",
        headers: {
          "Accept": "application/json"
        }
      }
    )
    if (!response.ok) {
      const err = await response.json()
      return { success: false, message: err.message || "변환 실패" }
    }
    return { success: true }
  } catch (error) {
    console.error("변환 API 호출 중 오류:", error)
    return { success: false, message: "서버 오류" }
  }
}

// 파일 타입 조회
export async function fetchFileTypes(): Promise<string[]> {
  const res = await fetch(`/api/common/file-types`)
  if (!res.ok) {
    throw new Error("파일 유형 목록을 불러오는데 실패했습니다.")
  }
  const json = (await res.json()) as FileTypesResponse
  return json.data
}