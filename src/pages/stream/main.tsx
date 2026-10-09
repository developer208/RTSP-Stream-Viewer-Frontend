import { useSearchParams } from 'react-router-dom'

import { Loader } from '@/components'
import { useStream } from '@/hooks/useStream'
import { STREAM_STATUS_STYLES } from '@/utils/constants'

function StreamView({ url }: { url: string }) {
  const { canvasRef, status, message } = useStream(url, true)
  const isLive = status === 'live'

  return (
    <main className="relative flex h-screen items-center justify-center bg-black text-white">
      <canvas ref={canvasRef} className="size-full object-contain" />
      {isLive ? null : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/70 p-6 text-center">
          {status === 'disconnected' ? null : <Loader size={28} />}
          <p className="max-w-md text-sm text-neutral-300">
            {message ?? `${STREAM_STATUS_STYLES[status].label}…`}
          </p>
          <p className="break-all text-xs text-neutral-500">{url}</p>
        </div>
      )}
    </main>
  )
}

// Single stream filling the whole page, opened in a new tab from a connection box.
function Main() {
  const [searchParams] = useSearchParams()
  const url = searchParams.get('url')

  if (!url) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-neutral-950 p-6 text-neutral-200">
        <h1 className="text-2xl font-medium">No stream selected</h1>
      </main>
    )
  }
  return <StreamView url={url} />
}

export default Main
