import { getServerSession } from "next-auth"
import { authOptions } from "./authOptions"
import { redirect } from "next/navigation"

export async function getCurrentUser() {
    const session = await getServerSession(authOptions)
    return session?.user
}

export async function requireAuth() {
    const user = await getCurrentUser()
    if (!user) {
        redirect("/login")
    }
    return user
}

export async function requireRole(role: string | string[]) {
    const user = await requireAuth()
    const roles = Array.isArray(role) ? role : [role]

    if (!user.role || !roles.includes(user.role)) {
        redirect("/dashboard")
    }
    return user
}
