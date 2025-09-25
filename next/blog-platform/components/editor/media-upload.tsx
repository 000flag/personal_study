"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Upload, ImageIcon, X } from "lucide-react"
import { cn } from "@/lib/utils"
import NextImage from "next/image"

interface MediaUploadProps {
  onImageSelect: (url: string, alt?: string) => void
  trigger?: React.ReactNode
}

interface UploadedImage {
  id: string
  url: string
  alt: string
  name: string
  size: number
}

export function MediaUpload({ onImageSelect, trigger }: MediaUploadProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [images, setImages] = useState<UploadedImage[]>([])
  const [selectedImage, setSelectedImage] = useState<UploadedImage | null>(null)
  const [altText, setAltText] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    Array.from(files).forEach((file) => {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader()
        reader.onload = (e) => {
          const newImage: UploadedImage = {
            id: Date.now().toString() + Math.random(),
            url: e.target?.result as string,
            alt: "",
            name: file.name,
            size: file.size,
          }
          setImages((prev) => [...prev, newImage])
        }
        reader.readAsDataURL(file)
      }
    })
  }

  const handleImageSelect = (image: UploadedImage) => {
    setSelectedImage(image)
    setAltText(image.alt)
  }

  const handleInsertImage = () => {
    if (selectedImage) {
      const updatedImage = { ...selectedImage, alt: altText }
      setImages((prev) => prev.map((img) => (img.id === selectedImage.id ? updatedImage : img)))
      onImageSelect(selectedImage.url, altText)
      setIsOpen(false)
      setSelectedImage(null)
      setAltText("")
    }
  }

  const removeImage = (id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id))
    if (selectedImage?.id === id) {
      setSelectedImage(null)
      setAltText("")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <ImageIcon className="h-4 w-4 mr-2" />
            Add Image
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Media Library</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[60vh]">
          {/* Upload Area */}
          <div className="space-y-4">
            <div
              className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-primary transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Click to upload images</p>
              <p className="text-xs text-muted-foreground mt-1">PNG, JPG, GIF up to 10MB</p>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileUpload}
              className="hidden"
            />

            {selectedImage && (
              <div className="space-y-3">
                <Label htmlFor="alt-text">Alt Text</Label>
                <Input
                  id="alt-text"
                  value={altText}
                  onChange={(e) => setAltText(e.target.value)}
                  placeholder="Describe this image..."
                />
                <Button onClick={handleInsertImage} className="w-full">
                  Insert Image
                </Button>
              </div>
            )}
          </div>

          {/* Image Grid */}
          <div className="lg:col-span-2 overflow-y-auto">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {images.map((image) => (
                <div
                  key={image.id}
                  className={cn(
                    "relative group cursor-pointer rounded-lg overflow-hidden border-2 transition-all",
                    selectedImage?.id === image.id ? "border-primary" : "border-transparent hover:border-border",
                  )}
                  onClick={() => handleImageSelect(image)}
                >
                  <div className="aspect-square relative">
                    <NextImage
                      src={image.url || "/placeholder.svg"}
                      alt={image.alt || image.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation()
                      removeImage(image.id)
                    }}
                  >
                    <X className="h-3 w-3" />
                  </Button>

                  <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-xs truncate">{image.name}</p>
                    <p className="text-xs text-white/80">{(image.size / 1024).toFixed(1)} KB</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
