import CloseRounded from '@mui/icons-material/CloseRounded'
import Dialog, { type DialogProps } from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import IconButton from '@mui/material/IconButton'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { type ReactNode } from 'react'

import { Button } from '@/components/Button/Button'

// The modal is black, so MUI controls placed inside it (inputs, etc.) use their dark-mode colours.
const darkTheme = createTheme({ palette: { mode: 'dark' } })

export interface ModalProps {
  open: boolean
  /** Called by the cancel button, the cross icon, the Escape key and a click outside the modal. */
  onClose: () => void
  heading?: ReactNode
  children: ReactNode
  onSubmit?: () => void
  cancelLabel?: string
  submitLabel?: string
  /** Optional extra button, shown before the submit button when a label is given. */
  secondaryLabel?: string
  onSecondary?: () => void
  isCancelButtonVisible?: boolean
  isSubmitButtonVisible?: boolean
  isCrossIconVisible?: boolean
  maxWidth?: DialogProps['maxWidth']
}

export function Modal({
  open,
  onClose,
  heading,
  children,
  onSubmit,
  cancelLabel = 'Cancel',
  submitLabel = 'Submit',
  secondaryLabel,
  onSecondary,
  isCancelButtonVisible = true,
  isSubmitButtonVisible = true,
  isCrossIconVisible = true,
  maxWidth = 'sm',
}: ModalProps) {
  const hasHeader = Boolean(heading) || isCrossIconVisible
  const hasActions = isCancelButtonVisible || isSubmitButtonVisible || Boolean(secondaryLabel)

  return (
    <ThemeProvider theme={darkTheme}>
      <Dialog
        open={open}
        // MUI calls this for a click on the backdrop and for the Escape key.
        onClose={() => onClose()}
        maxWidth={maxWidth}
        fullWidth
        slotProps={{ paper: { className: 'rounded-2xl border border-white/10 bg-black bg-none text-white' } }}
      >
        {hasHeader ? (
          <DialogTitle className="flex items-center justify-between gap-4 pr-3">
            <span>{heading}</span>
            {isCrossIconVisible ? (
              <IconButton
                aria-label="Close"
                size="small"
                onClick={onClose}
                className="text-neutral-400 hover:bg-white/10 hover:text-white"
              >
                <CloseRounded fontSize="small" />
              </IconButton>
            ) : null}
          </DialogTitle>
        ) : null}

        <DialogContent className="text-neutral-300">{children}</DialogContent>

        {hasActions ? (
          <DialogActions className="px-6 pb-4">
            {isCancelButtonVisible ? (
              <Button variant="text" onClick={onClose} className="text-neutral-300 hover:bg-white/10">
                {cancelLabel}
              </Button>
            ) : null}
            {secondaryLabel ? (
              <Button
                variant="outlined"
                onClick={onSecondary}
                className="border-white/30 text-white hover:border-white hover:bg-white/10"
              >
                {secondaryLabel}
              </Button>
            ) : null}
            {isSubmitButtonVisible ? (
              <Button onClick={onSubmit} className="bg-white text-neutral-950 hover:bg-neutral-200">
                {submitLabel}
              </Button>
            ) : null}
          </DialogActions>
        ) : null}
      </Dialog>
    </ThemeProvider>
  )
}
