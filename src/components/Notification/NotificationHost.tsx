import Alert from '@mui/material/Alert'
import Snackbar, { type SnackbarCloseReason } from '@mui/material/Snackbar'
import { useState } from 'react'

import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { type AppNotification, dismissNotification } from '@/store/notificationSlice'

function NotificationItem({ notification }: { notification: AppNotification }) {
  const dispatch = useAppDispatch()
  const [open, setOpen] = useState(true)

  const handleClose = (_event: unknown, reason?: SnackbarCloseReason) => {
    if (reason === 'clickaway') {
      return
    }
    setOpen(false)
  }

  return (
    <Snackbar
      open={open}
      autoHideDuration={notification.duration}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      slotProps={{
        // Remove from the queue only after the exit animation, so the next one slides in cleanly.
        transition: { onExited: () => dispatch(dismissNotification(notification.id)) },
      }}
    >
      <Alert
        severity={notification.severity}
        variant="filled"
        onClose={() => setOpen(false)}
        className="w-full rounded-lg"
      >
        {notification.message}
      </Alert>
    </Snackbar>
  )
}

// Mount once near the app root; shows queued notifications one at a time.
export function NotificationHost() {
  const current = useAppSelector((state) => state.notifications.queue[0])

  if (!current) {
    return null
  }

  return <NotificationItem key={current.id} notification={current} />
}
