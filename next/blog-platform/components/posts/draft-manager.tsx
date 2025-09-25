"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { usePostManagement } from "@/lib/post-management"
import { formatDate } from "@/lib/blog-data"
import { Search, Edit, Trash2, Calendar, EyeOff, Users, Globe, Clock, FileText, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function DraftManager() {
  const { drafts, loadDraft, deleteDraft, publishPost } = usePostManagement()
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [selectedDrafts, setSelectedDrafts] = useState<string[]>([])

  const filteredDrafts = drafts.filter((draft) => {
    const matchesSearch =
      draft.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      draft.content.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesFilter =
      filterStatus === "all" ||
      (filterStatus === "scheduled" && draft.scheduledAt) ||
      (filterStatus === "draft" && !draft.scheduledAt)

    return matchesSearch && matchesFilter
  })

  const handleSelectDraft = (draftId: string, checked: boolean) => {
    if (checked) {
      setSelectedDrafts([...selectedDrafts, draftId])
    } else {
      setSelectedDrafts(selectedDrafts.filter((id) => id !== draftId))
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedDrafts(filteredDrafts.map((d) => d.id))
    } else {
      setSelectedDrafts([])
    }
  }

  const handleBulkDelete = () => {
    selectedDrafts.forEach((id) => deleteDraft(id))
    setSelectedDrafts([])
  }

  const handleBulkPublish = async () => {
    for (const id of selectedDrafts) {
      await publishPost(id)
    }
    setSelectedDrafts([])
  }

  const getVisibilityIcon = (visibility: string) => {
    switch (visibility) {
      case "public":
        return <Globe className="h-4 w-4" />
      case "private":
        return <EyeOff className="h-4 w-4" />
      case "followers-only":
        return <Users className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">My Posts</h1>
        <Button onClick={() => loadDraft("")}>
          <Edit className="h-4 w-4 mr-2" />
          New Post
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search posts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Posts</SelectItem>
            <SelectItem value="draft">Drafts</SelectItem>
            <SelectItem value="scheduled">Scheduled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Bulk Actions */}
      {selectedDrafts.length > 0 && (
        <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
          <span className="text-sm font-medium">
            {selectedDrafts.length} post{selectedDrafts.length > 1 ? "s" : ""} selected
          </span>
          <Button variant="outline" size="sm" onClick={handleBulkPublish}>
            Publish Selected
          </Button>
          <Button variant="destructive" size="sm" onClick={handleBulkDelete}>
            Delete Selected
          </Button>
        </div>
      )}

      {/* Posts List */}
      <div className="space-y-4">
        {filteredDrafts.length > 0 && (
          <div className="flex items-center gap-2 pb-2 border-b">
            <Checkbox checked={selectedDrafts.length === filteredDrafts.length} onCheckedChange={handleSelectAll} />
            <span className="text-sm text-muted-foreground">Select all</span>
          </div>
        )}

        {filteredDrafts.map((draft) => (
          <Card key={draft.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <Checkbox
                  checked={selectedDrafts.includes(draft.id)}
                  onCheckedChange={(checked) => handleSelectDraft(draft.id, checked as boolean)}
                />

                <div className="flex-1 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <h3 className="text-lg font-semibold line-clamp-1">{draft.title || "Untitled Post"}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {draft.excerpt || draft.content.substring(0, 150) + "..."}
                      </p>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => loadDraft(draft.id)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => publishPost(draft.id)}>
                          <FileText className="h-4 w-4 mr-2" />
                          Publish
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => deleteDraft(draft.id)} className="text-destructive">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      {getVisibilityIcon(draft.visibility)}
                      <span className="capitalize">{draft.visibility.replace("-", " ")}</span>
                    </div>

                    {draft.scheduledAt && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>Scheduled for {formatDate(draft.scheduledAt)}</span>
                      </div>
                    )}

                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>Updated {formatDate(draft.updatedAt)}</span>
                    </div>

                    <span>{draft.wordCount} words</span>
                    <span>{draft.readTime} min read</span>
                  </div>

                  {draft.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {draft.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {draft.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{draft.tags.length - 3} more
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredDrafts.length === 0 && (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No posts found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm ? "Try adjusting your search terms" : "Start writing your first post"}
            </p>
            <Button onClick={() => loadDraft("")}>
              <Edit className="h-4 w-4 mr-2" />
              Create New Post
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
