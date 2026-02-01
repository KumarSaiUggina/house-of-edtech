import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AssignmentsDataTable } from "./_components/AssignmentsDataTable";
import { assignmentColumns } from "./_components/assignmentColumns";
import { StudentsDataTable } from "./_components/StudentsDataTable";
import { studentColumns } from "./_components/studentColumns";

export default async function CourseDetailsPage({ params }: { params: Promise<{ courseId: string }> }) {
    const { courseId } = await params;

    const course = await prisma.course.findUnique({
        where: {
            id: courseId,
        },
        include: {
            assignments: true,
            enrollments: {
                include: {
                    student: true,
                },
            },
        },
    });

    if (!course) {
        notFound();
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>{course.title}</CardTitle>
                    <CardDescription>Course Code: {course.code}</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">{course.description}</p>
                </CardContent>
            </Card>

            <Tabs defaultValue="assignments" className="w-full">
                <TabsList>
                    <TabsTrigger value="assignments">Assignments</TabsTrigger>
                    <TabsTrigger value="students">Students</TabsTrigger>
                </TabsList>
                <TabsContent value="assignments">
                    <Card>
                        <CardHeader>
                            <CardTitle>Assignments</CardTitle>
                            <CardDescription>
                                Manage assignments for this course
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <AssignmentsDataTable columns={assignmentColumns} data={course.assignments} />
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="students">
                    <Card>
                        <CardHeader>
                            <CardTitle>Enrolled Students</CardTitle>
                            <CardDescription>
                                Students enrolled in this course
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <StudentsDataTable columns={studentColumns} data={course.enrollments} />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
