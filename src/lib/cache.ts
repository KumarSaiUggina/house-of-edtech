import { cache } from 'react'
import { prisma } from '@/lib/db'

/**
 * Cached database queries for improved performance
 * React's cache function deduplicates requests during a single render
 */

export const getCachedUser = cache(async (userId: string) => {
    return await prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            image: true,
        }
    })
})

export const getCachedCourse = cache(async (courseId: string) => {
    return await prisma.course.findUnique({
        where: { id: courseId },
        include: {
            teacher: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                }
            },
            _count: {
                select: {
                    enrollments: true,
                    assignments: true,
                }
            }
        }
    })
})

export const getCachedAssignment = cache(async (assignmentId: string) => {
    return await prisma.assignment.findUnique({
        where: { id: assignmentId },
        include: {
            course: {
                select: {
                    id: true,
                    title: true,
                    code: true,
                }
            },
            _count: {
                select: {
                    submissions: true,
                }
            }
        }
    })
})

/**
 * Cached statistics queries
 */
export const getCachedDashboardStats = cache(async (userId: string, role: string) => {
    if (role === 'ADMIN') {
        const [totalUsers, totalCourses, totalAssignments] = await Promise.all([
            prisma.user.count(),
            prisma.course.count(),
            prisma.assignment.count(),
        ])

        return {
            totalUsers,
            totalCourses,
            totalAssignments,
        }
    }

    if (role === 'TEACHER') {
        const [totalCourses, totalStudents, totalAssignments] = await Promise.all([
            prisma.course.count({ where: { teacherId: userId } }),
            prisma.enrollment.count({
                where: {
                    course: {
                        teacherId: userId
                    }
                }
            }),
            prisma.assignment.count({
                where: {
                    course: {
                        teacherId: userId
                    }
                }
            }),
        ])

        return {
            totalCourses,
            totalStudents,
            totalAssignments,
        }
    }

    if (role === 'STUDENT') {
        const [totalEnrollments, totalSubmissions, pendingAssignments] = await Promise.all([
            prisma.enrollment.count({ where: { studentId: userId } }),
            prisma.submission.count({ where: { studentId: userId } }),
            prisma.assignment.count({
                where: {
                    course: {
                        enrollments: {
                            some: {
                                studentId: userId
                            }
                        }
                    },
                    submissions: {
                        none: {
                            studentId: userId
                        }
                    }
                }
            }),
        ])

        return {
            totalEnrollments,
            totalSubmissions,
            pendingAssignments,
        }
    }

    return null
})
