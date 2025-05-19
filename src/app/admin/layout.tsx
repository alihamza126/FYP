import type React from "react"
import type { Metadata } from "next"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { ChatProvider } from "@/context/AdminChat"

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Product Management Admin Dashboard",
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <SidebarProvider>
      <AdminSidebar />
      <main className="w-full px-4">
        <SidebarTrigger />
        <ChatProvider>
          {children}
        </ChatProvider>
      </main>
    </SidebarProvider>
  )
}
