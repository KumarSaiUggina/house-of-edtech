import { getCurrentUser } from "@/lib/auth/utils";
import { prisma } from "@/lib/db";
import { courseSchema } from "@/lib/validations/course";
import { NextResponse } from "next/server";
import * as z from "zod";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const { courseId } = await params;
    const user = await getCurrentUser();
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const course = await prisma.course.findUnique({
      where: {
        id: courseId,
      },
      include: {
        teacher: {
          select: {
            name: true,
            email: true,
          },
        },
        assignments: true,
        enrollments: {
          include: {
            student: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(course);
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const { courseId } = await params;
    const user = await getCurrentUser();
    if (!user || (user.role !== "ADMIN" && user.role !== "TEACHER")) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const course = await prisma.course.findUnique({
      where: {
        id: courseId,
      },
    });

    if (!course) {
      return new NextResponse("Not Found", { status: 404 });
    }

    if (user.role === "TEACHER" && course.teacherId !== user.id) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const json = await req.json();
    const body = courseSchema.parse(json);

    const updatedCourse = await prisma.course.update({
      where: {
        id: courseId,
      },
      data: {
        title: body.title,
        description: body.description,
        code: body.code,
        teacherId: user.role === "ADMIN" && body.teacherId ? body.teacherId : course.teacherId,
      },
    });

    return NextResponse.json(updatedCourse);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse(JSON.stringify(error.issues), { status: 422 });
    }
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const { courseId } = await params;
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return new NextResponse("Forbidden", { status: 403 });
    }

    await prisma.course.delete({
      where: {
        id: courseId,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}
