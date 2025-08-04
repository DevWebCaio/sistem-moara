import type { ReactNode } from "react"
import { Header } from "./header"
import { Sidebar } from "./sidebar"

interface MainLayoutProps {
  children: ReactNode
  userRole: "admin" | "user"
}

export function MainLayout({ children, userRole }: MainLayoutProps) {
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <Sidebar userRole={userRole} />
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <Header userRole={userRole} />
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">{children}</main>
      </div>
    </div>
  )
}
