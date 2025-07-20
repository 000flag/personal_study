// API calls will be implemented here

export interface Folder {
  id: string
  name: string
  path: string
  parentId: string | null
  children: string[]
  category: "image" | "video" | "zip"
}

export interface FileItem {
  id: string
  name: string
  size: number
  type: string
  extension: string
  dateModified: string
  folderId: string
  path: string
  category: "image" | "video" | "zip"
}

export interface UploadResponse {
  success: boolean
  fileId?: string
  message?: string
}

// Fetch folders from API - now shows all folders since they're shared
export const fetchFolders = async (category = "image"): Promise<Folder[]> => {
  try {
    const response = await fetch("../data/folders.json")
    const data = await response.json()
    // Return all folders since they are shared/common
    return data.folders
  } catch (error) {
    console.error("Error fetching folders:", error)
    return []
  }
}

// Fetch files from API
export const fetchFiles = async (folderId?: string, category = "image"): Promise<FileItem[]> => {
  try {
    const response = await fetch("../data/files.json")
    const data = await response.json()
    let files: FileItem[] = data.files

    if (folderId) {
      files = files.filter((file: FileItem) => file.folderId === folderId)
    }

    // Filter by category to show only files matching the selected category
    files = files.filter((file) => file.category === category)

    return files
  } catch (error) {
    console.error("Error fetching files:", error)
    return []
  }
}

// Upload file to API
export const uploadFile = async (file: File, folderName: string, description: string): Promise<UploadResponse> => {
  try {
    // Prepare FormData for file upload
    const formData = new FormData()
    formData.append("file", file)
    formData.append("folder", folderName) // Changed from folderId to folder name
    formData.append("description", description)

    // This is a stub for the actual API call
    console.log("Preparing to upload file:", file.name, "to folder:", folderName, "with description:", description)

    // Simulate API call
    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    })

    if (response.ok) {
      const result = await response.json()
      return { success: true, fileId: result.fileId }
    } else {
      return { success: false, message: "Upload failed" }
    }
  } catch (error) {
    console.error("Error uploading file:", error)
    return { success: false, message: "Upload error occurred" }
  }
}

// Search files
export const searchFiles = async (query: string): Promise<FileItem[]> => {
  try {
    const allFiles = await fetchFiles()
    return allFiles.filter((file) => file.name.toLowerCase().includes(query.toLowerCase()))
  } catch (error) {
    console.error("Error searching files:", error)
    return []
  }
}
