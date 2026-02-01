"use client"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface SelectOption {
    value: string
    label: string
}

interface FormSelectProps {
    label?: string
    error?: string
    helperText?: string
    required?: boolean
    placeholder?: string
    options: SelectOption[]
    value?: string
    onValueChange?: (value: string) => void
    disabled?: boolean
    id?: string
}

export function FormSelect({
    label,
    error,
    helperText,
    required,
    placeholder,
    options,
    value,
    onValueChange,
    disabled,
    id,
}: FormSelectProps) {
    const selectId = id || `select-${label?.toLowerCase().replace(/\s+/g, '-')}`

    return (
        <div className="space-y-2">
            {label && (
                <Label htmlFor={selectId} className={cn(required && "after:content-['*'] after:ml-0.5 after:text-destructive")}>
                    {label}
                </Label>
            )}
            <Select value={value} onValueChange={onValueChange} disabled={disabled}>
                <SelectTrigger
                    id={selectId}
                    className={cn(error && "border-destructive focus:ring-destructive")}
                    aria-invalid={error ? "true" : "false"}
                    aria-describedby={error ? `${selectId}-error` : helperText ? `${selectId}-helper` : undefined}
                >
                    <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent>
                    {options.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            {error && (
                <p id={`${selectId}-error`} className="text-sm font-medium text-destructive" role="alert">
                    {error}
                </p>
            )}
            {!error && helperText && (
                <p id={`${selectId}-helper`} className="text-sm text-muted-foreground">
                    {helperText}
                </p>
            )}
        </div>
    )
}
