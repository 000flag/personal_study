"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { RichTextEditor } from "./rich-text-editor"
import { MediaUpload } from "./media-upload"
import { usePostManagement } from "@/lib/post-management"
import { mockCategories } from "@/lib/blog-data"
import { useToast } from "@/hooks/use-toast"
import { Save, Send, CalendarIcon, EyeOff, Users, Globe, Clock, X, Plus } from "lucide-react"
import { format } from "date-fns"

export function PostEditor() {
  const { currentDraft, saveDraft, publishPost, autoSave, setAutoSave } = usePostManagement()
  const { toast } = useToast()

  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [excerpt, setExcerpt] = useState("")
  const [coverImage, setCoverImage] = useState("")
  const [category, setCategory] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState("")
  const [visibility, setVisibility] = useState<"public" | "private" | "followers-only">("public")
  const [scheduledDate, setScheduledDate] = useState<Date>()
  const [isScheduled, setIsScheduled] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isPublishing, setIsPublishing] = useState(false)

  // Load current draft data
  useEffect(() => {
    if (currentDraft) {
      setTitle(currentDraft.title)
      setContent(currentDraft.content)
      setExcerpt(currentDraft.excerpt)
      setCoverImage(currentDraft.coverImage || "")
      setCategory(currentDraft.category)
      setTags(currentDraft.tags)
      setVisibility(currentDraft.visibility)
      if (currentDraft.scheduledAt) {
        setScheduledDate(new Date(currentDraft.scheduledAt))
        setIsScheduled(true)
      }
    }
  }, [currentDraft])

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await saveDraft({
        title,
        content,
        excerpt,
        coverImage,
        category,
        tags,
        visibility,
        scheduledAt: isScheduled && scheduledDate ? scheduledDate.toISOString() : undefined,
      })
      toast({
        title: "Draft saved",
        description: "Your post has been saved as a draft",
      })
    } catch (error) {
      toast({
        title: "Error saving draft",
        description: "Please try again",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handlePublish = async () => {
    if (!title.trim() || !content.trim()) {
      toast({
        title: "Missing required fields",
        description: "Please add a title and content before publishing",
        variant: "destructive",
      })
      return
    }

    setIsPublishing(true)
    try {
      // Save first
      const draftId = await saveDraft({
        title,
        content,
        excerpt,
        coverImage,
        category,
        tags,
        visibility,
        scheduledAt: isScheduled && scheduledDate ? scheduledDate.toISOString() : undefined,
      })

      // Then publish
      const success = await publishPost(draftId, isScheduled && scheduledDate ? scheduledDate.toISOString() : undefined)

      if (success) {
        toast({
          title: isScheduled ? "Post scheduled" : "Post published",
          description: isScheduled
            ? `Your post will be published on ${format(scheduledDate!, "PPP")}`
            : "Your post is now live",
        })

        // Reset form
        setTitle("")
        setContent("")
        setExcerpt("")
        setCoverImage("")
        setCategory("")
        setTags([])
        setVisibility("public")
        setScheduledDate(undefined)
        setIsScheduled(false)
      }
    } catch (error) {
      toast({
        title: "Error publishing post",
        description: "Please try again",
        variant: "destructive",
      })
    } finally {
      setIsPublishing(false)
    }
  }

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()])
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleImageSelect = (url: string, alt?: string) => {
    setCoverImage(url)
  }

  const getVisibilityIcon = () => {
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
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Write Post</h1>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Switch checked={autoSave} onCheckedChange={setAutoSave} id="auto-save" />
            <Label htmlFor="auto-save" className="text-sm">
              Auto-save
            </Label>
          </div>
          <Button variant="outline" onClick={handleSave} disabled={isSaving}>
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? "Saving..." : "Save Draft"}
          </Button>
          <Button onClick={handlePublish} disabled={isPublishing}>
            {isScheduled ? <Clock className="h-4 w-4 mr-2" /> : <Send className="h-4 w-4 mr-2" />}
            {isPublishing ? "Publishing..." : isScheduled ? "Schedule" : "Publish"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Editor */}
        <div className="lg:col-span-2 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter your post title..."
              className="text-lg font-semibold"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="excerpt">Excerpt</Label>
            <Textarea
              id="excerpt"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Write a brief description of your post..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Content</Label>
            <RichTextEditor value={content} onChange={setContent} placeholder="Start writing your post..." />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Publishing Options */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Publishing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Visibility</Label>
                <Select value={visibility} onValueChange={(value: any) => setVisibility(value)}>
                  <SelectTrigger>
                    <SelectValue>
                      <div className="flex items-center gap-2">
                        {getVisibilityIcon()}
                        <span className="capitalize">{visibility.replace("-", " ")}</span>
                      </div>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4" />
                        Public
                      </div>
                    </SelectItem>
                    <SelectItem value="followers-only">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Followers Only
                      </div>
                    </SelectItem>
                    <SelectItem value="private">
                      <div className="flex items-center gap-2">
                        <EyeOff className="h-4 w-4" />
                        Private
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="schedule" checked={isScheduled} onCheckedChange={setIsScheduled} />
                <Label htmlFor="schedule">Schedule for later</Label>
              </div>

              {isScheduled && (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {scheduledDate ? format(scheduledDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={scheduledDate} onSelect={setScheduledDate} initialFocus />
                  </PopoverContent>
                </Popover>
              )}
            </CardContent>
          </Card>

          {/* Cover Image */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Cover Image</CardTitle>
            </CardHeader>
            <CardContent>
              {coverImage ? (
                <div className="space-y-3">
                  <div className="relative aspect-video rounded-lg overflow-hidden">
                    <img src={coverImage || "/placeholder.svg"} alt="Cover" className="w-full h-full object-cover" />
                    <Button
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => setCoverImage("")}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <MediaUpload
                  onImageSelect={handleImageSelect}
                  trigger={
                    <Button variant="outline" className="w-full bg-transparent">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Cover Image
                    </Button>
                  }
                />
              )}
            </CardContent>
          </Card>

          {/* Category */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Category</CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {mockCategories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.name}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Tags */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Tags</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add a tag..."
                  onKeyPress={(e) => e.key === "Enter" && addTag()}
                />
                <Button onClick={addTag} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="gap-1">
                    {tag}
                    <button onClick={() => removeTag(tag)}>
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
