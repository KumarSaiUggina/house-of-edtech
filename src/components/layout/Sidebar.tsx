"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
    LayoutDashboard,
    BookOpen,
    GraduationCap,
    Users,
    Settings,
    Menu,
    LogOut,
    FileText,
} from "lucide-react"
import { useState } from "react"
import { signOut } from "next-auth/react"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
    role?: string
}

export function Sidebar({ className, role }: SidebarProps) {
    const pathname = usePathname()
    const [open, setOpen] = useState(false)

    // Determine the base path based on role
    const getBasePath = () => {
        if (role === "ADMIN") return "/admin"
        if (role === "TEACHER") return "/teacher"
        if (role === "STUDENT") return "/student"
        return "/student" // fallback
    }

    const basePath = getBasePath()

    const routes = [
        {
            label: "Dashboard",
            icon: LayoutDashboard,
            href: basePath,
            active: pathname === basePath,
            roles: ["ADMIN", "TEACHER", "STUDENT"],
        },
        {
            label: "Users",
            icon: Users,
            href: `${basePath}/users`,
            active: pathname.startsWith(`${basePath}/users`),
            roles: ["ADMIN"],
        },
        {
            label: "Courses",
            icon: BookOpen,
            href: "/courses",
            active: pathname.startsWith("/courses"),
            roles: ["ADMIN", "TEACHER"],
        },
        {
            label: "My Courses",
            icon: BookOpen,
            href: "/courses",
            active: pathname.startsWith("/courses"),
            roles: ["STUDENT"],
        },
        {
            label: "Assignments",
            icon: FileText,
            href: `${basePath}/assignments`,
            active: pathname.startsWith(`${basePath}/assignments`),
            roles: ["TEACHER"],
        },
        {
            label: "Grades",
            icon: GraduationCap,
            href: `${basePath}/grades`,
            active: pathname.startsWith(`${basePath}/grades`),
            roles: ["STUDENT"],
        },
        {
            label: "Settings",
            icon: Settings,
            href: `${basePath}/settings`,
            active: pathname === `${basePath}/settings`,
            roles: ["ADMIN", "TEACHER", "STUDENT"],
        },
    ]

    const filteredRoutes = routes.filter((route) =>
        role ? route.roles.includes(role) : true
    )

    const SidebarContent = () => (
        <div className="space-y-4 py-4 flex flex-col h-full">
            <div className="px-3 py-2">
                <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
                    EdTech Platform
                </h2>
                <div className="space-y-1">
                    {filteredRoutes.map((route) => (
                        <Button
                            key={route.href}
                            variant={route.active ? "secondary" : "ghost"}
                            className="w-full justify-start"
                            asChild
                            onClick={() => setOpen(false)}
                        >
                            <Link href={route.href}>
                                <route.icon className="mr-2 h-4 w-4" />
                                {route.label}
                            </Link>
                        </Button>
                    ))}
                </div>
            </div>
            <div className="mt-auto px-3">
                <Button
                    variant="ghost"
                    className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
                    onClick={() => signOut({ callbackUrl: "/login" })}
                >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                </Button>
            </div>
        </div>
    )

    return (
        <>
            <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                    <Button
                        variant="outline"
                        size="icon"
                        className="md:hidden fixed top-4 left-4 z-40"
                    >
                        <Menu className="h-4 w-4" />
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0 w-64">
                    <SidebarContent />
                </SheetContent>
            </Sheet>

            <div className={cn("hidden border-r md:block w-64 h-screen fixed left-0 top-0 bg-background", className)}>
                <SidebarContent />
            </div>
        </>
    )
}
