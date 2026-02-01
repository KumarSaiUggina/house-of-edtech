import { describe, it, expect } from '@jest/globals'
import { createCourseSchema, updateCourseSchema } from '@/lib/validations/course'

describe('Course Validation Schemas', () => {
    describe('createCourseSchema', () => {
        it('should validate a valid course', () => {
            const validCourse = {
                title: 'Introduction to Computer Science',
                description: 'Learn the basics of programming',
                code: 'CS101',
            }

            const result = createCourseSchema.safeParse(validCourse)
            expect(result.success).toBe(true)
        })

        it('should reject course without title', () => {
            const invalidCourse = {
                description: 'Learn the basics of programming',
                code: 'CS101',
            }

            const result = createCourseSchema.safeParse(invalidCourse)
            expect(result.success).toBe(false)
        })

        it('should reject course with empty title', () => {
            const invalidCourse = {
                title: '',
                description: 'Learn the basics of programming',
                code: 'CS101',
            }

            const result = createCourseSchema.safeParse(invalidCourse)
            expect(result.success).toBe(false)
        })

        it('should reject course without code', () => {
            const invalidCourse = {
                title: 'Introduction to Computer Science',
                description: 'Learn the basics of programming',
            }

            const result = createCourseSchema.safeParse(invalidCourse)
            expect(result.success).toBe(false)
        })

        it('should accept course without description (optional)', () => {
            const validCourse = {
                title: 'Introduction to Computer Science',
                code: 'CS101',
            }

            const result = createCourseSchema.safeParse(validCourse)
            expect(result.success).toBe(true)
        })
    })

    describe('updateCourseSchema', () => {
        it('should allow partial updates', () => {
            const partialUpdate = {
                title: 'Updated Title',
            }

            const result = updateCourseSchema.safeParse(partialUpdate)
            expect(result.success).toBe(true)
        })

        it('should allow updating all fields', () => {
            const fullUpdate = {
                title: 'Updated Title',
                description: 'Updated description',
                code: 'CS102',
            }

            const result = updateCourseSchema.safeParse(fullUpdate)
            expect(result.success).toBe(true)
        })

        it('should allow empty object (no updates)', () => {
            const noUpdate = {}

            const result = updateCourseSchema.safeParse(noUpdate)
            expect(result.success).toBe(true)
        })
    })
})
