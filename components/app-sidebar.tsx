"use client"

import * as React from "react"
import {
  BookOpen,
  Bot,
  Command,
  Frame,
  LifeBuoy,
  Map,
  PieChart,
  Send,
  Settings2,
  SquareTerminal,
  Search,
} from "lucide-react"
import  ThemeSwitch  from "@/components/ThemeSwitch"

import { NavFavorites } from "@/components/nav-main"
import { NavSec } from "@/components/nav-sec"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "https://th.bing.com/th/id/OIP.JeGDOt3wdTdIwxU0lK-K5QHaHa?rs=1&pid=ImgDetMain",
  },
  NavSec: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: Search,
    },
    ],
  navMain: [
    {
      title: "Playground",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "History",
          url: "#",
        },
        {
          title: "Starred",
          url: "#",
        },
        {
          title: "Settings",
          url: "#",
        },
      ],
    },
    
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
            <NavUser user={data.user} />

            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <NavSec items={data.NavSec} />

      </SidebarHeader>
      <SidebarContent>
        <NavFavorites  />

      </SidebarContent>
      
    </Sidebar>
  )
}
