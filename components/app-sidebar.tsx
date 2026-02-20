"use client"

import * as React from "react"
import {
    LayoutDashboard,
    Command,
    RefreshCw,
    Calendar as CalendarIcon,
} from "lucide-react"
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
    useSidebar,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { usePathname } from "next/navigation"

// Menu items.
const items = [
    {
        title: "Dashboard",
        url: "/",
        icon: LayoutDashboard,
    },
    {
        title: "Updates",
        url: "/updates",
        icon: RefreshCw,
    },
    {
        title: "Calendar",
        url: "/calendar",
        icon: CalendarIcon,
    },
]

export function AppSidebar() {
    const pathname = usePathname()
    // We don't need useSidebar logic here unless we use it for something specific, 
    // but the demo uses it for trigger or mobile state if needed. 
    // For now, simple structure is fine.

    return (
        <Sidebar variant="sidebar" collapsible="none" className="w-[18rem]">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/">
                                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                                    <Command className="size-4" />
                                </div>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-semibold">HealthOS</span>
                                    <span className="truncate text-xs">Personal Tracker</span>
                                </div>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Platform</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild isActive={pathname === item.url} tooltip={item.title}>
                                        <Link href={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>


        </Sidebar>
    )
}
