export function FAQSection() {
  const faqs = [
    {
      question: "Can I access this without OAuth?",
      answer:
        "No. All access requires OAuth authentication via Google or GitHub for security and rate limiting.",
    },
    {
      question: "Which sources are included?",
      answer:
        "Four sources: Binance spot prices, curated crypto news, on-chain network metrics, and social sentiment from Twitter/Reddit.",
    },
    {
      question: "Can I select specific sources?",
      answer:
        "Not yet. All four sources are included in every response. Source selection is planned for a future release.",
    },
    {
      question: "Which crypto assets are supported?",
      answer:
        "Currently BTC, ETH, and major altcoins available on Binance spot markets. Full asset list available in the API response.",
    },
  ]

  return (
    <section className="container mx-auto px-4 py-16">
      <h2 className="mb-12 text-center text-3xl font-bold">FAQ</h2>
      <div className="mx-auto max-w-3xl space-y-6">
        {faqs.map((faq) => (
          <div key={faq.question} className="rounded-lg border bg-card p-6 text-card-foreground">
            <h3 className="mb-2 font-semibold">{faq.question}</h3>
            <p className="text-sm text-muted-foreground">{faq.answer}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
