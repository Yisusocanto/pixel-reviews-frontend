"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar"
import { NavLink } from "@/types/link"
import {
  ChevronsUpDown,
  Earth,
  Gamepad2,
  Gift,
  Home,
  LogOut,
  Pencil,
  Search,
} from "lucide-react"
import { signOut, useSession } from "next-auth/react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"

function AppSidebar() {
  const { data: session } = useSession()
  const { isMobile } = useSidebar()
  const router = useRouter()
  const pathname = usePathname()
  const links: NavLink[] = [
    { label: "Feed", href: "/", icon: Home },
    { label: "Discover", href: "/discover", icon: Earth },
    { label: "Search", href: "/search", icon: Search },
  ]
  const authLinks: NavLink[] = [
    { label: "My reviews", href: "/user", icon: Pencil },
    { label: "Wishlist", href: "/user", icon: Gift },
  ]

  const handleSignOut = async () => {
    await signOut()
    router.refresh()
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center gap-2">
              <div className="size-9 h-fit w-fit rounded-lg border bg-accent/20 p-2">
                <Gamepad2 className="size-5" />
              </div>
              <div className="group-data-[collapsible=icon]:hidden">
                <p className="text-2xl font-extrabold">Pixel</p>
                <p className="text-2xl font-extrabold">Reviews</p>
                <p className="text-sm tracking-widest text-muted-foreground uppercase">
                  For those who play
                </p>
              </div>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <Separator className={"my-4"} />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {links.map((link) => (
                <SidebarMenuItem key={link.label}>
                  <SidebarMenuButton
                    isActive={pathname == link.href ? true : false}
                    render={<Link href={link.href} />}
                  >
                    <link.icon />
                    <span className="text-lg">{link.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Library</SidebarGroupLabel>
          {session && (
            <SidebarGroupContent>
              <SidebarMenu>
                {authLinks.map((link) => (
                  <SidebarMenuItem key={link.label}>
                    <SidebarMenuButton
                      isActive={pathname == link.href ? true : false}
                      render={<Link href={link.href} />}
                    >
                      <link.icon />
                      <span className="text-lg">{link.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          )}
        </SidebarGroup>
      </SidebarContent>
      {session && (
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <SidebarMenuButton
                      size="lg"
                      tooltip={session?.user.name ?? ""}
                      className="w-full rounded-lg transition-colors group-data-[collapsible=icon]:size-9! group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-0! data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                    />
                  }
                >
                  <Avatar className="h-7 w-7 shrink-0 rounded-lg">
                    <AvatarFallback className="rounded-lg bg-primary/20 text-xs font-semibold text-primary">
                      {session?.user.name?.slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                    <span className="truncate font-medium">
                      {session?.user.username}
                    </span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4 shrink-0 group-data-[collapsible=icon]:hidden" />
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-56 rounded-lg"
                  side={isMobile ? "bottom" : "right"}
                  align="end"
                  sideOffset={4}
                >
                  <DropdownMenuGroup>
                    <DropdownMenuLabel className="p-0 font-normal">
                      <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                        <Avatar>
                          <AvatarFallback>
                            {session?.user.name?.slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="grid flex-1 text-left text-sm leading-tight">
                          <span className="truncate font-medium">
                            {session?.user.name}
                          </span>
                          <span className="truncate text-xs text-muted-foreground">
                            @{session?.user.username}
                          </span>
                        </div>
                      </div>
                    </DropdownMenuLabel>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem onClick={handleSignOut}>
                      <LogOut />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      )}
      <SidebarRail />
    </Sidebar>
  )
}

export default AppSidebar
