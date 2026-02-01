import { getCurrentUser } from "@/lib/auth/utils";
import { prisma } from "@/lib/db";
import { assignmentSchema } from "@/lib/validations/assignment";
import { NextResponse } from "next/server";
import * as z from "zod";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ assignmentId: string }> }
) {
  try {
    const { assignmentId } = await params;
    const user = await getCurrentUser();
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const assignment = await prisma.assignment.findUnique({
      where: {
        id: assignmentId,
      },
      include: {
        submissions: {
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

    return NextResponse.json(assignment);
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ assignmentId: string }> }
) {
  try {
    const { assignmentId } = await params;
    const user = await getCurrentUser();
    if (!user || user.role !== "TEACHER") {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const assignment = await prisma.assignment.findUnique({
      where: {
        id: assignmentId,
      },
      include: {
        course: true,
      },
    });

    if (!assignment) {
      return new NextResponse("Not Found", { status: 404 });
    }

    if (assignment.course.teacherId !== user.id) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const json = await req.json();
    const body = assignmentSchema.parse({
      ...json,
      dueDate: new Date(json.dueDate),
    });

    const updatedAssignment = await prisma.assignment.update({
      where: {
        id: assignmentId,
      },
      data: {
        title: body.title,
        description: body.description,
        maxScore: body.maxScore,
        dueDate: body.dueDate,
      },
    });

    return NextResponse.json(updatedAssignment);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse(JSON.stringify(error.issues), { status: 422 });
    }
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ assignmentId: string }> }
) {
  try {
    const { assignmentId } = await params;
    const user = await getCurrentUser();
    if (!user || user.role !== "TEACHER") {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const assignment = await prisma.assignment.findUnique({
      where: {
        id: assignmentId,
      },
      include: {
        course: true,
      },
    });

    if (!assignment) {
      return new NextResponse("Not Found", { status: 404 });
    }

    if (assignment.course.teacherId !== user.id) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    await prisma.assignment.delete({
      where: {
        id: assignmentId,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}
