# Analytics Chat Setup Guide

## ✅ Completed Steps

1. ✅ Installed dependencies (@openai/chatkit-react, recharts)
2. ✅ Created Analytics page at `/analytics` with auth protection
3. ✅ Created ChatKit component with MCP connection
4. ✅ Added routing and navigation from Dashboard
5. ✅ Created widget components for market data
6. ✅ Build successful

## 🔧 Remaining Setup Steps

### 1. Create OpenAI Workflow

You need to create a Workflow in OpenAI Platform to connect ChatKit with your MCP tools.

**Steps:**

1. Go to [OpenAI Platform](https://platform.openai.com) → Workflows
2. Click "Create New Workflow"
3. Name it: **"Context8 Crypto Analytics"**
4. Configure the workflow:
   - **Model**: gpt-4o or gpt-4o-mini
   - **System Prompt**:
     ```
     You are a crypto market analyst assistant. You have access to real-time market data through MCP tools.

     Available tools:
     - fetch(symbol: string) - Get complete market report with orderbook, volume profile, and flow analysis
     - search(query: string) - Search for cryptocurrency trading symbols

     When a user asks for market data:
     1. Use the appropriate tool (fetch or search)
     2. Analyze the data
     3. Call render_market_widget client tool with the data to display charts
     4. Provide a concise analysis in your response

     Always format numbers clearly and highlight important metrics like spread, imbalance, and volume.
     ```

5. **Add MCP Tools**:
   - Tool 1: `fetch`
     - Description: "Retrieve complete market data report for a specific symbol"
     - Parameters: `{ "symbol": "string" }`
   - Tool 2: `search`
     - Description: "Search for cryptocurrency trading symbols"
     - Parameters: `{ "query": "string" }`

6. **Add Client Tool** (for widget rendering):
   - Tool: `render_market_widget`
     - Description: "Render a market data widget in the UI"
     - Parameters:
       ```json
       {
         "symbol": "string",
         "price": "string",
         "volume": "string",
         "spread": "string (optional)"
       }
       ```

7. Save the workflow and copy the **Workflow ID** (format: `wf_xxxxx`)

### 2. Configure Environment Variables

Update your `.env.local` file:

```bash
# Context8 MCP Server
VITE_CONTEXT8_MCP_URL="https://api.context8.markets/sse"
VITE_CONTEXT8_DOMAIN_KEY="context8"
VITE_CHATKIT_WORKFLOW_ID="wf_xxxxx" # Paste your workflow ID here
```

### 3. Test the Integration

1. Start the dev server: `npm run dev`
2. Navigate to Dashboard → Analytics
3. Try these commands:
   - "Show BTC market report"
   - "Search for Ethereum symbols"
   - "Get order book for SOLUSDT"

### 4. Verify MCP Connection

Check browser console for:
- ✅ `[AnalyticsChatKit] Connected to https://api.context8.markets/sse`
- ✅ `[AnalyticsChatKit] Client tool invoked: render_market_widget`

## 📋 File Structure

```
src/
├── pages/
│   └── Analytics.tsx                 # Main analytics page with auth
├── components/
│   └── analytics/
│       ├── AnalyticsChatKit.tsx      # ChatKit integration with MCP
│       └── MarketDataWidget.tsx      # Widget for displaying market data
└── types/
    └── analytics.ts                  # TypeScript types for market data
```

## 🎨 Features

- ✅ Terminal-style UI matching Context8 branding
- ✅ Real-time chat with LLM agent
- ✅ MCP tools integration (fetch, search)
- ✅ Client-side widget rendering
- ✅ Session-only chat history (no persistence)
- ✅ Protected route with auth check
- ✅ Responsive layout (chat + widgets sidebar)

## 🚀 Next Steps (Future)

- [ ] Add more widget types (order book chart, volume profile)
- [ ] Implement historical data charts
- [ ] Add export functionality
- [ ] Multi-symbol comparison
- [ ] Real-time WebSocket updates

## 🔗 Resources

- [OpenAI ChatKit Docs](https://chatkit.openai.com)
- [MCP Protocol Docs](https://modelcontextprotocol.io)
- [Context8 API Docs](https://api.context8.markets/docs)

## ⚠️ Troubleshooting

**Issue**: ChatKit shows "Failed to load"
- Check VITE_CHATKIT_WORKFLOW_ID is set
- Verify workflow exists in OpenAI Platform
- Check browser console for errors

**Issue**: MCP tools not working
- Verify MCP server is running at https://api.context8.markets/sse
- Check CORS settings on MCP server
- Ensure tools are properly configured in workflow

**Issue**: Widgets not displaying
- Check browser console for client tool invocations
- Verify render_market_widget is called with correct params
- Check MarketData type matches the data structure
