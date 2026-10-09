import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { Tooltip } from '@/components/Tooltip/Tooltip'
import { cn } from '@/lib/cn'

export interface IconButtonProps {
  icon: IconDefinition
  /** Shown in the tooltip and read by screen readers. */
  label: string
  onClick: () => void
  className?: string
}

export function IconButton({ icon, label, onClick, className }: IconButtonProps) {
  return (
    <Tooltip title={label}>
      <button
        type="button"
        aria-label={label}
        onClick={onClick}
        className={cn(
          'flex size-9 cursor-pointer items-center justify-center rounded-lg bg-white/10 text-sm text-neutral-200 transition-colors hover:bg-white/20 hover:text-white',
          className,
        )}
      >
        <FontAwesomeIcon icon={icon} />
      </button>
    </Tooltip>
  )
}
