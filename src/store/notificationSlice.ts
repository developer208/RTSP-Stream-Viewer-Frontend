import { createSlice, nanoid, type PayloadAction } from '@reduxjs/toolkit'

export type NotificationSeverity = 'success' | 'error' | 'warning' | 'info'

export interface AppNotification {
  id: string
  message: string
  severity: NotificationSeverity
  /** Auto-hide delay in milliseconds. */
  duration: number
}

export interface NotifyPayload {
  message: string
  severity?: NotificationSeverity
  duration?: number
}

interface NotificationState {
  queue: AppNotification[]
}

const DEFAULT_DURATION_MS = 4000

const initialState: NotificationState = { queue: [] }

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    notify: {
      reducer(state, action: PayloadAction<AppNotification>) {
        state.queue.push(action.payload)
      },
      prepare({ message, severity = 'info', duration = DEFAULT_DURATION_MS }: NotifyPayload) {
        return { payload: { id: nanoid(), message, severity, duration } }
      },
    },
    dismissNotification(state, action: PayloadAction<string>) {
      state.queue = state.queue.filter((notification) => notification.id !== action.payload)
    },
  },
})

export const { notify, dismissNotification } = notificationSlice.actions
export const notificationReducer = notificationSlice.reducer
