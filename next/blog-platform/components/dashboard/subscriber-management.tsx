"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { Search, UserPlus, UserMinus, Mail, MoreHorizontal, Calendar, MapPin, Ban, MessageSquare } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface Subscriber {
  id: string
  email: string
  name: string
  avatar?: string
  subscribedAt: string
  status: "active" | "blocked" | "unsubscribed"
  location?: string
  source: "organic" | "referral" | "social" | "direct"
  notes?: string
  totalViews: number
  lastActive: string
}

const mockSubscribers: Subscriber[] = [
  {
    id: "1",
    email: "alice@example.com",
    name: "Alice Johnson",
    avatar: "/placeholder.svg",
    subscribedAt: "2024-01-15T10:00:00Z",
    status: "active",
    location: "New York, US",
    source: "organic",
    totalViews: 45,
    lastActive: "2024-01-20T14:30:00Z",
  },
  {
    id: "2",
    email: "bob@example.com",
    name: "Bob Smith",
    subscribedAt: "2024-01-10T09:15:00Z",
    status: "active",
    location: "London, UK",
    source: "social",
    notes: "Engaged reader, frequently comments",
    totalViews: 78,
    lastActive: "2024-01-19T16:45:00Z",
  },
  {
    id: "3",
    email: "charlie@example.com",
    name: "Charlie Brown",
    subscribedAt: "2024-01-05T11:30:00Z",
    status: "blocked",
    location: "Toronto, CA",
    source: "referral",
    notes: "Blocked for spam comments",
    totalViews: 12,
    lastActive: "2024-01-18T08:20:00Z",
  },
]

