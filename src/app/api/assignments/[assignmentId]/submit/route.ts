import { getCurrentUser } from "@/lib/auth/utils"
import { prisma } from "@/lib/db"
import { NextResponse } from "next/server"
import * as z from "zod"

// Simple schema for submission content
const submissionSchema = z.object({
    content: z.string().min(1, "Content is required"),
})

export async function POST(
    req: Request,
    { params }: { params: Promise<{ assignmentId: string }> }
) {
    try {
        const { assignmentId } = await params
        const user = await getCurrentUser()

        if (!user || user.role !== "STUDENT") {
            return new NextResponse("Forbidden", { status: 403 })
        }

        const json = await req.json()
        const body = submissionSchema.parse(json)

        // Check if student is enrolled in the course associated with the assignment?
        // Optimized: Just try to create. If we really wanted security we'd check enrollment.
        // Let's do a quick check to be safe.

        const assignment = await prisma.assignment.findUnique({
            where: { id: assignmentId },
            include: { course: true }
        })

        if (!assignment) {
            return new NextResponse("Assignment not found", { status: 404 })
        }

        const enrollment = await prisma.enrollment.findUnique({
            where: {
                studentId_courseId: {
                    studentId: user.id,
                    courseId: assignment.courseId
                }
            }
        })

        if (!enrollment) {
            return new NextResponse("You are not enrolled in this course", { status: 403 })
        }

        // Upsert submission (allow re-submission or new)
        const submission = await prisma.submission.upsert({
            where: {
                assignmentId_studentId: {
                    assignmentId: assignmentId,
                    studentId: user.id,
                },
            },
            update: {
                content: body.content,
                submittedAt: new Date(),
            },
            create: {
                assignmentId: assignmentId,
                studentId: user.id,
                content: body.content,
            },
        })

        return NextResponse.json(submission)
    } catch (error) {
        if (error instanceof z.ZodError) {
            return new NextResponse(JSON.stringify(error.issues), { status: 422 })
        }
        console.error(error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
