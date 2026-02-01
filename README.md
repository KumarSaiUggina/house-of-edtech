# House of EdTech - Student Performance Analytics Platform

A modern, full-stack student performance analytics platform built with Next.js 16, TypeScript, Prisma, and PostgreSQL. This application enables educational institutions to manage courses, track student progress, and analyze performance metrics.

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Prisma](https://img.shields.io/badge/Prisma-6-2D3748)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-336791)

## 🌟 Features

### Core Functionality
- **Role-Based Authentication**: Secure login system with three user roles (Admin, Teacher, Student)
- **Course Management**: Create, edit, and manage courses with unique course codes
- **Assignment System**: Create assignments with due dates, manage submissions, and grade student work
- **Student Enrollment**: Enroll students in courses and track their progress
- **Performance Analytics**: Dashboard statistics for each user role
- **Real-Time Updates**: Server-side rendering for fresh data on every page load

### Technical Highlights
- **Modern Stack**: Built with Next.js 16 App Router, React 19, and TypeScript
- **Database**: PostgreSQL with Prisma ORM for type-safe database access
- **Authentication**: NextAuth.js with credential-based authentication
- **UI Components**: shadcn/ui components with Tailwind CSS
- **Form Validation**: Zod schemas with react-hook-form integration
- **Security**: Rate limiting, secure headers, and input validation
- **Performance**: React cache, optimized queries, and image optimization

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL database
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd house-of-edtech-project
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/edtech"
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-here"
   ```

   Generate a secure secret:
   ```bash
   openssl rand -base64 32
   ```

4. **Setup the database**
   ```bash
   # Generate Prisma Client
   npx prisma generate
   
   # Push schema to database
   npx prisma db push
   
   # Seed the database (optional)
   npm run seed
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
house-of-edtech-project/
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── seed.ts                # Database seeding script
├── src/
│   ├── app/
│   │   ├── (auth)/            # Authentication pages
│   │   │   └── login/
│   │   ├── (dashboard)/       # Protected dashboard pages
│   │   │   ├── admin/
│   │   │   ├── teacher/
│   │   │   ├── student/
│   │   │   └── courses/
│   │   ├── api/               # API routes
│   │   │   ├── auth/
│   │   │   ├── courses/
│   │   │   └── assignments/
│   │   ├── layout.tsx
│   │   └── page.tsx           # Landing page
│   ├── components/
│   │   ├── forms/             # Reusable form components
│   │   ├── layout/            # Layout components
│   │   ├── shared/            # Shared components
│   │   └── ui/                # shadcn/ui components
│   ├── lib/
│   │   ├── api/               # API utilities
│   │   ├── auth/              # Auth utilities
│   │   ├── validations/       # Zod schemas
│   │   ├── cache.ts           # React cache utilities
│   │   └── db.ts              # Prisma client
│   └── types/                 # TypeScript types
├── .env                       # Environment variables
├── next.config.ts             # Next.js configuration
├── package.json
└── tsconfig.json
```

## 🗄️ Database Schema

### User Roles
- **ADMIN**: Full system access, manage all users and courses
- **TEACHER**: Create courses, manage assignments, grade submissions
- **STUDENT**: Enroll in courses, submit assignments, view grades

### Main Entities
- **User**: Authentication and user profile information
- **Course**: Course details with teacher assignment
- **Enrollment**: Student-course relationships
- **Assignment**: Course assignments with due dates
- **Submission**: Student assignment submissions with grades

## 🔐 Authentication

The application uses NextAuth.js with credential-based authentication:

- **Login**: `/login`
- **Session Management**: JWT-based sessions
- **Protected Routes**: Middleware protects dashboard routes
- **Role-Based Access**: Different dashboards for each role

### Default Users (if seeded)
```
Admin: admin@example.com / password
Teacher: teacher@example.com / password
Student: student@example.com / password
```

## 🛠️ API Routes

### Courses
- `GET /api/courses` - List all courses (filtered by role)
- `POST /api/courses` - Create a new course (Teacher/Admin)
- `GET /api/courses/[id]` - Get course details
- `PATCH /api/courses/[id]` - Update course (Teacher/Admin)
- `DELETE /api/courses/[id]` - Delete course (Admin)
- `POST /api/courses/[id]/enroll` - Enroll student in course

### Assignments
- `GET /api/assignments` - List assignments
- `POST /api/assignments` - Create assignment (Teacher)
- `GET /api/assignments/[id]` - Get assignment details
- `PATCH /api/assignments/[id]` - Update assignment
- `POST /api/assignments/[id]/submit` - Submit assignment (Student)

## 🎨 UI Components

Built with [shadcn/ui](https://ui.shadcn.com/) and Tailwind CSS:
- Reusable form components with validation
- Data tables with sorting and pagination
- Responsive layouts
- Accessible components (ARIA labels, keyboard navigation)

## 🧪 Testing

```bash
# Run unit tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

## 🚀 Deployment

### Deploy to Vercel

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Configure environment variables
   - Deploy

3. **Setup Production Database**
   - Use a managed PostgreSQL service (Neon, Supabase, Railway)
   - Update `DATABASE_URL` in Vercel environment variables
   - Run migrations: `npx prisma db push`

### Environment Variables (Production)
```env
DATABASE_URL="postgresql://..."
NEXTAUTH_URL="https://your-domain.vercel.app"
NEXTAUTH_SECRET="production-secret"
```

## 📊 Performance Optimizations

- **Server-Side Rendering**: Fresh data on every request
- **React Cache**: Deduplicated database queries
- **Image Optimization**: Next.js Image component
- **Code Splitting**: Dynamic imports for heavy components
- **Database Indexing**: Optimized queries with proper indexes

## 🔒 Security Features

- **Input Validation**: Zod schemas on all API routes
- **Rate Limiting**: In-memory rate limiter for API protection
- **Security Headers**: CSP, X-Frame-Options, HSTS
- **Password Hashing**: bcrypt for secure password storage
- **SQL Injection Prevention**: Prisma ORM parameterized queries
- **XSS Protection**: React automatic escaping

## 🤝 Contributing

This project was built as part of the House of Edtech assignment (December 2025).

## 👨‍💻 Developer

**[Your Name]**
- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your Profile](https://linkedin.com/in/yourprofile)
- Email: your.email@example.com

## 📝 License

This project is built for educational purposes.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/)
- [Prisma](https://www.prisma.io/)
- [shadcn/ui](https://ui.shadcn.com/)
- [NextAuth.js](https://next-auth.js.org/)
- House of Edtech for the assignment opportunity
