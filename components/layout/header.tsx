"use client"

import Link from "next/link"
import { CircleUser, Menu, Package2, Search, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Home, Building, DollarSign, FileText, Zap, Users2, BarChart } from "lucide-react"

interface HeaderProps {
  userRole: "admin" | "user"
}

export function Header({ userRole }: HeaderProps) {
  const pathname = usePathname()

  const navItems = [
    { href: "/dashboard", icon: Home, label: "Dashboard", roles: ["admin", "user"] },
    { href: "/power-plants", icon: Zap, label: "Usinas Solares", roles: ["admin"] },
    { href: "/consumer-units", icon: Building, label: "Unidades Consumidoras", roles: ["admin"] },
    { href: "/contracts", icon: FileText, label: "Contratos", roles: ["admin", "user"] },
    { href: "/energy-vault", icon: Package2, label: "Energy Vault", roles: ["admin"] },
    { href: "/financial", icon: DollarSign, label: "Financeiro", roles: ["admin"] },
    { href: "/crm", icon: Users2, label: "CRM", roles: ["admin"] },
    { href: "/reports", icon: BarChart, label: "Relatórios", roles: ["admin", "user"] },
  ]

  const filteredNavItems = navItems.filter((item) => item.roles.includes(userRole))

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button size="icon" variant="outline" className="sm:hidden bg-transparent">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Navigation Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="sm:max-w-xs">
          <nav className="grid gap-6 text-lg font-medium">
            <Link
              href="#"
              className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
            >
              <Package2 className="h-5 w-5 transition-all group-hover:scale-110" />
              <span className="sr-only">Solar DG Platform</span>
            </Link>
            {filteredNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground",
                  pathname === item.href && "text-foreground",
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            ))}
            <Link
              href="/settings"
              className={cn(
                "flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground",
                pathname === "/settings" && "text-foreground",
              )}
            >
              <Settings className="h-5 w-5" />
              Settings
            </Link>
          </nav>
        </SheetContent>
      </Sheet>
      <div className="relative ml-auto flex-1 md:grow-0">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search..."
          className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
        />
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary" size="icon" className="rounded-full">
            <CircleUser className="h-5 w-5" />
            <span className="sr-only">Toggle user menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Settings</DropdownMenuItem>
          <DropdownMenuItem>Support</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Logout</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}
