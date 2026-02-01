import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CourseForm } from "../_components/CourseForm";

export default function CreateCoursePage() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Create a new course</CardTitle>
                <CardDescription>
                    Fill out the form below to create a new course.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <CourseForm />
            </CardContent>
        </Card>
    );
}
