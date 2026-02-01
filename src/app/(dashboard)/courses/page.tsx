import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentUser } from "@/lib/auth/utils";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { DataTable } from "@/components/shared/DataTable";
import { columns } from "./_components/columns";

export default async function CoursesPage() {
    const user = await getCurrentUser();

    const courses = await prisma.course.findMany({
        where: {
            teacherId: user?.id
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
        }
    });

    return (
        <Card>
            <CardHeader>
                <CardTitle>Courses</CardTitle>
                <CardDescription>
                    A list of all the courses you have created.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <DataTable columns={columns} data={courses} />
            </CardContent>
        </Card>
    );
}
