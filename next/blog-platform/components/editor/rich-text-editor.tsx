"use client"

import { useState, useCallback, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bold, Italic, Underline, Link, List, ListOrdered, Quote, Code, ImageIcon, Eye, Type } from "lucide-react"
import { cn } from "@/lib/utils"

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export function RichTextEditor({ value, onChange, placeholder, className }: RichTextEditorProps) {
  const [activeTab, setActiveTab] = useState<"write" | "preview">("write")
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const insertText = useCallback(
    (before: string, after = "") => {
      const textarea = textareaRef.current
      if (!textarea) return

      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const selectedText = value.substring(start, end)

      const newText = value.substring(0, start) + before + selectedText + after + value.substring(end)
      onChange(newText)

      // Restore cursor position
      setTimeout(() => {
        textarea.focus()
        textarea.setSelectionRange(start + before.length, start + before.length + selectedText.length)
      }, 0)
    },
    [value, onChange],
  )

  const formatButtons = [
    { icon: Bold, label: "Bold", action: () => insertText("**", "**") },
    { icon: Italic, label: "Italic", action: () => insertText("*", "*") },
    { icon: Underline, label: "Underline", action: () => insertText("<u>", "</u>") },
    { icon: Link, label: "Link", action: () => insertText("[", "](url)") },
    { icon: List, label: "Bullet List", action: () => insertText("\n- ") },
    { icon: ListOrdered, label: "Numbered List", action: () => insertText("\n1. ") },
    { icon: Quote, label: "Quote", action: () => insertText("\n> ") },
    { icon: Code, label: "Code", action: () => insertText("`", "`") },
    { icon: ImageIcon, label: "Image", action: () => insertText("![alt text](", ")") },
  ]

  const renderMarkdown = (text: string) => {
    // Simple markdown preview (in a real app, use a proper markdown parser)
    return text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/`(.*?)`/g, "<code>$1</code>")
      .replace(/^> (.*$)/gm, "<blockquote>$1</blockquote>")
      .replace(/^# (.*$)/gm, "<h1>$1</h1>")
      .replace(/^## (.*$)/gm, "<h2>$1</h2>")
      .replace(/^### (.*$)/gm, "<h3>$1</h3>")
      .replace(/\n/g, "<br>")
  }

  return (
    <div className={cn("border border-border rounded-lg overflow-hidden", className)}>
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "write" | "preview")}>
        <div className="flex items-center justify-between border-b border-border p-2">
          <div className="flex items-center gap-1">
            {formatButtons.map((button) => (
              <Button
                key={button.label}
                variant="ghost"
                size="sm"
                onClick={button.action}
                title={button.label}
                className="h-8 w-8 p-0"
              >
                <button.icon className="h-4 w-4" />
              </Button>
            ))}
          </div>

          <TabsList className="grid w-32 grid-cols-2">
            <TabsTrigger value="write" className="text-xs">
              <Type className="h-3 w-3 mr-1" />
              Write
            </TabsTrigger>
            <TabsTrigger value="preview" className="text-xs">
              <Eye className="h-3 w-3 mr-1" />
              Preview
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="write" className="m-0">
          <Textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="min-h-[400px] border-0 resize-none focus-visible:ring-0 rounded-none"
          />
        </TabsContent>

        <TabsContent value="preview" className="m-0">
          <div
            className="min-h-[400px] p-4 prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(value) }}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
