import MuiTooltip, { type TooltipProps as MuiTooltipProps } from '@mui/material/Tooltip'
import Zoom from '@mui/material/Zoom'
import { type ReactElement, type ReactNode } from 'react'

export interface TooltipProps {
  title: ReactNode
  /** The element that shows the tooltip on hover or focus. */
  children: ReactElement
  placement?: MuiTooltipProps['placement']
}

// Dark tooltip with a gradient border and glow that zooms in.
export function Tooltip({ title, children, placement = 'bottom' }: TooltipProps) {
  return (
    <MuiTooltip
      placement={placement}
      enterDelay={100}
      slots={{ transition: Zoom }}
      slotProps={{
        // The gradient shows through the 1px padding around the dark inner box, forming the border.
        tooltip: {
          className:
            'max-w-none rounded-xl bg-linear-to-r from-violet-500 via-fuchsia-500 to-orange-400 p-px shadow-lg shadow-fuchsia-500/30',
        },
      }}
      title={
        <span className="flex items-center gap-2 rounded-[11px] bg-neutral-950 px-3 py-2 text-sm font-medium text-neutral-100">
          {title}
        </span>
      }
    >
      {children}
    </MuiTooltip>
  )
}
