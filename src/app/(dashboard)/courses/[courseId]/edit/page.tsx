import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CourseForm } from "../../_components/CourseForm";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";

export default async function EditCoursePage({ params }: { params: Promise<{ courseId: string }> }) {
    const { courseId } = await params;

    const course = await prisma.course.findUnique({
        where: {
            id: courseId,
        },
    });

    if (!course) {
        notFound();
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Edit course</CardTitle>
                <CardDescription>
                    Fill out the form below to edit the course.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <CourseForm course={course} />
            </CardContent>
        </Card>
    );
}
