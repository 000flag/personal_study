"use client"

import { useState } from "react"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { ResponsiveLayout } from "@/components/layout/responsive-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { blogPosts } from "@/lib/blog-data"
import { MobilePostCard } from "@/components/feed/mobile-post-card"
import { DesktopPostCard } from "@/components/feed/desktop-post-card"
import { useMobile } from "@/hooks/use-mobile"
import { Search, Bookmark, Calendar, FolderOpen, Trash2 } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"

export default function BookmarksPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("bookmarked")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [selectedBookmarks, setSelectedBookmarks] = useState<string[]>([])
  const isMobile = useMobile()

  // Mock bookmarked posts (in a real app, this would come from user's bookmarks)
  const bookmarkedPosts = blogPosts.slice(0, 8).map((post) => ({
    ...post,
    bookmarkedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    folder: Math.random() > 0.5 ? "To Read Later" : "Favorites",
  }))

  const filteredPosts = bookmarkedPosts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.author.name.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory = categoryFilter === "all" || post.category === categoryFilter

    return matchesSearch && matchesCategory
  })

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    switch (sortBy) {
      case "title":
        return a.title.localeCompare(b.title)
      case "author":
        return a.author.name.localeCompare(b.author.name)
      case "published":
        return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      case "folder":
        return a.folder.localeCompare(b.folder)
      case "bookmarked":
      default:
        return new Date(b.bookmarkedAt).getTime() - new Date(a.bookmarkedAt).getTime()
    }
  })

  const categories = Array.from(new Set(bookmarkedPosts.map((post) => post.category)))
  const folders = Array.from(new Set(bookmarkedPosts.map((post) => post.folder)))

  const handleSelectBookmark = (postId: string, checked: boolean) => {
    if (checked) {
      setSelectedBookmarks([...selectedBookmarks, postId])
    } else {
      setSelectedBookmarks(selectedBookmarks.filter((id) => id !== postId))
    }
  }

  const handleBulkRemove = () => {
    // In a real app, this would remove bookmarks from the backend
    setSelectedBookmarks([])
  }

  return (
    <ProtectedRoute>
      <ResponsiveLayout>
        <div className="container mx-auto px-4 py-6 max-w-6xl">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">Bookmarks</h1>
                <p className="text-muted-foreground">Save posts to read later or reference again</p>
              </div>
              <div className="flex items-center gap-2">
                <Bookmark className="h-5 w-5 text-blue-500" />
                <span className="font-semibold">{bookmarkedPosts.length}</span>
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search bookmarks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bookmarked">Recently Bookmarked</SelectItem>
                  <SelectItem value="published">Recently Published</SelectItem>
                  <SelectItem value="title">Title</SelectItem>
                  <SelectItem value="author">Author</SelectItem>
                  <SelectItem value="folder">Folder</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Bulk Actions */}
            {selectedBookmarks.length > 0 && (
              <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
                <span className="text-sm font-medium">
                  {selectedBookmarks.length} bookmark{selectedBookmarks.length > 1 ? "s" : ""} selected
                </span>
                <Button variant="destructive" size="sm" onClick={handleBulkRemove}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Remove Selected
                </Button>
              </div>
            )}

            {/* Folders Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <Bookmark className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-medium">Total Bookmarks</span>
                </div>
                <div className="text-2xl font-bold mt-1">{bookmarkedPosts.length}</div>
              </div>
              {folders.map((folder) => (
                <div key={folder} className="bg-muted/50 rounded-lg p-4">
                  <div className="flex items-center gap-2">
                    <FolderOpen className="h-4 w-4 text-orange-500" />
                    <span className="text-sm font-medium">{folder}</span>
                  </div>
                  <div className="text-2xl font-bold mt-1">
                    {bookmarkedPosts.filter((post) => post.folder === folder).length}
                  </div>
                </div>
              ))}
            </div>

            {/* Posts */}
            {sortedPosts.length === 0 ? (
              <div className="text-center py-12">
                <Bookmark className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No bookmarks found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm || categoryFilter !== "all"
                    ? "Try adjusting your filters"
                    : "Start bookmarking posts to save them for later"}
                </p>
                <Button asChild>
                  <a href="/">Explore Posts</a>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {!isMobile && (
                  <div className="flex items-center gap-2 pb-2 border-b">
                    <Checkbox
                      checked={selectedBookmarks.length === sortedPosts.length}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedBookmarks(sortedPosts.map((post) => post.id))
                        } else {
                          setSelectedBookmarks([])
                        }
                      }}
                    />
                    <span className="text-sm text-muted-foreground">Select all</span>
                  </div>
                )}

                <div className={isMobile ? "grid grid-cols-2 gap-3" : "space-y-6"}>
                  {sortedPosts.map((post) => (
                    <div key={post.id} className={isMobile ? "" : "flex items-start gap-4"}>
                      {!isMobile && (
                        <Checkbox
                          checked={selectedBookmarks.includes(post.id)}
                          onCheckedChange={(checked) => handleSelectBookmark(post.id, checked as boolean)}
                          className="mt-4"
                        />
                      )}
                      <div className="flex-1">
                        {isMobile ? (
                          <MobilePostCard post={post} />
                        ) : (
                          <div className="space-y-2">
                            <DesktopPostCard post={post} />
                            <div className="flex items-center gap-2 text-xs text-muted-foreground ml-4">
                              <FolderOpen className="h-3 w-3" />
                              <span>{post.folder}</span>
                              <span>•</span>
                              <Calendar className="h-3 w-3" />
                              <span>Bookmarked {new Date(post.bookmarkedAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </ResponsiveLayout>
    </ProtectedRoute>
  )
}
