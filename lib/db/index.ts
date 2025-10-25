import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"

// Allow DATABASE_URL to be optional during build time
const connectionString = process.env.DATABASE_URL || ""

// Only create client if DATABASE_URL is provided
const client = connectionString ? postgres(connectionString) : null

export const db = client ? drizzle(client) : null as any
