"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Search, MoreHorizontal, Edit, Trash2, Plus, Folder } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Category {
  id: string
  name: string
  slug: string
  description: string
  postCount: number
  color: string
  isActive: boolean
  createdAt: string
}

const mockCategories: Category[] = [
  {
    id: "1",
    name: "Technology",
    slug: "technology",
    description: "Articles about web development, programming, and tech trends",
    postCount: 45,
    color: "#3B82F6",
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "2",
    name: "Design",
    slug: "design",
    description: "UI/UX design, visual design, and design systems",
    postCount: 32,
    color: "#8B5CF6",
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "3",
    name: "Business",
    slug: "business",
    description: "Entrepreneurship, marketing, and business strategy",
    postCount: 28,
    color: "#10B981",
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "4",
    name: "Lifestyle",
    slug: "lifestyle",
    description: "Personal development, productivity, and life tips",
    postCount: 19,
    color: "#F59E0B",
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "5",
    name: "Travel",
    slug: "travel",
    description: "Travel guides, tips, and experiences",
    postCount: 12,
    color: "#EF4444",
    isActive: false,
    createdAt: "2024-01-01T00:00:00Z",
  },
]

export function CategoriesManagement() {
  const [categories, setCategories] = useState<Category[]>(mockCategories)
  const [searchTerm, setSearchTerm] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    color: "#3B82F6",
  })
  const { toast } = useToast()

  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleCreateCategory = () => {
    const newCategory: Category = {
      id: Date.now().toString(),
      name: formData.name,
      slug: formData.name.toLowerCase().replace(/\s+/g, "-"),
      description: formData.description,
      postCount: 0,
      color: formData.color,
      isActive: true,
      createdAt: new Date().toISOString(),
    }

    setCategories((prev) => [...prev, newCategory])
    setFormData({ name: "", description: "", color: "#3B82F6" })
    setIsCreateDialogOpen(false)

    toast({
      title: "Category Created",
      description: "New category has been created successfully.",
    })
  }

  const handleUpdateCategory = () => {
    if (!editingCategory) return

    setCategories((prev) =>
      prev.map((category) =>
        category.id === editingCategory.id
          ? {
              ...category,
              name: formData.name,
              slug: formData.name.toLowerCase().replace(/\s+/g, "-"),
              description: formData.description,
              color: formData.color,
            }
          : category,
      ),
    )

    setEditingCategory(null)
    setFormData({ name: "", description: "", color: "#3B82F6" })

    toast({
      title: "Category Updated",
      description: "Category has been updated successfully.",
    })
  }

  const handleDeleteCategory = (categoryId: string) => {
    setCategories((prev) => prev.filter((category) => category.id !== categoryId))
    toast({
      title: "Category Deleted",
      description: "Category has been deleted successfully.",
    })
  }

  const handleToggleActive = (categoryId: string) => {
    setCategories((prev) =>
      prev.map((category) => (category.id === categoryId ? { ...category, isActive: !category.isActive } : category)),
    )
  }

  const openEditDialog = (category: Category) => {
    setEditingCategory(category)
    setFormData({
      name: category.name,
      description: category.description,
      color: category.color,
    })
  }

  const resetForm = () => {
    setFormData({ name: "", description: "", color: "#3B82F6" })
    setEditingCategory(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Categories Management</h1>
          <p className="text-muted-foreground">Organize and manage content categories</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Category</DialogTitle>
              <DialogDescription>Add a new category to organize your content</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Category Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter category name"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter category description"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="color">Color</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="color"
                    type="color"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="w-16 h-10"
                  />
                  <Input
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    placeholder="#3B82F6"
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateCategory} disabled={!formData.name.trim()}>
                Create Category
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Categories</CardTitle>
          <CardDescription>Manage categories and their settings</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Search */}
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          {/* Categories Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Posts</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="w-[70px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCategories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: category.color }} />
                        <div>
                          <div className="font-medium">{category.name}</div>
                          <div className="text-sm text-muted-foreground">/{category.slug}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-[300px] truncate text-sm text-muted-foreground">{category.description}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{category.postCount} posts</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={category.isActive ? "default" : "secondary"}
                        className={category.isActive ? "bg-green-100 text-green-800" : ""}
                      >
                        {category.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(category.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openEditDialog(category)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleToggleActive(category.id)}>
                            <Folder className="mr-2 h-4 w-4" />
                            {category.isActive ? "Deactivate" : "Activate"}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeleteCategory(category.id)}
                            className="text-red-600"
                            disabled={category.postCount > 0}
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

      {/* Edit Dialog */}
      <Dialog open={!!editingCategory} onOpenChange={(open) => !open && resetForm()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
            <DialogDescription>Update category information</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Category Name</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter category name"
              />
            </div>
            <div>
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter category description"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="edit-color">Color</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="edit-color"
                  type="color"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  className="w-16 h-10"
                />
                <Input
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  placeholder="#3B82F6"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={resetForm}>
              Cancel
            </Button>
            <Button onClick={handleUpdateCategory} disabled={!formData.name.trim()}>
              Update Category
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
