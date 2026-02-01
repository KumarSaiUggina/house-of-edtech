
import { PrismaClient, Role } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Start seeding ...')

  const password = await bcrypt.hash('password123', 10)

  // 1. Create Admin
  const admin = await prisma.user.upsert({
    where: { email: 'admin@school.com' },
    update: {},
    create: {
      email: 'admin@school.com',
      name: 'Admin User',
      password,
      role: Role.ADMIN,
    },
  })
  console.log(`Created user (ADMIN): ${admin.email}`)

  // 2. Create Teacher
  const teacher = await prisma.user.upsert({
    where: { email: 'teacher@school.com' },
    update: {},
    create: {
      email: 'teacher@school.com',
      name: 'John Teacher',
      password,
      role: Role.TEACHER,
    },
  })
  console.log(`Created user (TEACHER): ${teacher.email}`)

  // 3. Create Student
  const student = await prisma.user.upsert({
    where: { email: 'student@school.com' },
    update: {},
    create: {
      email: 'student@school.com',
      name: 'Jane Student',
      password,
      role: Role.STUDENT,
    },
  })
  console.log(`Created user (STUDENT): ${student.email}`)

  // 4. Create Course
  const course = await prisma.course.upsert({
    where: { code: 'CS101' },
    update: {},
    create: {
      title: 'Introduction to Computer Science',
      code: 'CS101',
      description: 'Basics of programming and algorithms',
      teacherId: teacher.id,
    },
  })
  console.log(`Created course: ${course.title}`)

  // 5. Enroll Student
  const enrollment = await prisma.enrollment.create({
    data: {
      studentId: student.id,
      courseId: course.id,
    },
  }).catch(() => console.log('Student already enrolled')) // avoid unique constraint error on re-run

  // 6. Create Assignment
  const assignment = await prisma.assignment.create({
    data: {
      title: 'Midterm Exam',
      maxScore: 100,
      courseId: course.id,
      dueDate: new Date(new Date().setDate(new Date().getDate() + 7)), // 1 week from now
    }
  })
  console.log(`Created assignment: ${assignment.title}`)

  console.log('Seeding finished.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
