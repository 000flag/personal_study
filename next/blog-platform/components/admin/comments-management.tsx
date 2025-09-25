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
import { Search, MoreHorizontal, Eye, CheckCircle, XCircle, Trash2, Flag } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Comment {
  id: string
  content: string
  author: string
  postTitle: string
  status: "approved" | "pending" | "spam" | "hidden"
  likes: number
  replies: number
  createdAt: string
  isReported: boolean
}

const mockComments: Comment[] = [
  {
    id: "1",
    content: "Great article! This really helped me understand the concepts better.",
    author: "Alice Johnson",
    postTitle: "Getting Started with Next.js 15",
    status: "approved",
    likes: 12,
    replies: 3,
    createdAt: "2024-01-15T12:30:00Z",
    isReported: false,
  },
  {
    id: "2",
    content: "I disagree with some points here. The approach seems outdated.",
    author: "Bob Smith",
    postTitle: "The Future of Web Development",
    status: "pending",
    likes: 2,
    replies: 1,
    createdAt: "2024-01-20T15:45:00Z",
    isReported: false,
  },
  {
    id: "3",
    content: "This is spam content with promotional links...",
    author: "Spam User",
    postTitle: "Design Systems Best Practices",
    status: "spam",
    likes: 0,
    replies: 0,
    createdAt: "2024-01-18T10:20:00Z",
    isReported: true,
  },
  {
    id: "4",
    content: "Excellent breakdown of the topic. Looking forward to more content like this!",
    author: "Carol Davis",
    postTitle: "Building Scalable React Applications",
    status: "approved",
    likes: 8,
    replies: 2,
    createdAt: "2024-01-10T14:15:00Z",
    isReported: false,
  },
  {
    id: "5",
    content: "Could you provide more examples? The current ones are not clear enough.",
    author: "David Wilson",
    postTitle: "UX Research Methods",
    status: "hidden",
    likes: 1,
    replies: 0,
    createdAt: "2024-01-05T16:30:00Z",
    isReported: false,
  },
]

export function CommentsManagement() {
  const [comments, setComments] = useState<Comment[]>(mockComments)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedComments, setSelectedComments] = useState<string[]>([])
  const { toast } = useToast()

  const filteredComments = comments.filter((comment) => {
    const matchesSearch =
      comment.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comment.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comment.postTitle.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || comment.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleCommentAction = (commentId: string, action: string) => {
    setComments((prev) =>
      prev.map((comment) => {
        if (comment.id === commentId) {
          switch (action) {
            case "approve":
              return { ...comment, status: "approved" as const }
            case "hide":
              return { ...comment, status: "hidden" as const }
            case "spam":
              return { ...comment, status: "spam" as const }
            case "delete":
              return comment // Will be filtered out below
            default:
              return comment
          }
        }
        return comment
      }),
    )

    if (action === "delete") {
      setComments((prev) => prev.filter((comment) => comment.id !== commentId))
    }

    toast({
      title: "Comment Updated",
      description: `Comment ${action} action completed successfully.`,
    })
  }

  const handleBulkAction = (action: string) => {
    if (selectedComments.length === 0) return

    setComments((prev) =>
      prev.map((comment) => {
        if (selectedComments.includes(comment.id)) {
          switch (action) {
            case "approve":
              return { ...comment, status: "approved" as const }
            case "hide":
              return { ...comment, status: "hidden" as const }
            case "spam":
              return { ...comment, status: "spam" as const }
            default:
              return comment
          }
        }
        return comment
      }),
    )

    if (action === "delete") {
      setComments((prev) => prev.filter((comment) => !selectedComments.includes(comment.id)))
    }

    setSelectedComments([])
    toast({
      title: "Bulk Action Completed",
      description: `${selectedComments.length} comments updated successfully.`,
    })
  }

  const getStatusBadge = (status: Comment["status"]) => {
    switch (status) {
      case "approved":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            Approved
          </Badge>
        )
      case "pending":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            Pending
          </Badge>
        )
      case "spam":
        return <Badge variant="destructive">Spam</Badge>
      case "hidden":
        return <Badge variant="outline">Hidden</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const toggleCommentSelection = (commentId: string) => {
    setSelectedComments((prev) =>
      prev.includes(commentId) ? prev.filter((id) => id !== commentId) : [...prev, commentId],
    )
  }

  const toggleAllComments = () => {
    setSelectedComments(
      selectedComments.length === filteredComments.length ? [] : filteredComments.map((comment) => comment.id),
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Comments Management</h1>
        <p className="text-muted-foreground">Moderate and manage all comments across the platform</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Comments</CardTitle>
          <CardDescription>Review, approve, and moderate user comments</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters and Search */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search comments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="spam">Spam</SelectItem>
                <SelectItem value="hidden">Hidden</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Bulk Actions */}
          {selectedComments.length > 0 && (
            <div className="flex items-center gap-2 mb-4 p-3 bg-muted rounded-lg">
              <span className="text-sm font-medium">{selectedComments.length} comments selected</span>
              <Button size="sm" variant="outline" onClick={() => handleBulkAction("approve")}>
                <CheckCircle className="h-4 w-4 mr-2" />
                Approve
              </Button>
              <Button size="sm" variant="outline" onClick={() => handleBulkAction("hide")}>
                <XCircle className="h-4 w-4 mr-2" />
                Hide
              </Button>
              <Button size="sm" variant="outline" onClick={() => handleBulkAction("spam")}>
                <Flag className="h-4 w-4 mr-2" />
                Mark as Spam
              </Button>
              <Button size="sm" variant="destructive" onClick={() => handleBulkAction("delete")}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          )}

          {/* Comments Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">
                    <Checkbox
                      checked={selectedComments.length === filteredComments.length && filteredComments.length > 0}
                      onCheckedChange={toggleAllComments}
                    />
                  </TableHead>
                  <TableHead>Comment</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Post</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Likes</TableHead>
                  <TableHead>Replies</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="w-[70px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredComments.map((comment) => (
                  <TableRow key={comment.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedComments.includes(comment.id)}
                        onCheckedChange={() => toggleCommentSelection(comment.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="max-w-[300px]">
                        <p className="text-sm truncate">{comment.content}</p>
                        {comment.isReported && (
                          <Badge variant="destructive" className="mt-1 text-xs">
                            <Flag className="h-3 w-3 mr-1" />
                            Reported
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{comment.author}</TableCell>
                    <TableCell>
                      <div className="max-w-[200px] truncate text-sm text-muted-foreground">{comment.postTitle}</div>
                    </TableCell>
                    <TableCell>{getStatusBadge(comment.status)}</TableCell>
                    <TableCell>{comment.likes}</TableCell>
                    <TableCell>{comment.replies}</TableCell>
                    <TableCell>{new Date(comment.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            View Full
                          </DropdownMenuItem>
                          {comment.status !== "approved" && (
                            <DropdownMenuItem onClick={() => handleCommentAction(comment.id, "approve")}>
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Approve
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem onClick={() => handleCommentAction(comment.id, "hide")}>
                            <XCircle className="mr-2 h-4 w-4" />
                            Hide
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleCommentAction(comment.id, "spam")}>
                            <Flag className="mr-2 h-4 w-4" />
                            Mark as Spam
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleCommentAction(comment.id, "delete")}
                            className="text-red-600"
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
        </CardContent>
      </Card>
    </div>
  )
}
