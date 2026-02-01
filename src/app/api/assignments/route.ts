import { getCurrentUser } from "@/lib/auth/utils"
import { prisma } from "@/lib/db"
import { assignmentSchema } from "@/lib/validations/assignment"
import { NextResponse } from "next/server"
import * as z from "zod"

export async function GET(req: Request) {
    try {
        const user = await getCurrentUser()
        if (!user) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const { searchParams } = new URL(req.url)
        const courseId = searchParams.get("courseId")

        if (!courseId) {
            return new NextResponse("Course ID is required", { status: 400 })
        }

        const assignments = await prisma.assignment.findMany({
            where: {
                courseId: courseId,
            },
            orderBy: {
                createdAt: "desc",
            },
        })

        return NextResponse.json(assignments)
    } catch (error) {
        console.error(error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}

export async function POST(req: Request) {
    try {
        const user = await getCurrentUser()

        if (!user || user.role !== "TEACHER") {
            return new NextResponse("Forbidden", { status: 403 })
        }

        const json = await req.json()
        const body = assignmentSchema.parse({
            ...json,
            dueDate: new Date(json.dueDate),
        });

        // Verify teacher owns the course
        const course = await prisma.course.findUnique({
            where: { id: body.courseId },
        })

        if (!course || course.teacherId !== user.id) {
            return new NextResponse("Forbidden - You do not own this course", { status: 403 })
        }

        const assignment = await prisma.assignment.create({
            data: {
                title: body.title,
                description: body.description,
                maxScore: body.maxScore,
                dueDate: body.dueDate,
                courseId: body.courseId,
            },
        })

        return NextResponse.json(assignment)
    } catch (error) {
        if (error instanceof z.ZodError) {
            return new NextResponse(JSON.stringify(error.issues), { status: 422 })
        }
        console.error(error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
