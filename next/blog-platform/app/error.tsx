"use client"

import { useEffect } from "react"
import { AlertTriangle, RefreshCw, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="h-16 w-16 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400" />
          </div>
          <CardTitle className="text-red-600 dark:text-red-400">Something went wrong!</CardTitle>
          <CardDescription>An unexpected error occurred. This has been logged and we'll look into it.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-muted/50 rounded-lg p-4">
            <h3 className="font-medium mb-2">Error Details</h3>
            <p className="text-sm text-muted-foreground">{error.message}</p>
            {error.digest && <p className="text-xs text-muted-foreground mt-2">Error ID: {error.digest}</p>}
          </div>

          <div className="flex flex-col gap-3">
            <Button onClick={reset} className="w-full">
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
            <Button variant="outline" asChild className="w-full bg-transparent">
              <a href="/">
                <Home className="mr-2 h-4 w-4" />
                Go Home
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
