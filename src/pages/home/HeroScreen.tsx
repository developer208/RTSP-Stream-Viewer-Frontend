import { useIsMobile } from '@/hooks/useIsMobile'
import { cn } from '@/lib/cn'
import { PREVIEW_STREAMS, STREAM_STATUS_STYLES } from '@/utils/constants'
import type { STREAM_STATUS_TYPE } from '@/utils/types'

// On mobile the preview shows just one tile for each of these statuses.
const MOBILE_STATUSES: STREAM_STATUS_TYPE[] = ['live', 'reconnecting']

function HeroScreen() {
  const isMobile = useIsMobile()
  const streams = isMobile
    ? MOBILE_STATUSES.flatMap((status) => PREVIEW_STREAMS.find((stream) => stream.status === status) ?? [])
    : PREVIEW_STREAMS

  return (
    <section id="preview" className="relative mx-auto max-w-7xl px-6 lg:px-10">
      <div className="overflow-hidden rounded-t-2xl border border-b-0 border-white/10 bg-neutral-900/70 backdrop-blur-xl">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center px-4 py-3">
          <div className="flex gap-2">
            <span className="size-3 rounded-full bg-red-500" />
            <span className="size-3 rounded-full bg-yellow-500" />
            <span className="size-3 rounded-full bg-green-500" />
          </div>
          <span className="text-sm text-neutral-400">RTSP Stream Viewer</span>
        </div>

        <div className="grid gap-4 bg-neutral-100 p-4 sm:grid-cols-2 sm:p-6 lg:grid-cols-3">
          {streams.map((stream) => (
            <div
              key={stream.name}
              className={cn(
                'relative flex aspect-video items-end overflow-hidden rounded-xl bg-linear-to-br p-3',
                stream.tint,
              )}
            >
              <span className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-black/50 px-2 py-0.5 text-xs font-medium">
                <span
                  className={cn('size-1.5 rounded-full', STREAM_STATUS_STYLES[stream.status].dotClassName)}
                />
                {STREAM_STATUS_STYLES[stream.status].label}
              </span>
              <span className="text-sm font-medium">{stream.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HeroScreen
