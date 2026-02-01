"use client"

import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { forwardRef } from "react"

interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string
    error?: string
    helperText?: string
    required?: boolean
    showCharCount?: boolean
    maxLength?: number
}

export const FormTextarea = forwardRef<HTMLTextAreaElement, FormTextareaProps>(
    ({ label, error, helperText, required, showCharCount, maxLength, className, id, value, ...props }, ref) => {
        const textareaId = id || `textarea-${label?.toLowerCase().replace(/\s+/g, '-')}`
        const currentLength = typeof value === 'string' ? value.length : 0

        return (
            <div className="space-y-2">
                {label && (
                    <div className="flex items-center justify-between">
                        <Label htmlFor={textareaId} className={cn(required && "after:content-['*'] after:ml-0.5 after:text-destructive")}>
                            {label}
                        </Label>
                        {showCharCount && maxLength && (
                            <span className="text-xs text-muted-foreground">
                                {currentLength}/{maxLength}
                            </span>
                        )}
                    </div>
                )}
                <Textarea
                    id={textareaId}
                    ref={ref}
                    value={value}
                    maxLength={maxLength}
                    className={cn(
                        error && "border-destructive focus-visible:ring-destructive",
                        className
                    )}
                    aria-invalid={error ? "true" : "false"}
                    aria-describedby={error ? `${textareaId}-error` : helperText ? `${textareaId}-helper` : undefined}
                    {...props}
                />
                {error && (
                    <p id={`${textareaId}-error`} className="text-sm font-medium text-destructive" role="alert">
                        {error}
                    </p>
                )}
                {!error && helperText && (
                    <p id={`${textareaId}-helper`} className="text-sm text-muted-foreground">
                        {helperText}
                    </p>
                )}
            </div>
        )
    }
)

FormTextarea.displayName = "FormTextarea"
