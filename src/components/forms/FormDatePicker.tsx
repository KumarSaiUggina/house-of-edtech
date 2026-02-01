"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { forwardRef } from "react"
import { format } from "date-fns"

interface FormDatePickerProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'value' | 'onChange'> {
    label?: string
    error?: string
    helperText?: string
    required?: boolean
    value?: Date | string
    onChange?: (date: Date | null) => void
}

export const FormDatePicker = forwardRef<HTMLInputElement, FormDatePickerProps>(
    ({ label, error, helperText, required, className, id, value, onChange, ...props }, ref) => {
        const datePickerId = id || `datepicker-${label?.toLowerCase().replace(/\s+/g, '-')}`

        // Convert Date to string format for input
        const inputValue = value instanceof Date
            ? format(value, 'yyyy-MM-dd')
            : value || ''

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            if (onChange) {
                const dateValue = e.target.value ? new Date(e.target.value) : null
                onChange(dateValue)
            }
        }

        return (
            <div className="space-y-2">
                {label && (
                    <Label htmlFor={datePickerId} className={cn(required && "after:content-['*'] after:ml-0.5 after:text-destructive")}>
                        {label}
                    </Label>
                )}
                <Input
                    id={datePickerId}
                    ref={ref}
                    type="date"
                    value={inputValue}
                    onChange={handleChange}
                    className={cn(
                        error && "border-destructive focus-visible:ring-destructive",
                        className
                    )}
                    aria-invalid={error ? "true" : "false"}
                    aria-describedby={error ? `${datePickerId}-error` : helperText ? `${datePickerId}-helper` : undefined}
                    {...props}
                />
                {error && (
                    <p id={`${datePickerId}-error`} className="text-sm font-medium text-destructive" role="alert">
                        {error}
                    </p>
                )}
                {!error && helperText && (
                    <p id={`${datePickerId}-helper`} className="text-sm text-muted-foreground">
                        {helperText}
                    </p>
                )}
            </div>
        )
    }
)

FormDatePicker.displayName = "FormDatePicker"
