"use client"

import { Button } from "@/components/ui/button"
import { signIn } from "next-auth/react"

export function HeroSection() {
  return (
    <section className="container mx-auto px-4 py-24">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="mb-6 text-5xl font-bold tracking-tight">AI-ready crypto context</h1>
        <p className="mb-8 text-xl text-muted-foreground">
          MCP server delivering market data. OAuth-gated, one URL away.
        </p>
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Button
            size="lg"
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            className="w-full sm:w-auto"
          >
            Connect with Google
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
            className="w-full sm:w-auto"
          >
            Connect with GitHub
          </Button>
        </div>
      </div>
    </section>
  )
}
