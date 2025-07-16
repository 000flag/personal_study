// API calls will be implemented here

export interface Folder {
  id: string
  name: string
  path: string
  parentId: string | null
  children: string[]
  category: "all" | "image" | "video" | "document" | "audio"
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
  category: "all" | "image" | "video" | "document" | "audio"
}

export interface UploadResponse {
  success: boolean
  fileId?: string
  message?: string
}

// Fetch folders from API
export const fetchFolders = async (category = "all"): Promise<Folder[]> => {
  try {
    const response = await fetch("../data/folders.json")
    const data = await response.json()
    let folders: Folder[] = data.folders

    if (category !== "all") {
      folders = folders.filter((folder) => folder.category === category || folder.category === "all")
    }

    return folders
  } catch (error) {
    console.error("Error fetching folders:", error)
    return []
  }
}

// Fetch files from API
export const fetchFiles = async (folderId?: string, category = "all"): Promise<FileItem[]> => {
  try {
    const response = await fetch("../data/files.json")
    const data = await response.json()
    let files: FileItem[] = data.files

    if (folderId) {
      files = files.filter((file: FileItem) => file.folderId === folderId)
    }

    if (category !== "all") {
      files = files.filter((file) => file.category === category)
    }

    return files
  } catch (error) {
    console.error("Error fetching files:", error)
    return []
  }
}

// Upload file to API
export const uploadFile = async (file: File, folderId: string, description: string): Promise<UploadResponse> => {
  try {
    // Prepare FormData for file upload
    const formData = new FormData()
    formData.append("file", file)
    formData.append("folderId", folderId)
    formData.append("description", description) // Add description to form data

    // This is a stub for the actual API call
    console.log("Preparing to upload file:", file.name, "to folder:", folderId, "with description:", description)

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
