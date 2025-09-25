"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"
import { Search, MoreHorizontal, Trash2, Merge, Tag } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface TagItem {
  id: string
  name: string
  slug: string
  postCount: number
  createdAt: string
  lastUsed: string
}

const mockTags: TagItem[] = [
  {
    id: "1",
    name: "React",
    slug: "react",
    postCount: 25,
    createdAt: "2024-01-01T00:00:00Z",
    lastUsed: "2024-01-20T10:30:00Z",
  },
  {
    id: "2",
    name: "Next.js",
    slug: "nextjs",
    postCount: 18,
    createdAt: "2024-01-01T00:00:00Z",
    lastUsed: "2024-01-19T14:20:00Z",
  },
  {
    id: "3",
    name: "TypeScript",
    slug: "typescript",
    postCount: 22,
    createdAt: "2024-01-01T00:00:00Z",
    lastUsed: "2024-01-18T16:45:00Z",
  },
  {
    id: "4",
    name: "JavaScript",
    slug: "javascript",
    postCount: 35,
    createdAt: "2024-01-01T00:00:00Z",
    lastUsed: "2024-01-20T09:15:00Z",
  },
  {
    id: "5",
    name: "CSS",
    slug: "css",
    postCount: 28,
    createdAt: "2024-01-01T00:00:00Z",
    lastUsed: "2024-01-17T11:30:00Z",
  },
  {
    id: "6",
    name: "UI/UX",
    slug: "ui-ux",
    postCount: 15,
    createdAt: "2024-01-01T00:00:00Z",
    lastUsed: "2024-01-16T13:20:00Z",
  },
  {
    id: "7",
    name: "Design Systems",
    slug: "design-systems",
    postCount: 12,
    createdAt: "2024-01-01T00:00:00Z",
    lastUsed: "2024-01-15T15:10:00Z",
  },
  {
    id: "8",
    name: "Web Development",
    slug: "web-development",
    postCount: 42,
    createdAt: "2024-01-01T00:00:00Z",
    lastUsed: "2024-01-20T12:45:00Z",
  },
  {
    id: "9",
    name: "Performance",
    slug: "performance",
    postCount: 8,
    createdAt: "2024-01-01T00:00:00Z",
    lastUsed: "2024-01-14T10:20:00Z",
  },
  {
    id: "10",
    name: "SEO",
    slug: "seo",
    postCount: 6,
    createdAt: "2024-01-01T00:00:00Z",
    lastUsed: "2024-01-12T14:30:00Z",
  },
  {
    id: "11",
    name: "Accessibility",
    slug: "accessibility",
    postCount: 4,
    createdAt: "2024-01-01T00:00:00Z",
    lastUsed: "2024-01-10T16:15:00Z",
  },
  {
    id: "12",
    name: "Testing",
    slug: "testing",
    postCount: 9,
    createdAt: "2024-01-01T00:00:00Z",
    lastUsed: "2024-01-13T11:45:00Z",
  },
  {
    id: "13",
    name: "DevOps",
    slug: "devops",
    postCount: 7,
    createdAt: "2024-01-01T00:00:00Z",
    lastUsed: "2024-01-11T09:30:00Z",
  },
  {
    id: "14",
    name: "API",
    slug: "api",
    postCount: 16,
    createdAt: "2024-01-01T00:00:00Z",
    lastUsed: "2024-01-19T13:20:00Z",
  },
  {
    id: "15",
    name: "Database",
    slug: "database",
    postCount: 11,
    createdAt: "2024-01-01T00:00:00Z",
    lastUsed: "2024-01-16T10:45:00Z",
  },
]

