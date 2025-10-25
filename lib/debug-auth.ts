/**
 * Debug script to check OAuth configuration
 * Run: npx tsx lib/debug-auth.ts
 */

console.log("=== OAuth Configuration Debug ===\n")

// Check environment variables
console.log("1. Environment Variables:")
console.log("   AUTH_SECRET:", process.env.AUTH_SECRET ? "✅ Set" : "❌ Missing")
console.log("   NEXTAUTH_URL:", process.env.NEXTAUTH_URL || "❌ Missing")
console.log("")

console.log("2. Google OAuth:")
console.log("   GOOGLE_CLIENT_ID:", process.env.GOOGLE_CLIENT_ID ? "✅ Set" : "❌ Missing")
if (process.env.GOOGLE_CLIENT_ID) {
  console.log("   - Length:", process.env.GOOGLE_CLIENT_ID.length)
  console.log("   - Ends with .apps.googleusercontent.com:",
    process.env.GOOGLE_CLIENT_ID.endsWith(".apps.googleusercontent.com") ? "✅ Yes" : "❌ No")
  console.log("   - First 20 chars:", process.env.GOOGLE_CLIENT_ID.substring(0, 20) + "...")
}
console.log("   GOOGLE_CLIENT_SECRET:", process.env.GOOGLE_CLIENT_SECRET ? "✅ Set" : "❌ Missing")
if (process.env.GOOGLE_CLIENT_SECRET) {
  console.log("   - Length:", process.env.GOOGLE_CLIENT_SECRET.length)
  console.log("   - First 10 chars:", process.env.GOOGLE_CLIENT_SECRET.substring(0, 10) + "...")
}
console.log("")

console.log("3. GitHub OAuth:")
console.log("   GITHUB_CLIENT_ID:", process.env.GITHUB_CLIENT_ID ? "✅ Set" : "❌ Missing")
if (process.env.GITHUB_CLIENT_ID) {
  console.log("   - Length:", process.env.GITHUB_CLIENT_ID.length)
  console.log("   - First 10 chars:", process.env.GITHUB_CLIENT_ID.substring(0, 10) + "...")
}
console.log("   GITHUB_CLIENT_SECRET:", process.env.GITHUB_CLIENT_SECRET ? "✅ Set" : "❌ Missing")
if (process.env.GITHUB_CLIENT_SECRET) {
  console.log("   - Length:", process.env.GITHUB_CLIENT_SECRET.length)
  console.log("   - First 10 chars:", process.env.GITHUB_CLIENT_SECRET.substring(0, 10) + "...")
}
console.log("")

console.log("4. Database:")
console.log("   DATABASE_URL:", process.env.DATABASE_URL ? "✅ Set" : "❌ Missing")
if (process.env.DATABASE_URL) {
  // Mask password in URL
  const masked = process.env.DATABASE_URL.replace(/:([^@]+)@/, ":***@")
  console.log("   - URL:", masked)
}
console.log("")

console.log("5. Expected Callback URLs:")
console.log("   Google:", `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/auth/callback/google`)
console.log("   GitHub:", `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/auth/callback/github`)
console.log("")

// Common issues
console.log("=== Common Issues to Check ===")
console.log("1. Google Console redirect URI must EXACTLY match:")
console.log("   http://localhost:3000/api/auth/callback/google")
console.log("   (no trailing slash, http not https, localhost not 127.0.0.1)")
console.log("")
console.log("2. GitHub redirect URI must EXACTLY match:")
console.log("   http://localhost:3000/api/auth/callback/github")
console.log("")
console.log("3. Check .env.local has no spaces or quotes inside values")
console.log("4. Restart dev server after changing .env.local")
console.log("")
