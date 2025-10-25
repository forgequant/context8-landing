import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/session"
import { dataSources } from "@/lib/config/data-sources"

export default async function DashboardPage() {
  const user = await getCurrentUser()

  if (!user || !user.id) {
    redirect("/login")
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="mt-2 text-muted-foreground">Welcome back, {user.name || user.email}</p>
      </div>

      <div className="mb-8 rounded-lg border border-yellow-500/50 bg-yellow-500/10 p-4">
        <div className="flex items-center gap-2">
          <div className="text-yellow-500">⚠️</div>
          <div>
            <div className="font-semibold">MCP Server Under Development</div>
            <div className="text-sm text-muted-foreground">
              The actual MCP server will be developed separately. This dashboard shows the
              planned features.
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-lg border bg-card p-6 text-card-foreground">
          <div className="text-sm text-muted-foreground">Rate Limit (IP)</div>
          <div className="mt-2 text-3xl font-bold">30/hour</div>
          <div className="mt-1 text-xs text-muted-foreground">Planned feature</div>
        </div>

        <div className="rounded-lg border bg-card p-6 text-card-foreground">
          <div className="text-sm text-muted-foreground">Rate Limit (User)</div>
          <div className="mt-2 text-3xl font-bold">15/hour</div>
          <div className="mt-1 text-xs text-muted-foreground">Planned feature</div>
        </div>

        <div className="rounded-lg border bg-card p-6 text-card-foreground">
          <div className="text-sm text-muted-foreground">Data Sources</div>
          <div className="mt-2 text-3xl font-bold">4</div>
          <div className="mt-1 text-xs text-muted-foreground">Planned feature</div>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="mb-4 text-xl font-semibold">MCP Endpoint (Placeholder)</h2>
        <div className="rounded-lg border bg-card p-6">
          <code className="block rounded bg-muted p-4 text-sm">
            GET {process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/mcp/context
          </code>
          <p className="mt-4 text-sm text-muted-foreground">
            This endpoint currently returns a placeholder response. The actual MCP server will be
            developed separately and will handle authentication, rate limiting, and real crypto
            data.
          </p>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="mb-4 text-xl font-semibold">Planned Data Sources</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {dataSources.map((source) => (
            <div key={source.id} className="rounded-lg border bg-card p-4 text-card-foreground">
              <h3 className="font-semibold">{source.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{source.description}</p>
              <p className="mt-2 text-xs text-muted-foreground">
                Updates: {source.updateFrequency} (planned)
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
