import { useMemo } from 'react'

import { useAppDispatch } from '@/store/hooks'
import { type NotificationSeverity, notify } from '@/store/notificationSlice'

export function useNotification() {
  const dispatch = useAppDispatch()

  return useMemo(() => {
    const show = (severity: NotificationSeverity) => (message: string, duration?: number) =>
      dispatch(notify({ message, severity, duration }))

    return {
      success: show('success'),
      error: show('error'),
      warning: show('warning'),
      info: show('info'),
    }
  }, [dispatch])
}
