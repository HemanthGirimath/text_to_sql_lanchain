import { Calendar, Home, Inbox, Search, Settings } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/app/components/ui/sidebar"
import { title } from "process"
import UserProfile from "../profile/page"

// Menu items.
const items = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Chat",
    url: "/chat",
    icon: Inbox,
  },
  {
    title: "Login",
    url: "/sign-in",
    icon: Calendar,
  }
]

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent className="flex flex-col h-full">
        <SidebarGroup>
          <SidebarGroupLabel>Recent Chat's</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          Recent chat's goes here ..
        </SidebarGroup>

      </SidebarContent>
      <SidebarFooter>
        <UserProfile />
        </SidebarFooter>
    </Sidebar>
  )
}
