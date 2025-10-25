import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

/**
 * MCP Endpoint Placeholder
 *
 * This is a placeholder endpoint for the Context8 MCP server.
 * The actual MCP server will be developed separately and will provide:
 * - Real-time crypto market data
 * - OAuth-gated access
 * - Rate limiting (30/hour per IP, 15/hour per user)
 * - Four data sources: Binance prices, crypto news, on-chain metrics, social signals
 */
export async function GET() {
  return NextResponse.json(
    {
      status: "placeholder",
      message: "MCP server endpoint - under development",
      info: {
        description: "This endpoint will be replaced by a separate MCP server",
        features: [
          "Real-time crypto market data",
          "OAuth-gated access",
          "Rate limiting (30/hour per IP, 15/hour per user)",
          "Four data sources: prices, news, on-chain, social",
        ],
        documentation: "See README for MCP server setup instructions",
      },
      timestamp: new Date().toISOString(),
    },
    { status: 501 }
  )
}
