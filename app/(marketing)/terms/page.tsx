export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-8 text-4xl font-bold">Terms of Service</h1>

        <div className="prose prose-neutral dark:prose-invert">
          <h2>Acceptance of Terms</h2>
          <p>
            By accessing Context8, you agree to these Terms of Service. If you do not agree, do not
            use the service.
          </p>

          <h2>Service Description</h2>
          <p>
            Context8 provides OAuth-gated access to crypto market data via an MCP server. The
            service is provided "as is" without warranties.
          </p>

          <h2>Rate Limits</h2>
          <p>Usage is subject to rate limits:</p>
          <ul>
            <li>30 requests per hour per IP address</li>
            <li>15 requests per hour per authenticated user</li>
          </ul>

          <h2>Prohibited Use</h2>
          <p>You may not:</p>
          <ul>
            <li>Attempt to circumvent rate limits</li>
            <li>Use the service for illegal purposes</li>
            <li>Resell or redistribute data without permission</li>
            <li>Attempt to compromise service security</li>
          </ul>

          <h2>Service Availability</h2>
          <p>
            We strive for high availability but do not guarantee uninterrupted service. Maintenance
            windows will be announced when possible.
          </p>

          <h2>Changes to Terms</h2>
          <p>We reserve the right to modify these terms. Continued use constitutes acceptance.</p>

          <h2>Termination</h2>
          <p>We may suspend or terminate access for violations of these terms.</p>
        </div>
      </div>
    </div>
  )
}
