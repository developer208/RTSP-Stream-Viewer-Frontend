import TextField, { type OutlinedTextFieldProps } from '@mui/material/TextField'

import { cn } from '@/lib/cn'

export interface InputProps extends Omit<OutlinedTextFieldProps, 'variant' | 'error'> {
  /** When set, the field is shown in its error state with this message underneath. */
  errorMessage?: string
}

export function Input({
  errorMessage,
  helperText,
  size = 'small',
  fullWidth = true,
  className,
  ...props
}: InputProps) {
  return (
    <TextField
      variant="outlined"
      size={size}
      fullWidth={fullWidth}
      error={Boolean(errorMessage)}
      helperText={errorMessage ?? helperText}
      className={cn('[&_.MuiOutlinedInput-root]:rounded-lg', className)}
      {...props}
    />
  )
}
