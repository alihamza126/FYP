"use client"

import { useEffect } from "react"
import Link from "next/link"
import { AlertCircle, Home, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application error:", error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
      <div className="flex flex-col items-center max-w-md text-center">
        <div className="bg-red-100 p-3 rounded-full mb-4">
          <AlertCircle className="h-10 w-10 text-red-600" />
        </div>

        <h1 className="text-3xl font-bold mb-2">Something went wrong</h1>

        <p className="text-gray-600 mb-6">
          We're sorry, but we encountered an unexpected error. Our team has been notified.
        </p>

        {error.digest && (
          <div className="bg-gray-100 px-4 py-2 rounded-md mb-6 w-full overflow-auto">
            <p className="text-sm font-mono text-gray-700">Error ID: {error.digest}</p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 w-full">
          <Button onClick={reset} className="flex items-center justify-center gap-2" variant="default">
            <RefreshCw className="h-4 w-4" />
            Try again
          </Button>

          <Button asChild variant="outline" className="flex items-center justify-center gap-2">
            <Link href="/">
              <Home className="h-4 w-4" />
              Return home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
