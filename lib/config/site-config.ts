export const siteConfig = {
  name: "Context8",
  description: "OAuth-gated MCP delivering AI-ready crypto context. One URL away.",
  url: process.env.NEXTAUTH_URL || "http://localhost:3000",
  ogImage: "/og-image.png",
  links: {
    github: "https://github.com/context8",
    docs: "/docs",
  },
}

export type SiteConfig = typeof siteConfig
