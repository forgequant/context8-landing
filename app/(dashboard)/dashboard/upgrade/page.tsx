import { getCurrentUser } from "@/lib/session"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function UpgradePage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-8 text-3xl font-bold">Upgrade Plan</h1>

        <div className="mb-8 rounded-lg border bg-card p-6">
          <h2 className="mb-4 text-xl font-semibold">Current Plan: Free</h2>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span>Rate Limit</span>
              <span className="font-medium">15 requests/hour</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Data Sources</span>
              <span className="font-medium">4 sources</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Support</span>
              <span className="font-medium">Community</span>
            </div>
          </div>
        </div>

        <div className="rounded-lg border-2 border-primary bg-card p-6">
          <div className="mb-4 flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-semibold">Pro Plan</h2>
              <p className="mt-1 text-sm text-muted-foreground">Coming soon</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">TBD</div>
              <div className="text-sm text-muted-foreground">per month</div>
            </div>
          </div>

          <div className="mb-6 space-y-3">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-primary" />
              <span className="text-sm">Higher rate limits (100 requests/hour)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-primary" />
              <span className="text-sm">Priority support</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-primary" />
              <span className="text-sm">Advanced analytics</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-primary" />
              <span className="text-sm">Custom data source selection</span>
            </div>
          </div>

          <Button className="w-full" disabled>
            Coming Soon
          </Button>

          <p className="mt-4 text-center text-xs text-muted-foreground">
            Pro plan is under development. Join our waitlist to be notified when it launches.
          </p>
        </div>

        <div className="mt-8 text-center">
          <Button variant="outline" asChild>
            <Link href="/dashboard">Back to Dashboard</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
