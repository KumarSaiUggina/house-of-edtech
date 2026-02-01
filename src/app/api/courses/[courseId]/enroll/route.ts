import { getCurrentUser } from "@/lib/auth/utils"
import { prisma } from "@/lib/db"
import { NextResponse } from "next/server"

// Correctly type the params as an async-resolvable property
export async function POST(
    req: Request,
    { params }: { params: Promise<{ courseId: string }> }
) {
    try {
        const { courseId } = await params
        const user = await getCurrentUser()

        if (!user) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const existingEnrollment = await prisma.enrollment.findUnique({
            where: {
                studentId_courseId: {
                    studentId: user.id,
                    courseId: courseId,
                },
            },
        })

        if (existingEnrollment) {
            return new NextResponse("Already enrolled", { status: 409 })
        }

        const enrollment = await prisma.enrollment.create({
            data: {
                studentId: user.id,
                courseId: courseId,
            },
        })

        return NextResponse.json(enrollment)
    } catch (error) {
        console.log("[ENROLL_POST]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
