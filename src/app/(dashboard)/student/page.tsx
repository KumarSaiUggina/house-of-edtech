import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentUser } from "@/lib/auth/utils";
import { prisma } from "@/lib/db";
import { BookOpen, FileText } from "lucide-react";

export default async function StudentDashboard() {
  const user = await getCurrentUser();

  const stats = await prisma.$transaction(async (tx) => {
    const enrolledCourses = await tx.enrollment.count({
      where: { studentId: user?.id },
    });

    const pendingAssignments = await tx.assignment.count({
      where: {
        course: {
          enrollments: {
            some: {
              studentId: user?.id,
            },
          },
        },
        submissions: {
          none: {
            studentId: user?.id,
          },
        },
      },
    });
    
    return { enrolledCourses, pendingAssignments };
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">
          Welcome back, {user?.name}!
        </h2>
        <p className="text-muted-foreground">
          Here is an overview of your student dashboard.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Enrolled Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.enrolledCourses}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Assignments</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingAssignments}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
