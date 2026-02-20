"use client"

import { usePathname } from "next/navigation"

export function HeaderTitle() {
    const pathname = usePathname()

    const getTitle = (path: string) => {
        if (path === "/") return "Dashboard"
        if (path.startsWith("/entry")) return "Daily Entry"
        if (path.startsWith("/blood-work")) return "Blood Work"
        return "Dashboard"
    }

    return <span className="font-semibold">{getTitle(pathname)}</span>
}
