import { Inter } from "next/font/google"
import { SiteHeader } from "@/components/site-header"

const inter = Inter({ subsets: ["latin"] })

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`min-h-screen bg-background ${inter.className}`}>
      <SiteHeader />
      <main>{children}</main>
    </div>
  )
}
