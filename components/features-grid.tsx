export function FeaturesGrid() {
  const features = [
    {
      title: "Live market data",
      description: "Real-time spot prices from Binance. Updates every minute.",
    },
    {
      title: "News aggregation",
      description: "Curated crypto news. Updates every 15 minutes.",
    },
    {
      title: "On-chain insights",
      description: "Network activity and wallet metrics. Updates hourly.",
    },
    {
      title: "Social sentiment",
      description: "Twitter and Reddit signals. Updates every 30 minutes.",
    },
  ]

  return (
    <section className="container mx-auto px-4 py-16">
      <h2 className="mb-12 text-center text-3xl font-bold">Features</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {features.map((feature) => (
          <div key={feature.title} className="rounded-lg border bg-card p-6 text-card-foreground">
            <h3 className="mb-2 font-semibold">{feature.title}</h3>
            <p className="text-sm text-muted-foreground">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
