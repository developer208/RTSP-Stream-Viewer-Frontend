import MuiButton, { type ButtonProps as MuiButtonProps } from '@mui/material/Button'

import { cn } from '@/lib/cn'

export type ButtonProps = MuiButtonProps

// `loading`, `startIcon`, `color`, `size` etc. come straight from MUI.
export function Button({ variant = 'contained', className, ...props }: ButtonProps) {
  return (
    <MuiButton
      variant={variant}
      disableElevation
      className={cn('rounded-lg font-medium normal-case', className)}
      {...props}
    />
  )
}
