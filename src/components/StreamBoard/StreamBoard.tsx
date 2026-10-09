import { useEffect, useState } from 'react'

import { Button } from '@/components/Button/Button'
import { Footer } from '@/components/Footer/Footer'
import { Input } from '@/components/Input/Input'
import { Loader } from '@/components/Loader/Loader'
import { Modal } from '@/components/Modal/Modal'
import { Navbar } from '@/components/Navbar/Navbar'
import { useAuth } from '@/hooks/useAuth'
import { useIsMobile } from '@/hooks/useIsMobile'
import { deleteStream, listStreams } from '@/lib/streams'
import type { CONNECTION_TYPE } from '@/utils/types'

import { ConnectionBox } from './ConnectionBox'

const RTSP_URL_PATTERN = /^rtsps?:\/\/\S+$/i

export interface StreamBoardProps {
  /** Start with the streams saved to the logged-in user's account, fetched from the backend. */
  loadSavedStreams?: boolean
}

type NewConnection = Omit<CONNECTION_TYPE, 'id' | 'name'>

// Adds new connections, skipping any URL that already has a box.
function withConnections(current: CONNECTION_TYPE[], additions: NewConnection[]): CONNECTION_TYPE[] {
  const next = [...current]
  for (const addition of additions) {
    if (!next.some((connection) => connection.url === addition.url)) {
      const id = (next.at(-1)?.id ?? 0) + 1
      next.push({ id, name: `Connection ${id}`, ...addition })
    }
  }
  return next
}

/** The stream viewer page: the "Add RTSP URL" button and the grid of live stream boxes. */
export function StreamBoard({ loadSavedStreams = false }: StreamBoardProps) {
  const isMobile = useIsMobile()
  const { isLoggedIn, isAuthLoading, getAccessToken } = useAuth()
  const [connections, setConnections] = useState<CONNECTION_TYPE[]>([])
  const [hasLoadedSaved, setHasLoadedSaved] = useState(false)

  // Fetch the user's saved URLs once they are known to be logged in. Each becomes a box
  // that waits for its start button, so opening the page does not start every camera at once.
  useEffect(() => {
    if (!loadSavedStreams || !isLoggedIn) {
      return
    }
    let isActive = true
    const load = async () => {
      try {
        const accessToken = await getAccessToken()
        const savedStreams = accessToken ? await listStreams(accessToken) : []
        if (isActive) {
          setConnections((current) =>
            withConnections(
              current,
              savedStreams.map((stream) => ({ url: stream.url, savedStreamId: stream.id, autoStart: false })),
            ),
          )
        }
      } catch (error) {
        console.error('Could not load saved streams', error)
      } finally {
        if (isActive) {
          setHasLoadedSaved(true)
        }
      }
    }
    void load()
    return () => {
      isActive = false
    }
  }, [loadSavedStreams, isLoggedIn, getAccessToken])

  const isLoadingSaved = loadSavedStreams && (isAuthLoading || (isLoggedIn && !hasLoadedSaved))

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [url, setUrl] = useState('')
  const [errorMessage, setErrorMessage] = useState<string>()

  const openModal = () => {
    setUrl('')
    setErrorMessage(undefined)
    setIsModalOpen(true)
  }

  const connect = () => {
    const trimmedUrl = url.trim()
    if (!RTSP_URL_PATTERN.test(trimmedUrl)) {
      setErrorMessage('Enter a URL that starts with rtsp://')
      return
    }

    if (connections.some((connection) => connection.url === trimmedUrl)) {
      setErrorMessage('This URL is already connected')
      return
    }

    setConnections((current) => withConnections(current, [{ url: trimmedUrl, autoStart: true }]))
    setIsModalOpen(false)
  }

  const removeConnection = async (id: number, savedStreamId: string | null) => {
    setConnections((current) => current.filter((connection) => connection.id !== id))

    // Guests have nothing saved; for a logged-in user the URL is also removed from their history.
    if (!isLoggedIn || !savedStreamId) {
      return
    }
    try {
      const accessToken = await getAccessToken()
      if (accessToken) {
        await deleteStream(savedStreamId, accessToken)
      }
    } catch (error) {
      console.error('Could not remove the stream from history', error)
    }
  }

  let emptyMessage = 'No connections yet. Click “Add RTSP URL” to add one.'
  if (loadSavedStreams) {
    emptyMessage = isLoggedIn
      ? 'You have no saved streams yet. Click “Add RTSP URL” to add one.'
      : 'Log in to see your saved streams. You can still click “Add RTSP URL” to watch one.'
  }

  // A square-ish grid: 1 box fills the container, 2 sit side by side, 3-4 make a 2x2, and so on.
  const columns = isMobile ? 1 : Math.ceil(Math.sqrt(connections.length))

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <Navbar />

      <main className="mx-auto max-w-7xl px-6 py-8 lg:px-10">
        <div className="flex justify-end">
          <Button onClick={openModal} className="bg-white text-neutral-950 hover:bg-neutral-200">
            Add RTSP URL
          </Button>
        </div>

        <div className="mt-6 h-[70vh] overflow-y-auto rounded-2xl border border-white/10 bg-white/5 p-4">
          {connections.length === 0 ? (
            <div className="flex h-full items-center justify-center text-center text-neutral-400">
              {isLoadingSaved ? <Loader label="Loading your streams…" /> : emptyMessage}
            </div>
          ) : (
            <div
              className="grid h-full auto-rows-[minmax(8rem,1fr)] gap-4"
              style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
            >
              {connections.map((connection) => (
                <ConnectionBox
                  key={connection.id}
                  connection={connection}
                  onRemove={(savedStreamId) => void removeConnection(connection.id, savedStreamId)}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />

      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        heading="Add new connection"
        isCancelButtonVisible={false}
        submitLabel="Connect"
        onSubmit={connect}
      >
        <Input
          autoFocus
          label="RTSP URL"
          placeholder="rtsp://host:8554/stream"
          value={url}
          onChange={(event) => {
            setUrl(event.target.value)
            setErrorMessage(undefined)
          }}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              connect()
            }
          }}
          errorMessage={errorMessage}
          className="mt-2"
        />
      </Modal>
    </div>
  )
}
