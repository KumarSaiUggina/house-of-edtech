import * as z from "zod"

export const assignmentSchema = z.object({
    title: z.string().min(3, {
        message: "Title must be at least 3 characters.",
    }),
    description: z.string().optional(),
    maxScore: z.coerce.number().min(1, {
        message: "Max score must be at least 1.",
    }),
    dueDate: z.date(),
    courseId: z.string().min(1),
})

export type AssignmentFormValues = z.infer<typeof assignmentSchema>
