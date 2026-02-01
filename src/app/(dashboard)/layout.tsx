import { Sidebar } from "@/components/layout/Sidebar"
import { Header } from "@/components/layout/Header"
import { getCurrentUser } from "@/lib/auth/utils"
import { redirect } from "next/navigation"

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const user = await getCurrentUser()

    if (!user) {
        redirect("/login")
    }

    return (
        <div className="flex h-screen overflow-hidden">
            <Sidebar role={user.role} />
            <div className="flex flex-col flex-1 md:ml-64 overflow-hidden">
                <Header user={user} />
                <main className="flex-1 overflow-y-auto bg-gray-50/50 p-6">
                    {children}
                </main>
            </div>
        </div>
    )
}
