import { describe, it, expect } from '@jest/globals'
import { createAssignmentSchema, submitAssignmentSchema } from '@/lib/validations/assignment'

describe('Assignment Validation Schemas', () => {
    describe('createAssignmentSchema', () => {
        it('should validate a valid assignment', () => {
            const validAssignment = {
                title: 'Homework 1',
                description: 'Complete exercises 1-10',
                courseId: 'course-123',
                dueDate: new Date('2026-03-01'),
                maxScore: 100,
            }

            const result = createAssignmentSchema.safeParse(validAssignment)
            expect(result.success).toBe(true)
        })

        it('should reject assignment without title', () => {
            const invalidAssignment = {
                description: 'Complete exercises 1-10',
                courseId: 'course-123',
            }

            const result = createAssignmentSchema.safeParse(invalidAssignment)
            expect(result.success).toBe(false)
        })

        it('should reject assignment without courseId', () => {
            const invalidAssignment = {
                title: 'Homework 1',
                description: 'Complete exercises 1-10',
            }

            const result = createAssignmentSchema.safeParse(invalidAssignment)
            expect(result.success).toBe(false)
        })

        it('should accept assignment without description (optional)', () => {
            const validAssignment = {
                title: 'Homework 1',
                courseId: 'course-123',
            }

            const result = createAssignmentSchema.safeParse(validAssignment)
            expect(result.success).toBe(true)
        })

        it('should use default maxScore of 100', () => {
            const assignment = {
                title: 'Homework 1',
                courseId: 'course-123',
            }

            const result = createAssignmentSchema.safeParse(assignment)
            expect(result.success).toBe(true)
            if (result.success) {
                expect(result.data.maxScore).toBe(100)
            }
        })
    })

    describe('submitAssignmentSchema', () => {
        it('should validate a valid submission', () => {
            const validSubmission = {
                content: 'https://example.com/my-submission.pdf',
            }

            const result = submitAssignmentSchema.safeParse(validSubmission)
            expect(result.success).toBe(true)
        })

        it('should accept submission without content (optional)', () => {
            const submission = {}

            const result = submitAssignmentSchema.safeParse(submission)
            expect(result.success).toBe(true)
        })
    })
})
