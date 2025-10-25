export function ValuePropsSection() {
  const valueProps = [
    {
      title: "OAuth-gated access",
      description: "Secure authentication via Google or GitHub. No API keys needed.",
    },
    {
      title: "Four data sources",
      description: "Binance prices, crypto news, on-chain metrics, social signals.",
    },
    {
      title: "AI-optimized format",
      description: "Structured JSON ready for Claude and other AI assistants.",
    },
  ]

  return (
    <section className="container mx-auto px-4 py-16">
      <div className="grid gap-8 md:grid-cols-3">
        {valueProps.map((prop) => (
          <div key={prop.title} className="rounded-lg border bg-card p-6 text-card-foreground">
            <h3 className="mb-2 text-lg font-semibold">{prop.title}</h3>
            <p className="text-sm text-muted-foreground">{prop.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
