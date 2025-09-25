"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { AlertTriangle, CheckCircle, XCircle, Eye } from "lucide-react"
import { mockReportedContent, type ReportedContent } from "@/lib/admin"
import { useToast } from "@/hooks/use-toast"

export function ContentModeration() {
  const [reports, setReports] = useState<ReportedContent[]>(mockReportedContent)
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedReport, setSelectedReport] = useState<ReportedContent | null>(null)
  const [reviewNotes, setReviewNotes] = useState("")
  const { toast } = useToast()

  const filteredReports = reports.filter((report) => statusFilter === "all" || report.status === statusFilter)

  const handleReportAction = (reportId: string, action: "approve" | "dismiss" | "resolve") => {
    setReports((prev) =>
      prev.map((report) => {
        if (report.id === reportId) {
          return {
            ...report,
            status:
              action === "approve"
                ? ("resolved" as const)
                : action === "dismiss"
                  ? ("dismissed" as const)
                  : ("resolved" as const),
            reviewedBy: "admin-1",
            reviewedAt: new Date().toISOString(),
          }
        }
        return report
      }),
    )

    toast({
      title: "Report Updated",
      description: `Report has been ${action}d successfully.`,
    })

    setSelectedReport(null)
    setReviewNotes("")
  }

  const getStatusBadge = (status: ReportedContent["status"]) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            Pending
          </Badge>
        )
      case "reviewed":
        return (
          <Badge variant="default" className="bg-blue-100 text-blue-800">
            Reviewed
          </Badge>
        )
      case "resolved":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            Resolved
          </Badge>
        )
      case "dismissed":
        return <Badge variant="outline">Dismissed</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getReasonBadge = (reason: string) => {
    const colors = {
      spam: "bg-red-100 text-red-800",
      harassment: "bg-orange-100 text-orange-800",
      inappropriate: "bg-purple-100 text-purple-800",
      copyright: "bg-blue-100 text-blue-800",
    }

    return (
      <Badge variant="outline" className={colors[reason as keyof typeof colors] || "bg-gray-100 text-gray-800"}>
        {reason}
      </Badge>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Content Moderation</h1>
        <p className="text-muted-foreground">Review and manage reported content</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Reported Content</CardTitle>
          <CardDescription>Review reports and take appropriate action</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex justify-between items-center mb-6">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Reports</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="reviewed">Reviewed</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="dismissed">Dismissed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Reports Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Content</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Reported</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">Content ID: {report.contentId}</div>
                        <div className="text-sm text-muted-foreground truncate max-w-[200px]">{report.description}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{report.type}</Badge>
                    </TableCell>
                    <TableCell>{getReasonBadge(report.reason)}</TableCell>
                    <TableCell>{getStatusBadge(report.status)}</TableCell>
                    <TableCell>{new Date(report.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" onClick={() => setSelectedReport(report)}>
                            <Eye className="h-4 w-4 mr-2" />
                            Review
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Review Report</DialogTitle>
                            <DialogDescription>
                              Review the reported content and take appropriate action
                            </DialogDescription>
                          </DialogHeader>

                          {selectedReport && (
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="text-sm font-medium">Content Type</label>
                                  <p className="text-sm text-muted-foreground">{selectedReport.type}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">Reason</label>
                                  <p className="text-sm text-muted-foreground">{selectedReport.reason}</p>
                                </div>
                              </div>

                              <div>
                                <label className="text-sm font-medium">Description</label>
                                <p className="text-sm text-muted-foreground">{selectedReport.description}</p>
                              </div>

                              <div>
                                <label className="text-sm font-medium">Review Notes</label>
                                <Textarea
                                  placeholder="Add your review notes..."
                                  value={reviewNotes}
                                  onChange={(e) => setReviewNotes(e.target.value)}
                                />
                              </div>
                            </div>
                          )}

                          <DialogFooter>
                            <Button
                              variant="outline"
                              onClick={() => selectedReport && handleReportAction(selectedReport.id, "dismiss")}
                            >
                              <XCircle className="h-4 w-4 mr-2" />
                              Dismiss
                            </Button>
                            <Button
                              variant="destructive"
                              onClick={() => selectedReport && handleReportAction(selectedReport.id, "resolve")}
                            >
                              <AlertTriangle className="h-4 w-4 mr-2" />
                              Take Action
                            </Button>
                            <Button onClick={() => selectedReport && handleReportAction(selectedReport.id, "approve")}>
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Approve Content
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
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
