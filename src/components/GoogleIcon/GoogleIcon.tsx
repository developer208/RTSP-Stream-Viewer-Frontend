import { faGoogle } from '@fortawesome/free-brands-svg-icons'

import { cn } from '@/lib/cn'

export interface GoogleIconProps {
  className?: string
}

const [width, height, , , path] = faGoogle.icon

// Font Awesome's Google icon is a single shape, so it can only take one colour.
// Using it as a mask over a gradient gives it Google's red, yellow and green.
const MASK = `url("data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}"><path d="${String(path)}"/></svg>`,
)}") center / contain no-repeat`

// Red across the top, green down the right and bottom, yellow on the left.
const COLORS = 'conic-gradient(from -45deg, #ea4335 0 90deg, #34a853 90deg 270deg, #fbbc05 270deg 360deg)'

export function GoogleIcon({ className }: GoogleIconProps) {
  return (
    <span
      aria-hidden
      className={cn('inline-block size-[1em] shrink-0', className)}
      style={{ background: COLORS, mask: MASK, WebkitMask: MASK }}
    />
  )
}
