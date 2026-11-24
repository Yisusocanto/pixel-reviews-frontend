"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
import {
  ChartArea,
  ChevronsUpDown,
  Home,
  LogOut,
  Search,
  Settings,
  ShieldCheck,
  User,
} from "lucide-react"
import { signOut, useSession } from "next-auth/react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"

function AppSidebar() {
  const { data: session } = useSession()
  const { isMobile, setOpenMobile } = useSidebar()
  const router = useRouter()
  const pathname = usePathname()
  const isAdmin = session?.user.role === "admin"

  const links: NavLink[] = [
    { label: "Feed", href: "/feed", icon: Home },
    { label: "Search", href: "/search", icon: Search },
    { label: "Charts", href: "/charts", icon: ChartArea },
  ]
  const authLinks: NavLink[] = [
    {
      label: "Profile",
      href: `/users/${session?.user.username}`,
      icon: User,
    },
  ]
  const adminLinks: NavLink[] = [
    {
      label: "Moderation",
      href: "/admin/moderation",
      icon: ShieldCheck,
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
              href={session ? "/feed" : "/"}
              onClick={handleNavigate}
              className="group flex items-center gap-3 overflow-hidden rounded-lg p-1.5 transition-colors outline-none group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-0 hover:bg-sidebar-accent/60"
            >
              <PixelGamepadIcon className="h-6 w-12 shrink-0 text-primary transition-transform duration-200 group-hover:scale-105" />
              <div className="flex flex-col group-data-[collapsible=icon]:hidden">
                <div className="flex items-baseline gap-1 text-lg leading-none font-black tracking-tight">
                  <span className="text-primary">Pixel</span>
                  <span className="text-foreground">Reviews</span>
                </div>
                <span className="mt-1 font-mono text-[10px] font-semibold tracking-[0.2em] text-muted-foreground uppercase">
                  For those who play
                </span>
              </div>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <Separator className="my-2 opacity-60" />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="font-mono text-[10px] font-semibold tracking-[0.2em] text-muted-foreground/80 uppercase">
            Explore
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {links.map((link) => {
                const isActive = pathname === link.href
                return (
                  <SidebarMenuItem key={link.label}>
                    <SidebarMenuButton
                      isActive={isActive}
                      tooltip={link.label}
                      render={<Link href={link.href} onClick={handleNavigate} />}
                      className="h-10 rounded-md border-l-2 border-l-transparent text-muted-foreground transition-all hover:bg-sidebar-accent hover:text-foreground data-[active=true]:border-l-primary data-[active=true]:bg-primary/10 data-[active=true]:font-semibold data-[active=true]:text-foreground"
                    >
                      <link.icon
                        className={
                          isActive
                            ? "size-4 text-primary"
                            : "size-4 text-muted-foreground transition-colors group-hover/menu-item:text-primary"
                        }
                      />
                      <span className="text-sm">{link.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        {session && (
          <SidebarGroup>
            <SidebarGroupLabel className="font-mono text-[10px] font-semibold tracking-[0.2em] text-muted-foreground/80 uppercase">
              Library
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="gap-1">
                {authLinks.map((link) => {
                  const isActive = pathname === link.href
                  return (
                    <SidebarMenuItem key={link.label}>
                      <SidebarMenuButton
                        isActive={isActive}
                        tooltip={link.label}
                        render={
                          <Link href={link.href} onClick={handleNavigate} />
                        }
                        className="h-10 rounded-md border-l-2 border-l-transparent text-muted-foreground transition-all hover:bg-sidebar-accent hover:text-foreground data-[active=true]:border-l-primary data-[active=true]:bg-primary/10 data-[active=true]:font-semibold data-[active=true]:text-foreground"
                      >
                        <link.icon
                          className={
                            isActive
                              ? "size-4 text-primary"
                              : "size-4 text-muted-foreground transition-colors group-hover/menu-item:text-primary"
                          }
                        />
                        <span className="text-sm">{link.label}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
        {isAdmin && (
          <SidebarGroup>
            <SidebarGroupLabel className="font-mono text-[10px] font-semibold tracking-[0.2em] text-muted-foreground/80 uppercase">
              Administration
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="gap-1">
                {adminLinks.map((link) => {
                  const isActive = pathname.startsWith(link.href)
                  return (
                    <SidebarMenuItem key={link.label}>
                      <SidebarMenuButton
                        isActive={isActive}
                        tooltip={link.label}
                        render={
                          <Link href={link.href} onClick={handleNavigate} />
                        }
                        className="h-10 rounded-md border-l-2 border-l-transparent text-muted-foreground transition-all hover:bg-sidebar-accent hover:text-foreground data-[active=true]:border-l-primary data-[active=true]:bg-primary/10 data-[active=true]:font-semibold data-[active=true]:text-foreground"
                      >
                        <link.icon
                          className={
                            isActive
                              ? "size-4 text-primary"
                              : "size-4 text-muted-foreground transition-colors group-hover/menu-item:text-primary"
                          }
                        />
                        <span className="text-sm">{link.label}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
      <SidebarFooter>
        {session && (
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
                    <AvatarImage
                      src={session.user.profilePhotoUrl ?? ""}
                      alt={`${session.user.username}' profile photo`}
                    />
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
                          <AvatarImage
                            src={session.user.profilePhotoUrl ?? ""}
                            alt={`${session.user.username}' profile photo`}
                          />
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
                    {isAdmin && (
                      <DropdownMenuItem
                        onClick={() => router.push("/admin/moderation")}
                      >
                        <ShieldCheck />
                        Moderation
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={() => router.push("/settings")}>
                      <Settings />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleSignOut}>
                      <LogOut />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        )}
        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 px-2 py-1 text-[11px] text-muted-foreground group-data-[collapsible=icon]:hidden">
          <Link
            href="/privacy"
            onClick={handleNavigate}
            className="transition-colors hover:text-primary"
          >
            Privacy
          </Link>
          <span>·</span>
          <Link
            href="/terms"
            onClick={handleNavigate}
            className="transition-colors hover:text-primary"
          >
            Terms
          </Link>
          <span>·</span>
          <a
            href="https://www.igdb.com"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-primary"
          >
            Data by IGDB
          </a>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

export default AppSidebar
