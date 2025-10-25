export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-8 text-4xl font-bold">Privacy Policy</h1>

        <div className="prose prose-neutral dark:prose-invert">
          <h2>Data Collection</h2>
          <p>
            We collect only the minimum data required to provide our service: your email address
            from OAuth providers (Google or GitHub) and usage metrics for rate limiting.
          </p>

          <h2>Data Storage</h2>
          <p>
            All data is stored securely in our PostgreSQL database. Sessions expire after 60
            minutes of inactivity.
          </p>

          <h2>Data Sharing</h2>
          <p>We do not share, sell, or rent your personal data to third parties.</p>

          <h2>Rate Limiting</h2>
          <p>
            We track usage metrics (IP address, user ID, timestamp) solely for rate limiting
            purposes. This data is retained for 30 days.
          </p>

          <h2>Cookies</h2>
          <p>
            We use secure, HttpOnly session cookies for authentication. These cookies are required
            for the service to function.
          </p>

          <h2>Contact</h2>
          <p>For privacy concerns, contact us via GitHub issues.</p>
        </div>
      </div>
    </div>
  )
}
