import Backdrop from '@mui/material/Backdrop'
import CircularProgress from '@mui/material/CircularProgress'

import { cn } from '@/lib/cn'

export interface LoaderProps {
  label?: string
  size?: number
  /** Covers the whole screen with a dimmed backdrop instead of rendering inline. */
  overlay?: boolean
  className?: string
}

export function Loader({ label, size = 32, overlay = false, className }: LoaderProps) {
  const content = (
    <div
      role="status"
      aria-live="polite"
      className={cn('flex flex-col items-center justify-center gap-3', className)}
    >
      <CircularProgress size={size} color="inherit" />
      {label ? <span className="text-sm">{label}</span> : <span className="sr-only">Loading</span>}
    </div>
  )

  if (!overlay) {
    return content
  }

  return (
    <Backdrop open className="z-[1400] text-white">
      {content}
    </Backdrop>
  )
}
