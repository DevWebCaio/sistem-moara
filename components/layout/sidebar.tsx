"use client"

import Link from "next/link"
import { Home, Package, Package2, Settings, Users2, Building, DollarSign, FileText, Zap, BarChart } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

interface SidebarProps {
  userRole: "admin" | "user"
}

export function Sidebar({ userRole }: SidebarProps) {
  const pathname = usePathname()

  const navItems = [
    { href: "/dashboard", icon: Home, label: "Dashboard", roles: ["admin", "user"] },
    { href: "/power-plants", icon: Zap, label: "Usinas Solares", roles: ["admin"] },
    { href: "/consumer-units", icon: Building, label: "Unidades Consumidoras", roles: ["admin"] },
    { href: "/contracts", icon: FileText, label: "Contratos", roles: ["admin", "user"] },
    { href: "/energy-vault", icon: Package, label: "Energy Vault", roles: ["admin"] },
    { href: "/financial", icon: DollarSign, label: "Financeiro", roles: ["admin"] },
    { href: "/crm", icon: Users2, label: "CRM", roles: ["admin"] },
    { href: "/reports", icon: BarChart, label: "Relatórios", roles: ["admin", "user"] },
  ]

  const filteredNavItems = navItems.filter((item) => item.roles.includes(userRole))

  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
      <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
        <Link
          href="#"
          className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
        >
          <Package2 className="h-4 w-4 transition-all group-hover:scale-110" />
          <span className="sr-only">Solar DG Platform</span>
        </Link>
        <TooltipProvider>
          {filteredNavItems.map((item) => (
            <Tooltip key={item.href}>
              <TooltipTrigger asChild>
                <Link
                  href={item.href}
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8",
                    pathname === item.href && "bg-accent text-accent-foreground",
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="sr-only">{item.label}</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">{item.label}</TooltipContent>
            </Tooltip>
          ))}
        </TooltipProvider>
      </nav>
      <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/settings"
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8",
                  pathname === "/settings" && "bg-accent text-accent-foreground",
                )}
              >
                <Settings className="h-5 w-5" />
                <span className="sr-only">Settings</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Settings</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </nav>
    </aside>
  )
}
