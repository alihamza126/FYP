"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, ShoppingBag, Users, Settings, LogOut, Menu, X, ChartBarStacked, Move3D } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar"

export function AdminSidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const toggleSidebar = () => {
    setIsOpen(!isOpen)
  }

  const closeSidebar = () => {
    setIsOpen(false)
  }

  const handleLogout = () => {
    // Clear admin token
    document.cookie = "admin_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
    // Redirect to login
    window.location.href = "/admin/login"
  }

  const navItems = [
    {
      title: "Dashboard",
      href: "/admin",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      title: "Products",
      href: "/admin/products",
      icon: <ShoppingBag className="h-5 w-5" />,
    },
    {
      title: "Categories",
      href: "/admin/categories",
      icon: <ChartBarStacked className="h-5 w-5" />,
    },
    {
      title: "Home slider",
      href: "/admin/slider",
      icon: <Move3D className="h-5 w-5" />,
    },
    {
      title: "Users",
      href: "/admin/users",
      icon: <Users className="h-5 w-5" />,
    },
    {
      title: "Settings",
      href: "/admin/settings",
      icon: <Settings className="h-5 w-5" />,
    },
  ]

  return (
    <Sidebar>
      {/* Mobile menu button */}
      <SidebarHeader>
        <Button variant="ghost" size="icon" className="md:hidden fixed top-4 left-4 z-50" onClick={toggleSidebar}>
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SidebarHeader>

      {/* Sidebar */}
      <SidebarContent>
        <SidebarGroup>
          <div className="flex flex-col h-full">
            <div className="p-4 border-b">
              <h2 className="text-xl font-bold">Admin Panel</h2>
            </div>

            <nav className="flex-1 p-4 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeSidebar}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
                    pathname === item.href || (item.href !== "/admin" && pathname?.startsWith(item.href))
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted",
                  )}
                >
                  {item.icon}
                  <span>{item.title}</span>
                </Link>
              ))}
            </nav>


          </div>
        </SidebarGroup>
        <SidebarGroup>
          <div className="p-4 border-t">
            <Button
              variant="ghost"
              className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-5 w-5" />
              Logout
            </Button>
          </div>
        </SidebarGroup>
      </SidebarContent>

      {/* Overlay */}
      {isOpen && <div className="fixed inset-0 z-30 bg-black/50 md:hidden" onClick={closeSidebar} />}
    </Sidebar>
  )
}
