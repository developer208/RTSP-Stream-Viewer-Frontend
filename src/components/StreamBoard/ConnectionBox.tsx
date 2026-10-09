import {
  faArrowUpRightFromSquare,
  faPause,
  faPlay,
  faPlugCircleXmark,
  faRotateRight,
  faTrash,
} from '@fortawesome/free-solid-svg-icons'
import { useState } from 'react'

import { Button } from '@/components/Button/Button'
import { IconButton } from '@/components/IconButton/IconButton'
import { Loader } from '@/components/Loader/Loader'
import { useStream } from '@/hooks/useStream'
import { cn } from '@/lib/cn'
import { STREAM_STATUS_STYLES } from '@/utils/constants'
import type { CONNECTION_TYPE } from '@/utils/types'

interface ConnectionBoxProps {
  connection: CONNECTION_TYPE
  /** Receives the ID of the saved stream, or null when this URL was not saved to an account. */
  onRemove: (savedStreamId: string | null) => void
}

export function ConnectionBox({ connection, onRemove }: ConnectionBoxProps) {
  // `isEnabled` is what the user asked for (connected or not); `attempt` forces a new try.
  const [isEnabled, setIsEnabled] = useState(connection.autoStart)
  // Stays false for a saved stream until the user presses start for the first time.
  const [hasStarted, setHasStarted] = useState(connection.autoStart)
  const [attempt, setAttempt] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const stream = useStream(connection.url, isEnabled, attempt, isPaused)
  const { canvasRef, message } = stream

  const status = hasStarted ? stream.status : 'idle'
  // Known from the account's history before connecting, or reported by the backend after.
  const savedStreamId = stream.savedStreamId ?? connection.savedStreamId ?? null
  const statusStyle = STREAM_STATUS_STYLES[status]
  const isLive = status === 'live'
  const isIdle = status === 'idle'
  const isDisconnected = status === 'disconnected'
  // Pausing only makes sense while there is a picture, playing or frozen.
  const canPause = isLive || status === 'paused'

  const start = () => {
    setHasStarted(true)
    setIsEnabled(true)
  }

  const reconnect = () => {
    setIsPaused(false)
    setIsEnabled(true)
    setAttempt((current) => current + 1)
  }

  const openInNewTab = () => {
    window.open(`/stream?url=${encodeURIComponent(connection.url)}`, '_blank', 'noopener')
  }

  return (
    <div className="relative overflow-hidden rounded-xl border border-white/10 bg-black">
      {/* The canvas keeps the last frame when the stream stops, so it is dimmed while not live. */}
      <canvas
        ref={canvasRef}
        className={cn('size-full object-contain transition-opacity', isLive ? 'opacity-100' : 'opacity-40')}
      />

      {isLive || status === 'paused' ? null : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center">
          {isIdle ? (
            <Button onClick={start} className="bg-white text-neutral-950 hover:bg-neutral-200">
              Start stream
            </Button>
          ) : (
            <>
              {isDisconnected ? null : <Loader size={28} />}
              <p className="max-w-md text-sm text-neutral-300">{message ?? `${statusStyle.label}…`}</p>
            </>
          )}
        </div>
      )}

      <span className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-black/60 px-2 py-0.5 text-xs font-medium">
        <span className={cn('size-1.5 rounded-full', statusStyle.dotClassName)} />
        {statusStyle.label}
      </span>

      <div className="absolute right-3 top-3 flex gap-2">
        <IconButton
          icon={faArrowUpRightFromSquare}
          label="Open in new tab"
          onClick={openInNewTab}
          className="bg-sky-500 text-white hover:bg-sky-400"
        />
        {canPause ? (
          <IconButton
            icon={isPaused ? faPlay : faPause}
            label={isPaused ? 'Play stream' : 'Pause stream'}
            onClick={() => setIsPaused((current) => !current)}
          />
        ) : null}
        {isIdle ? <IconButton icon={faPlay} label="Start stream" onClick={start} /> : null}
        {isDisconnected ? <IconButton icon={faRotateRight} label="Reconnect stream" onClick={reconnect} /> : null}
        {isIdle || isDisconnected ? null : (
          <IconButton
            icon={faPlugCircleXmark}
            label="Disconnect stream"
            onClick={() => setIsEnabled(false)}
          />
        )}
        <IconButton
          icon={faTrash}
          label="Remove stream"
          onClick={() => onRemove(savedStreamId)}
          className="bg-red-500 text-white hover:bg-red-400"
        />
      </div>

      <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/80 to-transparent px-3 pb-2 pt-6 text-left">
        <p className="truncate text-sm font-medium text-neutral-100">{connection.name}</p>
        <p className="truncate text-xs text-neutral-400">{connection.url}</p>
      </div>
    </div>
  )
}
