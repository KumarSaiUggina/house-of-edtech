import * as z from "zod"

export const courseSchema = z.object({
    title: z.string().min(3, {
        message: "Title must be at least 3 characters.",
    }),
    description: z.string().optional(),
    code: z.string().min(2, {
        message: "Course code must be at least 2 characters.",
    }),
    teacherId: z.string().optional(),
})

export type CourseFormValues = z.infer<typeof courseSchema>
