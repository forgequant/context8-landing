# Analytics Setup (API-First)

The product direction is API-first. For developer usage examples, see the landing page "API" section and `/dashboard/settings` in the app.

## Analytics Page

The `/analytics` page uses OpenAI ChatKit UI components for interactive analysis. If you want the assistant to use Context8 data, configure your workflow/tools to call the Context8 REST API endpoints (e.g. `POST https://api.context8.markets/v1/signals`) using a user-generated API key (Bearer auth).

## Environment

This repo does not ship a built-in tool server. Any LLM tool-calling integration should be implemented against the REST API.
