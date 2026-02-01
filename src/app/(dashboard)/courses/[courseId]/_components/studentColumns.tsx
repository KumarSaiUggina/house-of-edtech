"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Enrollment, User } from "@prisma/client"

type EnrollmentWithStudent = Enrollment & {
    student: User
}

export const studentColumns: ColumnDef<EnrollmentWithStudent>[] = [
    {
        accessorKey: "student.name",
        header: "Name",
        cell: ({ row }) => {
            return <div className="font-medium">{row.original.student.name}</div>
        },
    },
    {
        accessorKey: "student.email",
        header: "Email",
        cell: ({ row }) => {
            return <div className="text-muted-foreground">{row.original.student.email}</div>
        },
    },
    {
        accessorKey: "enrolledAt",
        header: "Enrolled Date",
        cell: ({ row }) => {
            return (
                <div>
                    {new Date(row.original.enrolledAt).toLocaleDateString()}
                </div>
            )
        },
    },
]
