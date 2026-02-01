import { NextResponse } from "next/server"
import { ZodError } from "zod"

/**
 * Custom API Error class for structured error handling
 */
export class ApiError extends Error {
    constructor(
        public statusCode: number,
        message: string,
        public details?: unknown
    ) {
        super(message)
        this.name = "ApiError"
    }
}

/**
 * Centralized error handler for API routes
 * Converts various error types into consistent NextResponse objects
 */
export function handleApiError(error: unknown): NextResponse {
    // Log error for monitoring (in production, use proper logging service)
    console.error("[API Error]", error)

    // Handle custom API errors
    if (error instanceof ApiError) {
        const responseBody: { error: string; details?: unknown } = {
            error: error.message,
        };
        if (error.details) {
            responseBody.details = error.details;
        }
        return NextResponse.json(
            responseBody,
            { status: error.statusCode }
        )
    }

    // Handle Zod validation errors
    if (error instanceof ZodError) {
        return NextResponse.json(
            {
                error: "Validation error",
                details: error.issues.map((err) => ({
                    path: err.path.join('.'),
                    message: err.message
                }))
            },
            { status: 400 }
        )
    }

    // Handle Prisma errors
    if (error && typeof error === 'object' && 'code' in error) {
        const prismaError = error as { code: string; meta?: unknown }

        // Unique constraint violation
        if (prismaError.code === 'P2002') {
            return NextResponse.json(
                { error: "A record with this value already exists" },
                { status: 409 }
            )
        }

        // Record not found
        if (prismaError.code === 'P2025') {
            return NextResponse.json(
                { error: "Record not found" },
                { status: 404 }
            )
        }
    }

    // Handle generic errors
    if (error instanceof Error) {
        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: 500 }
        )
    }

    // Fallback for unknown errors
    return NextResponse.json(
        { error: "An unexpected error occurred" },
        { status: 500 }
    )
}

/**
 * Wrapper for API route handlers with automatic error handling
 */
export function withErrorHandler<T extends unknown[]>(
    handler: (...args: T) => Promise<NextResponse>
) {
    return async (...args: T): Promise<NextResponse> => {
        try {
            return await handler(...args)
        } catch (error) {
            return handleApiError(error)
        }
    }
}