export function SubscriberManagement() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>(mockSubscribers)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [selectedSubscribers, setSelectedSubscribers] = useState<string[]>([])
  const [selectedSubscriber, setSelectedSubscriber] = useState<Subscriber | null>(null)
  const [notes, setNotes] = useState("")
  const { toast } = useToast()

  const filteredSubscribers = subscribers.filter((subscriber) => {
    const matchesSearch =
      subscriber.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subscriber.email.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesFilter = filterStatus === "all" || subscriber.status === filterStatus

    return matchesSearch && matchesFilter
  })

  const handleSelectSubscriber = (subscriberId: string, checked: boolean) => {
    if (checked) {
      setSelectedSubscribers([...selectedSubscribers, subscriberId])
    } else {
      setSelectedSubscribers(selectedSubscribers.filter((id) => id !== subscriberId))
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedSubscribers(filteredSubscribers.map((s) => s.id))
    } else {
      setSelectedSubscribers([])
    }
  }

  const handleBulkAction = (action: "block" | "unblock" | "remove") => {
    const actionText = action === "block" ? "blocked" : action === "unblock" ? "unblocked" : "removed"

    setSubscribers((prev) =>
      prev.map((subscriber) =>
        selectedSubscribers.includes(subscriber.id)
          ? { ...subscriber, status: action === "remove" ? "unsubscribed" : action === "block" ? "blocked" : "active" }
          : subscriber,
      ),
    )

    toast({
      title: `Subscribers ${actionText}`,
      description: `${selectedSubscribers.length} subscriber(s) have been ${actionText}.`,
    })

    setSelectedSubscribers([])
  }

  const handleUpdateNotes = () => {
    if (selectedSubscriber) {
      setSubscribers((prev) =>
        prev.map((subscriber) => (subscriber.id === selectedSubscriber.id ? { ...subscriber, notes } : subscriber)),
      )

      toast({
        title: "Notes updated",
        description: "Subscriber notes have been saved.",
      })

      setSelectedSubscriber(null)
      setNotes("")
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge variant="default" className="bg-green-500">
            Active
          </Badge>
        )
      case "blocked":
        return <Badge variant="destructive">Blocked</Badge>
      case "unsubscribed":
        return <Badge variant="secondary">Unsubscribed</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getSourceBadge = (source: string) => {
    const colors = {
      organic: "bg-blue-500",
      social: "bg-purple-500",
      referral: "bg-orange-500",
      direct: "bg-green-500",
    }
    return <Badge className={colors[source as keyof typeof colors]}>{source}</Badge>
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Subscriber Management</h2>
        <div className="flex items-center gap-2">
          <Badge variant="outline">{subscribers.length} total subscribers</Badge>
          <Badge variant="default">{subscribers.filter((s) => s.status === "active").length} active</Badge>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search subscribers..."
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
            <SelectItem value="all">All Subscribers</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="blocked">Blocked</SelectItem>
            <SelectItem value="unsubscribed">Unsubscribed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Bulk Actions */}
      {selectedSubscribers.length > 0 && (
        <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
          <span className="text-sm font-medium">
            {selectedSubscribers.length} subscriber{selectedSubscribers.length > 1 ? "s" : ""} selected
          </span>
          <Button variant="outline" size="sm" onClick={() => handleBulkAction("block")}>
            <Ban className="h-4 w-4 mr-2" />
            Block
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleBulkAction("unblock")}>
            <UserPlus className="h-4 w-4 mr-2" />
            Unblock
          </Button>
          <Button variant="destructive" size="sm" onClick={() => handleBulkAction("remove")}>
            <UserMinus className="h-4 w-4 mr-2" />
            Remove
          </Button>
        </div>
      )}

      {/* Subscribers List */}
      <Card>
        <CardContent className="p-0">
          {filteredSubscribers.length > 0 && (
            <div className="flex items-center gap-2 p-4 border-b">
              <Checkbox
                checked={selectedSubscribers.length === filteredSubscribers.length}
                onCheckedChange={handleSelectAll}
              />
              <span className="text-sm text-muted-foreground">Select all</span>
            </div>
          )}

          <div className="divide-y">
            {filteredSubscribers.map((subscriber) => (
              <div key={subscriber.id} className="p-4 hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-4">
                  <Checkbox
                    checked={selectedSubscribers.includes(subscriber.id)}
                    onCheckedChange={(checked) => handleSelectSubscriber(subscriber.id, checked as boolean)}
                  />

                  <Avatar>
                    <AvatarImage src={subscriber.avatar || "/placeholder.svg"} />
                    <AvatarFallback>{subscriber.name.charAt(0)}</AvatarFallback>
                  </Avatar>

                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{subscriber.name}</h4>
                      {getStatusBadge(subscriber.status)}
                      {getSourceBadge(subscriber.source)}
                    </div>
                    <p className="text-sm text-muted-foreground">{subscriber.email}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Joined {formatDate(subscriber.subscribedAt)}
                      </span>
                      {subscriber.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {subscriber.location}
                        </span>
                      )}
                      <span>{subscriber.totalViews} views</span>
                      <span>Last active {formatDate(subscriber.lastActive)}</span>
                    </div>
                    {subscriber.notes && <p className="text-xs text-muted-foreground italic">"{subscriber.notes}"</p>}
                  </div>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedSubscriber(subscriber)
                          setNotes(subscriber.notes || "")
                        }}
                      >
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Subscriber Notes</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={subscriber.avatar || "/placeholder.svg"} />
                            <AvatarFallback>{subscriber.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-medium">{subscriber.name}</h4>
                            <p className="text-sm text-muted-foreground">{subscriber.email}</p>
                          </div>
                        </div>
                        <Textarea
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          placeholder="Add notes about this subscriber..."
                          rows={4}
                        />
                        <Button onClick={handleUpdateNotes} className="w-full">
                          Save Notes
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Mail className="h-4 w-4 mr-2" />
                        Send Email
                      </DropdownMenuItem>
                      {subscriber.status === "active" ? (
                        <DropdownMenuItem onClick={() => handleBulkAction("block")}>
                          <Ban className="h-4 w-4 mr-2" />
                          Block
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem onClick={() => handleBulkAction("unblock")}>
                          <UserPlus className="h-4 w-4 mr-2" />
                          Unblock
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem onClick={() => handleBulkAction("remove")} className="text-destructive">
                        <UserMinus className="h-4 w-4 mr-2" />
                        Remove
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>

          {filteredSubscribers.length === 0 && (
            <div className="text-center py-12">
              <UserPlus className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No subscribers found</h3>
              <p className="text-muted-foreground">
                {searchTerm ? "Try adjusting your search terms" : "Your subscribers will appear here"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
