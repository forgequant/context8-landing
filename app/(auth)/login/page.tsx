"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { signIn } from "next-auth/react"
import { useSearchParams, useRouter } from "next/navigation"
import { Suspense, useState } from "react"

function LoginForm() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const error = searchParams.get("error")

  const [isLogin, setIsLogin] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setFormError(null)

    try {
      if (isLogin) {
        // Login
        const result = await signIn("credentials", {
          email: formData.email,
          password: formData.password,
          redirect: false,
        })

        if (result?.error) {
          setFormError(result.error)
        } else if (result?.ok) {
          router.push("/dashboard")
        }
      } else {
        // Register
        const response = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        })

        const data = await response.json()

        if (!response.ok) {
          setFormError(data.error || "Registration failed")
        } else {
          // Auto-login after registration
          const result = await signIn("credentials", {
            email: formData.email,
            password: formData.password,
            redirect: false,
          })

          if (result?.ok) {
            router.push("/dashboard")
          }
        }
      }
    } catch (error) {
      setFormError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md space-y-8 rounded-lg border bg-card p-8 text-card-foreground">
        <div className="text-center">
          <h1 className="text-3xl font-bold">
            {isLogin ? "Sign In" : "Sign Up"} to Context8
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {isLogin ? "Welcome back" : "Create your account"}
          </p>
        </div>

        {(error || formError) && (
          <div className="rounded-lg border border-destructive bg-destructive/10 p-4 text-sm text-destructive">
            {formError || "Authentication error. Please try again."}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required={!isLogin}
                disabled={isLoading}
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              disabled={isLoading}
              minLength={8}
            />
            {!isLogin && (
              <p className="text-xs text-muted-foreground">
                Must be at least 8 characters long
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : isLogin ? "Sign In" : "Sign Up"}
          </Button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <Button
            className="w-full"
            variant="outline"
            size="lg"
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            disabled={isLoading}
          >
            Continue with Google
          </Button>
        </div>

        <div className="text-center">
          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin)
              setFormError(null)
            }}
            className="text-sm text-muted-foreground hover:text-primary"
            disabled={isLoading}
          >
            {isLogin
              ? "Don't have an account? Sign up"
              : "Already have an account? Sign in"}
          </button>
        </div>

        <p className="text-center text-xs text-muted-foreground">
          By signing in, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginForm />
    </Suspense>
  )
}
