import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/session"
import Link from "next/link"
import { DashboardHeader } from "@/components/dashboard-header"

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader user={user} />
      <main>{children}</main>
    </div>
  )
}
