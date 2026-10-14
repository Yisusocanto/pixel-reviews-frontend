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
import { PixelGamepadIcon } from "@/components/ui/pixel-gamepad-icon"
import { NavLink } from "@/types/link"
import { ChevronsUpDown, Earth, Home, LogOut, Search, User } from "lucide-react"
import { signOut, useSession } from "next-auth/react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"

function AppSidebar() {
  const { data: session } = useSession()
  const { isMobile, setOpenMobile } = useSidebar()
  const router = useRouter()
  const pathname = usePathname()
  const links: NavLink[] = [
    { label: "Feed", href: "/", icon: Home },
    { label: "Discover", href: "/discover", icon: Earth },
    { label: "Search", href: "/search", icon: Search },
  ]
  const authLinks: NavLink[] = [
    {
      label: "Profile",
      href: `/users/${session?.user.username}`,
      icon: User,
    },
  ]

  const handleNavigate = () => {
    if (isMobile) setOpenMobile(false)
  }

  const handleSignOut = async () => {
    handleNavigate()
    await signOut()
    router.refresh()
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="py-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <Link
              href="/"
              onClick={handleNavigate}
              className="flex items-center gap-3 overflow-hidden rounded-md p-1 transition-colors outline-none group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-0"
            >
              <PixelGamepadIcon className="h-6 w-12 shrink-0 text-primary transition-transform hover:scale-105" />
              <div className="flex flex-col group-data-[collapsible=icon]:hidden">
                <div className="flex items-baseline gap-1 text-xl leading-none font-black tracking-tight">
                  <span className="text-primary">Pixel</span>
                  <span className="text-foreground">Reviews</span>
                </div>
                <span className="mt-1 text-xs font-semibold tracking-widest text-muted-foreground uppercase">
                  For those who play
                </span>
              </div>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <Separator className={"my-4"} />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="gap-2">
              {links.map((link) => (
                <SidebarMenuItem key={link.label}>
                  <SidebarMenuButton
                    isActive={pathname == link.href ? true : false}
                    render={<Link href={link.href} onClick={handleNavigate} />}
                    className="rounded-sm border-l-2 border-l-primary selection:bg-primary hover:bg-primary/7 data-selected:bg-primary"
                  >
                    <link.icon className="text-primary" />
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
              <SidebarMenu className="gap-2">
                {authLinks.map((link) => (
                  <SidebarMenuItem key={link.label}>
                    <SidebarMenuButton
                      isActive={pathname == link.href ? true : false}
                      render={
                        <Link href={link.href} onClick={handleNavigate} />
                      }
                      className="rounded-sm border-l-2 border-l-primary selection:bg-primary hover:bg-primary/7 data-selected:bg-primary"
                    >
                      <link.icon className="text-primary" />
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
