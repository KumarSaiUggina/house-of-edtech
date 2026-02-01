import { getCurrentUser } from "@/lib/auth/utils";
import { redirect } from "next/navigation";
import AdminDashboard from "./admin/page";
import TeacherDashboard from "./teacher/page";
import StudentDashboard from "./student/page";

export default async function DashboardPage() {
    const user = await getCurrentUser();

    if (!user) {
        redirect("/login");
    }

    switch (user.role) {
        case "ADMIN":
            return <AdminDashboard />;
        case "TEACHER":
            return <TeacherDashboard />;
        case "STUDENT":
            return <StudentDashboard />;
        default:
            redirect("/login");
    }
}
