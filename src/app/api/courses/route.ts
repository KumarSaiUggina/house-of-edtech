import { getCurrentUser } from "@/lib/auth/utils"
import { prisma } from "@/lib/db"
import { courseSchema } from "@/lib/validations/course"
import { NextResponse } from "next/server"
import * as z from "zod"

export async function GET(req: Request) {
    try {
        const user = await getCurrentUser()

        if (!user) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        let courses

        if (user.role === "ADMIN") {
            courses = await prisma.course.findMany({
                include: {
                    teacher: {
                        select: {
                            name: true,
                            email: true,
                        },
                    },
                    _count: {
                        select: {
                            enrollments: true,
                        },
                    },
                },
                orderBy: {
                    createdAt: "desc",
                },
            })
        } else if (user.role === "TEACHER") {
            courses = await prisma.course.findMany({
                where: {
                    teacherId: user.id,
                },
                include: {
                    _count: {
                        select: {
                            enrollments: true,
                        },
                    },
                },
                orderBy: {
                    createdAt: "desc",
                },
            })
        } else {
            // Student - fetches enrolled courses (or all available? Let's assume list of all for now so they can enroll)
            // Actually, typically students want to see "My Courses".
            // Let's return ALL courses for now so they can pick one to enroll, 
            // but ideally we'd have search/filter.
            courses = await prisma.course.findMany({
                include: {
                    teacher: {
                        select: {
                            name: true,
                        },
                    },
                },
                orderBy: {
                    createdAt: "desc",
                },
            })
        }

        return NextResponse.json(courses)
    } catch (error) {
        return new NextResponse("Internal Error", { status: 500 })
    }
}

export async function POST(req: Request) {
    try {
        const user = await getCurrentUser()

        if (!user || (user.role !== "ADMIN" && user.role !== "TEACHER")) {
            return new NextResponse("Forbidden", { status: 403 })
        }

        const json = await req.json()
        const body = courseSchema.parse(json)

        const course = await prisma.course.create({
            data: {
                title: body.title,
                code: body.code,
                description: body.description,
                teacherId: user.role === "ADMIN" && body.teacherId ? body.teacherId : user.id,
            },
        })

        return NextResponse.json(course)
    } catch (error) {
        if (error instanceof z.ZodError) {
            return new NextResponse(JSON.stringify(error.issues), { status: 422 })
        }
        return new NextResponse("Internal Error", { status: 500 })
    }
}
