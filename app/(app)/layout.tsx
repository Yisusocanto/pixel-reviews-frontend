import AppSidebar from "@/components/app-sidebar"
import NavBar from "@/components/nav-bar"
import { SidebarInset } from "@/components/ui/sidebar"

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <AppSidebar />
      <SidebarInset className="flex min-h-svh min-w-0 flex-1 flex-col bg-secondary">
        <NavBar />
        <div className="flex min-w-0 flex-1 flex-col bg-secondary">
          {children}
        </div>
      </SidebarInset>
    </>
  )
}
