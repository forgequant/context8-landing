"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"

function AuthErrorContent() {
  const searchParams = useSearchParams()
  const error = searchParams.get("error")

  const errorMessages: Record<string, string> = {
    Configuration: "Server configuration error. Please contact support.",
    AccessDenied: "Access denied. You do not have permission to sign in.",
    Verification: "Verification token expired or invalid.",
    Default: "An error occurred during authentication.",
  }

  const errorMessage = error ? errorMessages[error] || errorMessages.Default : errorMessages.Default

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md space-y-8 rounded-lg border bg-card p-8 text-center text-card-foreground">
        <div>
          <h1 className="text-3xl font-bold text-destructive">Authentication Error</h1>
          <p className="mt-4 text-muted-foreground">{errorMessage}</p>
        </div>

        <div className="space-y-4">
          <Button asChild className="w-full">
            <Link href="/login">Try Again</Link>
          </Button>

          <Button asChild variant="outline" className="w-full">
            <Link href="/">Return Home</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthErrorContent />
    </Suspense>
  )
}
