import { useEffect, useRef, useState } from 'react'

import { useAuth } from '@/hooks/useAuth'
import { connectStream, StreamRequestError } from '@/lib/streams'
import { WS_URL } from '@/utils/constants'
import type { STREAM_STATUS_TYPE } from '@/utils/types'

const MIN_RETRY_DELAY_MS = 1000
const MAX_RETRY_DELAY_MS = 15000

interface StreamState {
  status: STREAM_STATUS_TYPE
  /** Explains a problem, e.g. why the camera cannot be reached. */
  message?: string
}

interface StatusMessage {
  type: 'status'
  status: STREAM_STATUS_TYPE
  message?: string
}

/**
 * Plays an RTSP stream into a canvas. While `isEnabled` is true it keeps a
 * WebSocket to the backend open, reconnecting if the connection drops.
 * Change `attempt` to connect again after the stream stopped with an error.
 * While `isPaused` is true the connection stays open but the picture is frozen.
 */
export function useStream(url: string, isEnabled: boolean, attempt = 0, isPaused = false) {
  const { getAccessToken } = useAuth()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const socketRef = useRef<WebSocket | null>(null)
  // Mirrors `isPaused` for the socket callbacks, which outlive a single render.
  const isPausedRef = useRef(isPaused)
  const [state, setState] = useState<StreamState>({ status: 'connecting' })
  // Set when the backend saved this URL to the logged-in user's history.
  const [savedStreamId, setSavedStreamId] = useState<string | null>(null)

  // Tell the backend to stop or resume sending frames, which also saves bandwidth.
  useEffect(() => {
    isPausedRef.current = isPaused
    const socket = socketRef.current
    if (socket?.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ type: isPaused ? 'pause' : 'play' }))
    }
  }, [isPaused])

  useEffect(() => {
    if (!isEnabled) {
      return
    }

    let isStopped = false
    let socket: WebSocket | null = null
    let retryTimer: ReturnType<typeof setTimeout> | undefined
    let retryDelay = MIN_RETRY_DELAY_MS
    // Frames can arrive faster than they decode; only the newest one waiting is kept.
    let pendingFrame: Blob | null = null
    let isDrawing = false

    const drawFrames = async () => {
      if (isDrawing) {
        return
      }
      isDrawing = true
      while (pendingFrame && !isStopped) {
        const frame = pendingFrame
        pendingFrame = null
        try {
          const bitmap = await createImageBitmap(frame)
          const canvas = canvasRef.current
          if (canvas && !isStopped) {
            if (canvas.width !== bitmap.width || canvas.height !== bitmap.height) {
              canvas.width = bitmap.width
              canvas.height = bitmap.height
            }
            canvas.getContext('2d')?.drawImage(bitmap, 0, 0)
          }
          bitmap.close()
        } catch {
          // A frame that fails to decode is skipped; the next one replaces it.
        }
      }
      isDrawing = false
    }

    const retryLater = (message: string) => {
      setState({ status: 'reconnecting', message })
      retryTimer = setTimeout(() => void open(), retryDelay)
      retryDelay = Math.min(retryDelay * 2, MAX_RETRY_DELAY_MS)
    }

    const open = async () => {
      try {
        // Each connection needs a fresh single-use ticket from the backend.
        const { wsPath, stream } = await connectStream(url, await getAccessToken())
        if (isStopped) {
          return
        }
        if (stream) {
          setSavedStreamId(stream.id)
        }

        socket = new WebSocket(WS_URL + wsPath)
        socketRef.current = socket
        socket.binaryType = 'blob'
        socket.onopen = () => {
          // A connection opened (or re-opened) while paused must start paused.
          if (isPausedRef.current) {
            socket?.send(JSON.stringify({ type: 'pause' }))
          }
        }
        socket.onmessage = (event: MessageEvent<string | Blob>) => {
          if (typeof event.data === 'string') {
            const message = JSON.parse(event.data) as StatusMessage
            if (message.type === 'status') {
              setState({ status: message.status, message: message.message })
              if (message.status === 'live') {
                retryDelay = MIN_RETRY_DELAY_MS
              }
            }
            return
          }
          // Frames already on their way when pause was pressed are dropped.
          if (!isPausedRef.current) {
            pendingFrame = event.data
            void drawFrames()
          }
        }
        socket.onclose = () => {
          if (!isStopped) {
            retryLater('Lost the connection to the server')
          }
        }
      } catch (error) {
        if (isStopped) {
          return
        }
        // A rejected URL will be rejected again, so stop instead of retrying.
        if (error instanceof StreamRequestError && error.status === 400) {
          setState({ status: 'disconnected', message: error.message })
          return
        }
        retryLater(error instanceof StreamRequestError ? error.message : 'Could not reach the server')
      }
    }

    void open()

    return () => {
      isStopped = true
      clearTimeout(retryTimer)
      socket?.close()
      socketRef.current = null
      // The next connection starts from "connecting" rather than a stale status.
      setState({ status: 'connecting' })
    }
  }, [url, isEnabled, attempt, getAccessToken])

  let status: STREAM_STATUS_TYPE = 'disconnected'
  if (isEnabled) {
    status = isPaused && state.status === 'live' ? 'paused' : state.status
  }

  return {
    canvasRef,
    savedStreamId,
    status,
    message: isEnabled ? state.message : undefined,
  } satisfies {
    canvasRef: typeof canvasRef
    savedStreamId: string | null
    status: STREAM_STATUS_TYPE
    message?: string
  }
}
