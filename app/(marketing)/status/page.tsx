export default function StatusPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-8 text-4xl font-bold">System Status</h1>

        <div className="space-y-6">
          <div className="rounded-lg border bg-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">All Systems Operational</h2>
                <p className="text-sm text-muted-foreground">
                  All services are running normally
                </p>
              </div>
              <div className="h-4 w-4 rounded-full bg-green-500" />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Service Components</h3>

            <div className="rounded-lg border bg-card p-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">API Server</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Operational</span>
                  <div className="h-3 w-3 rounded-full bg-green-500" />
                </div>
              </div>
            </div>

            <div className="rounded-lg border bg-card p-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">Authentication</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Operational</span>
                  <div className="h-3 w-3 rounded-full bg-green-500" />
                </div>
              </div>
            </div>

            <div className="rounded-lg border bg-card p-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">Database</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Operational</span>
                  <div className="h-3 w-3 rounded-full bg-green-500" />
                </div>
              </div>
            </div>

            <div className="rounded-lg border bg-card p-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">Data Sources</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Operational</span>
                  <div className="h-3 w-3 rounded-full bg-green-500" />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 rounded-lg border bg-muted/50 p-4 text-sm text-muted-foreground">
            <p>
              Note: This is a placeholder status page. In production, this would be connected to
              actual system health checks and incident reporting.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