export function TagsManagement() {
  const [tags, setTags] = useState<TagItem[]>(mockTags)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState<string>("name")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const { toast } = useToast()

  const filteredTags = tags
    .filter((tag) => tag.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name)
        case "posts":
          return b.postCount - a.postCount
        case "recent":
          return new Date(b.lastUsed).getTime() - new Date(a.lastUsed).getTime()
        case "created":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        default:
          return 0
      }
    })

  const handleDeleteTag = (tagId: string) => {
    setTags((prev) => prev.filter((tag) => tag.id !== tagId))
    toast({
      title: "Tag Deleted",
      description: "Tag has been deleted successfully.",
    })
  }

  const handleBulkDelete = () => {
    if (selectedTags.length === 0) return

    setTags((prev) => prev.filter((tag) => !selectedTags.includes(tag.id)))
    setSelectedTags([])
    toast({
      title: "Tags Deleted",
      description: `${selectedTags.length} tags have been deleted successfully.`,
    })
  }

  const handleMergeTags = () => {
    if (selectedTags.length < 2) {
      toast({
        title: "Select Multiple Tags",
        description: "Please select at least 2 tags to merge.",
        variant: "destructive",
      })
      return
    }

    // In a real app, this would open a merge dialog
    toast({
      title: "Merge Tags",
      description: `Merging ${selectedTags.length} tags would be implemented here.`,
    })
  }

  const toggleTagSelection = (tagId: string) => {
    setSelectedTags((prev) => (prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]))
  }

  const toggleAllTags = () => {
    setSelectedTags(selectedTags.length === filteredTags.length ? [] : filteredTags.map((tag) => tag.id))
  }

  const getUsageColor = (postCount: number) => {
    if (postCount >= 30) return "bg-green-100 text-green-800"
    if (postCount >= 15) return "bg-blue-100 text-blue-800"
    if (postCount >= 5) return "bg-yellow-100 text-yellow-800"
    return "bg-gray-100 text-gray-800"
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Tags Management</h1>
        <p className="text-muted-foreground">Manage, merge, and organize content tags</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Tags</CardTitle>
          <CardDescription>View and manage all tags used across the platform</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters and Search */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name (A-Z)</SelectItem>
                <SelectItem value="posts">Most Used</SelectItem>
                <SelectItem value="recent">Recently Used</SelectItem>
                <SelectItem value="created">Recently Created</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Bulk Actions */}
          {selectedTags.length > 0 && (
            <div className="flex items-center gap-2 mb-4 p-3 bg-muted rounded-lg">
              <span className="text-sm font-medium">{selectedTags.length} tags selected</span>
              <Button size="sm" variant="outline" onClick={handleMergeTags}>
                <Merge className="h-4 w-4 mr-2" />
                Merge Tags
              </Button>
              <Button size="sm" variant="destructive" onClick={handleBulkDelete}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Selected
              </Button>
            </div>
          )}

          {/* Tags Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">
                    <Checkbox
                      checked={selectedTags.length === filteredTags.length && filteredTags.length > 0}
                      onCheckedChange={toggleAllTags}
                    />
                  </TableHead>
                  <TableHead>Tag</TableHead>
                  <TableHead>Posts</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Last Used</TableHead>
                  <TableHead className="w-[70px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTags.map((tag) => (
                  <TableRow key={tag.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedTags.includes(tag.id)}
                        onCheckedChange={() => toggleTagSelection(tag.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Tag className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="font-medium">{tag.name}</div>
                          <div className="text-sm text-muted-foreground">/{tag.slug}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={getUsageColor(tag.postCount)}>
                        {tag.postCount} posts
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(tag.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>{new Date(tag.lastUsed).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Tag className="mr-2 h-4 w-4" />
                            View Posts
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Merge className="mr-2 h-4 w-4" />
                            Merge with...
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeleteTag(tag.id)}
                            className="text-red-600"
                            disabled={tag.postCount > 0}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Summary Stats */}
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{tags.length}</div>
              <div className="text-sm text-muted-foreground">Total Tags</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{tags.filter((t) => t.postCount > 0).length}</div>
              <div className="text-sm text-muted-foreground">Used Tags</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{tags.filter((t) => t.postCount === 0).length}</div>
              <div className="text-sm text-muted-foreground">Unused Tags</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {Math.round(tags.reduce((sum, t) => sum + t.postCount, 0) / tags.length)}
              </div>
              <div className="text-sm text-muted-foreground">Avg Usage</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
